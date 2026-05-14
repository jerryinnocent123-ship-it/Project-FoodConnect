import Footer from '../components/client/Footer'
import NavBar from '../components/client/NavBar'

function ClientLayout({ children, className = 'min-h-screen bg-[#fffaf5]' }) {
  return (
    <div className={className}>
      <NavBar />
      {children}
      <Footer />
    </div>
  )
}

export default ClientLayout
