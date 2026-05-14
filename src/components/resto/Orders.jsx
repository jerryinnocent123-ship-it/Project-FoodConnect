import React from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../common/LanguageSwitcher'
import SideBarResto from '../../layouts/SideBarResto'

function Orders() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBarResto />

      <div className="min-h-screen p-6 md:ml-64">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                {t('Orders')}
              </p>
              <h1 className="text-3xl font-bold text-slate-900">{t('Orders')}</h1>
            </div>
            <LanguageSwitcher />
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-slate-700">{t('Orders page coming soon.')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders
