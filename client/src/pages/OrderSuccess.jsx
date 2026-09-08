import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold">Order Placed Successfully!</h1>

        <p className="mt-4 text-gray-500">
          Thank you for shopping with SmartCart. Your order has been
          successfully placed.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white"
          >
            Continue Shopping
          </Link>

          <Link
            to="/orders"
            className="rounded-xl border px-6 py-3 font-semibold"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
