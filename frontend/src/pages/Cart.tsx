import {useEffect, useState} from "react";
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
  const {token}= useAuth();
  const [cartItems, setCartItems]= useState<CartItem[]>([]);
  const [error, setError]= useState<string>("");

  const fetchCart= async ()=> {
    try{
      const res= await api.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setCartItems(res.data.items || []);
    }
    catch(err: any){
      setError(err.response?.data?.error || "Failed to fetch cart");
    }
  };

  useEffect(()=>{
     fetchCart(); 
  }, [token]);

  const handleDeleteItem= async (productId: number)=> {
    try{
      await api.delete("/api/cart/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          product_id: productId,
        },
      });
      fetchCart();
    }
    catch(err: any){
      setError(err.response?.data?.error || "Failed to delete item");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {error && <p className="text-red-500">{error}</p>}
      {cartItems.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <ul className="space-y-2">
          {cartItems.map((item) => (
            <li key={item.id} className="border p-2 rounded flex justify-between items-center">
              <div>
                {item.Product.name} — ₹{item.Product.price} × {item.quantity}
              </div>
              <button
                onClick={() => handleDeleteItem(item.product_id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
