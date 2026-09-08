import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { token } = useAuth();

  const [wishlist, setWishlist] = useState({
    products: [],
  });

  const [loading, setLoading] = useState(true);

  // Load wishlist when user logs in
  useEffect(() => {
    const loadWishlist = async () => {
      if (!token) {
        setWishlist({ products: [] });
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/wishlist");

        setWishlist(data);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
        setWishlist({ products: [] });
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [token]);

  // Add product to wishlist
  const addToWishlist = async (productId) => {
    try {
      const data = await apiRequest("/wishlist/add", {
        method: "POST",
        body: JSON.stringify({
          productId,
        }),
      });

      setWishlist(data);
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const data = await apiRequest("/wishlist/remove", {
        method: "DELETE",
        body: JSON.stringify({
          productId,
        }),
      });

      setWishlist(data);
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  // Check whether product is already wishlisted
  const isWishlisted = (productId) => {
    return wishlist.products.some(
      (product) => String(product._id) === String(productId),
    );
  };

  // Toggle wishlist
  const toggleWishlist = async (productId) => {
    if (isWishlisted(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
