"use client";

import { BarChartIcon, DatabaseIcon, ListChecksIcon } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Intuitive Form Builder",
      description: "Design and customize forms effortlessly with our drag-and-drop interface.",
      icon: ListChecksIcon,
    },
    {
      title: "Actionable Analytics",
      description: "Get insights to optimize your forms for better results.",
      icon: BarChartIcon,
    },
    {
      title: "Smart Data Handling",
      description: "Seamlessly export, organize, and analyze form submissions.",
      icon: DatabaseIcon,
    },
  ];

  return (
    <section
      id="features"
      className="py-12 sm:py-16 lg:py-20 px-8 sm:px-0 min-h-screen flex justify-center items-center">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 grid gap-10">
        <div className="text-center flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold leading-tight sm:text-4xl xl:text-5xl">Powerful Tools for Form Building</h2>
          <p className="text-base text-foreground/70 mt-4">
            Enhance your form-building experience with ease and insights.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:grid-cols-3 sm:mt-16 xl:mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center px-6 py-8 transition-shadow bg-background border rounded-lg hover:border-primary hover:bg-primary/5 gap-2">
              <div className="flex justify-center flex-col items-center gap-3">
                <div className="flex justify-center items-center p-2 rounded bg-primary/10">
                  <feature.icon className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-center">{feature.title}</h3>
              </div>
              <p className="mt-3 text-sm text-foreground/70 text-start">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
