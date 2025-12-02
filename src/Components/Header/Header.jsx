import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaSearch, FaArrowLeft, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react"; 

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('userEmail');
      
      if (token && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
      }
    };

    // Check on mount
    checkAuth();

    // Listen for custom auth change event
    window.addEventListener('authChange', checkAuth);

    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else if (searchTerm.trim() === "") {
      navigate(`/`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail("");
    
    // Trigger custom event
    window.dispatchEvent(new Event('authChange'));
    
    navigate('/');
  };

  return (
    <header className="top-header">
      <div className="header-content">
        {/* Back to Home */}
        <Link to="/" className="back-link">
          <FaArrowLeft /> Home
        </Link>

        {/* Search Box */}
        <div className="header-search">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-field"
              />
              <button type="submit" className="search-btn">
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Auth Links - Conditional Rendering */}
        <div className="header-actions">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="auth-btn dashboard-btn">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="auth-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
              <Link to="/register" className="auth-btn">
                Join Us
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;