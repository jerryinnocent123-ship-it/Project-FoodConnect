// sa se hero component ki pral montre yon imaj ak yon mesaj akeyi itilizatè a sou paj dakèy la. 
// Li kapab gen ladan tou yon bouton pou ankouraje itilizatè a pou li eksplore plis sou sit la
//  oswa pou li enskri.
import { useNavigate } from "react-router-dom"

function Hero() {
  const bgHero = "../../Public/hero-bg.jpg" // chemen imaj la
  const navigate = useNavigate();


  return (
    <>
      <div className="bg-hero" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7)), url(${bgHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '400px', display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center', color: '#fff'
      }}>

        <h1 className="text-5xl font-bold text-center">Delicious Food, Delivered To You</h1>
        <p className="text-lg text-center">Order your favorite meals from local restaurants in minutes.</p>
        <button onClick={() => navigate('/restaurant')}
         className="mt-5 px-8 py-4 text-2xl font-bold bg-[#D80B0F] text-white border-none rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#A3080B] hover:shadow-lg active:scale-95">
          Order Now
        </button>
      </div>

    </>

  )
}

export default Hero