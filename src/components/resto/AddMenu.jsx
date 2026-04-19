import { useState } from 'react'
import { ImagePlus, LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import SideBarResto from '../../layouts/SideBarResto'
import LanguageSwitcher from '../common/LanguageSwitcher'
import { createMenu } from '../../services/menuService'

const initialForm = {
  title: '',
  description: '',
  price: '',
}

function AddMenu() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleImageChange = (event) => {
    const nextFile = event.target.files?.[0] || null
    setImageFile(nextFile)
    setSuccessMessage('')
    setErrorMessage('')

    if (!nextFile) {
      setPreviewUrl('')
      return
    }

    setPreviewUrl(URL.createObjectURL(nextFile))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!user?.id) {
      setErrorMessage(t('You must be logged in as a restaurant to add a menu.'))
      return
    }

    if (!form.title.trim() || !form.description.trim() || !form.price || !imageFile) {
      setErrorMessage(t('Please complete all fields before saving the menu.'))
      return
    }

    try {
      setIsSubmitting(true)

      await createMenu({
        title: form.title,
        description: form.description,
        price: form.price,
        imageFile,
        ownerId: user?.id,
      })

      setForm(initialForm)
      setImageFile(null)
      setPreviewUrl('')
      setSuccessMessage(t('Menu added successfully.'))
    } catch (submitError) {
      console.error('Error creating menu:', submitError)
      setErrorMessage(submitError.message || t('Unable to save this menu right now.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBarResto />

      <div className="min-h-screen p-6 md:ml-64">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                {t('Menu Management')}
              </p>
              <h1 className="text-3xl font-bold text-slate-900">{t('Add a New Menu')}</h1>
            </div>
            <LanguageSwitcher />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
            >
              <div className="grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {t('Menu Title')}
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder={t('Enter the menu title')}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {t('Description')}
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder={t('Describe the menu item')}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {t('Price')}
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="12.99"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {t('Menu Image')}
                  </label>
                  <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-slate-500 transition hover:border-orange-300 hover:bg-orange-50">
                    <ImagePlus className="h-5 w-5" />
                    <span>{t('Choose an image')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {errorMessage && (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? t('Saving...') : t('Add Menu')}
                </button>
              </div>
            </form>

            <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
                {t('Live Preview')}
              </p>
              <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-white/10">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={form.title || t('Menu preview')}
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center bg-slate-900/60 text-slate-300">
                    {t('Image preview will appear here.')}
                  </div>
                )}
                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {form.title || t('Your menu title')}
                      </h2>
                      <p className="mt-1 text-sm text-slate-300">
                        {user?.profile?.full_name || user?.email}
                      </p>
                    </div>
                    <span className="rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold text-white">
                      ${Number(form.price || 0).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-200">
                    {form.description || t('Your menu description will appear here.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddMenu
