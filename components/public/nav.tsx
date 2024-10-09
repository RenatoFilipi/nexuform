"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { MonitorIcon, MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Brand from "../core/brand";
import { Label } from "../ui/label";

const navLinks = [
  { id: 1, name: "Home", path: "/" },
  { id: 2, name: "Log In", path: "/login" },
  { id: 3, name: "Sign Up", path: "/signup" },
];

const Nav = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (path: string) => path === pathname;
  const { setTheme, theme } = useTheme();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side={"left"}
        className="flex flex-col h-full justify-between">
        <div className="flex flex-col">
          <div className="flex justify-start items-center w-full">
            <Brand type="logo_text" className="h-8 fill-foreground" />
          </div>
          <div className="flex flex-col pt-10 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.path}
                className={`${
                  isActive(link.path) &&
                  "bg-secondary text-background hover:bg-secondary/80"
                } p-2 border rounded hover:bg-foreground/5`}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center px-4 py-2">
          <span className="text-sm flex items-center justify-center">
            <SunMoonIcon className="w-4 h-4 mr-2" /> Theme
          </span>
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="flex gap-1">
            <div>
              <RadioGroupItem
                value="system"
                id="system"
                className="peer sr-only"
              />
              <Label
                htmlFor="system"
                className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
                <MonitorIcon className="w-3 h-3" />
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="light"
                id="light"
                className="peer sr-only"
              />
              <Label
                htmlFor="light"
                className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
                <SunIcon className="w-3 h-3" />
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label
                htmlFor="dark"
                className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
                <MoonIcon className="w-3 h-3" />
              </Label>
            </div>
          </RadioGroup>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Nav;
