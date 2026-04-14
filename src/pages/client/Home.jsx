import NavBar from "../../components/client/NavBar"
import Hero from "../../components/client/Hero"

function Home() {
  return (
    <div>
      <NavBar />
      <h1>Home</h1> 
      {/* fok nou efase h1 sa */}
      <Hero />
    </div>
  )
}

export default Home