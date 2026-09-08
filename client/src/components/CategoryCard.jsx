function CategoryCard({ category }) {
  return (
    <div className="group cursor-pointer rounded-2xl border bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-3xl transition group-hover:bg-black">
        <span className="transition group-hover:grayscale">
          {category.icon}
        </span>
      </div>

      <h3 className="mt-5 font-semibold text-gray-900">{category.name}</h3>

      <p className="mt-1 text-sm text-gray-500">Explore products</p>
    </div>
  );
}

export default CategoryCard;
