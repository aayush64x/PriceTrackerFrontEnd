// src/Components/Search/Search.jsx
import Header from "../Header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaSearch,
  FaArrowLeft,
  FaHeart,
  FaStar,
  FaChevronDown,
  FaPlus
} from "react-icons/fa";
import './Search.css';

const Search = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    rating: true,
    discount: true,
    availability: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/products/search?keyword=${query}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
        console.log("Fetched products:", data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchProducts();
  }, [query]);

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Navigate to product detail page
  const seeProductDetail = (product) => {
    navigate(`/product-detail?q=${encodeURIComponent(product.asin)}`);
  };

  // Keep this if you plan to track price later
  const handleAddToTracker = (product) => {
    console.log("Track price feature coming soon for:", product.asin);
  };

  return (
    <div className="fullscreen-container">
      <Header />

      <div className="main-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="sidebar-header"><h3>Filters</h3></div>

          <div className="filter-section">
            <button className="filter-header" onClick={() => toggleFilter("price")}>
              <span>Price Range</span>
              <FaChevronDown className={expandedFilters.price ? "expanded" : ""} />
            </button>
            {expandedFilters.price && (
              <div className="filter-options">
                <label><input type="checkbox" /> Under $300</label>
                <label><input type="checkbox" /> $300 - $500</label>
                <label><input type="checkbox" /> $500 - $800</label>
                <label><input type="checkbox" /> $800 - $1000</label>
                <label><input type="checkbox" /> Over $1000</label>
              </div>
            )}
          </div>

          <div className="filter-section">
            <button className="filter-header" onClick={() => toggleFilter("rating")}>
              <span>Customer Rating</span>
              <FaChevronDown className={expandedFilters.rating ? "expanded" : ""} />
            </button>
            {expandedFilters.rating && (
              <div className="filter-options">
                <label><input type="checkbox" /> 4.5+ Stars</label>
                <label><input type="checkbox" /> 4.0+ Stars</label>
                <label><input type="checkbox" /> 3.5+ Stars</label>
                <label><input type="checkbox" /> 3.0+ Stars</label>
              </div>
            )}
          </div>

          <div className="filter-section">
            <button className="filter-header" onClick={() => toggleFilter("discount")}>
              <span>Discount</span>
              <FaChevronDown className={expandedFilters.discount ? "expanded" : ""} />
            </button>
            {expandedFilters.discount && (
              <div className="filter-options">
                <label><input type="checkbox" /> 25% or more</label>
                <label><input type="checkbox" /> 20% or more</label>
                <label><input type="checkbox" /> 15% or more</label>
                <label><input type="checkbox" /> 10% or more</label>
              </div>
            )}
          </div>

          <div className="filter-section">
            <button className="filter-header" onClick={() => toggleFilter("availability")}>
              <span>Availability</span>
              <FaChevronDown className={expandedFilters.availability ? "expanded" : ""} />
            </button>
            {expandedFilters.availability && (
              <div className="filter-options">
                <label><input type="checkbox" /> In Stock</label>
                <label><input type="checkbox" /> FREE Shipping</label>
                <label><input type="checkbox" /> Prime Eligible</label>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-header">
            <div className="results-info">
              <h1>Search Results for "{query}"</h1>
              <p>{products.length} products found</p>
            </div>

            <div className="sort-controls">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="relevance">Sort by Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="card-content">
                    <img src={product.imageURL} alt={product.productName} style={{ objectFit: "contain" }} />
                    <h3>{product.productName}</h3>
                    <p>${product.price}</p>
                    <div className="card-actions">
                      <button onClick={() => handleAddToTracker(product)}>
                        <FaPlus /> Track Price
                      </button>
                      <button onClick={() => seeProductDetail(product)}>
                        <FaHeart /> Product Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
