import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// Import pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders"; // ✅ Added Orders page
import NotFound from "./pages/NotFound";

/* ========================================
   AUTH CONTEXT
======================================== */
interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("coffeebaraUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("coffeebaraUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("coffeebaraUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* ========================================
   NAVBAR COMPONENT
======================================== */
const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-content">
        <h1 className="logo">CoffeeBara Café</h1>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          {user && <li><Link to="/orders">Orders</Link></li>} {/* ✅ Orders link visible only if logged in */}

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

/* ========================================
   FOOTER COMPONENT
======================================== */
const Footer = () => (
  <footer className="footer">
    <p>© {new Date().getFullYear()} CoffeeBara Café. All rights reserved.</p>
  </footer>
);

/* ========================================
   MAIN APP COMPONENT
======================================== */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/orders" element={<Orders />} /> {/* ✅ Added route */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} /> {/* 404 fallback */}
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
