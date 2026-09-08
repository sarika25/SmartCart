import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function AIChatbot() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hey! How can I help you?",
    },
  ]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);

  const [shoppingRequirements, setShoppingRequirements] = useState(null);

  const getRecommendations = async (preferences) => {
    setLoading(true);

    try {
      const query = `I need ${preferences.product} under ${preferences.budget} for ${preferences.useCase}`;

      const response = await fetch("http://localhost:5000/api/ai/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: query,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get recommendations");
      }

      const recommendations = data.recommendations || [];

      if (recommendations.length === 0) {
        setMessages((previousMessages) => [
          ...previousMessages,
          {
            id: Date.now(),
            sender: "bot",
            text:
              data.message ||
              "Sorry, I couldn't find products matching your requirements.",
          },
        ]);

        return;
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now(),
          sender: "bot",
          text: "Here are some products I found for you:",
          products: recommendations,
        },
      ]);
    } catch (error) {
      console.error("AI recommendation error:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now(),
          sender: "bot",
          text: "Sorry, I couldn't get recommendations right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;

    const userText = message.trim();

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((previousMessages) => [...previousMessages, userMessage]);
    setMessage("");

    const updatedHistory = [
      ...chatHistory,
      {
        role: "user",
        text: userText,
      },
    ];

    setChatHistory(updatedHistory);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/ai/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          conversationHistory: updatedHistory,
          previousRequirements: shoppingRequirements,
        }),
      });

      const data = await response.json();

      if (data.requirements) {
        setShoppingRequirements(data.requirements);
      }

      if (!response.ok) {
        throw new Error(data.message || "AI request failed");
      }

      if (data.message) {
        setChatHistory((previousHistory) => [
          ...previousHistory,
          {
            role: "assistant",
            text: data.message,
          },
        ]);
      }

      // Save AI response to conversation history
      const updatedHistoryWithAI = [
        ...updatedHistory,
        {
          role: "assistant",
          text: data.message || "",
        },
      ];

      setChatHistory(updatedHistoryWithAI);
      // AI has enough information and found products
      if (data.recommendations && data.recommendations.length > 0) {
        setMessages((previousMessages) => [
          ...previousMessages,
          {
            id: Date.now() + 1,
            sender: "bot",
            text:
              data.message ||
              "I found some products that match your requirements:",
            products: data.recommendations,
          },
        ]);

        return;
      }

      // AI needs more information
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + 1,
          sender: "bot",
          text:
            data.message ||
            "Could you tell me a little more about what you're looking for?",
        },
      ]);
    } catch (error) {
      console.error("AI chat error:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "Sorry, I couldn't process that right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "Hey! How can I help you?",
      },
    ]);

    setChatHistory([]);
    setShoppingRequirements(null);
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    const openChat = () => {
      setIsOpen(true);
    };

    window.addEventListener("open-ai-chat", openChat);

    return () => {
      window.removeEventListener("open-ai-chat", openChat);
    };
  }, []);

  return (
    <>
      {/* Floating Chat Button */}

      {!isOpen && (
        <div className="fixed bottom-1 right-0 z-50 flex flex-col items-end gap-2">
          {/* Ask me bubble */}
          {/* <div className="animate-bounce rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white shadow-lg">
            👋 Ask me!
          </div> */}

          {/* Animated GIF button */}
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex h-50 w-45 items-center justify-center "
            aria-label="Open AI shopping assistant"
          >
            <img
              src="/chatbot.gif"
              alt="Open SmartCart AI"
              className="h-40 w-45 "
            />

            {/* Online indicator */}
            {/* <span className="absolute right-1 top-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></span> */}
          </button>
        </div>
      )}

      {/* Chat Window */}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[calc(100vw-2rem)] max-w-[360px] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
          {/* Header */}

          <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg">
                🤖
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black bg-green-500"></span>
              </div>

              <div>
                <h2 className="text-sm font-semibold">SmartCart AI</h2>

                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-green-400">●</span>

                  <p className="text-xs text-gray-300">
                    Online · Shopping Assistant
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNewChat}
                className="rounded-lg px-2 py-1 text-xs text-gray-300 transition hover:bg-gray-800 hover:text-white"
              >
                New Chat
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-gray-300 transition hover:bg-gray-800 hover:text-white"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}

          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`flex ${
                  item.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    item.sender === "user"
                      ? "rounded-br-md bg-black text-white"
                      : "rounded-bl-md bg-white text-gray-700 shadow-sm"
                  }`}
                >
                  <div>
                    <div>
                      <div>{item.text}</div>

                      {item.time && (
                        <div
                          className={`mt-1 text-[10px] ${
                            item.sender === "user"
                              ? "text-gray-300"
                              : "text-gray-400"
                          }`}
                        >
                          {item.time}
                        </div>
                      )}
                    </div>

                    {item.products && item.products.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {item.products.map((recommendation) => {
                          const product = recommendation.product;

                          return (
                            <div
                              key={product._id}
                              className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                            >
                              {/* Product Image */}
                              <div className="flex h-32 items-center justify-center bg-gray-100">
                                {product.image ? (
                                  <img
                                    src={`${import.meta.env.BASE_URL}${product.image.replace(/^\/+/, "")}`}
                                    alt={product.name}
                                    className="h-full w-full object-contain p-3"
                                  />
                                ) : (
                                  <span className="text-5xl">🛍️</span>
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="p-3">
                                <div className="mb-1 flex items-center justify-between gap-2">
                                  <span className="text-xs font-medium text-gray-500">
                                    {product.brand || "SmartCart"}
                                  </span>

                                  {recommendation.matchScore && (
                                    <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                                      {recommendation.matchScore}% Match
                                    </span>
                                  )}
                                </div>

                                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                                  {product.name}
                                </h3>

                                {/* Price + Rating */}
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-base font-bold text-gray-900">
                                    ₹{product.price?.toLocaleString("en-IN")}
                                  </span>

                                  {product.rating && (
                                    <span className="text-xs text-gray-600">
                                      ⭐ {product.rating}
                                    </span>
                                  )}
                                </div>

                                {/* Buttons */}
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() =>
                                      navigate(`/product/${product._id}`)
                                    }
                                    className="rounded-lg border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                  >
                                    View Product
                                  </button>

                                  <button
                                    onClick={async () => {
                                      if (!user) {
                                        navigate("/login");
                                        return;
                                      }

                                      try {
                                        await addToCart(product._id);

                                        alert("Product added to cart!");
                                      } catch (error) {
                                        console.error(
                                          "Add to cart error:",
                                          error,
                                        );
                                        alert("Failed to add product to cart.");
                                      }
                                    }}
                                    className="rounded-lg bg-black px-2 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]"></span>
                  </div>

                  <span className="text-xs text-gray-500">
                    Finding the best products...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}

          <div className="border-t bg-white p-3">
            <div className="flex items-center gap-2 rounded-xl border px-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
              />

              <button
                onClick={handleSendMessage}
                className="flex pt-1 pb-1 pr-1.5 pl-1.5 items-center justify-center rounded-lg bg-black text-white transition hover:bg-gray-800"
                aria-label="Send message"
              >
                ✨Ask AI
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;
