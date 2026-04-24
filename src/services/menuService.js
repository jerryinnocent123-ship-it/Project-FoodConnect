import { supabase } from '../../lib/supabase'

const sanitizeFileName = (fileName) =>
  fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')

export async function fetchRestaurantByOwner(ownerId) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('id, name, owner_id, zone, lat, lng, created_at')
    .eq('owner_id', ownerId)
    .limit(1)
    .single()

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error('No restaurant profile was found for this account.')
  }

  return data
}

export async function uploadMenuImage({ file, restaurantId }) {
  const safeName = sanitizeFileName(file.name || 'menu-image')
  const filePath = `${restaurantId}/${Date.now()}-${safeName}`

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
  const restaurant = await fetchRestaurantByOwner(ownerId)
  const imageUrl = await uploadMenuImage({ file: imageFile, restaurantId: restaurant.id })

  const payload = {
    title: title.trim(),
    description: description.trim(),
    price: Number(price),
    image_url: imageUrl,
    restaurant_id: restaurant.id,
    restaurant_name: restaurant.name,
  }

  const { data, error } = await supabase
    .from('menus')
    .insert([payload])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function fetchRecentMenus(limit = 6) {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return data || []
}

export async function fetchMenusByRestaurant(restaurantId) {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data || []
}

export async function fetchMenusByOwner(ownerId) {
  const restaurant = await fetchRestaurantByOwner(ownerId)
  return fetchMenusByRestaurant(restaurant.id)
}

export async function fetchRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('id, name, owner_id, zone, lat, lng, created_at')
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

  return restaurants.map((restaurant) => {
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
}
