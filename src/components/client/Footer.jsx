import { HandPlatter, Globe , Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-16 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <HandPlatter className="h-6 w-6 text-orange-400" />
            <span className="text-2xl font-bold">FoodConnect</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
            {t('Footer description')}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">{t('Quick Links')}</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
            <Link to="/" className="hover:text-orange-300">{t('Home')}</Link>
            <Link to="/restaurant" className="hover:text-orange-300">{t('Restaurants')}</Link>
            <Link to="/about" className="hover:text-orange-300">{t('About')}</Link>
            <Link to="/contact" className="hover:text-orange-300">{t('Contact')}</Link>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">{t('Contact')}</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-orange-300" /> +509 0000-0000</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-orange-300" /> support@foodconnect.ht</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-orange-300" /> Port-au-Prince, Haiti</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">{t('Follow Us')}</h3>
          <div className="mt-4 flex items-center gap-3">
            <a href="/" className="rounded-full bg-white/10 p-3 text-slate-200 transition hover:bg-orange-500">
              <Globe  className="h-4 w-4" />
            </a>
            <a href="mailto:support@foodconnect.ht" className="rounded-full bg-white/10 p-3 text-slate-200 transition hover:bg-orange-500">
              <Mail className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-300">{t('Footer note')}</p>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-slate-400">
        {t('Footer copyright')}
      </div>
    </footer>
  )
}

export default Footer
