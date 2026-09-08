import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const { wishlist, removeFromWishlist, loading } = useWishlist();

  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p>Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist ❤️</h1>

          <p className="mt-2 text-gray-500">Products you've saved for later.</p>
        </div>

        {wishlist.products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center">
            <div className="text-6xl">♡</div>

            <h2 className="mt-4 text-xl font-semibold">
              Your wishlist is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Save products you love and find them here later.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-black px-6 py-3 font-semibold text-white"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.products.map((product) => (
              <article
                key={product._id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="flex h-64 w-full items-center justify-center overflow-hidden bg-gray-100 p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </Link>

                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {product.category}
                  </p>

                  <Link to={`/product/${product._id}`}>
                    <h2 className="mt-2 text-lg font-semibold">
                      {product.name}
                    </h2>
                  </Link>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    <span className="text-sm text-gray-500">
                      ⭐ {product.rating}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => addToCart(product._id)}
                      className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="rounded-xl border px-4 py-3 text-lg"
                      title="Remove from wishlist"
                    >
                      ♥
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
