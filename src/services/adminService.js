import { supabase } from '../../lib/supabase'

export const RESTAURANT_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
}

async function fetchCount({ table, match }) {
  let query = supabase.from(table).select('*', { count: 'exact', head: true })

  if (match) {
    query = query.match(match)
  }

  const { count, error } = await query

  if (error) {
    throw error
  }

  return count || 0
}

export async function fetchAdminStats() {
  const [userCount, restaurantCount, menuCount, clientCount] = await Promise.all([
    fetchCount({ table: 'profile' }),
    fetchCount({ table: 'restaurants' }),
    fetchCount({ table: 'menus' }),
    fetchCount({ table: 'profile', match: { role: 'client' } }),
  ])

  return { userCount, restaurantCount, menuCount, clientCount }
}

export async function fetchRecentAdminData() {
  const [menusResponse, restaurantsResponse, usersResponse] = await Promise.all([
    supabase.from('menus').select('*').order('created_at', { ascending: false }).limit(5),
    supabase
      .from('restaurants')
      .select('id, name, owner_id, status, verified, created_at')
      .order('created_at', { ascending: false }),
    supabase.from('profile').select('*').order('email', { ascending: true }).limit(5),
  ])

  if (menusResponse.error) throw menusResponse.error
  if (restaurantsResponse.error) throw restaurantsResponse.error
  if (usersResponse.error) throw usersResponse.error

  return {
    menus: menusResponse.data || [],
    restaurants: restaurantsResponse.data || [],
    users: usersResponse.data || [],
  }
}

async function updateRestaurantSubmission({ restaurantId, status }) {
  const updates = {
    status,
    verified: status === RESTAURANT_STATUSES.APPROVED,
  }

  const { data, error } = await supabase
    .from('restaurants')
    .update(updates)
    .eq('id', restaurantId)
    .select('id, name, owner_id, status, verified, created_at')
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function approveRestaurantSubmission(restaurantId) {
  return updateRestaurantSubmission({
    restaurantId,
    status: RESTAURANT_STATUSES.APPROVED,
  })
}

export async function rejectRestaurantSubmission(restaurantId) {
  return updateRestaurantSubmission({
    restaurantId,
    status: RESTAURANT_STATUSES.REJECTED,
  })
}

export async function suspendRestaurantSubmission(restaurantId) {
  return updateRestaurantSubmission({
    restaurantId,
    status: RESTAURANT_STATUSES.SUSPENDED,
  })
}

export async function deleteRestaurantSubmission(restaurantId) {
  const { error } = await supabase
    .from('restaurants')
    .delete()
    .eq('id', restaurantId)

  if (error) {
    throw error
  }
}
