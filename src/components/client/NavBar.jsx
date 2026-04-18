import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { HandPlatter, Home, MapPin, Info, Phone, ShoppingBag, LayoutDashboard, Menu as MenuIcon, ClipboardList } from 'lucide-react'

const NavBar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const userRole = user?.role  // ← modifié ici
  const userEmail = user?.email

  const handleLogout = async () => {
    await signOut()
    navigate('/')
    setIsDropdownOpen(false)
  }

  const navLinks = () => {
    const links = [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Restaurants', path: '/restaurant', icon: MapPin },
      { name: 'About', path: '/about', icon: Info },
      { name: 'Contact', path: '/contact', icon: Phone }
    ]

    if (userRole === 'client') {
      links.push({ name: 'Cart', path: '/Cart', icon: ShoppingBag })
    }

    if (userRole === 'restaurant') {
      links.push({ name: 'Dashboard', path: '/restaurant/Dashboards', icon: LayoutDashboard })
      links.push({ name: 'Orders', path: '/restaurant-orders', icon: ClipboardList })
      links.push({ name: 'Menu', path: '/restaurant-menu', icon: MenuIcon })
    }

    if (userRole === 'admin') {
      links.push({ name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard })
    }

    return links
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 px-4 py-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <HandPlatter className="w-6 h-6 text-red-600" />
          <Link to="/" className="text-2xl font-bold flex items-center space-x-1">
            <span className="text-red-600">Food</span>
            <span className="text-blue-600">Connect</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks().map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                className="flex flex-col items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 text-lg"
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span className="font-medium">{link.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Sign Up</Link>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 focus:outline-none">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{userEmail?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-gray-700 hidden lg:inline">{userEmail?.split('@')[0]}</span>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                  <Link to="/Profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-gray-100">
          {navLinks().map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span className="font-medium">{link.name}</span>
              </Link>
            )
          })}
          {!user ? (
            <div className="space-y-2 pt-2">
              <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="block py-2 text-blue-600 font-semibold text-lg" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-100">
              <div className="py-2 text-gray-600">{userEmail}</div>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false) }} className="block w-full text-left py-2 text-red-600">
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default NavBar