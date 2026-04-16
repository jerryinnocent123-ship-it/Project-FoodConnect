import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../../lib/supabase'

 const Profile = () => {
  // ============================================
  // 1. Deklarasyon tout varyab nou pral itilize
  // ============================================
  
  // { user } soti nan AuthContext - li gen enfòmasyon sou moun ki konekte a
  const { user } = useAuth()
  
  // loading: si true, montre yon spinner pandan app ap chaje
  const [loading, setLoading] = useState(false)
  
  // message: pou montre si operasyon an reyisi oswa si gen erè
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // profile: tout enfòmasyon pèsonèl moun nan
  const [profile, setProfile] = useState({
    email: '',           // Gmail la (kap vini otomatikman)
    firstName: '',       // Non
    lastName: '',        // Premye non
    phone: '',           // Nimewo telefòn
    address: '',         // Adrès
    city: '',           // Vil
    postalCode: '',     // Kòd postal
    country: ''         // Peyi
  })

  // ============================================
  // 2. useEffect - Chaje done yo lè paj lan ouvri
  // ============================================
  
  useEffect(() => {
    // Si gen yon itilizatè ki konekte, mete email la otomatikman
    if (user) {
      setProfile(prev => ({
        ...prev,
        email: user.email  // Mete Gmail la soti nan Auth
      }))
      loadProfile() // Chaje profile ki te deja anrejistre
    }
  }, [user])

  // ============================================
  // 3. Fonksyon pou chaje profile ki egziste deja
  // ============================================
  
  const loadProfile = async () => {
    try {
      setLoading(true)
      
      // Rekipere done profile nan tab "profiles" nan Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = pa gen done
        throw error
      }
      
      // Si gen done, mete yo nan profile
      if (data) {
        setProfile({
          email: user.email,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postal_code || '',
          country: data.country || ''
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // 4. Fonksyon pou mete ajou profile
  // ============================================
  
  const handleChange = (e) => {
    // Mete ajou valè nan profile lè itilizatè a tape
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Anpeche paj la reload
    setLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      // Mete ajou oswa kreye profile nan Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,                    // ID itilizatè a
          email: user.email,              // Email la
          first_name: profile.firstName,  // Non
          last_name: profile.lastName,    // Premye non
          phone: profile.phone,           // Telefòn
          address: profile.address,       // Adrès
          city: profile.city,             // Vil
          postal_code: profile.postalCode,// Kòd postal
          updated_at: new Date()          // Dat dènye modifikasyon
        })
      
      if (error) throw error
      
      // Montre mesaj siksè
      setMessage({ type: 'success', text: 'Profile modified avèk siksè!' })
      
      // Efase mesaj la apre 3 segonn
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Erè: ' + error.message })
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // 5. Kòd HTML la (sistèm nan)
  // ============================================
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Tit paj la */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Mwen</h1>
          <p className="text-gray-600">Jere enfòmasyon pèsonèl ou</p>
        </div>
        
        {/* Mesaj siksè oswa erè */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
        
        {/* Fòm lan */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          
          {/* Seksyon Email - li afiche otomatikman soti nan Gmail la */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              📧 Gmail / Email
            </label>
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg border text-gray-600">
              {profile.email} {/* Email la afiche isit men ou pa ka chanje l */}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Email sa a soti nan kont ou. Ou pa ka modifye l isit.
            </p>
          </div>
          
          {/* Fòm nan 2 kolòn pou pi bèl */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Non */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                👤 Non *
              </label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Antre non ou"
              />
            </div>
            
            {/* Premye Non */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                👤 Premye Non *
              </label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Antre premye non ou"
              />
            </div>
            
            {/* Telefòn */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                📞 Telefòn
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+509 1234 5678"
              />
            </div>
            
            {/* Adrès */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                🏠 Adrès
              </label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Non rue, nimewo kay"
              />
            </div>
            
            {/* Vil */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                🏙️ Vil
              </label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pòtoprens, Kap Ayisyen..."
              />
            </div>
            
            {/* Kòd Postal */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                📮 Kòd Postal
              </label>
              <input
                type="text"
                name="postalCode"
                value={profile.postalCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="HT 6110"
              />
            </div>
            
            {/* Peyi */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                🌍 Peyi
              </label>
              <select
                name="country"
                value={profile.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chwazi peyi ou</option>
                <option value="Haiti">Ayiti</option>
                <option value="USA">Etazini</option>
                <option value="Canada">Kanada</option>
                <option value="France">Frans</option>
                <option value="Other">Lòt</option>
              </select>
            </div>
          </div>
          
          {/* Bouton pou anrejistre */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Chargement...' : '💾 Anrejistre Profile'}
            </button>
          </div>
        </form>
        
        {/* Enfòmasyon lokalizasyon (map) - Bonus */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">📍 Lokalizasyon</h2>
          <p className="text-gray-600 mb-4">
            Afiche adrès ou sou yon kat (Google Maps)
          </p>
          {profile.address && profile.city && (
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(
                `${profile.address}, ${profile.city}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <span>📍 Wè sou Google Maps</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile