import React, { useState } from 'react';
import './LandingPage.css';
import { FaSearch, FaBell, FaArrowDown, FaChartLine, FaMobile, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); //just shows hamburger menu
  const [searchQuery, setSearchQuery] = useState(''); //stores what users search
  const navigate = useNavigate(); //just redirecting to other pages

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  //
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with the query
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="landing-container">
      {/* Navigation Header */}
      <header className="landing-header">
        <div className="nav-container">
          <div className="logo">
            <h2>PriceTracker</h2>
          </div>
          
          <nav className={`nav-menu ${isMenuOpen ? 'nav-menu-active' : ''}`}>
            <Link to="#features" className="nav-link">Features</Link>
            <Link to="#how-it-works" className="nav-link">How It Works</Link>
            <Link to="#pricing" className="nav-link">Pricing</Link>
            <Link to="#support" className="nav-link">Support</Link>
          </nav>

          <div className="nav-actions">
            {/* Search Form in Header */}
            <form onSubmit={handleSearch} className="nav-search-form">
              <div className="nav-search-wrapper">
                <FaSearch className="nav-search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} //updates searchquery every time letter typed
                  className="nav-search-input"
                />
              </div>
            </form>
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/register" className="join-btn">Join Us</Link>
            <div className="mobile-menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">NEVER OVERPAY AGAIN</h1>
            <p className="hero-subtitle">Track prices across thousands of stores and get notified when your favorite products drop in price.</p>
            <Link to="/register" className="cta-button">Start Tracking</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-cards">
            <div className="price-card card-1">
              <div className="product-preview">
                <div className="product-img"></div>
                <div className="product-info">
                  <h4>iPhone 15 Pro</h4>
                  <div className="price-info">
                    <span className="old-price">$1,199</span>
                    <span className="new-price">$999</span>
                  </div>
                  <div className="price-drop">
                    <FaArrowDown /> 17% off
                  </div>
                </div>
              </div>
            </div>
            
            <div className="price-card card-2">
              <div className="product-preview">
                <div className="product-img"></div>
                <div className="product-info">
                  <h4>AirPods Pro</h4>
                  <div className="price-info">
                    <span className="old-price">$249</span>
                    <span className="new-price">$199</span>
                  </div>
                  <div className="price-drop">
                    <FaArrowDown /> 20% off
                  </div>
                </div>
              </div>
            </div>

            <div className="price-card card-3">
              <div className="product-preview">
                <div className="product-img"></div>
                <div className="product-info">
                  <h4>MacBook Air</h4>
                  <div className="price-info">
                    <span className="old-price">$1,299</span>
                    <span className="new-price">$1,099</span>
                  </div>
                  <div className="price-drop">
                    <FaArrowDown /> 15% off
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="categories-container">
          <div className="category-column">
            <h3>Featured Stores</h3>
            <ul>
              <li><Link to="#amazon">Amazon</Link></li>
              <li><Link to="#bestbuy">Best Buy</Link></li>
              <li><Link to="#walmart">Walmart</Link></li>
              <li><Link to="#target">Target</Link></li>
            </ul>
          </div>

          <div className="category-column">
            <h3>Electronics</h3>
            <ul>
              <li><Link to="#phones">Smartphones</Link></li>
              <li><Link to="#laptops">Laptops</Link></li>
              <li><Link to="#headphones">Headphones</Link></li>
              <li><Link to="#tablets">Tablets</Link></li>
            </ul>
          </div>

          <div className="category-column">
            <h3>Fashion</h3>
            <ul>
              <li><Link to="#shoes">Shoes</Link></li>
              <li><Link to="#clothing">Clothing</Link></li>
              <li><Link to="#accessories">Accessories</Link></li>
              <li><Link to="#watches">Watches</Link></li>
            </ul>
          </div>

          <div className="category-column">
            <h3>Home & Garden</h3>
            <ul>
              <li><Link to="#furniture">Furniture</Link></li>
              <li><Link to="#appliances">Appliances</Link></li>
              <li><Link to="#decor">Home Decor</Link></li>
              <li><Link to="#tools">Tools</Link></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="features-container">
          <h2>Why Choose PriceTracker?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaBell />
              </div>
              <h3>Real-time Alerts</h3>
              <p>Get instant notifications when prices drop below your target price across multiple stores.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>Price History</h3>
              <p>View detailed price history charts to make informed purchasing decisions and spot trends.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaSearch />
              </div>
              <h3>Smart Search</h3>
              <p>Advanced search algorithms to find the best deals across thousands of online stores.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaMobile />
              </div>
              <h3>Mobile Ready</h3>
              <p>Track prices on the go with our responsive design that works perfectly on any device.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><Link to="#guide">User Guide</Link></li>
              <li><Link to="#faq">FAQ</Link></li>
              <li><Link to="#blog">Blog</Link></li>
              <li><Link to="#api">API Access</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Help</h4>
            <ul>
              <li><Link to="#support">Get Help</Link></li>
              <li><Link to="#contact">Contact Us</Link></li>
              <li><Link to="#feedback">Feedback</Link></li>
              <li><Link to="#report">Report Issue</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><Link to="#about">About Us</Link></li>
              <li><Link to="#careers">Careers</Link></li>
              <li><Link to="#press">Press</Link></li>
              <li><Link to="#investors">Investors</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Account</h4>
            <ul>
              <li><Link to="/register">Sign Up</Link></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="#premium">Premium</Link></li>
              <li><Link to="#enterprise">Enterprise</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 PriceTracker. All rights reserved.</p>
          <div className="footer-links">
            <Link to="#privacy">Privacy Policy</Link>
            <Link to="#terms">Terms of Service</Link>
            <Link to="#cookies">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;