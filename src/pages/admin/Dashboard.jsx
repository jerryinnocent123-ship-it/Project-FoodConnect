import { useEffect, useState } from 'react'
import { Building2, MenuSquare, ShieldCheck, Users } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import LanguageSwitcher from '../../components/common/LanguageSwitcher'
import NavBar from '../../components/client/NavBar'
import {
  approveRestaurantSubmission,
  deleteRestaurantSubmission,
  fetchAdminStats,
  fetchRecentAdminData,
  rejectRestaurantSubmission,
  suspendRestaurantSubmission,
} from '../../services/adminService'

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
  suspended: 'bg-slate-200 text-slate-700',
}

function Dashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    userCount: 0,
    restaurantCount: 0,
    menuCount: 0,
    clientCount: 0,
  })
  const [recentData, setRecentData] = useState({
    menus: [],
    restaurants: [],
    users: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoadingByKey, setActionLoadingByKey] = useState({})

  useEffect(() => {
    let isMounted = true

    const loadAdminDashboard = async () => {
      try {
        const [statsData, recent] = await Promise.all([
          fetchAdminStats(),
          fetchRecentAdminData(),
        ])

        if (!isMounted) return

        setStats(statsData)
        setRecentData(recent)
      } catch (loadError) {
        if (!isMounted) return
        console.error('Error loading admin dashboard:', loadError)
        setError(t('Unable to load admin dashboard right now.'))
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadAdminDashboard()

    return () => {
      isMounted = false
    }
  }, [t])

  const setActionLoading = (restaurantId, action, isLoading) => {
    const key = `${restaurantId}:${action}`

    setActionLoadingByKey((current) => {
      if (isLoading) {
        return { ...current, [key]: true }
      }

      const nextState = { ...current }
      delete nextState[key]
      return nextState
    })
  }

  const handleStatusAction = async ({ restaurantId, action, request, successMessage }) => {
    try {
      setActionLoading(restaurantId, action, true)
      const updatedRestaurant = await request()

      if (updatedRestaurant) {
        setRecentData((current) => ({
          ...current,
          restaurants: current.restaurants.map((restaurant) =>
            restaurant.id === restaurantId ? updatedRestaurant : restaurant
          ),
        }))
      } else {
        setRecentData((current) => ({
          ...current,
          restaurants: current.restaurants.filter((restaurant) => restaurant.id !== restaurantId),
        }))
      }

      toast.success(successMessage)
    } catch (actionError) {
      console.error(`Error running ${action} action:`, actionError)
      toast.error(t('Unable to update restaurant status right now.'))
    } finally {
      setActionLoading(restaurantId, action, false)
    }
  }

  const getActionLabel = (restaurantId, action, idleLabel, loadingLabel) =>
    actionLoadingByKey[`${restaurantId}:${action}`] ? loadingLabel : idleLabel

  const getRestaurantStatus = (restaurant) =>
    restaurant.status || (restaurant.verified ? 'approved' : 'pending')

  const isRestaurantBusy = (restaurantId) =>
    ['approve', 'reject', 'suspend', 'delete'].some(
      (action) => actionLoadingByKey[`${restaurantId}:${action}`]
    )

  const cards = [
    { label: t('Total Users'), value: stats.userCount, icon: Users, color: 'bg-slate-900 text-white' },
    { label: t('Total Restaurants'), value: stats.restaurantCount, icon: Building2, color: 'bg-orange-500 text-white' },
    { label: t('Total Menus'), value: stats.menuCount, icon: MenuSquare, color: 'bg-white text-slate-900' },
    { label: t('Total Clients'), value: stats.clientCount, icon: ShieldCheck, color: 'bg-emerald-500 text-white' },
  ]

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <NavBar />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              {t('Admin Dashboard')}
            </p>
            <h1 className="text-3xl font-bold text-slate-900">{t('Platform Overview')}</h1>
          </div>
          <LanguageSwitcher />
        </div>

        {loading && <p className="text-slate-600">{t('Loading dashboard...')}</p>}
        {!loading && error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {cards.map((card) => {
                const Icon = card.icon

                return (
                  <article key={card.label} className={`rounded-[1.75rem] p-5 shadow-sm ${card.color}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm opacity-80">{card.label}</p>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-3xl font-bold">{card.value}</p>
                  </article>
                )
              })}
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-3">
              <section className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                <h2 className="text-xl font-semibold text-slate-900">{t('Latest Menus')}</h2>
                <div className="mt-4 space-y-4">
                  {recentData.menus.map((menu) => (
                    <div key={menu.id} className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">{menu.title}</p>
                      <p className="text-sm text-slate-500">{menu.restaurant_name}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                <h2 className="text-xl font-semibold text-slate-900">{t('Latest Restaurants')}</h2>
                <div className="mt-4 space-y-4">
                  {recentData.restaurants.map((restaurant) => {
                    const currentStatus = getRestaurantStatus(restaurant)

                    return (
                      <div key={restaurant.id} className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{restaurant.name}</p>
                            <p className="text-sm text-slate-500">{restaurant.owner_id}</p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                              STATUS_STYLES[currentStatus] || 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {currentStatus === 'pending' ? t('Pending') : currentStatus}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          <button
                            type="button"
                            disabled={isRestaurantBusy(restaurant.id)}
                            onClick={() =>
                              handleStatusAction({
                                restaurantId: restaurant.id,
                                action: 'approve',
                                request: () => approveRestaurantSubmission(restaurant.id),
                                successMessage: t('Restaurant approved successfully.'),
                              })
                            }
                            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {getActionLabel(
                              restaurant.id,
                              'approve',
                              t('Approve'),
                              t('Approving...')
                            )}
                          </button>
                          <button
                            type="button"
                            disabled={isRestaurantBusy(restaurant.id)}
                            onClick={() =>
                              handleStatusAction({
                                restaurantId: restaurant.id,
                                action: 'reject',
                                request: () => rejectRestaurantSubmission(restaurant.id),
                                successMessage: t('Restaurant rejected successfully.'),
                              })
                            }
                            className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {getActionLabel(
                              restaurant.id,
                              'reject',
                              t('Reject'),
                              t('Rejecting...')
                            )}
                          </button>
                          <button
                            type="button"
                            disabled={isRestaurantBusy(restaurant.id)}
                            onClick={() =>
                              handleStatusAction({
                                restaurantId: restaurant.id,
                                action: 'suspend',
                                request: () => suspendRestaurantSubmission(restaurant.id),
                                successMessage: t('Restaurant suspended successfully.'),
                              })
                            }
                            className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {getActionLabel(
                              restaurant.id,
                              'suspend',
                              t('Suspend'),
                              t('Suspending...')
                            )}
                          </button>
                          <button
                            type="button"
                            disabled={isRestaurantBusy(restaurant.id)}
                            onClick={() =>
                              handleStatusAction({
                                restaurantId: restaurant.id,
                                action: 'delete',
                                request: async () => {
                                  await deleteRestaurantSubmission(restaurant.id)
                                  return null
                                },
                                successMessage: t('Restaurant deleted successfully.'),
                              })
                            }
                            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {getActionLabel(
                              restaurant.id,
                              'delete',
                              t('Delete'),
                              t('Deleting...')
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              <section className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                <h2 className="text-xl font-semibold text-slate-900">{t('Latest Users')}</h2>
                <div className="mt-4 space-y-4">
                  {recentData.users.map((user) => (
                    <div key={user.id} className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">{user.full_name || user.email}</p>
                      <p className="text-sm text-slate-500">{user.role || t('Unknown role')}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
