import { useEffect, useMemo, useState } from 'react'
import { LocateFixed, MapPin, Search, UtensilsCrossed } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { fetchMenusByRestaurant, fetchRestaurants } from '../../services/menuService'
import { useCart } from '../../context/CartContext'

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function RestaurantDirectory({ compact = false }) {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const [restaurants, setRestaurants] = useState([])
  const [menus, setMenus] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedZone, setSelectedZone] = useState('')
  const [dishTerm, setDishTerm] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [loadingRestaurants, setLoadingRestaurants] = useState(true)
  const [loadingMenus, setLoadingMenus] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadRestaurants = async () => {
      try {
        const data = await fetchRestaurants()
        if (!isMounted) return

        setRestaurants(data)
        setSelectedRestaurant(data[0] || null)
      } catch (loadError) {
        if (!isMounted) return
        console.error('Error loading restaurants:', loadError)
        setError(t('Unable to load restaurants right now.'))
      } finally {
        if (isMounted) {
          setLoadingRestaurants(false)
        }
      }
    }

    loadRestaurants()

    return () => {
      isMounted = false
    }
  }, [t])

  useEffect(() => {
    if (!selectedRestaurant?.id) {
      setMenus([])
      return
    }

    let isMounted = true

    const loadMenus = async () => {
      try {
        setLoadingMenus(true)
        const data = await fetchMenusByRestaurant(selectedRestaurant.id)
        if (!isMounted) return
        setMenus(data)
      } catch (loadError) {
        if (!isMounted) return
        console.error('Error loading restaurant menus:', loadError)
        setError(t('Unable to load menus right now.'))
      } finally {
        if (isMounted) {
          setLoadingMenus(false)
        }
      }
    }

    loadMenus()

    return () => {
      isMounted = false
    }
  }, [selectedRestaurant, t])

  const zones = useMemo(
    () => [...new Set(restaurants.map((restaurant) => restaurant.zone).filter(Boolean))],
    [restaurants]
  )

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t('Geolocation is not supported by your browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationError('')
      },
      () => {
        setLocationError(t('Unable to retrieve your location.'))
      }
    )
  }

  const filteredRestaurants = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    const normalizedDishTerm = dishTerm.trim().toLowerCase()

    let matched = restaurants.filter((restaurant) => {
      const name = restaurant.name?.toLowerCase() || ''
      const address = restaurant.adresse?.toLowerCase() || ''
      const zone = restaurant.zone?.toLowerCase() || ''
      const hasSearchMatch =
        !normalizedTerm ||
        name.includes(normalizedTerm) ||
        address.includes(normalizedTerm) ||
        zone.includes(normalizedTerm)
      const hasZoneMatch = !selectedZone || restaurant.zone === selectedZone
      const hasDishMatch =
        !normalizedDishTerm ||
        (restaurant.dishes || []).some((dish) => dish.toLowerCase().includes(normalizedDishTerm))

      return hasSearchMatch && hasZoneMatch && hasDishMatch
    })

    if (userLocation) {
      matched = matched
        .map((restaurant) => ({
          ...restaurant,
          distance:
            restaurant.lat && restaurant.lng
              ? getDistance(userLocation.lat, userLocation.lng, restaurant.lat, restaurant.lng)
              : null,
        }))
        .sort((a, b) => {
          if (a.distance === null) return 1
          if (b.distance === null) return -1
          return a.distance - b.distance
        })
    }

    return compact ? matched.slice(0, 6) : matched
  }, [compact, restaurants, searchTerm, selectedZone, dishTerm, userLocation])

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            {t('Restaurants')}
          </p>
          <h2 className="text-3xl font-bold text-slate-900">{t('Discover Restaurants')}</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
          <label className="flex w-full items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t('Search restaurants...')}
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <select
            value={selectedZone}
            onChange={(event) => setSelectedZone(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none shadow-sm"
          >
            <option value="">{t('All zones')}</option>
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={dishTerm}
            onChange={(event) => setDishTerm(event.target.value)}
            placeholder={t('Search by dish...')}
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none shadow-sm placeholder:text-slate-400"
          />

          <button
            type="button"
            onClick={handleUseMyLocation}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
          >
            <LocateFixed className="h-4 w-4" />
            {t('Use my location')}
          </button>
        </div>

        {locationError && <p className="text-sm text-red-600">{locationError}</p>}
      </div>

      {loadingRestaurants && <p className="text-slate-600">{t('Loading restaurants...')}</p>}
      {!loadingRestaurants && error && <p className="text-red-600">{error}</p>}

      {!loadingRestaurants && !error && (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5 md:grid-cols-2">
            {filteredRestaurants.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-slate-600 md:col-span-2">
                {t('No restaurants found.')}
              </div>
            )}

            {filteredRestaurants.map((restaurant) => (
              <article
                key={restaurant.id}
                className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {restaurant.name}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      {restaurant.zone || restaurant.adresse || t('Address not available')}
                    </p>
                    {restaurant.distance !== null && restaurant.distance !== undefined && (
                      <p className="mt-2 text-sm text-orange-600">
                        {restaurant.distance.toFixed(1)} km
                      </p>
                    )}
                    {restaurant.dishes?.length > 0 && (
                      <p className="mt-2 text-sm text-slate-500">
                        {t('Dishes')}: {restaurant.dishes.slice(0, 3).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="rounded-full bg-orange-50 p-3 text-orange-600">
                    <UtensilsCrossed className="h-5 w-5" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRestaurant(restaurant)}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
                >
                  {t('View Menu')}
                </button>
              </article>
            ))}
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.2em] text-orange-300">
                {t('Selected Restaurant')}
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                {selectedRestaurant?.name || t('Pick a restaurant')}
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                {selectedRestaurant?.adresse || t('Choose a restaurant to see its menus.')}
              </p>
            </div>

            {loadingMenus && <p className="text-slate-300">{t('Loading menus...')}</p>}

            {!loadingMenus && menus.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-700 p-6 text-slate-300">
                {t('No menus available yet.')}
              </div>
            )}

            {!loadingMenus && menus.length > 0 && (
              <div className="space-y-4">
                {menus.map((menu) => (
                  <article
                    key={menu.id}
                    className="overflow-hidden rounded-3xl bg-white/10 backdrop-blur"
                  >
                    <div className="grid gap-4 md:grid-cols-[140px_1fr]">
                      <img
                        src={menu.image_url}
                        alt={menu.title}
                        className="h-full min-h-36 w-full object-cover"
                      />
                      <div className="p-4">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h4 className="text-lg font-semibold text-white">{menu.title}</h4>
                          <span className="rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold text-white">
                            ${Number(menu.price || 0).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm leading-6 text-slate-200">{menu.description}</p>
                        <button
                          type="button"
                          onClick={() => addToCart(menu)}
                          className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-orange-500 hover:text-white"
                        >
                          {t('Add to Cart')}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default RestaurantDirectory
