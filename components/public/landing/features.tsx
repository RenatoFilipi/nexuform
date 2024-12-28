"use client";

const features = [
  {
    title: "Flexible Editor",
    description: "Create forms effortlessly with our intuitive and adaptable editor, designed for all use cases.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#ECD294" viewBox="0 0 24 24">
        <rect x="3" y="6" width="18" height="2" rx="1" />
        <rect x="3" y="11" width="14" height="2" rx="1" />
        <rect x="3" y="16" width="10" height="2" rx="1" />
      </svg>
    ),
    iconColor: "#ECD294",
  },
  {
    title: "Advanced Analytics",
    description: "Gain valuable insights into form performance with our built-in analytics tools.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#7ACD98" viewBox="0 0 24 24">
        <path d="M4 12h4v8H4zM10 6h4v14h-4zM16 9h4v11h-4z" />
      </svg>
    ),
    iconColor: "#7ACD98",
  },
  {
    title: "Export Data",
    description: "Download your submissions and analytics for offline use.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#FB7185" viewBox="0 0 24 24">
        <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
        <rect x="4" y="18" width="16" height="2" rx="1" />
      </svg>
    ),
    iconColor: "#FB7185",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-40">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block px-4 py-1 mb-6 text-xs font-medium text-background uppercase bg-foreground/80 rounded-full">
            Features
          </div>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">Powerful Tools for Form Building</h2>
          <p className="mt-4 text-base leading-7 sm:mt-8 text-foreground/60">
            Build smarter with a flexible editor and actionable analytics.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:grid-cols-3 sm:mt-16 xl:mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-8 transition-shadow bg-background border rounded-lg shadow-sm hover:shadow-md hover:border-foreground/70">
              <div className="" style={{ color: feature.iconColor }}>
                {feature.icon}
              </div>
              <h3 className="mt-8 text-xl font-bold">{feature.title}</h3>
              <p className="mt-4 text-base text-foreground/60 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
