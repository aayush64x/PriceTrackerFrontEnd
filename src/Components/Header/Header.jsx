// src/Components/Header/Header.jsx
import { useNavigate, Link } from "react-router-dom";
import { FaSearch, FaArrowLeft, FaUser, FaHeart, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react"; 
import { useAuth } from "../../javascript/AuthContext";
//import "./Header.css";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, userEmail, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      // Update URL with ?q= parameter to trigger SearchResults
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else if (searchTerm.trim() === "") {
      navigate(`/`);
    }
  };

  const handleLogout = () => {
    logout();
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
          {isAuthenticated() ? (
            // Logged in state
            <>
              <Link to="/watchlist" className="auth-link" title="My Watchlist">
                <FaHeart /> Watchlist
              </Link>
              <div className="user-menu">
                <span className="user-email">
                  <FaUser /> {userEmail}
                </span>
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </>
          ) : (
            // Logged out state
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