"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import ModeToggle2 from "../../core/mode-toggle2";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Log In", path: "/login" },
  { name: "Sign Up", path: "/signup" },
  { name: "Features", path: "#features" },
  { name: "How It Works", path: "#how-it-works" },
  { name: "Pricing", path: "#pricing" },
  { name: "Faq", path: "#faq" },
];

const Nav = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className=" rounded-lg bg-popover shadow-lg p-4 w-screen">
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="text-foreground hover:bg-foreground/10 p-3 rounded-md text-sm font-medium transition-colors duration-200">
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex justify-end items-center gap-4 p-3">
          <ModeToggle2 />
        </div>
        <div className="flex justify-between items-center gap-4 mt-4">
          <Link
            href={"/legal/privacy"}
            className="text-xs text-foreground/80 hover:underline transition-colors">
            Privacy
          </Link>
          <Link
            href={"/legal/terms"}
            className="text-xs text-foreground/80 hover:underline transition-colors">
            Terms
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Nav;
