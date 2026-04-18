import { Routes, Route } from 'react-router-dom'

// Client
import Home from './pages/client/Home'
import About from './pages/client/About'
import Restaurant from './pages/client/Restaurant'
import Contact from './pages/client/Contact'
import Cart from './components/client/Cart'
import Profile from './components/client/Profile'

// login
import LoginPage from './pages/Login/LoginPage'
import Register from './pages/Login/Register'

// Admin
import Dashboard from './pages/admin/Dashboard'

// Restaurant
import Dashboards from './pages/restaurant/Dashboards'

// Auth
import { ProtectedRoute } from './context/ProtectedRoute'



function App() {
  return (
    
    <Routes>
      {/* Client */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/restaurant" element={<Restaurant />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Admin & Restaurant */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
      <Route path="/restaurant/Dashboards" element={<ProtectedRoute allowedRoles={['restaurant']}><Dashboards /></ProtectedRoute>} />
      <Route path="/restaurant/dashboard" element={<ProtectedRoute allowedRoles={['restaurant']}><Dashboards /></ProtectedRoute>} />


      {/* Login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Register />} />
    </Routes>
  )
}

export default App
