import { useEffect, useState } from "react";
import api from "../api";
import type { Product } from "../types";
import { useAuth } from "../context/AuthContext";

export default function Products() {
  const {token}= useAuth();
  const [products, setProducts]= useState<Product[]>([]);
  const [error, setError]= useState<string>("");
  const [message, setMessage]= useState<string>("");

  useEffect(()=>{
    const fetchProducts= async ()=>{
      try{
        const res= await api.get("api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data.products);
      }
      catch(err: any){
        setError(err.response?.data?.error || "Failed to fetch products");
      }
    };
    fetchProducts();
  }, [token]);

  const handleAddToCart= async (productId: number)=> {
    try {
      await api.post("/api/cart/add", { product_id: productId, quantity: 1 }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Product added to cart successfully");
      setTimeout(() => {
      setMessage("");
    }, 3000);
    }
    catch (err: any) {
      setError(err.response?.data?.error || "Failed to add product to cart");
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Products</h2>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.id} className="border p-2 rounded">
              <div className="flex justify-between items-center">
                <div>
                  {product.name} — ₹{product.price}
                </div>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
