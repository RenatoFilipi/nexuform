"use client";

import {
  ChartAreaIcon,
  HouseIcon,
  LogOutIcon,
  Menu,
  Settings2Icon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
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

const navLinks = [
  {
    id: 1,
    name: "Dashboard",
    path: "/dashboard",
    icon: <HouseIcon className="w-4 h-4 mr-2" />,
  },
  {
    id: 2,
    name: "Analytics",
    path: "/dashboard/analytics",
    icon: <ChartAreaIcon className="w-4 h-4 mr-2" />,
  },
];

const Nav = () => {
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;

  return (
    <div className="border-b h-16 flex items-center px-6 justify-between">
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
              <AvatarFallback className="bg-primary hover:bg-primary/70">
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

const MobileMenu = ({ children }: { children: ReactNode }) => {
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
          <Button variant={"secondary"} className="flex justify-start">
            <LogOutIcon className="w-4 h-4 mr-2" /> Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Nav;
