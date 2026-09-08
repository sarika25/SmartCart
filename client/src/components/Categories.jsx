import { Link } from "react-router-dom";

const categories = [
  {
    name: "Beauty",
    image: "/beauty.png",
  },
  {
    name: "Toys",
    image: "/toys.png",
  },
  {
    name: "Grocery",
    image: "/grocery.png",
  },
  {
    name: "Books",
    image: "/books.webp",
  },
  {
    name: "Home",
    image: "/home.webp",
  },
  {
    name: "Sports",
    image: "/aaa.png",
  },
];

function Categories() {
  return (
    <section id="categories" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Shop by category
          </h2>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col items-center"
            >
              {/* Image Container */}
              <div
                className="
                  relative
                  h-[135px]
                  w-[150px]
                  overflow-hidden
                  rounded-b-2xl
                  rounded-t-[72px]
                  bg-gray-200
                  shadow-sm
                  transition-all
                  duration-300
                  ease-out
                  group-hover:-translate-y-2
                  group-hover:shadow-xl
                "
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="
                    absolute
                    bottom-[-8px]
                    h-[145px]
                    w-[150px]
                    object-contain
                    transition-transform
                    duration-300
                    ease-out
                    group-hover:scale-110
                  "
                />
              </div>

              {/* Category Name */}
              <div
                className="
                  mt-3
                  w-full
                  text-center
                  text-base
                  font-semibold
                  text-gray-800
                  transition-colors
                  duration-300
                  group-hover:text-black
                "
              >
                {category.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
