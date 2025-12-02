import React, { useState } from 'react';
import './WatchList.css';
import { FaHeart, FaArrowLeft, FaTrash, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const WatchList = () => {
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Fetch saved products from backend
  const fetchWatchlist = async () => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:8080/api/watchlist/saved-products', {
        params: { email },
      });
      setWatchlistItems(response.data);
      setShowEmailForm(false);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Email is required. Please enter a valid email.');
      } else {
        setError('Could not load watchlist. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = (productId) => {
    setWatchlistItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const setPriceAlert = (productId) => {
    alert(`Price alert set for product ${productId}`);
  };

  // ✅ Email form popup
  if (showEmailForm) {
    return (
      <div className="watchlist-container">
        <div className="watchlist-login">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>

          <div className="login-card">
            <FaHeart className="watchlist-icon" />
            <h1>View Your Watchlist</h1>
            <p>Enter your email to view your saved products</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchWatchlist();
              }}
              className="email-form"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="email-input"
              />
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Loading...' : 'View Watchlist'}
              </button>
            </form>

            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Watchlist display
  return (
    <div className="watchlist-container">
      <header className="watchlist-header">
        <div className="header-content">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
          <h1>My Watchlist</h1>
          <div className="user-info">
            <span>{email}</span>
            <button onClick={() => setShowEmailForm(true)} className="logout-btn">
              Change Email
            </button>
          </div>
        </div>
      </header>

      <div className="watchlist-content">
        {loading ? (
          <p>Loading your watchlist...</p>
        ) : watchlistItems.length === 0 ? (
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
                  <button onClick={() => removeFromWatchlist(item.id)} className="remove-btn">
                    <FaTrash /> 
                  </button>
                </div>

                <div className="card-details">
                  <h3>{item.productName}</h3>

                  <div className="price-section">
                    <div className="current-price">${item.price}</div>
                  </div>

                  <div className="card-actions">
                    <button onClick={() => setPriceAlert(item.id)} className="alert-btn">
                      <FaBell /> Set Alert
                    </button>
                    <Link to={`/product/${item.id}`} className="view-btn">
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