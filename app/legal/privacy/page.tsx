import Brand from "@/components/shared/core/brand";
import { supportEmail } from "@/utils/envs";
import Link from "next/link";

const topics = [
  {
    title: "Information Collection",
    description:
      "We may collect personal information, such as your name, email address, and usage data, when you use our services. This information is collected to provide and improve our services.",
  },
  {
    title: "Use of Information",
    description:
      "The data we collect is used to personalize your experience, improve our offerings, and communicate with you about updates or promotional content. We will never sell your information to third parties.",
  },
  {
    title: "Data Security",
    description:
      "We implement appropriate security measures to protect your information from unauthorized access, alteration, or disclosure. However, no data transmission over the internet can be guaranteed to be completely secure.",
  },
  {
    title: "Cookies",
    description:
      "Our website may use cookies to enhance your experience. You can disable cookies through your browser settings, but this may limit the functionality of our services.",
  },
  {
    title: "Third-Party Services",
    description:
      "We may use third-party services to help provide our services. These services may collect information as outlined in their respective privacy policies.",
  },
  {
    title: "Your Rights",
    description:
      "You have the right to access, update, or delete your personal information. If you have concerns or requests, please contact us at support@nebulaform.com.",
  },
  {
    title: "Changes to Privacy Policy",
    description:
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page, and significant changes will be communicated to you.",
  },
];

const Privacy = () => {
  return (
    <div className="flex flex-col w-full min-h-dvh px-4 sm:px-8 lg:px-16 py-8 bg-foreground/5">
      <div className="flex justify-center items-center py-4 gap-4">
        <Link href={"/"} className="flex justify-center items-center">
          <Brand type="logo_text" className="h-8 fill-foreground" />
        </Link>
      </div>
      <div className="max-w-3xl mx-auto shadow rounded-lg p-6 bg-background">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-foreground/80">
            Your privacy is important to us at NebulaForm. This Privacy Policy explains how we collect, use, and protect
            your personal information when you use our services.
          </p>
        </div>
        {topics.map((topic, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-xl font-medium">{topic.title}</h2>
            <p className="mt-2 text-foreground/80">{topic.description}</p>
          </div>
        ))}
        <div className="mt-6">
          <p className="text-foreground/80 text-xs">
            By using NebulaForm, you consent to the terms of this Privacy Policy and our data practices. For questions
            or concerns, please reach out to{" "}
            <a href="mailto:support@nebulaform.com" className="text-blue-600 hover:underline">
              {supportEmail}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
