"use client";

import { BarChart3Icon, FileTextIcon, LayoutDashboardIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const Features = () => {
  const t = useTranslations("landing");

  const features = [
    {
      title: "Effortless Form Creation",
      description: "Create custom forms quickly with our intuitive editor.",
      icon: (
        <div className="flex justify-center items-center p-3 bg-green-100 rounded dark:bg-green-950">
          <LayoutDashboardIcon size={40} className="text-green-600" />
        </div>
      ),
    },
    {
      title: "Actionable Analytics",
      description: "Get insights to optimize your forms for better results.",
      icon: (
        <div className="flex justify-center items-center p-3 bg-blue-100 rounded dark:bg-blue-950">
          <BarChart3Icon size={40} className="text-blue-600" />
        </div>
      ),
    },
    {
      title: "Seamless Data Management",
      description: "Easily export submissions and data for offline analysis.",
      icon: (
        <div className="flex justify-center items-center p-3 bg-orange-100 rounded dark:bg-orange-950">
          <FileTextIcon size={40} className="text-orange-600" />
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block px-4 py-1 mb-6 text-xs font-semibold uppercase rounded-lg border bg-primary/10 border-primary/40 text-primary">
            Features
          </div>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
            Powerful Tools for Form Building
          </h2>
          <p className="mt-4 text-base leading-7 sm:mt-8 text-foreground/70">
            Enhance your form-building experience with ease and insights.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:grid-cols-3 sm:mt-16 xl:mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-8 transition-shadow bg-background border rounded-lg shadow-sm hover:shadow-md hover:border-primary">
              <div>{feature.icon}</div>
              <h3 className="mt-8 text-xl font-bold text-center">
                {feature.title}
              </h3>
              <p className="mt-4 text-base text-foreground/70 text-center">
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
