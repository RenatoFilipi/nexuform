"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { id: 1, name: "Home", path: "/" },
  { id: 2, name: "Log In", path: "/login" },
  { id: 3, name: "Sign Up", path: "/signup" },
];

const Nav = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (path: string) => path === pathname;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={"left"} className="">
        <div>
          <Image
            src={"/brand.svg"}
            alt="brand"
            width={150}
            height={100}></Image>
        </div>
        <div className="flex flex-col pt-10 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.path}
              className={`${
                isActive(link.path) && "bg-primary/20"
              } p-2 border rounded`}>
              {link.name}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Nav;
