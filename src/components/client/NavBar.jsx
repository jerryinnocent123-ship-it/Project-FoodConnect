import { Link } from "react-router-dom"

function NavBar() {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/restaurant">Restaurant</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    </div>

    

  )
}

export default NavBar