import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from "react-i18next";

const Register = () => {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', tel: '', adresse: '', role: 'client'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await signUp(
        form.email, form.password, form.full_name, form.tel, form.adresse, form.role
      )
      if (error) throw error

      if (form.role === 'restaurant') navigate('/restaurant/Dashboards')
      else navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center">{t('Register')}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input name="full_name" placeholder={t('Full name')} onChange={handleChange} required className="w-full border p-2 rounded" />
          <input name="email" type="email" placeholder={t('Email')} onChange={handleChange} required className="w-full border p-2 rounded" />
          <input name="password" type="password" placeholder={t('Password')} onChange={handleChange} required className="w-full border p-2 rounded" />
          <input name="tel" placeholder={t('Phone')} onChange={handleChange} required className="w-full border p-2 rounded" />
          <input name="adresse" placeholder={t('Address')} onChange={handleChange} required className="w-full border p-2 rounded" />
          <select name="role" onChange={handleChange} className="w-full border p-2 rounded">
            <option value="client">Client</option>
            <option value="restaurant">Restaurant</option>
          </select>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
            {loading ? t('Creating...') : t('Signup')}
          </button>
        </form>
        <p className="mt-4 text-center">{t('Already have an account?')} <Link to="/login" className="text-blue-600">{t('Login')}</Link></p>
      </div>
    </div>
  )
}

export default Register
