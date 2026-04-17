// sa se hero component ki pral montre yon imaj ak yon mesaj akeyi itilizatè a sou paj dakèy la. 
// Li kapab gen ladan tou yon bouton pou ankouraje itilizatè a pou li eksplore plis sou sit la
//  oswa pou li enskri.

function Hero() {
  const bgHero = "../../Public/hero-bg.jpg" // chemen imaj la
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

        <h1 className="text-4xl font-bold text-center">Delicious Food, Delivered To You</h1>
        <p className="text-lg text-center">Order your favorite meals from local restaurants in minutes.</p>
        <button className="btn-primary" style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#D80B0F',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          
        }}>Order Now</button>
      </div>

    </>

  )
}

export default Hero