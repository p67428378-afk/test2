import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
} from "../services/api";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "cacao_royale_cart_id";

export const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(() => {
    return localStorage.getItem(CART_STORAGE_KEY) || null;
  });
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch cart data from server
  const fetchCart = useCallback(async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getCart(id);
      setCart(data);
      if (data && (data.cart_id || data.id)) {
        const resolvedId = data.cart_id || data.id;
        setCartId(resolvedId);
        localStorage.setItem(CART_STORAGE_KEY, resolvedId);
      }
    } catch (err) {
      // Cart might have expired or not found
      localStorage.removeItem(CART_STORAGE_KEY);
      setCartId(null);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cartId) {
      fetchCart(cartId);
    }
  }, [cartId, fetchCart]);

  const addItem = async (chocolate, requestedQty = 1) => {
    try {
      setError(null);
      // Pre-check inventory
      if (chocolate.stock_quantity <= 0) {
        throw new Error("This item is currently out of stock.");
      }

      // Check current quantity in cart
      const existingItem = cart?.items?.find(
        (item) => item.chocolate_id === chocolate.id,
      );
      const currentQty = existingItem ? existingItem.quantity : 0;
      const newTotalQty = currentQty + requestedQty;

      if (newTotalQty > chocolate.stock_quantity) {
        const msg = `Only ${chocolate.stock_quantity} items remaining in stock.`;
        setError(msg);
        throw new Error(msg);
      }

      setLoading(true);
      const updatedCart = await apiAddToCart({
        cartId: cartId || undefined,
        chocolateId: chocolate.id,
        quantity: requestedQty,
      });

      const resolvedId = updatedCart.cart_id || updatedCart.id;
      setCartId(resolvedId);
      localStorage.setItem(CART_STORAGE_KEY, resolvedId);
      setCart(updatedCart);
      setIsDrawerOpen(true);
      return updatedCart;
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err.message ||
        "Failed to add item to cart";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQty, availableStock) => {
    if (newQty <= 0) {
      return removeItem(itemId);
    }

    if (availableStock !== undefined && newQty > availableStock) {
      const msg = `Only ${availableStock} items remaining in stock.`;
      setError(msg);
      throw new Error(msg);
    }

    try {
      setError(null);
      setLoading(true);
      const result = await apiUpdateCartItem(itemId, newQty);
      if (result && result.items) {
        setCart(result);
      } else if (cartId) {
        await fetchCart(cartId);
      }
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err.message ||
        "Failed to update item quantity";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setError(null);
      setLoading(true);
      const result = await apiRemoveCartItem(itemId);
      if (result && result.items) {
        setCart(result);
      } else if (cartId) {
        await fetchCart(cartId);
      }
    } catch (err) {
      const message =
        err?.response?.data?.detail || err.message || "Failed to remove item";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    setCartId(null);
    setCart(null);
    setError(null);
  };

  const items = cart?.items || [];
  const itemCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const subtotal =
    cart?.subtotal !== undefined
      ? cart.subtotal
      : items.reduce(
          (acc, item) =>
            acc +
            (item.item_subtotal !== null && item.item_subtotal !== undefined
              ? item.item_subtotal
              : (item.chocolate?.price || 0) * item.quantity),
          0,
        );

  const hasHeatSensitiveItems = items.some(
    (item) => item.chocolate?.is_heat_sensitive,
  );

  return (
    <CartContext.Provider
      value={{
        cartId,
        cart,
        items,
        itemCount,
        subtotal,
        hasHeatSensitiveItems,
        loading,
        error,
        setError,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        toggleDrawer: () => setIsDrawerOpen((prev) => !prev),
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
