import Brand from "@/components/shared/core/brand";
import { cookieTypes, cookiesLastUpdatedAt, managementOptions } from "@/utils/legal";
import Link from "next/link";

const Cookies = () => {
  return (
    <div className="flex flex-col w-full min-h-dvh px-4 sm:px-8 lg:px-16 py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="flex justify-center items-center py-8 gap-4">
        <Link href={"/"} className="flex justify-center items-center">
          <Brand type="logo_text" className="h-10 fill-foreground dark:fill-gray-100" />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto rounded-xl p-8 bg-white shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/30">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cookie Policy</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Last Updated: {cookiesLastUpdatedAt}
          </p>
        </div>

        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50">
          <p className="text-blue-800 dark:text-blue-200">
            This Cookie Policy explains how NebulaForm uses cookies and similar technologies when you use our website
            and services. By continuing to use our site, you consent to our use of cookies in accordance with this
            policy.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            What Are Cookies?
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              Cookies are small text files stored on your device when you visit websites. They help sites remember
              information about your visit, which can make it easier to visit again and make the site more useful.
            </p>
            <p>
              We also use similar technologies like web beacons, pixels, and local storage that may store small amounts
              of data on your device.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Types of Cookies We Use</h2>

          <div className="space-y-8">
            {cookieTypes.map((type, index) => (
              <div key={index} className="p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-3">{type.category}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{type.purpose}</p>

                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Examples:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300 mb-4">
                  {type.examples.map((example, i) => (
                    <li key={i}>{example}</li>
                  ))}
                </ul>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Duration:</span> {type.duration}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Managing Your Cookie Preferences
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>You have several options to control or limit how we and our partners use cookies:</p>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {managementOptions.map((option, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700/50">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">{option.method}</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{option.description}</p>
                </div>
              ))}
            </div>

            <p className="mt-4">
              Note that disabling certain cookies may affect the functionality of our website and services.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">Contact Us</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            If you have any questions about our use of cookies, please contact us at:
          </p>
          <a
            href="mailto:privacy@nebulaform.com"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600">
            privacy@nebulaform.com
          </a>
          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our
            data practices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
