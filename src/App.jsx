

import {Routes, Route} from 'react-router-dom'
// Client
import Home from "./pages/client/Home"
import About from "./pages/client/About"
import Restaurant from "./pages/client/Restaurant"
import Contact from "./pages/client/Contact"


// login
import LoginPage from "./pages/Login/LoginPage"
import Register from "./pages/Login/Register"
// Admin
import Dashboard from "./pages/admin/Dashboard"

// Restaurant
import Dashboards from "./pages/restaurant/Dashboard"



function App() {
  return (
    
    <Routes>
      {/* Client */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/restaurant" element={<Restaurant />} />
      <Route path="/contact" element={<Contact />} />
          
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/restaurant/dashboard" element={<Dashboards />} />
      {/* Login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Register />} />
    </Routes>
  )
}

export default App