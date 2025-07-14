import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { clearSuggestions } from "../api";
import { useAuth } from "../context/AuthContext";
import type { Suggestion } from "../types";

export default function ShowSuggestions() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get("/api/suggestions/stored", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuggestions(res.data.suggestions || []);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch suggestions");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [token]);

  const handleAddToCart = async (itemName: string) => {
    try {
      // First, find the product by name
      const productsRes = await api.get("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const product = productsRes.data.products.find(
        (p: any) => p.name.toLowerCase() === itemName.toLowerCase()
      );
      
      if (!product) {
        setError(`Product "${itemName}" not found in inventory`);
        return;
      }

      // Add to cart
      await api.post("/api/cart/add", 
        { product_id: product.id, quantity: 1 }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setMessage(`"${itemName}" added to cart successfully`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to add "${itemName}" to cart`);
    }
  };

  const handleClearSuggestions = async () => {
    try {
      await clearSuggestions();
      setSuggestions([]);
      setMessage("All suggestions cleared successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to clear suggestions");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Recipe Suggestions</h1>
            <button
              onClick={() => navigate("/products")}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Back to Products
            </button>
          </div>
          
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No suggestions available</h2>
            <p className="text-gray-600 mb-6">Add items to your cart to get personalized recipe suggestions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recipe Suggestions</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleClearSuggestions}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Clear All Suggestions
            </button>
            <button
              onClick={() => navigate("/products")}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-600">{message}</p>
          </div>
        )}

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {suggestion.dish_name}
                </h3>
                
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Additional Items Needed:</h4>
                  <div className="space-y-2">
                    {suggestion.extra_items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <span className="text-gray-700 font-medium">{item}</span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
