function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-2xl text-gray-600">{description}</p>
      )}
    </div>
  );
}

export default SectionHeader;
