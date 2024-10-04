"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { minWidth640 } from "@/helpers/constants";
import { setState } from "@/helpers/types";
import { formList } from "@/mocks/forms";
import {
  ChartAreaIcon,
  CheckIcon,
  ChevronsUpDownIcon,
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
import { useMediaQuery } from "react-responsive";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import FormSettings from "../form/form-settings";

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
const Nav = () => {
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;

  // editor
  if (pathname.includes("dashboard/editor/")) {
    return (
      <div className="flex justify-between items-center h-16 px-6 z-10 bg-background">
        <div className="flex justify-center items-center gap-4">
          <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
            <Link href={"/dashboard/forms"}>
              <Image alt="logo" src={"/logo.svg"} height={0} width={24} />
            </Link>
          </Button>
          <span className="text-foreground/80 text-sm hidden sm:flex ">
            Form name placeholder
          </span>
        </div>
        <div className="flex justify-center items-center gap-4">
          <FormSettings>
            <Button variant={"outline"} size={"sm"}>
              <SettingsIcon className="w-5 h-5" />
            </Button>
          </FormSettings>
          <Button variant={"outline"} size={"sm"}>
            Share
          </Button>
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

  // form
  if (pathname.includes("dashboard/forms/")) {
    const currentFormId = pathname.split("/")[3];
    const currentForm = formList.find((x) => x.id === currentFormId);

    return (
      <div className="border-b h-16 flex items-center px-6 justify-between z-10 bg-background">
        <div className="flex justify-center items-center gap-4 h-full">
          <div className="flex justify-center items-center gap-4">
            <Link href={"/dashboard"}>
              <Image alt="logo" src={"/logo.svg"} height={0} width={33} />
            </Link>
            {currentForm !== undefined && (
              <div className="flex justify-center items-center gap-1">
                <span className="">{currentForm.title}</span>
                <SelectForm>
                  <Button variant={"ghost"} size={"icon"} className="w-6">
                    <ChevronsUpDownIcon className="w-4 h-4" />
                  </Button>
                </SelectForm>
              </div>
            )}
          </div>
          <div className="hidden sm:flex justify-center items-center gap-0 h-full">
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
                <AvatarFallback className="bg-foreground hover:bg-foreground/70 text-background">
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
          <NavMobile>
            <Button variant={"ghost"} size={"icon"}>
              <Menu className="w-8 h-8" />
            </Button>
          </NavMobile>
        </div>
      </div>
    );
  }

  // app
  return (
    <div className="border-b h-16 flex items-center px-6 justify-between z-10 bg-background">
      <div className="flex justify-center items-center gap-6 h-full">
        <div className="flex justify-center items-center gap-4">
          <Link href={"/dashboard"}>
            <Image alt="logo" src={"/logo.svg"} height={0} width={33} />
          </Link>
        </div>
        <div className="hidden sm:flex justify-center items-center gap-0 h-full">
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
              <AvatarFallback className="bg-foreground hover:bg-foreground/70 text-background">
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
        <NavMobile>
          <Button variant={"ghost"} size={"icon"}>
            <Menu className="w-8 h-8" />
          </Button>
        </NavMobile>
      </div>
    </div>
  );
};
const NavMobile = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (path: string) => path === pathname;

  // app
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side={"left"}
        className="flex flex-col h-full justify-between">
        <div>
          <Image src={"/brand.svg"} alt="brand" width={150} height={100} />
          <div className="flex flex-col pt-10 gap-2">
            {navLinks.map((link) => (
              <Link
                onClick={() => setOpen(false)}
                key={link.id}
                href={link.path}
                className={`${
                  isActive(link.path) && "bg-primary/40 hover:bg-primary/50"
                } p-2 border rounded hover:bg-foreground/5`}>
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
const SelectForm = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <SelectFormBody setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3">
        <SelectFormBody setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};
const SelectFormBody = ({ setState }: { setState: setState<boolean> }) => {
  const pathname = usePathname();
  const currentForm = pathname.split("/")[3];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center sm:justify-start items-center mt-8 sm:mt-0">
        <h1 className="text-xl font-semibold">Your forms</h1>
      </div>
      <div className="flex flex-col gap-1">
        {formList.map((form) => (
          <Link
            onClick={() => setState(false)}
            href={`${form.id}`}
            key={form.id}
            className={`${
              currentForm === form.id && "bg-primary/40 hover:bg-primary/50"
            } flex justify-between hover:bg-foreground/5 rounded px-2 cursor-pointer text-xs items-center h-8`}>
            {form.title}
            {currentForm === form.id && <CheckIcon className="w-5 h-5" />}
          </Link>
        ))}
      </div>
      <div className="flex justify-end flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4">
        <Button
          onClick={() => setState(false)}
          type="button"
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Nav;
