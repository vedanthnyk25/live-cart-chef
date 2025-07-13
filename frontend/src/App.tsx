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
    <nav className="p-4 border-b flex gap-4">
      <Link to="/">Home</Link>
      {isAuthenticated ? (
        <>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <button onClick={logout} className="text-red-500">Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
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
            element= {
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
