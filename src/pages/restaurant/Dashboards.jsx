import { useEffect, useState } from 'react'
import { LayoutGrid, LoaderCircle, LogOut } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import SideBarResto from '../../layouts/SideBarResto'
import LanguageSwitcher from '../../components/common/LanguageSwitcher'
import { fetchMenusByOwner } from '../../services/menuService'

function Dashboards() {
  const { t } = useTranslation()
  const { signOut, user } = useAuth()
  const [menus, setMenus] = useState([])
  const [loadingMenus, setLoadingMenus] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadMenus = async () => {
      try {
        const data = await fetchMenusByOwner(user?.id)
        if (!isMounted) return
        setMenus(data)
      } catch (error) {
        if (!isMounted) return
        console.error('Error loading dashboard menus:', error)
        setLoadError(t('Unable to load menus right now.'))
      } finally {
        if (isMounted) {
          setLoadingMenus(false)
        }
      }
    }

    if (user?.id) {
      loadMenus()
    } else {
      setLoadingMenus(false)
    }

    return () => {
      isMounted = false
    }
  }, [t, user?.id])

  const handleLogout = async () => {
    try {
      const { error } = await signOut()
      if (error) {
        console.error('Logout error:', error)
        return
      }
      window.location.replace(`/?logout=true&t=${Date.now()}`)
    } catch (error) {
      console.error('Unexpected logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBarResto />

      <div className="min-h-screen md:ml-64">
        <div className="mx-auto max-w-7xl p-6">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                {t('Dashboard')}
              </p>
              <h1 className="text-3xl font-bold text-slate-900">{t('Restaurant Dashboard')}</h1>
              <p className="mt-2 text-slate-600">
                {t('Manage your menus and review everything you have published.')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                <LogOut className="h-4 w-4" />
                {t('Logout')}
              </button>
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.75rem] bg-slate-900 p-5 text-white">
              <p className="text-sm text-slate-300">{t('Restaurant')}</p>
              <p className="mt-2 text-2xl font-semibold">
                {user?.profile?.full_name || user?.email}
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{t('Published Menus')}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{menus.length}</p>
            </div>
            <div className="rounded-[1.75rem] bg-orange-500 p-5 text-white">
              <p className="text-sm text-orange-100">{t('Status')}</p>
              <p className="mt-2 text-2xl font-semibold">{t('Ready to serve')}</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-3 text-orange-600">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                  {t('Menu Overview')}
                </p>
                <h2 className="text-2xl font-bold text-slate-900">{t('Your Menus')}</h2>
              </div>
            </div>

            {loadingMenus && (
              <div className="flex items-center gap-3 text-slate-600">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                <span>{t('Loading menus...')}</span>
              </div>
            )}

            {!loadingMenus && loadError && <p className="text-red-600">{loadError}</p>}

            {!loadingMenus && !loadError && menus.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
                {t('No menus available yet.')}
              </div>
            )}

            {!loadingMenus && !loadError && menus.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {menus.map((menu) => (
                  <article
                    key={menu.id}
                    className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
                  >
                    <img
                      src={menu.image_url}
                      alt={menu.title}
                      className="h-52 w-full object-cover"
                    />
                    <div className="space-y-3 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl font-semibold text-slate-900">{menu.title}</h3>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                          ${Number(menu.price || 0).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{menu.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboards
