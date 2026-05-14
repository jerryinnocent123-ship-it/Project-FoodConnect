import { useState } from 'react'
import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Francais' },
  { code: 'ht', label: 'Kreyol' },
]

function LanguageSwitcher({ compact = false, className = '' }) {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = i18n.language?.slice(0, 2).toUpperCase() || 'EN'

  const handleChangeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600 ${
          compact ? 'px-2.5 py-2' : ''
        }`}
      >
        <Globe className="h-4 w-4" />
        {!compact && <span>{t('Language')}</span>}
        <span className="uppercase">{currentLanguage}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => handleChangeLanguage(language.code)}
              className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
