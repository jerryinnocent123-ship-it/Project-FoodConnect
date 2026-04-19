import { Camera, LoaderCircle, Mail, MapPin, Phone, Shield, UserCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import ClientLayout from '../../layouts/ClientLayout'
import {
  buildDefaultUsername,
  fetchProfileById,
  saveProfile,
  uploadProfileImage,
} from '../../services/profileService'

function Profile() {
  const { t } = useTranslation()
  const { user, refreshUser } = useAuth()
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    email: '',
    tel: '',
    adresse: '',
    images_url: '',
    role: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      try {
        const data = await fetchProfileById(user?.id, user?.email)
        if (!isMounted) return

        setProfile({
          full_name: data.full_name || '',
          username: data.username || buildDefaultUsername(data.full_name || user?.email || ''),
          email: data.email || user?.email || '',
          tel: data.tel || '',
          adresse: data.adresse || '',
          images_url: data.images_url || '',
          role: data.role || user?.role || '',
        })
      } catch (error) {
        if (!isMounted) return
        console.error('Error loading profile:', error)
        setMessage({ type: 'error', text: error.message || t('Unable to load profile right now.') })
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (user?.id) {
      loadProfile()
    } else {
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [t, user?.email, user?.id, user?.role])

  const roleLabel = useMemo(() => {
    if (profile.role === 'admin') return t('Administrator')
    if (profile.role === 'restaurant') return t('Restaurant Owner')
    return t('Client')
  }, [profile.role, t])

  const handleChange = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
  }

  const handleImageChange = async (event) => {
    const nextFile = event.target.files?.[0]
    if (!nextFile || !user?.id) return

    try {
      setIsSaving(true)
      setMessage({ type: '', text: '' })
      const nextImageUrl = await uploadProfileImage({ file: nextFile, userId: user.id })

      const updatedProfile = await saveProfile({
        userId: user.id,
        email: profile.email,
        full_name: profile.full_name || user.email,
        username: profile.username || buildDefaultUsername(profile.email),
        tel: profile.tel,
        adresse: profile.adresse,
        role: profile.role || user.role,
        images_url: nextImageUrl,
      })

      setProfile((current) => ({ ...current, images_url: updatedProfile.images_url || nextImageUrl }))
      await refreshUser()
      setMessage({ type: 'success', text: t('Profile updated successfully.') })
    } catch (error) {
      console.error('Error uploading profile image:', error)
      setMessage({ type: 'error', text: error.message || t('Unable to save profile right now.') })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!user?.id) return

    try {
      setIsSaving(true)
      setMessage({ type: '', text: '' })

      const updatedProfile = await saveProfile({
        userId: user.id,
        email: profile.email,
        full_name: profile.full_name,
        username: profile.username || buildDefaultUsername(profile.full_name || profile.email),
        tel: profile.tel,
        adresse: profile.adresse,
        role: profile.role || user.role,
        images_url: profile.images_url,
      })

      setProfile((current) => ({ ...current, ...updatedProfile }))
      await refreshUser()
      setMessage({ type: 'success', text: t('Profile updated successfully.') })
    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage({ type: 'error', text: error.message || t('Unable to save profile right now.') })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ClientLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            {t('Profile')}
          </p>
          <h1 className="text-3xl font-bold text-slate-900">{t('Manage Your Profile')}</h1>
        </div>

        {message.text && (
          <div
            className={`mb-6 rounded-2xl px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {message.text}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center gap-3 text-slate-600">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            <span>{t('Loading profile...')}</span>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  {profile.images_url ? (
                    <img
                      src={profile.images_url}
                      alt={profile.full_name || profile.username}
                      className="h-32 w-32 rounded-full object-cover ring-4 ring-white/20"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10 ring-4 ring-white/10">
                      <UserCircle className="h-16 w-16 text-slate-200" />
                    </div>
                  )}

                  <label className="absolute bottom-1 right-1 flex cursor-pointer items-center justify-center rounded-full bg-orange-500 p-3 text-white shadow-lg transition hover:bg-orange-400">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>

                <h2 className="mt-5 text-2xl font-semibold">{profile.full_name || t('No name yet')}</h2>
                <p className="mt-1 text-sm text-slate-300">@{profile.username || 'username'}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-100">
                  <Shield className="h-4 w-4 text-orange-300" />
                  {roleLabel}
                </div>
              </div>

              <div className="mt-8 space-y-4 text-sm text-slate-200">
                <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-orange-300" /> {profile.email || t('Not provided')}</p>
                <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-orange-300" /> {profile.tel || t('Not provided')}</p>
                <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-orange-300" /> <span>{profile.adresse || t('Not provided')}</span></p>
              </div>
            </aside>

            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">{t('Full name')}</label>
                  <input
                    type="text"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                    placeholder={t('Enter your full name')}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">{t('Username')}</label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                    placeholder="foodconnect_user"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">{t('Phone')}</label>
                  <input
                    type="text"
                    name="tel"
                    value={profile.tel}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                    placeholder="+509 0000-0000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">{t('Address')}</label>
                  <input
                    type="text"
                    name="adresse"
                    value={profile.adresse}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                    placeholder={t('Enter your address')}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">{t('Email')}</label>
                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">{t('Role')}</label>
                  <input
                    type="text"
                    value={roleLabel}
                    readOnly
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSaving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {isSaving ? t('Saving...') : t('Save Profile')}
              </button>
            </form>
          </div>
        )}
      </div>
    </ClientLayout>
  )
}

export default Profile
