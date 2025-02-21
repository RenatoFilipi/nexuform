"use client";

import { BarChart3Icon, FileTextIcon, LayoutDashboardIcon } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Effortless Form Creation",
      description: "Create custom forms quickly with our intuitive editor.",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Actionable Analytics",
      description: "Get insights to optimize your forms for better results.",
      icon: BarChart3Icon,
    },
    {
      title: "Seamless Data Management",
      description: "Easily export submissions and data for offline analysis.",
      icon: FileTextIcon,
    },
  ];

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 px-8 sm:px-0">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center flex flex-col justify-center items-center">
          <div className="inline-block px-4 py-1 mb-6 text-xs font-semibold uppercase rounded-lg border bg-primary/10 w-fit border-primary/40 text-primary">
            Features
          </div>
          <h2 className="text-2xl font-bold leading-tight sm:text-4xl xl:text-5xl">Powerful Tools for Form Building</h2>
          <p className="text-base text-foreground/70 mt-4">
            Enhance your form-building experience with ease and insights.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:grid-cols-3 sm:mt-16 xl:mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-8 transition-shadow bg-background border-2 rounded-lg hover:border-primary">
              <div className="flex justify-center items-center p-3 bg-primary/20 rounded">
                <feature.icon className="text-primary w-7 h-7" />
              </div>
              <h3 className="mt-8 text-xl font-bold text-center">{feature.title}</h3>
              <p className="mt-3 text-sm text-foreground/70 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
