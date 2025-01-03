"use client";

const steps = [
  {
    title: "Design Your Form",
    description:
      "Effortlessly create a form that perfectly suits your requirements.",
    iconColor: "hsl(262.12, 83.26%, 57.84%)",
    icon: (
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="30"
          cy="30"
          r="28"
          stroke="hsl(262.12, 83.26%, 57.84%)"
          strokeWidth="3"
        />
        <path
          d="M20 30H40M30 20V40"
          stroke="hsl(262.12, 83.26%, 57.84%)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Customize and Publish",
    description:
      "Personalize your form with ease and make it live in just a few clicks.",
    iconColor: "hsl(262.12, 83.26%, 57.84%)",
    icon: (
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 20H50M20 10V50M40 25L25 40"
          stroke="hsl(262.12, 83.26%, 57.84%)"
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
          stroke="hsl(262.12, 83.26%, 57.84%)"
          strokeWidth="3"
        />
      </svg>
    ),
  },
  {
    title: "Share Instantly",
    description:
      "Easily distribute your form using a link or a QR code for broader reach.",
    iconColor: "hsl(262.12, 83.26%, 57.84%)",
    icon: (
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect
          x="10"
          y="10"
          width="15"
          height="15"
          fill="hsl(262.12, 83.26%, 57.84%)"
        />
        <rect
          x="35"
          y="10"
          width="15"
          height="15"
          fill="hsl(262.12, 83.26%, 57.84%)"
        />
        <rect
          x="10"
          y="35"
          width="15"
          height="15"
          fill="hsl(262.12, 83.26%, 57.84%)"
        />
        <rect
          x="35"
          y="35"
          width="15"
          height="15"
          fill="hsl(262.12, 83.26%, 57.84%)"
        />
      </svg>
    ),
  },
  {
    title: "Manage Responses",
    description:
      "Track and organize submissions efficiently from a central dashboard.",
    iconColor: "hsl(262.12, 83.26%, 57.84%)",
    icon: (
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15 30L25 20L35 35L45 25"
          stroke="hsl(262.12, 83.26%, 57.84%)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 45L50 45"
          stroke="hsl(262.12, 83.26%, 57.84%)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Unlock Insights",
    description:
      "Explore performance metrics with our in-depth analytics tools.",
    iconColor: "hsl(262.12, 83.26%, 57.84%)",
    icon: (
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="30"
          cy="30"
          r="28"
          stroke="hsl(262.12, 83.26%, 57.84%)"
          strokeWidth="3"
        />
        <path
          d="M15 30L25 20L35 35L45 25"
          stroke="hsl(262.12, 83.26%, 57.84%)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Export with Ease",
    description:
      "Download submissions and analytics for offline review anytime.",
    iconColor: "hsl(262.12, 83.26%, 57.84%)",
    icon: (
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30 10V40M30 40L20 30M30 40L40 30"
          stroke="hsl(262.12, 83.26%, 57.84%)"
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
          stroke="hsl(262.12, 83.26%, 57.84%)"
          strokeWidth="3"
        />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-16 lg:py-40 bg-neutral-800 w-full">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white leading-tight sm:text-4xl xl:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-base leading-7 sm:mt-4 text-neutral-50/80">
            Follow these simple steps to create, share, and analyze forms.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 transition-shadow bg-neutral-900 border border-background/20 rounded-lg shadow-sm hover:shadow-md hover:border-primary">
              {step.icon}
              <h3 className="mt-6 text-xl font-bold text-white">
                {step.title}
              </h3>
              <p className="mt-4 text-base text-center text-neutral-50/80">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
