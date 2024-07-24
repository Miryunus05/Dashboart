import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutPage from './components/LayoutPage';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Home from './components/Home';
import Products from './components/ProductPage';
import Category from './components/CategoryPage';
import ProtectedRoute from './components/ProtectRout';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutPage />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="category" element={<Category />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;