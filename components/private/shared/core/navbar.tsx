"use client";

import Brand from "@/components/shared/core/brand";
import { Button } from "@/components/ui/button";
import { minWidth640 } from "@/utils/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMedia } from "react-use";

const Navbar = () => {
  const pathname = usePathname();
  const isInOrg = pathname?.includes("/organizations/") && pathname.split("/organizations/")[1]?.split("/")[0] !== "";

  return isInOrg ? <NavbarInOrg /> : <NavbarOutOrg />;
};
const NavbarOutOrg = () => {
  const isDesktop = useMedia(minWidth640);

  return (
    <nav className="h-14 flex items-center px-4 sm:px-6 justify-between z-10 bg-background fixed w-full border-b">
      {/* content */}
      <div>
        <Button variant={"ghost"} size={"icon"} className="h-8 w-8" asChild>
          <Link href={"/dashboard/organizations"}>
            <Brand type="logo" className="h-5 fill-foreground" />
          </Link>
        </Button>
      </div>
      {/* avatar */}
      <div></div>
    </nav>
  );
};
const NavbarInOrg = () => {
  return (
    <nav className="h-14 flex items-center px-4 sm:px-8 justify-between z-10 bg-background fixed w-full">
      <div>Navbar dentro da organização</div>
    </nav>
  );
};

export default Navbar;
