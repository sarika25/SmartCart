import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Hero() {
  const categories = [
    { name: "Fashion", image: "/categories/fashion.png" },
    { name: "Mobiles", image: "/categories/mobile.png" },
    { name: "Electronics", image: "/categories/electronic.png" },
    { name: "Beauty", image: "/categories/beauty.png" },
    { name: "Home", image: "/categories/home.png" },
    { name: "Appliances", image: "/categories/appliances.png" },
    { name: "Toys", image: "/categories/toys.png" },
    { name: "Baby Care", image: "/categories/baby.png" },
    { name: "Grocery", image: "/categories/grocery.png" },
    { name: "Sports", image: "/categories/sports.png" },
    { name: "Furniture", image: "/categories/furniture.png" },
    { name: "Books", image: "/categories/book.png" },
    { name: "Media", image: "/categories/media.png" },
    { name: "Health Care", image: "/categories/medicine.png" },
  ];

  const categoryContainerRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const container = categoryContainerRef.current;

    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);

    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 5,
    );
  };

  useEffect(() => {
    checkScroll();

    const container = categoryContainerRef.current;

    if (container) {
      container.addEventListener("scroll", checkScroll);
    }

    window.addEventListener("resize", checkScroll);

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }

      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollCategories = (direction) => {
    const container = categoryContainerRef.current;

    if (!container) return;

    container.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-gray-50 sm:px-6 lg:px-8">
      {/* Category icons */}
      <div className="relative mx-auto mt-4 w-[95%]">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scrollCategories("left")}
            aria-label="Scroll categories left"
            className="absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-2xl font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            <i className="ri-arrow-left-s-fill"></i>
          </button>
        )}

        {/* Category Scroll Area */}
        <div
          ref={categoryContainerRef}
          className="scrollbar-hide mx-12 overflow-x-auto border-b border-gray-300"
        >
          <div className="flex min-w-max gap-3 px-2 pb-2 sm:gap-5">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="flex w-20 shrink-0 flex-col items-center justify-center rounded-md px-2 py-2 transition hover:bg-gray-200 sm:w-24"
              >
                <div className="flex items-center justify-center">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-7 w-7 object-contain sm:h-8 sm:w-8"
                  />
                </div>

                <div className="mt-1 text-center text-xs font-bold sm:text-sm">
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scrollCategories("right")}
            aria-label="Scroll categories right"
            className="absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-2xl font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            <i className="ri-arrow-right-s-fill"></i>
          </button>
        )}
      </div>

      {/* Hero Content */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm shadow-sm">
            <span>✨</span>
            <span className="font-medium">AI-powered shopping assistant</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
            Shopping made
            <span className="block">smarter with AI.</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Find products that match your needs, preferences, and budget with
            the help of SmartCart AI.
          </p>

          {/* CTA */}
          <div className="mt-20 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-ai-chat"));
              }}
              className="rounded-xl bg-black px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-gray-800 hover:shadow-md"
            >
              ✨ Ask SmartCart AI
            </button>

            <a
              href="/products"
              className="rounded-xl border border-gray-300 bg-white px-7 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Browse Products
            </a>
          </div>

          {/* Example */}
          <p className="mt-5 text-xs text-gray-500">
            Try asking: "Find wireless headphones under ₹5,000 for office
            calls."
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
