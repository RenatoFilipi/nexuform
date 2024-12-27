"use client";

const steps = [
  {
    title: "Create a Form",
    description: "Start by creating a new form tailored to your needs.",
    iconColor: "#ECD294",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="28" stroke="#ECD294" strokeWidth="3" />
        <path
          d="M20 30H40M30 20V40"
          stroke="#ECD294"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Edit & Publish",
    description:
      "Customize your form with blocks, adjust design, and publish it.",
    iconColor: "#ACE0BF",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 20H50M20 10V50M40 25L25 40"
          stroke="#ACE0BF"
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
          stroke="#ACE0BF"
          strokeWidth="3"
        />
      </svg>
    ),
  },
  {
    title: "Share via Link or QR Code",
    description: "Distribute your form easily through a link or QR code.",
    iconColor: "#84A8F5",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="15" height="15" fill="#84A8F5" />
        <rect x="35" y="10" width="15" height="15" fill="#84A8F5" />
        <rect x="10" y="35" width="15" height="15" fill="#84A8F5" />
        <rect x="35" y="35" width="15" height="15" fill="#84A8F5" />
      </svg>
    ),
  },
  {
    title: "Analyze Submissions",
    description:
      "Track all responses effortlessly and manage them in one place.",
    iconColor: "#D2AAF7",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15 30L25 20L35 35L45 25"
          stroke="#D2AAF7"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 45L50 45"
          stroke="#D2AAF7"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Check Analytics",
    description: "Dive deeper into performance with our analytics dashboard.",
    iconColor: "#BEF264",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="28" stroke="#BEF264" strokeWidth="3" />
        <path
          d="M15 30L25 20L35 35L45 25"
          stroke="#BEF264"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Export Data",
    description: "Download your submissions and analytics for offline use.",
    iconColor: "#FB7185",
    icon: (
      <svg
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
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-16 lg:py-20 bg-foreground/10 w-full">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground leading-tight sm:text-4xl xl:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-base leading-7 sm:mt-4 text-foreground/60">
            Follow these simple steps to create, share, and analyze forms.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 transition-shadow bg-foreground/5 border border-background/20 rounded-lg shadow-sm hover:shadow-md">
              {step.icon}
              <h3 className="mt-6 text-xl font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mt-4 text-base text-center text-foreground/60">
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
