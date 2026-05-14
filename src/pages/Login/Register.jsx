import { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from "react-i18next";

const Register = () => {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', tel: '', adresse: '', role: 'client'
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submitLockRef = useRef(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading || submitLockRef.current) {
      return
    }

    setError('')

    //  Validation password match
    if (form.password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    submitLockRef.current = true

    try {
      const { error } = await signUp(
        form.email,
        form.password,
        form.full_name,
        form.tel,
        form.adresse,
        form.role
      )

      if (error) throw error

      if (form.role === 'restaurant') navigate('/restaurant/Dashboards')
      else navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      submitLockRef.current = false
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center">{t('Register')}</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input name="full_name" placeholder={t('Full name')} onChange={handleChange} required disabled={loading} className="w-full border p-2 rounded disabled:bg-gray-100" />

          <input name="email" type="email" placeholder={t('Email')} onChange={handleChange} required disabled={loading} className="w-full border p-2 rounded disabled:bg-gray-100" />

          {/*  Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t('Password')}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full border p-2 rounded disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-sm text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t('Confirm Password')}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full border p-2 rounded disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-2 text-sm text-gray-600"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

      {/* si motpass la pa match ok tande */}
          {confirmPassword && form.password !== confirmPassword && (
            <p className="text-red-500 text-sm">
              Passwords do not match
            </p>
          )}

          <input name="tel" placeholder={t('Phone')} onChange={handleChange} required disabled={loading} className="w-full border p-2 rounded disabled:bg-gray-100" />

          <input name="adresse" placeholder={t('Address')} onChange={handleChange} required disabled={loading} className="w-full border p-2 rounded disabled:bg-gray-100" />

          <select name="role" onChange={handleChange} disabled={loading} className="w-full border p-2 rounded disabled:bg-gray-100">
            <option value="client">Client</option>
            <option value="restaurant">Restaurant</option>
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-blue-400 disabled:cursor-not-allowed">
            {loading ? t('Creating...') : t('Signup')}
          </button>
        </form>

        <p className="mt-4 text-center">
          {t('Already have an account?')}{" "}
          <Link to="/login" className="text-blue-600">{t('Login')}</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
