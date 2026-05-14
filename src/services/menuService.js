import { supabase } from '../../lib/supabase'

let restaurantsCache = null
let restaurantsRequest = null

const menusCacheByRestaurant = new Map()
const menuRequestsByRestaurant = new Map()
const createMenuRequests = new Map()

const sanitizeFileName = (fileName) =>
  fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')

const normalizeMenuTitle = (title = '') => title.trim().replace(/\s+/g, ' ')

const buildDuplicateMenuError = (title) =>
  new Error(`A menu named "${title}" already exists for this restaurant.`)

const APPROVED_RESTAURANT_FILTER = 'status.eq.approved,and(status.is.null,verified.eq.true)'

export async function fetchRestaurantByOwner(ownerId) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('id, name, owner_id, zone, lat, lng, created_at')
    .eq('owner_id', ownerId)
    .limit(1)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error('No restaurant profile was found for this account.')
  }

  return data
}

async function findExistingMenuByTitle({ restaurantId, title }) {
  const normalizedTitle = normalizeMenuTitle(title)

  const { data, error } = await supabase
    .from('menus')
    .select('id, title, restaurant_id')
    .eq('restaurant_id', restaurantId)
    .ilike('title', normalizedTitle)

  if (error) {
    throw error
  }

  return (
    (data || []).find(
      (menu) => normalizeMenuTitle(menu.title).toLowerCase() === normalizedTitle.toLowerCase()
    ) || null
  )
}

export async function uploadMenuImage({ file, ownerId }) {
  const safeName = sanitizeFileName(file.name || 'menu-image')
  const filePath = `${ownerId}/${Date.now()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from('images-menu')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage.from('images-menu').getPublicUrl(filePath)

  return data.publicUrl
}

export async function createMenu({
  title,
  description,
  price,
  imageFile,
  ownerId,
}) {
  const normalizedTitle = normalizeMenuTitle(title)
  const requestKey = `${ownerId}:${normalizedTitle.toLowerCase()}`

  if (createMenuRequests.has(requestKey)) {
    return createMenuRequests.get(requestKey)
  }

  const request = (async () => {
    const restaurant = await fetchRestaurantByOwner(ownerId)

    if (!restaurant?.id) {
      throw new Error('No valid restaurant was found for this account.')
    }

    const existingMenu = await findExistingMenuByTitle({
      restaurantId: restaurant.id,
      title: normalizedTitle,
    })

    if (existingMenu) {
      throw buildDuplicateMenuError(normalizedTitle)
    }

    if (!imageFile) {
      throw new Error('A menu image is required.')
    }

    const imageUrl = await uploadMenuImage({ file: imageFile, ownerId })

    const payload = {
      title: normalizedTitle,
      description: description.trim(),
      price: Number(price),
      image_url: imageUrl,
      restaurant_id: restaurant.id,
      restaurant_name: restaurant.name,
    }

    if (!payload.title || !payload.description || Number.isNaN(payload.price)) {
      throw new Error('Invalid menu payload.')
    }

    if (!payload.restaurant_id) {
      throw new Error('Invalid restaurant_id for menu creation.')
    }

    const { error } = await supabase.from('menus').insert([payload])

    if (error) {
      throw error
    }

    const cachedMenus = menusCacheByRestaurant.get(restaurant.id)
    if (cachedMenus) {
      menusCacheByRestaurant.set(restaurant.id, [payload, ...cachedMenus])
    }

    if (restaurantsCache) {
      restaurantsCache = restaurantsCache.map((restaurantItem) =>
        restaurantItem.id === restaurant.id
          ? {
              ...restaurantItem,
              dishes: [...(restaurantItem.dishes || []), normalizedTitle],
            }
          : restaurantItem
      )
    }

    return payload
  })()

  createMenuRequests.set(requestKey, request)

  try {
    return await request
  } finally {
    createMenuRequests.delete(requestKey)
  }
}

export async function fetchRecentMenus(limit = 6) {
  const { data: approvedRestaurants, error: restaurantError } = await supabase
    .from('restaurants')
    .select('id')
    .or(APPROVED_RESTAURANT_FILTER)

  if (restaurantError) {
    throw restaurantError
  }

  const approvedRestaurantIds = (approvedRestaurants || []).map((restaurant) => restaurant.id)

  if (approvedRestaurantIds.length === 0) {
    return []
  }

  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .in('restaurant_id', approvedRestaurantIds)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return data || []
}

export async function fetchMenusByRestaurant(restaurantId, options = {}) {
  const { publicOnly = false } = options

  if (menusCacheByRestaurant.has(restaurantId)) {
    return menusCacheByRestaurant.get(restaurantId)
  }

  if (menuRequestsByRestaurant.has(restaurantId)) {
    return menuRequestsByRestaurant.get(restaurantId)
  }

  const request = (async () => {
    if (publicOnly) {
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('id', restaurantId)
        .or(APPROVED_RESTAURANT_FILTER)
        .maybeSingle()

      if (restaurantError) {
        throw restaurantError
      }

      if (!restaurant) {
        return []
      }
    }

    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    const menus = data || []
    menusCacheByRestaurant.set(restaurantId, menus)
    return menus
  })()

  menuRequestsByRestaurant.set(restaurantId, request)

  try {
    return await request
  } finally {
    menuRequestsByRestaurant.delete(restaurantId)
  }
}

export async function fetchMenusByOwner(ownerId) {
  const restaurant = await fetchRestaurantByOwner(ownerId)
  return fetchMenusByRestaurant(restaurant.id)
}

export async function fetchRestaurants() {
  if (restaurantsCache) {
    return restaurantsCache
  }

  if (restaurantsRequest) {
    return restaurantsRequest
  }

  restaurantsRequest = (async () => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('id, name, owner_id, zone, lat, lng, created_at')
      .or(APPROVED_RESTAURANT_FILTER)
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    const restaurants = data || []
    const ownerIds = restaurants.map((restaurant) => restaurant.owner_id).filter(Boolean)

    let profiles = []
    if (ownerIds.length > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('id, adresse, full_name')
        .in('id', ownerIds)

      if (profileError) {
        throw profileError
      }

      profiles = profileData || []
    }

    const { data: menusData, error: menusError } = await supabase
      .from('menus')
      .select('id, title, restaurant_id')

    if (menusError) {
      throw menusError
    }

    const profileById = new Map(profiles.map((profile) => [profile.id, profile]))
    const menusByRestaurant = new Map()

    for (const menu of menusData || []) {
      const currentMenus = menusByRestaurant.get(menu.restaurant_id) || []
      currentMenus.push(menu.title)
      menusByRestaurant.set(menu.restaurant_id, currentMenus)
    }

    restaurantsCache = restaurants.map((restaurant) => {
      const profile = profileById.get(restaurant.owner_id)
      const address = profile?.adresse || ''
      const zone = restaurant.zone || address.split(',')[0]?.trim() || ''

      return {
        ...restaurant,
        adresse: address,
        zone,
        lat: restaurant.lat || null,
        lng: restaurant.lng || null,
        dishes: menusByRestaurant.get(restaurant.id) || [],
      }
    })

    return restaurantsCache
  })()

  try {
    return await restaurantsRequest
  } finally {
    restaurantsRequest = null
  }
}
