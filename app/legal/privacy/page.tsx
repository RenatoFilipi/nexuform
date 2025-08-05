import Brand from "@/components/shared/brand";
import { APP_NAME, PRIVACY_DATE, SUPPORT_EMAIL } from "@/utils/envs";
import { privacyTopics } from "@/utils/legal";
import Link from "next/link";

const Privacy = () => {
  return (
    <div className="flex flex-col w-full min-h-dvh px-4 sm:px-8 lg:px-16 py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="flex justify-center items-center py-8 gap-4">
        <Link href={"/"} className="flex justify-center items-center">
          <Brand type="logo_text" className="h-10 fill-foreground dark:fill-gray-100" />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto rounded-xl p-8 bg-white shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/30">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Last Updated: {PRIVACY_DATE}
          </p>
        </div>

        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50">
          <p className="text-blue-800 dark:text-blue-200">
            At {PRIVACY_DATE}, we&apos;re committed to protecting your privacy. This policy explains what data we
            collect, how we use it, and your rights regarding your personal information when using our form builder
            platform.
          </p>
        </div>

        {privacyTopics.map((topic, index) => (
          <div key={index} className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              {topic.title}
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              {topic.description.map((paragraph, pIndex) => (
                <p key={pIndex} className={paragraph ? "" : "mt-4"}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">Contact Us</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            For any privacy-related questions or to exercise your data rights, please contact our Data Protection
            Officer at:
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600">
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            By using {APP_NAME}, you acknowledge you&apos;ve read and understood this Privacy Policy. Thank you for
            trusting us with your data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
