// src/Components/Watchlist/WatchList.jsx
import React, { useState, useEffect } from 'react';
import './WatchList.css';
import { FaHeart, FaArrowLeft, FaTrash, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../javascript/AuthContext';
import axios from 'axios';

const WatchList = () => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { isAuthenticated, userEmail, authToken, logout } = useAuth();

  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      // Save current page to redirect back after login
      localStorage.setItem('redirectAfterLogin', '/watchlist');
      navigate('/login');
      return;
    }

    // Fetch watchlist if user is authenticated
    fetchWatchlist();
  }, [isAuthenticated, navigate]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:8080/api/watchlist/saved-products', {
        params: { email: userEmail },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      setWatchlistItems(response.data);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      
      if (err.response?.status === 401) {
        // Unauthorized - token expired or invalid
        logout();
        navigate('/login');
      } else if (err.response?.status === 400) {
        setError('Could not load watchlist. Please try again.');
      } else {
        setError('Could not load watchlist. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (watchlistId) => {
    try {
      await axios.delete(`http://localhost:8080/api/watchlist/${watchlistId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Remove from local state
      setWatchlistItems((prev) => prev.filter((item) => item.id !== watchlistId));
      alert('Item removed from watchlist');
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item. Please try again.');
    }
  };

  const setPriceAlert = (productId) => {
    alert(`Price alert set for product ${productId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="watchlist-container">
        <div className="loading-state">
          <p>Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <header className="watchlist-header">
        <div className="header-content">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
          <h1>My Watchlist</h1>
          <div className="user-info">
            <span>{userEmail}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="watchlist-content">
        {error && <div className="error-message">{error}</div>}
        
        {watchlistItems.length === 0 ? (
          <div className="empty-watchlist">
            <FaHeart className="empty-icon" />
            <h2>Your watchlist is empty</h2>
            <p>Start adding products to track their prices</p>
            <Link to="/search" className="browse-btn">Browse Products</Link>
          </div>
        ) : (
          <div className="watchlist-grid">
            {watchlistItems.map((item) => (
              <div key={item.id} className="watchlist-card">
                <div className="card-image">
                  <img src={item.imageURL || '/images/default.jpg'} alt={item.productName} />
                  <button 
                    onClick={() => removeFromWatchlist(item.id)} 
                    className="remove-btn"
                    title="Remove from watchlist"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="card-details">
                  <h3>{item.productName}</h3>

                  <div className="price-section">
                    <div className="current-price">${item.price}</div>
                    {item.targetPrice && (
                      <div className="target-price">
                        Target: ${item.targetPrice}
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button 
                      onClick={() => setPriceAlert(item.id)} 
                      className="alert-btn"
                    >
                      <FaBell /> Set Alert
                    </button>
                    <Link 
                      to={`/product-detail?q=${item.asin || item.id}`} 
                      className="view-btn"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchList;