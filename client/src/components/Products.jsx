import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navbarSearch = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 18;

  const filteredProducts = products.filter((product) => {
    const searchText = search || navbarSearch;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-low") {
      return a.price - b.price;
    }

    if (sort === "price-high") {
      return b.price - a.price;
    }

    if (sort === "rating") {
      return b.rating - a.rating;
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, navbarSearch, category, sort]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="px-6 py-20 text-center">
        <p>Loading products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-20 text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section id="products" className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Curated for you"
          title="Recommended products"
          description="Explore some of our most popular products."
        />
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
          <select
            value={category}
            onChange={(e) => {
              setSearchParams({
                category: e.target.value,
              });
            }}
            className="mt-4 rounded-xl border bg-white px-4 py-3 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Fashion">Fashion</option>
            <option value="Mobiles">Mobiles</option>
            <option value="Electronics">Electronics</option>
            <option value="Beauty">Beauty</option>
            <option value="Home">Home</option>
            <option value="Appliances">Appliances</option>
            <option value="Toys">Toys</option>
            <option value="Baby Care">Baby Care</option>
            <option value="Grocery">Grocery</option>
            <option value="Sports">Sports</option>
            <option value="Furniture">Furniture</option>
            <option value="Books">Books</option>
            <option value="Media">Media</option>
            <option value="Health Care">Health Care</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="mt-4 rounded-xl border bg-white px-4 py-3 outline-none"
          >
            <option value="default">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
        {sortedProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border bg-white p-12 text-center">
            <div className="text-5xl">🔍</div>

            <h3 className="mt-4 text-xl font-semibold">No products found</h3>

            <p className="mt-2 text-gray-500">
              Try changing your search or category.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10">
            {/* Result Count */}
            <p className="mb-4 text-center text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {indexOfFirstProduct + 1}
              </span>
              {" – "}
              <span className="font-medium text-gray-900">
                {Math.min(indexOfLastProduct, sortedProducts.length)}
              </span>
              {" of "}
              <span className="font-medium text-gray-900">
                {sortedProducts.length}
              </span>
              {" products"}
            </p>

            {/* Desktop Pagination */}
            <div className="hidden items-center justify-center gap-2 sm:flex">
              {/* Previous */}
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`h-10 w-10 rounded-lg border text-sm font-medium transition ${
                    currentPage === index + 1
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>

            {/* Mobile Pagination */}
            <div className="flex items-center justify-center gap-2 sm:hidden">
              {/* Previous */}
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ←
              </button>

              {/* First 3 Pages */}
              {[1, 2, 3].map(
                (page) =>
                  page <= totalPages && (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-10 w-10 rounded-lg border text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-black text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ),
              )}

              {/* Dots */}
              {totalPages > 4 && (
                <span className="px-1 text-gray-500">...</span>
              )}

              {/* Last Page */}
              {totalPages > 3 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`h-10 w-10 rounded-lg border text-sm font-medium transition ${
                    currentPage === totalPages
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {totalPages}
                </button>
              )}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;
