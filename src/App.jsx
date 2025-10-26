import "./App.css";
import Search from "./Components/Search/Search";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/LandingPage/LandingPage";
import Count from "./Components/Practice/Practice"
import ProductDetail from "./Components/ProductDetail/ProductDetail";

function App() {
  return (
    <>
      <Routes>
        <Route path="/search" element={<Search />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/practice" element={<Count />} />
        <Route path="/product-detail" element={<ProductDetail/>} />
        
      </Routes>
    </>
  );
}

export default App;
