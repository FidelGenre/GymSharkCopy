import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// 1. Proveedores de Estado (Contextos)
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// 2. Componentes de Estructura (Layout)
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import AnnouncementBar from './components/layout/AnnouncementBar'; // Componente importado

// 3. Componentes de Página
import Hero from './components/home/Hero';
import CategoryPage from './pages/CategoryPage'; 
import ProductDetail from './components/products/ProductDetail';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Checkout from './components/checkout/Checkout';
import Orders from './components/auth/Orders';
import Profile from './components/auth/Profile';

import './App.css';

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Detectamos si estamos en checkout
  const isCheckoutPage = location.pathname === '/checkout';

  // URL del logo
  const logoUrl = "/gymsharklogo.avif";

  return (
    <div className="App">
      {/* 1. ANUNCIO DINÁMICO: Solo fuera de checkout */}
      {!isCheckoutPage && <AnnouncementBar />}

      {/* 2. HEADER: Simplificado para checkout o Navbar normal */}
      {isCheckoutPage ? (
        <header style={{ 
          padding: '15px 0', 
          textAlign: 'center', 
          borderBottom: '1px solid #e6e6e6',
          background: '#fff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <img 
            src={logoUrl} 
            alt="Gymshark Logo" 
            onClick={() => navigate('/')}
            style={{ 
              height: '24px', 
              width: 'auto', 
              cursor: 'pointer',
              display: 'block'
            }} 
          />
        </header>
      ) : (
        <Navbar />
      )}

      {/* 3. UTILIDADES: Solo fuera de checkout */}
      {!isCheckoutPage && <CartDrawer />}

      {/* 4. RUTAS */}
      <Routes>
        <Route path="/" element={<main><Hero /></main>} />
        <Route path="/category/:gender/:subCategory" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* 5. FOOTER: Oculto en checkout */}
      {!isCheckoutPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider> 
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;