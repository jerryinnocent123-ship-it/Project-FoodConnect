import { supabase } from '../../lib/supabase'

const sanitizeFileName = (fileName) =>
  fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')

export const buildDefaultUsername = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'user'

const isDuplicateKeyError = (error) => error?.code === '23505'

const buildRestaurantAlreadyExistsError = () =>
  new Error('A restaurant profile already exists for this account.')

async function ensureRestaurantForOwner({ userId, full_name, adresse }) {
  const zone = adresse.split(',')[0]?.trim() || null

  const { data: existingRestaurant, error: existingRestaurantError } = await supabase
    .from('restaurants')
    .select('id')
    .eq('owner_id', userId)
    .maybeSingle()

  if (existingRestaurantError) {
    throw existingRestaurantError
  }

  if (existingRestaurant) {
    const { error: updateRestaurantError } = await supabase
      .from('restaurants')
      .update({ name: full_name, zone })
      .eq('id', existingRestaurant.id)

    if (updateRestaurantError) {
      throw updateRestaurantError
    }

    return existingRestaurant
  }

  const { data: insertedRestaurant, error: insertRestaurantError } = await supabase
    .from('restaurants')
    .insert({
      name: full_name,
      owner_id: userId,
      zone,
      status: 'pending',
      verified: false,
    })
    .select('id')
    .maybeSingle()

  if (insertRestaurantError) {
    if (isDuplicateKeyError(insertRestaurantError)) {
      throw buildRestaurantAlreadyExistsError()
    }

    throw insertRestaurantError
  }

  return insertedRestaurant
}

export async function fetchProfileById(userId, email = '') {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (data) {
    return data
  }

  return {
    id: userId,
    email,
    full_name: '',
    username: buildDefaultUsername(email.split('@')[0] || ''),
    tel: '',
    adresse: '',
    images_url: '',
  }
}

export async function uploadProfileImage({ file, userId }) {
  const safeName = sanitizeFileName(file.name || 'profile-image')
  const filePath = `${userId}/${Date.now()}-${safeName}`

  const { error } = await supabase.storage
    .from('images_user')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw error
  }

  const { data } = supabase.storage.from('images_user').getPublicUrl(filePath)
  return data.publicUrl
}

export async function saveProfile({
  userId,
  email,
  full_name,
  username,
  tel,
  adresse,
  role,
  images_url,
}) {
  const payload = {
    id: userId,
    email,
    full_name: full_name.trim(),
    username: username.trim(),
    tel: tel.trim(),
    adresse: adresse.trim(),
    role,
    images_url: images_url || null,
  }

  const { data, error } = await supabase
    .from('profile')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    throw error
  }

  if (role === 'restaurant') {
    await ensureRestaurantForOwner({
      userId,
      full_name: payload.full_name,
      adresse: payload.adresse,
    })
  }

  return data
}
