// src/Components/ProductDetail/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import './ProductDetail.css';
import { FaArrowLeft, FaExternalLinkAlt, FaBell, FaBarcode, FaBox, FaIndustry, FaLayerGroup, FaTag } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q');

  // Get logged-in user email from localStorage or session
  const getUserEmail = () => {
    return localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
  };

  const isUserLoggedIn = () => {
    return !!getUserEmail();
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/public/products/product-detail?q=${query}`
        );
        if (!response.ok) throw new Error('Failed to fetch product detail');
        const data = await response.json();
        setProduct(data);
        console.log('Product detail:', data);
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchPriceHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/price-history?asin=${query}`
        );
        if (response.ok) {
          const data = await response.json();
          setPriceHistory(data);
        } else {
          setPriceHistory([]);
        }
      } catch (error) {
        console.error(error);
        setPriceHistory([]);
      }
    };

    if (query) {
      fetchProductDetail();
      fetchPriceHistory();
    }
  }, [query]);

  const handleAddToWatchlistClick = () => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      // Save current location to return after login
      localStorage.setItem('redirectAfterLogin', location.pathname + location.search);
      // Redirect to login page
      navigate('/login');
      return;
    }
    
    // User is logged in, show the modal
    setShowModal(true);
  };

  const handleAddToWatchlist = async (e) => {
    e.preventDefault();

    if (!product) {
      alert('Product information not available.');
      return;
    }

    if (!isUserLoggedIn()) {
      alert('Please log in to add items to your watchlist.');
      localStorage.setItem('redirectAfterLogin', location.pathname + location.search);
      navigate('/login');
      return;
    }

    if (!targetPrice || parseFloat(targetPrice) <= 0) {
      alert('Please enter a valid target price.');
      return;
    }

    try {
      const userEmail = getUserEmail();
      const requestBody = {
        email: userEmail,
        asin: product.asin,
        targetPrice: parseFloat(targetPrice)
      };

      console.log('Sending request:', requestBody);

      const response = await fetch('http://localhost:8080/api/watchlist/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.text();
        alert(`Product added to watchlist!`);
        
        // Only close modal and reset form on success
        setShowModal(false);
        setTargetPrice('');
      } else {
        // Get error message from response
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert(`Failed to add to watchlist: ${errorText}`);
        // Keep modal open so user can try again
      }
    } catch (error) {
      console.error('Request error:', error);
      alert('Error connecting to server. Please try again later.');
      // Keep modal open so user can try again
    }
  };

  if (loading) {
    return (
      <div className="product-loading-container">
        <div className="product-loading-spinner"></div>
        <p className="product-loading-text">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-loading-container">
        <p className="product-loading-text">Product not found or not available.</p>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <header className="product-header">
        <div className="product-header-content">
          <button onClick={() => navigate(-1)} className="product-back-link">
            <FaArrowLeft /> Back to Results
          </button>
        </div>
      </header>

      <main className="product-main-content">
        <div className="content-wrapper">
          {/* Product Overview Section */}
          <section className="product-detail-section">
            <div className="product-detail-grid">
              <div className="product-image-container">
                <img
                  src={product.imageURL || '/placeholder.png'}
                  alt={product.productName || 'Image not available'}
                  className="product-detail-image"
                />
              </div>

              <div className="product-detail-info">
                <h1 className="product-detail-title">{product.productName || 'Name not available'}</h1>
                
                <div className="product-price-section">
                  <div className="current-price-label">Current Price</div>
                  <div className="current-price-value">
                    {product.price ? `$${product.price}` : 'N/A'}
                  </div>
                </div>

                <div className="product-actions">
                  <button onClick={handleAddToWatchlistClick} className="product-alert-button">
                    <FaBell /> Add to Watchlist
                  </button>

                  <a
                    href={product.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-amazon-button"
                  >
                    <span>View on Amazon</span>
                    <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Product Details Section */}
          <section className="product-specs-section">
            <h2 className="specs-title">Product Information</h2>
            <div className="specs-grid">
              <div className="spec-card">
                <div className="spec-icon">
                  <FaBarcode />
                </div>
                <div className="spec-content">
                  <div className="spec-label">ASIN</div>
                  <div className="spec-value">{product.ASIN || query || 'N/A'}</div>
                </div>
              </div>

              <div className="spec-card">
                <div className="spec-icon">
                  <FaTag />
                </div>
                <div className="spec-content">
                  <div className="spec-label">Category</div>
                  <div className="spec-value">{product.category || 'N/A'}</div>
                </div>
              </div>

              <div className="spec-card">
                <div className="spec-icon">
                  <FaLayerGroup />
                </div>
                <div className="spec-content">
                  <div className="spec-label">Product Group</div>
                  <div className="spec-value">{product.productGroup || 'N/A'}</div>
                </div>
              </div>
          
              <div className="spec-card">
                <div className="spec-icon">
                  <FaBox />
                </div>
                <div className="spec-content">
                  <div className="spec-label">Product ID</div>
                  <div className="spec-value">{product.id || 'N/A'}</div>
                </div>
              </div>
            </div>
          </section>
          

          {/* Price History Chart */}
          <section className="product-chart-section">
            <h2 className="product-chart-title">Price History (Last 90 Days)</h2>
            <div className="product-chart-container">
              {priceHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={priceHistory} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '2px solid #000',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                      formatter={(v) => [`$${v}`, 'Price']}
                    />
                    <Line type="monotone" dataKey="price" stroke="#000" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="no-price-history">No price history available.</p>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Watchlist Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add to Watchlist</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleAddToWatchlist} className="alert-form">
              <div className="form-group">
                <label className="form-label">Target Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter target price"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  required
                  className="form-input"
                />
                <p className="form-helper-text">
                  You'll be notified when the price drops to or below this amount.
                </p>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <FaBell /> Add to Watchlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;