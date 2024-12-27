"use client";

const features = [
  {
    title: "Flexible Editor",
    description:
      "Create forms effortlessly with our intuitive and adaptable editor, designed for all use cases.",
    icon: (
      <svg
        className="mx-auto"
        width="40"
        height="40"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 20H50M20 10V50M40 25L25 40"
          stroke="#ECD294"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="5"
          y="5"
          width="50"
          height="50"
          rx="5"
          stroke="#ECD294"
          strokeWidth="3"
        />
      </svg>
    ),
    iconColor: "#ECD294",
  },
  {
    title: "Analytics",
    description:
      "Gain valuable insights into form performance with our built-in analytics tools.",
    icon: (
      <svg
        className="mx-auto"
        width="40"
        height="40"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="28" stroke="#7ACD98" strokeWidth="3" />
        <path
          d="M15 30L25 20L35 35L45 25"
          stroke="#7ACD98"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 45L50 45"
          stroke="#7ACD98"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconColor: "#7ACD98",
  },
  {
    title: "Export Data",
    description: "Download your submissions and analytics for offline use.",
    icon: (
      <svg
        className="mx-auto"
        width="40"
        height="40"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30 10V40M30 40L20 30M30 40L40 30"
          stroke="#FB7185"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="15"
          y="15"
          width="30"
          height="30"
          rx="5"
          stroke="#FB7185"
          strokeWidth="3"
        />
      </svg>
    ),
    iconColor: "#FB7185",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block px-4 py-1 mb-6 text-xs font-medium text-background uppercase bg-foreground/80 rounded-full">
            Features
          </div>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
            Powerful Tools for Form Building
          </h2>
          <p className="mt-4 text-base leading-7 sm:mt-8 text-foreground/60">
            Build smarter with a flexible editor and actionable analytics.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:grid-cols-3 sm:mt-16 xl:mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-8 transition-shadow bg-background border rounded-lg shadow-sm hover:shadow-md">
              <div className="mb-6" style={{ color: feature.iconColor }}>
                {feature.icon}
              </div>
              <h3 className="mt-8 text-xl font-bold">{feature.title}</h3>
              <p className="mt-4 text-base text-foreground/60 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
