// sa se hero component ki pral montre yon imaj ak yon mesaj akeyi itilizatè a sou paj dakèy la. 
// Li kapab gen ladan tou yon bouton pou ankouraje itilizatè a pou li eksplore plis sou sit la
//  oswa pou li enskri.
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next";

function Hero() {
  const bgHero = "../../Public/hero-bg.jpg"
  const bgVideo = "/VId.mp4" 
  const navigate = useNavigate();
  const { t } = useTranslation()

  return (
    <>
      <div className="bg-hero" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7)), url(${bgHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>

        {/* VIDEO */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        >
          <source src={bgVideo} type="video/mp4" />
        </video>

        {/* OVERLAY */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/80 to-black/70 z-10"></div>

        {/* CONTENT */}
        <div className="absolute inset-0 z-20 flex flex-col">

          {/* TEXTE (un peu plus bas) */}
          <div className="flex-1 flex flex-col justify-center items-center text-center px-4 mt-10">
            <h1 className="text-5xl font-bold text-white">
              {t('Delicious Food, Delivered To You')}
            </h1>

            <p className="text-lg text-white mt-4">
              {t('Order your favorite meals from local restaurants in minutes.')}
            </p>
          </div>

          {/* BOUTON BAS DROITE */}
          <div className="p-6 flex justify-end">
            <button
              onClick={() => navigate('/restaurant')}
              className="px-8 py-4 text-2xl font-bold bg-[#D80B0F] text-white rounded-full transition-all duration-300 ease-in-out hover:bg-[#A3080B] hover:shadow-lg active:scale-95"
            >
              {t('Order Now')}
            </button>
          </div>

        </div>

      </div>
    </>
  )
}

export default Hero