import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Cart from "./pages/Cart";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-yellow-400 text-blue-600 px-3 py-1 rounded-full font-bold text-lg">
              W
            </div>
            <span className="text-xl font-bold">Walmart</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search everything at Walmart online and in store"
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full hover:bg-yellow-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/products" className="hover:text-yellow-400 transition-colors">
                  Products
                </Link>
                <Link to="/cart" className="hover:text-yellow-400 transition-colors flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"/>
                  </svg>
                  Cart
                </Link>
                <button 
                  onClick={logout} 
                  className="bg-transparent border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-transparent border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
