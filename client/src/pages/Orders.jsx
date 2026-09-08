import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiRequest("/orders");
        setOrders(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen px-6 py-20 text-center">
        <p>Loading your orders...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen px-6 py-20 text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">📦</div>

          <h1 className="mt-6 text-3xl font-bold">No orders yet</h1>

          <p className="mt-3 text-gray-500">
            Your completed purchases will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-4xl font-bold">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>

                  <p className="font-medium">{order._id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date</p>

                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>

                  <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {order.items.map((item, index) => (
                  <div
                    key={`${order._id}-${index}`}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-2"
                        onError={(e) => {
                          console.log("ORDER IMAGE FAILED:", item.image);
                        }}
                        onLoad={() => {
                          console.log("ORDER IMAGE LOADED:", item.image);
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <h2 className="font-semibold">{item.name}</h2>

                      <p className="text-sm text-gray-500">
                        ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end border-t pt-5">
                <p className="text-xl font-bold">
                  Total: ₹{order.totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Orders;
