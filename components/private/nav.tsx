"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOutIcon, Settings2Icon, UserIcon } from "lucide-react";

const navLinks = [
  { id: 1, name: "Dashboard", path: "/dashboard" },
  { id: 2, name: "Analytics", path: "/dashboard/analytics" },
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
        <div className="flex justify-center items-center gap-2 h-full">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.path}
              className={`${
                isActive(link.path) && "font-semibold"
              } text-sm h-full flex justify-center items-center px-3 hover:bg-foreground/5 relative`}>
              {isActive(link.path) && <div className="bg-foreground bottom-0 w-full h-1 absolute"></div>}
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>R</AvatarFallback>
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
              <LogOutIcon className="w-4 h-4 mr-2" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Nav;
