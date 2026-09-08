import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

function Checkout() {
  const { cart, setCart } = useCart();
  const { user } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const order = await apiRequest("/orders", {
        method: "POST",
      });

      console.log("ORDER CREATED:", order);

      // Clear frontend cart
      setCart({
        items: [],
      });

      // Go to success page
      navigate("/order-success");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please login to checkout</h1>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 rounded-xl bg-black px-6 py-3 text-white"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Your cart is empty</h1>

          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-black px-6 py-3 text-white"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-10 text-4xl font-bold">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Order Items */}
          <div className="md:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Order Summary</h2>

            <div className="space-y-6">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-5 border-b pb-5"
                >
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-contain rounded-xl p-2"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ₹
                    {(item.product.price * item.quantity).toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Total</h2>

            <div className="mt-6 flex justify-between border-b pb-4">
              <span className="text-gray-600">Items</span>

              <span>
                {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>

            <div className="mt-4 flex justify-between">
              <span className="text-lg font-semibold">Total Amount</span>

              <span className="text-xl font-bold">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
