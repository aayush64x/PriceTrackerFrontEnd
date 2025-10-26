// src/Components/ProductDetail/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import './ProductDetail.css';
import { FaArrowLeft, FaExternalLinkAlt, FaBell } from 'react-icons/fa';
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
  const [email, setEmail] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/products/product-detail?q=${query}`
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

  const handleAddToWatchlist = async (e) => {
    e.preventDefault();

    if (!product) return;

    try {
      const response = await fetch('http://localhost:8080/api/watchlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asin: product.asin,
          userEmail: email,
          targetPrice
        })
      });

      if (response.ok) {
        alert(`Product added to watchlist for ${email}!`);
      } else {
        alert('Failed to add to watchlist. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error adding to watchlist. Please try again later.');
    }

    setShowModal(false);
    setEmail('');
    setTargetPrice('');
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
        <div className="product-content-wrapper">
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
                <p className="product-detail-price">
                  Price: {product.price ? `$${product.price}` : 'N/A'}
                </p>

                <button onClick={() => setShowModal(true)} className="product-alert-button">
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
          </section>

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
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
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
