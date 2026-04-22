import { Link, useLocation } from 'react-router-dom'
import { ClipboardList, LayoutDashboard, Menu as MenuIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/common/LanguageSwitcher'

function SideBarResto() {
  const { t } = useTranslation()
  const location = useLocation()

  const links = [
    { label: t('Dashboard'), path: '/restaurant/dashboard', icon: LayoutDashboard },
    { label: t('Orders'), path: '/restaurant/orders', icon: ClipboardList },
    { label: t('Add Menu'), path: '/restaurant/add-menu', icon: MenuIcon },
  ]

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-slate-900 text-white shadow-xl md:block">
      <div className="flex h-full flex-col px-5 py-6">
        <div className="mb-8 border-b border-slate-700 pb-4">
          <h2 className="text-2xl font-bold">{t('Restaurant')}</h2>
          <p className="mt-1 text-sm text-slate-300">{t('Dashboard sidebar')}</p>
        </div>

        <nav className="flex flex-1 flex-col gap-3">
          {links.map((link) => {
            const isActive = location.pathname === link.path
            const Icon = link.icon

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <LanguageSwitcher className="mt-6" />
      </div>
    </aside>
  )
}

export default SideBarResto
