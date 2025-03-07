import Brand from "@/components/core/brand";
import GridPattern from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import Link from "next/link";

const AuthPanel = () => {
  return (
    <div className="flex-1 sm:flex hidden w-full bg-gradient-to-b relative from-primary to-foreground bg-primary">
      <Link href={"/"}>
        <Brand type="logo_text" className="h-8 fill-background absolute top-6 left-6" />
      </Link>
      {/* <Particles className="absolute inset-0 z-0" quantity={100} ease={20} color="#ffffff" refresh /> */}
      <GridPattern width={15} height={15} x={-1} y={-1} strokeDasharray={"4 2"} className={cn("")} maxOpacity={0.2} />
    </div>
  );
};

export default AuthPanel;
