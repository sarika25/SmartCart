import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart, updateQuantity } = useCart();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { isWishlisted, toggleWishlist } = useWishlist();

  // Add to cart with selected quantity
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const updatedCart = await addToCart(product._id);

      const cartItem = updatedCart.items.find(
        (item) => item.product?._id === product._id,
      );

      if (cartItem && quantity > 1) {
        await updateQuantity(product._id, quantity);
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  // Buy Now with selected quantity
  const handleBuyNow = async () => {
    if (!product) return;

    try {
      const updatedCart = await addToCart(product._id);

      const cartItem = updatedCart.items.find(
        (item) => item.product?._id === product._id,
      );

      if (cartItem && quantity > 1) {
        await updateQuantity(product._id, quantity);
      }

      navigate("/cart");
    } catch (error) {
      console.error("Buy Now failed:", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products/${id}`,
        );

        const data = await response.json();

        console.log("Product details:", data);
        console.log("Product image:", data.image);

        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Product Card */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-gray-50 rounded-2xl h-[480px] flex items-center justify-center p-8">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-center">
              {/* Category */}
              <span className="inline-block w-fit bg-gray-100 text-gray-600 text-sm font-medium px-4 py-2 rounded-full">
                {product.category}
              </span>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-5 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-5">
                <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg">
                  <span className="font-semibold">
                    <span>{product.rating || 0}</span>
                  </span>
                  <span>★</span>
                </div>

                <span className="text-gray-500 text-sm">128 Reviews</span>
              </div>

              {/* Price */}
              <div className="mt-7">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>

                <span className="ml-3 text-gray-400 line-through">
                  ₹{(product.price * 1.15).toLocaleString("en-IN")}
                </span>

                <span className="ml-3 text-green-600 font-semibold">
                  15% off
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mt-6">
                {product.description}
              </p>

              {/* Quantity */}
              <div className="mt-7">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </p>

                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2 text-lg hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="px-5 py-2 font-medium">{quantity}</span>

                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="px-4 py-2 text-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-8">
                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`w-14 h-14 flex items-center justify-center rounded-xl border transition ${
                    isWishlisted(product._id)
                      ? "border-red-500 text-red-500 bg-red-50"
                      : "border-gray-300 text-gray-700 hover:border-gray-500"
                  }`}
                  title={
                    isWishlisted(product._id)
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"
                  }
                >
                  <i
                    className={`text-2xl ${
                      isWishlisted(product._id)
                        ? "ri-heart-fill"
                        : "ri-heart-line"
                    }`}
                  ></i>
                </button>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border border-black text-black font-semibold py-3.5 rounded-xl hover:bg-gray-100 transition"
                >
                  Add to Cart
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-black text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 transition"
                >
                  Buy Now
                </button>
              </div>

              {/* Product Benefits */}
              <div className="grid grid-cols-3 gap-3 mt-8 pt-7 border-t">
                <div className="text-center">
                  <p className="text-xl">🚚</p>
                  <p className="text-xs text-gray-500 mt-2">Free Delivery</p>
                </div>

                <div className="text-center">
                  <p className="text-xl">↩️</p>
                  <p className="text-xs text-gray-500 mt-2">Easy Returns</p>
                </div>

                <div className="text-center">
                  <p className="text-xl">🔒</p>
                  <p className="text-xs text-gray-500 mt-2">Secure Payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="bg-white rounded-3xl shadow-sm mt-8 p-6 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Customer Feedback
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                Ratings & Reviews
              </h2>
            </div>
          </div>

          {/* Rating Summary */}
          <div className="flex flex-col md:flex-row gap-10">
            <div className="min-w-[180px]">
              <div className="text-5xl font-bold text-gray-900">
                <span>{product.rating || 0}</span>
              </div>

              <div className="text-yellow-500 text-xl mt-2">★ ★ ★ ★ ☆</div>

              <p className="text-sm text-gray-500 mt-2">Based on 128 reviews</p>
            </div>

            {/* Rating Bars */}
            <div className="flex-1 max-w-xl space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-8">{rating}★</span>

                  <div className="h-2 bg-gray-200 rounded-full flex-1 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{
                        width:
                          rating === 5
                            ? "70%"
                            : rating === 4
                              ? "20%"
                              : rating === 3
                                ? "7%"
                                : "2%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Review */}
          <div className="border-t mt-8 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                A
              </div>

              <div>
                <p className="font-semibold text-gray-900">Aman Sharma</p>

                <div className="text-yellow-500 text-sm">★ ★ ★ ★ ★</div>
              </div>
            </div>

            <p className="text-gray-600 mt-4">
              Great product! The quality is really good and the product was
              delivered quickly. Definitely worth the price.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductDetails;
