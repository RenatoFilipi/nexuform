"use client";
import {
  BarChart3Icon,
  ClipboardCheckIcon,
  FilePlusIcon,
  LayoutGridIcon,
  SendIcon,
  SettingsIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

const HowItWorks = () => {
  const t = useTranslations("landing");

  const steps = [
    {
      title: "Design Your Form",
      description:
        "Effortlessly create a form tailored to your specific needs.",
      icon: <FilePlusIcon size={40} className="text-primary" />,
    },
    {
      title: "Customize and Publish",
      description:
        "Personalize your form and publish it with just a few clicks.",
      icon: <ClipboardCheckIcon size={40} className="text-primary" />,
    },
    {
      title: "Share Instantly",
      description: "Distribute your form easily via link or QR code.",
      icon: <SettingsIcon size={40} className="text-primary" />,
    },
    {
      title: "Manage Submissions",
      description: "Track and organize submissions from a central dashboard.",
      icon: <LayoutGridIcon size={40} className="text-primary" />,
    },
    {
      title: "Unlock Insights",
      description:
        "Analyze form performance using our powerful analytics tools.",
      icon: <BarChart3Icon size={40} className="text-primary" />,
    },
    {
      title: "Export with Ease",
      description: "Download submissions and analytics for offline review.",
      icon: <SendIcon size={40} className="text-primary" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-16 w-full">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-base leading-7 sm:mt-4 text-foreground/70">
            Easily create, customize, and manage forms in a few simple steps.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 transition-shadow border rounded-lg shadow-sm hover:shadow-md hover:border-primary">
              {step.icon}
              <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
              <p className="mt-4 text-base text-center text-foreground/70">
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
