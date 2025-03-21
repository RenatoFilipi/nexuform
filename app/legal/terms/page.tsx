import Brand from "@/components/core/brand";
import Link from "next/link";

const topics = [
  {
    title: "Acceptance of Terms",
    description:
      "By using our website or services, you acknowledge that you have read, understood, and agreed to be bound by these terms. If you do not agree, you must discontinue use immediately.",
  },
  {
    title: "Use of Services",
    description:
      "You agree to use our services only for lawful purposes and in accordance with these terms. Unauthorized use, including attempting to disrupt or exploit the service, may result in suspension or termination of your access.",
  },
  {
    title: "Intellectual Property",
    description:
      "All content, trademarks, and materials provided on this website are the property of NebulaForm or its licensors and are protected by applicable intellectual property laws. You may not copy, reproduce, distribute, or create derivative works without prior written consent.",
  },
  {
    title: "Limitation of Liability",
    description:
      "We strive to provide accurate and reliable services, but we do not guarantee error-free or uninterrupted service. To the maximum extent permitted by law, NebulaForm is not liable for any damages or losses resulting from your use of our services.",
  },
  {
    title: "Changes to Terms",
    description:
      "We reserve the right to modify these Terms of Service at any time. Continued use of the services following updates constitutes acceptance of the new terms.",
  },
];

const Terms = () => {
  return (
    <div className="flex flex-col w-full min-h-dvh px-4 sm:px-8 lg:px-16 py-8 bg-foreground/5">
      <div className="flex justify-center items-center py-4 gap-4">
        <Link href={"/"} className="flex justify-center items-center">
          <Brand type="logo_text" className="h-8 fill-foreground" />
        </Link>
      </div>
      <div className="max-w-3xl mx-auto shadow rounded-lg p-6 bg-background">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-foreground/80">
            Welcome to NebulaForm! By accessing or using our services, you agree to comply with these Terms of Service.
            Please read them carefully.
          </p>
        </div>
        {topics.map((topic, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-xl font-medium">{topic.title}</h2>
            <p className="mt-2 text-foreground/80">{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terms;
