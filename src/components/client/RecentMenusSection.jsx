import { useEffect, useState } from 'react'
import { Clock3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { fetchRecentMenus } from '../../services/menuService'
import { useCart } from '../../context/CartContext'

function RecentMenusSection() {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadMenus = async () => {
      try {
        const data = await fetchRecentMenus(6)
        if (!isMounted) return
        setMenus(data)
      } catch (loadError) {
        if (!isMounted) return
        console.error('Error loading recent menus:', loadError)
        setError(t('Unable to load menus right now.'))
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMenus()

    return () => {
      isMounted = false
    }
  }, [t])

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-full bg-orange-100 p-3 text-orange-600">
          <Clock3 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            {t('Top Menu')}
          </p>
          <h2 className="text-3xl font-bold text-slate-900">{t('Recently Added Menus')}</h2>
        </div>
      </div>

      {loading && <p className="text-slate-600">{t('Loading menus...')}</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}

      {!loading && !error && menus.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-slate-600">
          {t('No menus available yet.')}
        </div>
      )}

      {!loading && !error && menus.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {menus.map((menu) => (
            <article
              key={menu.id}
              className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            >
              <img
                src={menu.image_url}
                alt={menu.title}
                className="h-56 w-full object-cover"
              />
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{menu.title}</h3>
                    <p className="text-sm text-slate-500">
                      {menu.restaurant_name || t('Restaurant')}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    ${Number(menu.price || 0).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-600">{menu.description}</p>
                <button
                  type="button"
                  onClick={() => addToCart(menu)}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
                >
                  {t('Add to Cart')}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default RecentMenusSection
