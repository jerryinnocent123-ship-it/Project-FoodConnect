import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Hero() {
  const bgHero = "../../Public/hero-bg.jpg";
  const bgVideo = "/VId.mp4";

  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative h-[400px] flex items-center justify-center text-white overflow-hidden">
      
     

      
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      
      <div className="absolute inset-0 bg-black/60"></div>

      
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        
        <h1 className="text-5xl font-bold">
          {t('Delicious Food, Delivered To You')}
        </h1>

        <p className="text-lg mt-4">
          {t('Order your favorite meals from local restaurants in minutes.')}
        </p>

          <button
          onClick={() => navigate("/restaurant")}
          className="mt-12 px-8 py-4 text-2xl font-bold bg-[#D80B0F] text-white rounded-lg hover:bg-[#A3080B] transition-all duration-300 active:scale-95"
        >
          {t("Order Now")}
        </button>
           
          </div>
          </div>

        

      

     
    
  );
}

export default Hero;