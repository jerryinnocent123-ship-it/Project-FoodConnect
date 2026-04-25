import { Mail, MapPin, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ClientLayout from '../../layouts/ClientLayout'

function Contact() {
  const { t } = useTranslation()

  return (
    <ClientLayout>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          {t('Contact')}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">{t('Contact Us')}</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">{t('Contact description')}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-[2rem] bg-white p-6 shadow-sm">
            <Phone className="h-6 w-6 text-orange-500" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">{t('Phone')}</h2>
            <p className="mt-2 text-slate-600">+509 0000-0000</p>
          </article>
          <article className="rounded-[2rem] bg-white p-6 shadow-sm">
            <Mail className="h-6 w-6 text-orange-500" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">{t('Email')}</h2>
            <p className="mt-2 text-slate-600">support@foodconnect.ht</p>
          </article>
          <article className="rounded-[2rem] bg-white p-6 shadow-sm">
            <MapPin className="h-6 w-6 text-orange-500" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">{t('Address')}</h2>
            <p className="mt-2 text-slate-600">Port-au-Prince, Haiti</p>
          </article>
        </div>
        
      </section>
    </ClientLayout>
  )
}

export default Contact
