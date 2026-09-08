import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  const { isWishlisted, toggleWishlist } = useWishlist();

  // Find product in cart
  const cartItem = cart?.items?.find(
    (item) => item.product?._id === product._id,
  );

  const quantity = cartItem?.quantity || 0;

  return (
    <article className="group overflow-hidden rounded-2xl border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Product Image */}
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gray-100">
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product._id)}
          className={`absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-md transition hover:scale-110 hover:bg-gray-50 ${
            isWishlisted(product._id) ? "text-red-500" : "text-gray-700"
          }`}
          title={
            isWishlisted(product._id)
              ? "Remove from Wishlist"
              : "Add to Wishlist"
          }
        >
          <i
            className={
              isWishlisted(product._id) ? "ri-heart-fill" : "ri-heart-line"
            }
          ></i>
        </button>

        {/* Product Image */}
        <Link
          to={`/product/${product._id}`}
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Product Information */}
      <div className="p-5">
        {/* Category */}
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {product.category}
        </p>

        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="mt-2 line-clamp-1 text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
        </Link>

        {/* Price + Rating */}
        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <span className="text-sm text-gray-500">⭐ {product.rating}</span>
        </div>

        {/* Cart Controls */}
        {quantity === 0 ? (
          // Add to Cart
          <button
            onClick={() => addToCart(product._id)}
            className="mt-5 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Add to Cart
          </button>
        ) : (
          // Quantity + Remove
          <div className="mt-5 flex gap-2">
            {/* Quantity */}
            <div className="flex flex-1 items-center justify-between rounded-xl border border-gray-300 px-2 py-1">
              {/* Minus */}
              <button
                onClick={() => {
                  if (quantity === 1) {
                    removeFromCart(product._id);
                  } else {
                    updateQuantity(product._id, quantity - 1);
                  }
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl font-semibold transition hover:bg-gray-100"
              >
                −
              </button>

              {/* Quantity */}
              <span className="text-sm font-semibold">{quantity}</span>

              {/* Plus */}
              <button
                onClick={() => updateQuantity(product._id, quantity + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl font-semibold transition hover:bg-gray-100"
              >
                +
              </button>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeFromCart(product._id)}
              className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
