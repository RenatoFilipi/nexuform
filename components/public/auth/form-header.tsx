import Brand from "@/components/shared/brand";
import Link from "next/link";

interface FormHeaderProps {
  title: string;
  desc: string;
  link: string;
  path: string;
}

const FormHeader = ({ title, desc, link, path }: FormHeaderProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-8">
      {/* Logo Section with hover effect */}
      <Link href="/" className="group flex justify-center items-center">
        <div className="flex p-4 bg-gradient-to-br from-primary/30 to-primary/5 rounded-lg">
          <Brand type="logo" className="fill-primary w-10 h-10" />
        </div>
      </Link>
      {/* Title and Description */}
      <div className="text-center space-y-2 max-w-lg">
        <h1 className="text-2xl font-bold text-foreground leading-tight tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">
          {desc}{" "}
          <Link
            href={path}
            className="font-semibold text-blue-600 underline-offset-2 hover:underline transition-colors duration-200">
            {link}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FormHeader;
