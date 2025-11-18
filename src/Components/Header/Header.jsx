import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { useState } from "react"; 

//import "./Header.css";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      // Update URL with ?q= parameter to trigger SearchResults
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      
    }else if (searchTerm.trim() === ""){
        navigate(`/`);
    }
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

        {/* Auth Links */}
        <div className="header-actions">
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
          <Link to="/register" className="auth-btn">
            Join Us
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;