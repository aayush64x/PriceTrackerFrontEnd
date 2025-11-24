// src/App.jsx
import "./App.css";
import Search from "./Components/Search/Search";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Components/LandingPage/LandingPage";
import Count from "./Components/Practice/Practice";
import ProductDetail from "./Components/ProductDetail/ProductDetail";
import WatchList from "./Components/Watchlist/WatchList";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { AuthProvider } from "./javascript/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/search" element={<Search />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/practice" element={<Count />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/watchlist" element={<WatchList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;