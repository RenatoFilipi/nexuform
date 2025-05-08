import Brand from "@/components/shared/core/brand";
import Link from "next/link";

interface FormHeaderProps {
  title: string;
  desc: string;
  link: string;
  path: string;
}

const FormHeader = ({ title, desc, link, path }: FormHeaderProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Link href="/" className="group flex justify-center items-center">
        <div className="flex justify-center items-center p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/30">
          <Brand type="logo" className="fill-primary w-10 h-10 group-hover:rotate-6 transition-transform" />
        </div>
      </Link>
      <div className="text-center space-y-2 max-w-md">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-muted-foreground">
          {desc}{" "}
          <Link href={path} className="font-medium text-blue-600 underline-offset-4 hover:underline transition-colors">
            {link}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FormHeader;
