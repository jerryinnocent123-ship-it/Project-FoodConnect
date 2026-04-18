import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import React from 'react'

function Dashboards() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const { error } = await signOut()
      if (error) {
        console.error('Logout error:', error)
        return
      }
      // Force a hard redirect and reload to ensure completely clean state
      window.location.replace(`/?logout=true&t=${Date.now()}`)
    } catch (error) {
      console.error('Unexpected logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <div>
        <p>Welcome to the restaurant dashboard.</p>
      </div>
    </div>
  )
}

export default Dashboards