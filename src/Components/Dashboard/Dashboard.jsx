import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import {
  FaShoppingCart,
  FaBell,
  FaDollarSign,
  FaClock,
  FaTrash,
  FaChartLine,
  FaExternalLinkAlt,
  FaUser,
  FaEnvelope,
  FaLock,
  FaBox,
  FaCog,
  FaSearch
} from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState('');
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTargetPrice, setNewTargetPrice] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);

  const navigate = useNavigate();

  // Get user email from localStorage or redirect to login
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/login');
      return;
    }
    setUserEmail(email);
    fetchWatchlist(email);
  }, [navigate]);

  // Fetch watchlist from backend
  const fetchWatchlist = async (email) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/watchlist/saved-products', {
        params: { email }
      });
      setWatchlistItems(response.data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate status based on current price and target
  const getStatus = (currentPrice, targetPrice) => {
    if (!currentPrice || !targetPrice) return 'above';
    
    const difference = currentPrice - targetPrice;
    const percentDiff = (difference / targetPrice) * 100;

    if (currentPrice <= targetPrice) return 'below';
    if (percentDiff <= 10) return 'close'; // Within 10% of target
    return 'above';
  };

  // Calculate price difference
  const getPriceDifference = (currentPrice, targetPrice) => {
    if (!currentPrice || !targetPrice) return 0;
    return (currentPrice - targetPrice).toFixed(2);
  };

  // Get status badge text
  const getStatusText = (status) => {
    switch (status) {
      case 'below': return 'Below Target';
      case 'close': return 'Close to Target';
      case 'above': return 'Above Target';
      default: return 'Unknown';
    }
  };

  // Format time ago
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const now = new Date();
    const then = new Date(timestamp);
    const diffInMs = now - then;
    const diffInMins = Math.floor(diffInMs / 60000);
    
    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} min ago`;
    
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  // Open product details modal
  const viewProductDetails = async (product) => {
    setSelectedProduct(product);
    setNewTargetPrice(product.targetPrice || product.price);
    setShowModal(true);

    // Fetch price history for this product
    try {
      const response = await axios.get(`http://localhost:8080/price-history`, {
        params: { q: product.asin }
      });
      setPriceHistory(response.data);
    } catch (error) {
      console.error('Error fetching price history:', error);
      setPriceHistory([]);
    }
  };

  // Update target price
  const updateTargetPrice = async () => {
    if (!selectedProduct || !newTargetPrice) return;

    try {
      // Call backend to update target price
      await axios.put(
        `http://localhost:8080/api/watchlist/${selectedProduct.id}/target-price`,
        { targetPrice: parseFloat(newTargetPrice) }
      );

      // Update local state
      setWatchlistItems(prev =>
        prev.map(item =>
          item.id === selectedProduct.id
            ? { ...item, targetPrice: parseFloat(newTargetPrice) }
            : item
        )
      );

      alert('Target price updated successfully!');
      setShowModal(false);
    } catch (error) {
      console.error('Error updating target price:', error);
      alert('Failed to update target price');
    }
  };

  // Remove from watchlist
  const removeFromWatchlist = async (productId) => {
    if (!window.confirm('Are you sure you want to stop tracking this product?')) {
      return;
    }

    try {
      // Call backend to remove
      await axios.delete(`http://localhost:8080/api/watchlist/${productId}`);

      // Update local state
      setWatchlistItems(prev => prev.filter(item => item.id !== productId));
      alert('Product removed from watchlist');
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      alert('Failed to remove product');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  // Delete account
  const deleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${userEmail}`);
        localStorage.removeItem('userEmail');
        alert('Account deleted successfully');
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Calculate stats
  const totalProducts = watchlistItems.length;
  const belowTargetCount = watchlistItems.filter(
    item => getStatus(item.price, item.targetPrice) === 'below'
  ).length;
  const potentialSavings = watchlistItems
    .filter(item => item.price < item.targetPrice)
    .reduce((sum, item) => sum + (item.targetPrice - item.price), 0);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">My Dashboard</h1>
          
          {/* Search Bar */}
          <div className="dashboard-search">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-field"
                />
                <button type="submit" className="search-btn">
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="dashboard-user-info">
            <button onClick={() => setShowAccountSettings(true)} className="settings-btn">
              Settings 
            </button>
            <button onClick={handleLogout} className="dashboard-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Tracked Products Section */}
        <section>
          <div className="section-header">
            <h2 className="section-title">Tracked Products</h2>
          </div>

          {watchlistItems.length === 0 ? (
            <div className="empty-state">
              <FaBox className="empty-icon" />
              <h3>No products tracked yet</h3>
              <p>Start tracking products to get price alerts</p>
              <Link to="/search" className="browse-products-btn">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="dashboard-products-grid">
              {watchlistItems.map((product) => {
                const status = getStatus(product.price, product.targetPrice);
                const priceDiff = getPriceDifference(product.price, product.targetPrice);

                return (
                  <div key={product.id} className="dashboard-product-card">
                    <div className="product-card-image">
                      <img
                        src={product.imageURL || '/placeholder.png'}
                        alt={product.productName}
                      />
                    </div>

                    <div className="product-card-content">
                      <h3 className="product-card-name">{product.productName}</h3>

                      <div className="price-comparison">
                        <div className="price-row">
                          <span className="price-label">Current Price</span>
                          <span className="price-value">
                            ${product.price ? product.price.toFixed(2) : 'N/A'}
                          </span>
                        </div>

                        <div className="price-row">
                          <span className="price-label">Target Price</span>
                          <span className="price-value">
                            ${product.targetPrice ? product.targetPrice.toFixed(2) : 'N/A'}
                          </span>
                        </div>

                        <div className="price-row">
                          <span className="price-label">Difference</span>
                          <span className={`price-difference ${priceDiff < 0 ? 'positive' : 'negative'}`}>
                            {priceDiff > 0 ? '+' : ''}${priceDiff}
                          </span>
                        </div>
                      </div>

                      <div className="last-updated">
                        <FaClock />
                        <span>Updated {getTimeAgo(product.timeStamp)}</span>
                      </div>

                      <div className="product-card-actions">
                        <button
                          onClick={() => viewProductDetails(product)}
                          className="view-history-btn"
                        >
                          <FaChartLine /> View Details
                        </button>
                        <button
                          onClick={() => removeFromWatchlist(product.id)}
                          className="remove-btn"
                        >
                          <FaTrash /> 
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Account Settings Modal */}
      {showAccountSettings && (
        <div className="modal-overlay" onClick={() => setShowAccountSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Account Settings</h2>
              <button className="modal-close" onClick={() => setShowAccountSettings(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="account-info">
                <div className="info-row">
                  <span className="info-label">
                    <FaEnvelope /> Email
                  </span>
                  <span className="info-value">{userEmail}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">
                    <FaLock /> Password
                  </span>
                  <button className="edit-btn">Change Password</button>
                </div>
              </div>

              <div className="notification-preferences">
                <h3>Notification Preferences</h3>

                <div className="preference-item">
                  <span>Email Notifications</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <span>Price Drop Alerts</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={priceDropAlerts}
                      onChange={(e) => setPriceDropAlerts(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="danger-zone">
                <h3>Danger Zone</h3>
                <button onClick={deleteAccount} className="delete-account-btn">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Product Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-product-grid">
                <div className="modal-product-image">
                  <img
                    src={selectedProduct.imageURL || '/placeholder.png'}
                    alt={selectedProduct.productName}
                  />
                </div>

                <div className="modal-product-info">
                  <h3>{selectedProduct.productName}</h3>

                  <div className="modal-price-info">
                    <div className="modal-price-row">
                      <span className="price-label">Current Price</span>
                      <span className="price-value">
                        ${selectedProduct.price ? selectedProduct.price.toFixed(2) : 'N/A'}
                      </span>
                    </div>

                    <div className="modal-price-row">
                      <span className="price-label">Your Target</span>
                      <span className="price-value">
                        ${selectedProduct.targetPrice ? selectedProduct.targetPrice.toFixed(2) : 'N/A'}
                      </span>
                    </div>

                    <div className="modal-price-row">
                      <span className="price-label">ASIN</span>
                      <span className="info-value">{selectedProduct.asin}</span>
                    </div>
                  </div>

                  <div className="target-price-edit">
                    <input
                      type="number"
                      step="0.01"
                      value={newTargetPrice}
                      onChange={(e) => setNewTargetPrice(e.target.value)}
                      className="target-price-input"
                      placeholder="New target price"
                    />
                    <button onClick={updateTargetPrice} className="update-target-btn">
                      Update Target
                    </button>
                  </div>

                  <a
                    href={selectedProduct.url || `https://www.amazon.com/dp/${selectedProduct.asin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="amazon-link-btn"
                  >
                    View on Amazon <FaExternalLinkAlt />
                  </a>
                </div>
              </div>

              {/* Price History Chart */}
              <div className="modal-chart-section">
                <h3>Price History</h3>
                {priceHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" tickFormatter={(v) => `$${v}`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '2px solid #000',
                          borderRadius: '12px'
                        }}
                        formatter={(v) => [`$${v}`, 'Price']}
                      />
                      <Line type="monotone" dataKey="price" stroke="#000" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-container">
                    <p style={{ textAlign: 'center', color: '#666' }}>
                      No price history available yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;