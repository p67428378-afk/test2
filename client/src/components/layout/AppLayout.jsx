import React, { createContext, useContext, useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { cartService } from "../../services/api";

export const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export default function AppLayout({ children }) {
  const [cart, setCart] = useState({
    items: [],
    subtotal: "0.00",
    total: "0.00",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Could not load shopping cart.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (paintingId) => {
    setError("");
    setSuccessMessage("");

    // Check if item is already in cart locally first
    const alreadyInCart = cart.items.some(
      (item) => item.painting_id === paintingId,
    );
    if (alreadyInCart) {
      setError("This item is already in your cart");
      return false;
    }

    try {
      await cartService.addCartItem(paintingId);
      setSuccessMessage("Added to cart successfully!");
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Failed to add to cart:", err);
      const errMsg =
        err.response?.data?.detail || "Could not add item to cart.";
      setError(errMsg);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    setError("");
    setSuccessMessage("");
    try {
      await cartService.removeCartItem(itemId);
      setSuccessMessage("Removed from cart.");
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      setError("Could not remove item from cart.");
      return false;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        error,
        setError,
        successMessage,
        setSuccessMessage,
        addToCart,
        removeFromCart,
        fetchCart,
      }}
    >
      <div className="min-h-screen flex flex-col bg-background text-on-background">
        <Header cartCount={cartCount} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </CartContext.Provider>
  );
}
