import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { apiRequest } from "../services/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, token } = useAuth();

  const [cart, setCart] = useState({
    items: [],
  });

  // Load cart
  useEffect(() => {
    const loadCart = async () => {
      if (!token) {
        setCart({ items: [] });
        return;
      }

      try {
        const data = await apiRequest("/cart");

        setCart(data);
      } catch (error) {
        console.error("Failed to load cart:", error);
        setCart({ items: [] });
      }
    };

    loadCart();
  }, [token]);

  // Add product to cart
  const addToCart = async (productId) => {
    try {
      const updatedCart = await apiRequest("/cart/add", {
        method: "POST",
        body: JSON.stringify({
          productId,
        }),
      });

      setCart(updatedCart);

      return updatedCart;
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      throw error;
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      const updatedCart = await apiRequest("/cart/update", {
        method: "PUT",
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  // Remove product from cart
  const removeFromCart = async (productId) => {
    try {
      const updatedCart = await apiRequest("/cart/update", {
        method: "PUT",
        body: JSON.stringify({
          productId,
          quantity: 0,
        }),
      });

      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
