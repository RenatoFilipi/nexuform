"use client";

import Brand from "@/components/core/brand";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  MonitorIcon,
  MoonIcon,
  Settings2Icon,
  SettingsIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
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
              <Brand type="logo" className="h-6 fill-foreground" />
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
              <Brand type="logo" className="h-7 fill-foreground" />
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
          <AvatarMenu />
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
            <Brand type="logo" className="h-7 fill-foreground" />
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
        <AvatarMenu />
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
          <Brand type="logo_text" className="h-7 fill-foreground" />
          <div className="flex flex-col pt-10 gap-2">
            {navLinks.map((link) => (
              <Link
                onClick={() => setOpen(false)}
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
const AvatarMenu = () => {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback className="text-sm">R</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-6 min-w-52 text-foreground/80">
        <DropdownMenuLabel className="text-foreground">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuItem className="flex flex-row justify-between items-center">
          Profile
          <UserIcon className="h-4 w-4 mr-2" />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-row justify-between items-center">
          Settings
          <Settings2Icon className="h-4 w-4 mr-2" />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-row justify-between items-center">
          Theme
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
                className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-primary/30">
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
                className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-primary/30">
                <SunIcon className="w-3 h-3" />
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label
                htmlFor="dark"
                className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-primary/30">
                <MoonIcon className="w-3 h-3" />
              </Label>
            </div>
          </RadioGroup>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={"/"} className="flex justify-between w-full items-center">
            Log out
            <LogOutIcon className="w-4 h-4 mr-2" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
