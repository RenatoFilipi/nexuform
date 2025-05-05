import Brand from "@/components/shared/core/brand";
import Link from "next/link";

const FormHeader = ({ title, desc, link, path }: { title: string; desc: string; link: string; path: string }) => {
  return (
    <div className="flex w-full flex-col justify-center gap-4">
      <Link href={"/"} className="flex justify-center items-center">
        <Brand type="logo" className="fill-foreground w-12 h-12" />
      </Link>
      <div className="flex justify-center w-full flex-col gap-2 items-center">
        <h1 className="text-2xl font-medium">{title}</h1>
        <span className="text-sm text-muted-foreground">
          {desc}{" "}
          <Link href={path} className="hover:underline text-info dark:text-blue-500">
            {link}
          </Link>
        </span>
      </div>
    </div>
  );
};

export default FormHeader;
