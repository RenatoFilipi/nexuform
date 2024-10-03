"use client";

import {
  ChartAreaIcon,
  HouseIcon,
  LogOutIcon,
  Menu,
  Settings2Icon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import FormSettings from "./form-settings";

const navLinks = [
  {
    id: 1,
    name: "Forms",
    path: "/dashboard/forms",
    icon: <HouseIcon className="w-4 h-4 mr-2" />,
  },
  {
    id: 2,
    name: "Analytics",
    path: "/dashboard/analytics",
    icon: <ChartAreaIcon className="w-4 h-4 mr-2" />,
  },
];

const AppNav = () => {
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;

  if (pathname.includes("/editor/")) {
    return (
      <div className="flex justify-between items-center h-14 px-6 z-10 bg-background">
        <div>
          <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
            <Link href={"/dashboard/forms"}>
              <Image alt="logo" src={"/logo.svg"} height={0} width={24} />
            </Link>
          </Button>
        </div>
        <div className="flex justify-center items-center gap-4">
          <FormSettings>
            <Button variant={"outline"} size={"icon"}>
              <SettingsIcon className="w-5 h-5" />
            </Button>
          </FormSettings>
          <Button variant={"outline"} size={"sm"}>
            Save
          </Button>
          <Button variant={"secondary"} size={"sm"}>
            Publish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b h-16 flex items-center px-6 justify-between z-10 bg-background">
      <div className="flex justify-center items-center gap-12 h-full">
        <Link href={"/dashboard"}>
          <Image alt="logo" src={"/logo.svg"} height={0} width={33} />
        </Link>
        <div className="hidden sm:flex justify-center items-center gap-2 h-full">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.path}
              className={`${
                isActive(link.path) && ""
              } text-sm h-full flex justify-center items-center px-3 hover:bg-foreground/5 relative`}>
              {isActive(link.path) && (
                <div className="bg-foreground bottom-0 w-full h-1 absolute"></div>
              )}
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="hidden sm:flex justify-center items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-foreground text-background">
                R
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-6 min-w-44">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="h4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings2Icon className="h4 w-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"/"} className="flex justify-center items-center">
                <LogOutIcon className="w-4 h-4 mr-2" /> Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex sm:hidden">
        <MobileMenu>
          <Button variant={"ghost"} size={"icon"}>
            <Menu className="w-8 h-8" />
          </Button>
        </MobileMenu>
      </div>
    </div>
  );
};

const MobileMenu = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (path: string) => path === pathname;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side={"left"}
        className="flex flex-col h-full justify-between">
        <div>
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
                onClick={() => setOpen(false)}
                key={link.id}
                href={link.path}
                className={`${
                  isActive(link.path) && "bg-primary"
                } p-2 border rounded`}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-col">
            <Button variant={"ghost"} className="flex justify-start">
              <UserIcon className="h4 w-4 mr-2" /> Profile
            </Button>
            <Button variant={"ghost"} className="flex justify-start">
              <Settings2Icon className="h4 w-4 mr-2" /> Settings
            </Button>
          </div>
          <Button variant={"secondary"} className="flex justify-start" asChild>
            <Link href={"/"}>
              <LogOutIcon className="w-4 h-4 mr-2" /> Log out
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AppNav;
