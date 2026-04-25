import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from "react-i18next";


const getRedirectPath = (role) => {
  const normalizedRole = typeof role === 'string' ? role.trim().toLowerCase() : 'client'

  if (normalizedRole === 'admin') return '/admin/dashboard'
  if (normalizedRole === 'restaurant') return '/restaurant/Dashboards'
  return '/'
}

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return

    navigate(getRedirectPath(user.role), { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await signIn(email, password)
      if (error) throw error

      navigate(getRedirectPath(data?.user?.role), { replace: true })
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }
const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center">{t('Login')}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="email"
            placeholder={t('Email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder={t('Password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
           {loading ? t('Signing in...') : t('Login')}
          </button>
        </form>
        <p className="mt-4 text-center">
          {t('No account?')} <Link to="/signup" className="text-blue-600">{t('Signup')}</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
