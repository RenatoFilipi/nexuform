import Brand from "@/components/shared/core/brand";
import { appName } from "@/utils/envs";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t h-16 flex items-center">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Brand type="logo" className="h-4 w-auto fill-primary" />
            </Link>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} {appName}.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
