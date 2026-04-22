import { useTranslation } from 'react-i18next'
import ClientLayout from '../../layouts/ClientLayout'

export default function About() {
  const { t } = useTranslation()

  return (
    <ClientLayout>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          {t('About')}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">{t('About FoodConnect')}</h1>
        <div className="mt-6 space-y-5 text-lg leading-8 text-slate-600">
          <p>{t('About paragraph one')}</p>
          <p>{t('About paragraph two')}</p>
        </div>
      </section>
    </ClientLayout>
  )
}
