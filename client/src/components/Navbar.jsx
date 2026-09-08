import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../services/productService";

function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const navigate = useNavigate();

  const cartCount = (cart?.items || []).reduce(
    (total, item) => total + (item.quantity || 0),
    0,
  );

  const wishlistCount = wishlist?.items?.length || wishlist?.length || 0;

  const handleLogoClick = () => {
    navigate("/");
    setShowMobileMenu(false);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const searchText = search.trim();

    if (!searchText) return;

    setShowDropdown(false);

    navigate(`/products?search=${encodeURIComponent(searchText)}`);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedDesktopSearch = desktopSearchRef.current?.contains(
        event.target,
      );

      const clickedMobileSearch = mobileSearchRef.current?.contains(
        event.target,
      );

      if (!clickedDesktopSearch && !clickedMobileSearch) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchResults = products
    .filter((product) => {
      const searchText = search.toLowerCase().trim();

      return (
        product.name?.toLowerCase().includes(searchText) ||
        product.category?.toLowerCase().includes(searchText)
      );
    })
    .slice(0, 5);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= MAIN NAVBAR ================= */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="relative z-50 flex shrink-0 cursor-pointer items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-lg text-white">
              S
            </div>

            <span className="text-xl font-bold tracking-tight">SmartCart</span>
          </Link>

          {/* ================= DESKTOP SEARCH ================= */}
          <div
            ref={desktopSearchRef}
            className="relative hidden w-full max-w-md sm:block"
          >
            <form
              onSubmit={handleSearch}
              className="flex items-center rounded-xl border bg-white px-4 py-2 focus-within:ring-1 focus-within:ring-black"
            >
              <input
                id="desktop-search"
                name="desktop-search"
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  if (search.trim()) {
                    setShowDropdown(true);
                  }
                }}
                placeholder="Search on SmartCart..."
                className="w-full bg-transparent py-1 outline-none"
              />

              <button type="submit" className="text-xl">
                🔍︎
              </button>
            </form>

            {/* Desktop Search Dropdown */}
            {showDropdown && search.trim() && (
              <SearchDropdown
                searchResults={searchResults}
                navigate={navigate}
                setSearch={setSearch}
                setShowDropdown={setShowDropdown}
              />
            )}
          </div>

          {/* ================= DESKTOP ACTIONS ================= */}
          <div className="hidden items-center gap-3 sm:flex">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative rounded-full p-2 text-lg text-gray-600 transition hover:bg-gray-100"
              title="Wishlist"
            >
              <i className="ri-heart-line"></i>

              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-xs font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Orders */}
            {user && (
              <Link
                to="/orders"
                className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100"
                title="Orders"
              >
                <img
                  src="/Order_Icon.png"
                  alt="Order"
                  className="h-4.5 w-4.5"
                />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative rounded-full p-2 text-lg text-gray-600 transition hover:bg-gray-100"
              title="Cart"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Authentication */}
            {user ? (
              <>
                <span className="hidden text-sm font-medium text-gray-700 lg:block">
                  Hi, {user.name}
                </span>

                <button
                  onClick={logout}
                  className="rounded-lg bg-black px-3 py-2 text-sm text-white transition hover:bg-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-black"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-gray-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ================= MOBILE ACTIONS ================= */}
          <div className="flex items-center gap-1 sm:hidden">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative rounded-full p-2 text-lg text-gray-600 hover:bg-gray-100"
              title="Wishlist"
            >
              <i className="ri-heart-line"></i>

              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-600 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative rounded-full p-2 text-lg text-gray-600 hover:bg-gray-100"
              title="Cart"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="rounded-lg p-2 text-xl text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* ================= MOBILE SEARCH ================= */}
        <div ref={mobileSearchRef} className="relative pb-3 sm:hidden">
          <form
            onSubmit={handleSearch}
            className="flex items-center rounded-xl border bg-white px-4 py-2 focus-within:ring-1 focus-within:ring-black"
          >
            <input
              id="mobile-search"
              name="mobile-search"
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (search.trim()) {
                  setShowDropdown(true);
                }
              }}
              placeholder="Search on SmartCart..."
              className="w-full bg-transparent py-1 text-sm outline-none"
            />

            <button type="submit" className="text-xl">
              🔍︎
            </button>
          </form>

          {/* Mobile Search Dropdown */}
          {showDropdown && search.trim() && (
            <SearchDropdown
              searchResults={searchResults}
              navigate={navigate}
              setSearch={setSearch}
              setShowDropdown={setShowDropdown}
            />
          )}
        </div>

        {/* ================= MOBILE MENU ================= */}
        {showMobileMenu && (
          <div className="border-t py-4 sm:hidden">
            {user ? (
              <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-sm text-gray-500">Welcome back</p>

                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
            ) : null}

            <div className="flex flex-col gap-1">
              {user && (
                <Link
                  to="/orders"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <img
                    src="/Order_Icon.png"
                    alt="Orders"
                    className="h-5 w-5 object-contain"
                  />
                  <span>My Orders</span>
                </Link>
              )}

              <Link
                to="/wishlist"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <i className="ri-heart-line text-lg"></i>
                <span>Wishlist</span>
              </Link>

              <Link
                to="/cart"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <span className="text-lg leading-none">🛒</span>
                <span>Cart</span>
              </Link>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                  }}
                  className="mt-2 rounded-lg bg-black px-4 py-3 text-left text-sm font-medium text-white"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setShowMobileMenu(false)}
                    className="rounded-lg bg-black px-4 py-3 text-sm font-medium text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

/* ================= SEARCH DROPDOWN ================= */

function SearchDropdown({
  searchResults,
  navigate,
  setSearch,
  setShowDropdown,
}) {
  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-white shadow-xl">
      {searchResults.length > 0 ? (
        searchResults.map((product) => (
          <button
            key={product._id}
            type="button"
            onClick={() => {
              navigate(`/product/${product._id}`);
              setSearch("");
              setShowDropdown(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </span>

            <div className="min-w-0">
              <p className="truncate font-medium text-gray-900">
                {product.name}
              </p>

              <p className="text-sm text-gray-500">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            </div>
          </button>
        ))
      ) : (
        <div className="px-4 py-4 text-sm text-gray-500">No products found</div>
      )}
    </div>
  );
}

export default Navbar;
