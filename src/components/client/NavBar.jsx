import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HandPlatter, Home, MapPin, Info, Phone, ShoppingBag, LayoutDashboard, Menu as MenuIcon, ClipboardList } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import LanguageSwitcher from '../common/LanguageSwitcher'
import { useCart } from '../../context/CartContext'

const NavBar = () => {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const userRole = user?.role
  const userEmail = user?.email

  const handleLogout = async () => {
    await signOut()
    navigate('/')
    setIsDropdownOpen(false)
  }

  const navLinks = () => {
    const links = [
      { name: t('Home'), path: '/', icon: Home },
      { name: t('Restaurants'), path: '/restaurant', icon: MapPin },
      { name: t('About'), path: '/about', icon: Info },
      { name: t('Contact'), path: '/contact', icon: Phone },
    ]

    if (userRole === 'client') {
      links.push({ name: `${t('Cart')} (${itemCount})`, path: '/cart', icon: ShoppingBag })
    }

    if (!user) {
      links.push({ name: `${t('Cart')} (${itemCount})`, path: '/cart', icon: ShoppingBag })
    }

    if (userRole === 'restaurant') {
      links.push({ name: t('Dashboard'), path: '/restaurant/dashboard', icon: LayoutDashboard })
      links.push({ name: t('Orders'), path: '/restaurant/orders', icon: ClipboardList })
      links.push({ name: t('Add Menu'), path: '/restaurant/add-menu', icon: MenuIcon })
    }

    if (userRole === 'admin') {
      links.push({ name: t('Admin Dashboard'), path: '/admin/dashboard', icon: LayoutDashboard })
    }

    return links
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <HandPlatter className="h-6 w-6 text-red-600" />
          <Link to="/" className="flex items-center space-x-1 text-2xl font-bold">
            <span className="text-red-600">Food</span>
            <span className="text-blue-600">Connect</span>
          </Link>
        </div>

        <div className="hidden items-center space-x-8 md:flex">
          {navLinks().map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                className="flex flex-col items-center gap-1 text-gray-700 transition-colors duration-200 hover:text-blue-600"
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="hidden items-center space-x-4 md:flex">
          <LanguageSwitcher />

          {!user ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                {t('Login')}
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                {t('Signup')}
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((current) => !current)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {user?.profile?.images_url ? (
                  <img
                    src={user.profile.images_url}
                    alt={user.profile.full_name || userEmail}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <span className="font-semibold text-blue-600">
                      {userEmail?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="hidden text-gray-700 lg:inline">
                  {userEmail?.split('@')[0]}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white py-2 shadow-lg">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {t('Profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50"
                  >
                    {t('Logout')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher compact />

          <button
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-gray-100 py-4 md:hidden">
          {navLinks().map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 py-2 text-lg text-gray-700 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            )
          })}

          {!user ? (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                className="block py-2 text-lg text-gray-700 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('Login')}
              </Link>
              <Link
                to="/signup"
                className="block py-2 text-lg font-semibold text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('Signup')}
              </Link>
            </div>
          ) : (
            <div className="border-t border-gray-100 pt-2">
              <div className="py-2 text-gray-600">{userEmail}</div>
              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full py-2 text-left text-red-600"
              >
                {t('Logout')}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default NavBar
