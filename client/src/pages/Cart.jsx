import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Prevent crash while cart is loading
  const cartItems = cart?.items || [];

  const total = cartItems.reduce(
    (sum, item) =>
      sum + (item.product ? item.product.price * item.quantity : 0),
    0,
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <div className="text-6xl">🛒</div>

          <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>

          <p className="mt-2 text-gray-500">
            Add some products to your cart to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems
            .filter((item) => item.product)
            .map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-6 border-b pb-6"
              >
                {/* Product Image */}
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-100">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-contain p-2"
                  />
                </div>

                {/* Product Information */}
                <div className="flex-1">
                  <h2 className="font-semibold">{item.product.name}</h2>

                  <p>₹{item.product.price.toLocaleString("en-IN")}</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                    className="rounded border px-3 py-1"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                    className="rounded border px-3 py-1"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-10 text-right">
          <h2 className="text-2xl font-bold">
            Total: ₹{total.toLocaleString("en-IN")}
          </h2>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-4 rounded-xl bg-black px-8 py-3 text-white"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
