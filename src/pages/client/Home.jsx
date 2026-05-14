import Hero from '../../components/client/Hero'
import RecentMenusSection from '../../components/client/RecentMenusSection'
import RestaurantDirectory from '../../components/client/RestaurantDirectory'
import ClientLayout from '../../layouts/ClientLayout'

function Home() {
  return (
    <ClientLayout>
      <Hero />
      <RecentMenusSection />
      <RestaurantDirectory compact />
    </ClientLayout>
  )
}

export default Home
