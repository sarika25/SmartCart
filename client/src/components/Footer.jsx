function Footer() {
  const benefits = [
    {
      icon: "ri-truck-line",
      title: "FREE SHIPPING",
      description: (
        <>
          On Orders of Rs. 299
          <br />
          and above
        </>
      ),
    },
    {
      icon: "ri-arrow-go-back-line",
      title: "EASY RETURNS",
      description: "15-Day Return Policy",
    },
    {
      icon: "ri-award-line",
      title: "100% AUTHENTIC",
      description: (
        <>
          Products Sourced
          <br />
          Directly
        </>
      ),
    },
    {
      icon: "ri-price-tag-3-line",
      title: "1900+ BRANDS",
      description: "1.2 Lakh+ Products",
    },
  ];

  return (
    <footer className="mt-10">
      {/* ================= TOP BENEFITS SECTION ================= */}
      <div className="bg-gray-50 px-6 py-10 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {/* Benefits */}
          {benefits.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-950 text-white">
                <i className={`${item.icon} text-2xl`}></i>
              </div>

              {/* Text */}
              <div>
                <h3 className="border-b border-gray-300 pb-2 text-sm font-medium text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-5 text-gray-700">
                  {item.description}
                </p>
              </div>
            </div>
          ))}

          {/* Social Media */}
          <div className="text-center lg:text-left">
            <h3 className="text-sm font-medium leading-5 text-gray-900">
              Show us some love ♥ on social
              <br />
              media
            </h3>

            <div className="mt-4 flex justify-center gap-5 text-gray-900 lg:justify-start">
              <i className="ri-instagram-fill cursor-pointer text-xl hover:text-gray-950"></i>
              <i className="ri-facebook-circle-fill cursor-pointer text-xl hover:text-gray-950"></i>
              <i className="ri-youtube-fill cursor-pointer text-xl hover:text-gray-950"></i>
              <i className="ri-twitter-x-fill cursor-pointer text-xl hover:text-gray-950"></i>
              <i className="ri-pinterest-fill cursor-pointer text-xl hover:text-gray-950"></i>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM PINK SECTION ================= */}
      <div className="bg-gray-950 px-6 py-5 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center">
          {/* Policy Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium">
            <a href="#" className="hover:underline">
              Terms & Conditions
            </a>

            <a href="#" className="hover:underline">
              Shipping Policy
            </a>

            <a href="#" className="hover:underline">
              Cancellation Policy
            </a>

            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>

          {/* Copyright */}
          <p className="mt-6 text-sm">
            © 2026 SmartCart AI. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
