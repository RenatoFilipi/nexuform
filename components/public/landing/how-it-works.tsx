"use client";
import { BarChartIcon, ClipboardCheckIcon, DownloadIcon, LayoutGridIcon, PaintbrushIcon, SendIcon } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Design Your Form",
      description: "Effortlessly create a form tailored to your specific needs.",
      icon: PaintbrushIcon,
    },
    {
      title: "Customize and Publish",
      description: "Personalize your form and publish it with just a few clicks.",
      icon: ClipboardCheckIcon,
    },
    {
      title: "Share Instantly",
      description: "Easily distribute your form to your audience in no time.",
      icon: SendIcon,
    },
    {
      title: "Manage Submissions",
      description: "Track and organize submissions from a central dashboard.",
      icon: LayoutGridIcon,
    },
    {
      title: "Unlock Insights",
      description: "Analyze form performance using our powerful analytics tools.",
      icon: BarChartIcon,
    },
    {
      title: "Export with Ease",
      description: "Download submissions and analytics for offline review.",
      icon: DownloadIcon,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-16 lg:py-16 w-full px-8 sm:px-0 min-h-screen flex justify-center items-center">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 grid gap-10">
        <div className="text-center flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold leading-tight sm:text-4xl xl:text-5xl">How It Works</h2>
          <p className="mt-4 text-base text-foreground/70">
            Easily create, customize, and manage forms in a few simple steps.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center px-6 py-8 transition-shadow bg-background border rounded-lg hover:border-primary hover:bg-primary/5">
              <div className="flex justify-center flex-col items-center gap-3">
                <div className="flex justify-center items-center p-2 rounded bg-primary/10">
                  <step.icon className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-center">{step.title}</h3>
              </div>
              <p className="mt-3 text-sm text-foreground/70 text-start">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
