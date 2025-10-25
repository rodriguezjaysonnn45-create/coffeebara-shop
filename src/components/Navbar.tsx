import { Link } from "react-router-dom";
import { useAuth } from "../App";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-content">
        {/* Logo */}
        <h1 className="logo">CoffeeBara Café</h1>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>

          {/* Orders only when logged in */}
          {user && <li><Link to="/orders">Orders</Link></li>}

          {user ? (
            <>
              <li className="user-greeting">Hello, {user.name}! ☕</li>
              <li>
                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
