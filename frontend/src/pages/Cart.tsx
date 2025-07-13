import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  Product: {
    name: string;
    price: number;
  };
}

export default function Cart() {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string>("");

  const fetchCart = async () => {
    try {
      const res = await api.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setCartItems(res.data.items || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const handleDeleteItem = async (productId: number) => {
    try {
      await api.delete("/api/cart/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          product_id: productId,
        },
      });
      fetchCart();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete item");
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.Product.price * item.quantity), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to get started</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
            {/* Cart Items */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex items-center">
                      {/* Product Image Placeholder */}
                      <div className="bg-gray-200 w-16 h-16 rounded-md flex items-center justify-center mr-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {item.Product.name}
                        </h3>
                        <p className="text-gray-600 mb-2">Quantity: {item.quantity}</p>
                        <p className="text-xl font-bold text-green-600">₹{item.Product.price}</p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleDeleteItem(item.product_id)}
                        className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹{(totalPrice * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{(totalPrice * 1.18).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium mt-6">
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Free shipping</span> on orders over ₹500
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
