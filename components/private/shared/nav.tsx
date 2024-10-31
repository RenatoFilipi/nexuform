"use client";

import Brand from "@/components/core/brand";
import { Badge2 } from "@/components/ui/badge2";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { minWidth640 } from "@/helpers/constants";
import { formStatus, setState } from "@/helpers/types";
import { formList } from "@/mocks/forms";
import {
  ChartAreaIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  HouseIcon,
  LogOutIcon,
  Menu,
  MonitorIcon,
  MoonIcon,
  SunIcon,
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
import CreateForm from "../forms/create-form";

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
    return null;
  }
  // form
  if (pathname.includes("dashboard/forms/")) {
    const currentFormId = pathname.split("/")[3];
    const currentForm = formList.find((x) => x.id === currentFormId);

    const BadgeColor = (status: formStatus) => {
      switch (status) {
        case "published":
          return (
            <Badge2 variant={"green"} uppercase>
              {status}
            </Badge2>
          );
        case "draft":
          return (
            <Badge2 variant={"orange"} uppercase>
              {status}
            </Badge2>
          );
        case "inactive":
          return (
            <Badge2 variant={"gray"} uppercase>
              {status}
            </Badge2>
          );
      }
    };

    return (
      <div className="border-b h-14 flex items-center px-2 sm:px-6 justify-between z-10 bg-background fixed w-full">
        <div className="flex justify-center items-center gap-1 h-full">
          <div className="flex justify-center items-center gap-1">
            <Link href={"/dashboard"}>
              <Brand type="logo" className="h-7 fill-foreground" />
            </Link>
            {currentForm !== undefined && (
              <SelectForm>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="flex justify-center items-center gap-2">
                  <div className="flex justify-center items-center gap-1">
                    <span className="text-sm">{currentForm.title}</span>
                    {BadgeColor(currentForm.status)}
                  </div>
                  <ChevronsUpDownIcon className="w-4 h-4" />
                </Button>
              </SelectForm>
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
              <Menu className="w-6 h-6" />
            </Button>
          </NavMobile>
        </div>
      </div>
    );
  }
  // app
  return (
    <div className="border-b h-14 flex items-center px-2 sm:px-6 justify-between z-10 bg-background fixed w-full">
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
            <Menu className="w-6 h-6" />
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
  const { setTheme, theme } = useTheme();

  // app
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-screen flex flex-col gap-4">
        <div className="flex flex-col">
          {navLinks.map((link) => (
            <Link
              onClick={() => setOpen(false)}
              key={link.id}
              href={link.path}
              className={`${
                isActive(link.path) &&
                "bg-secondary text-background hover:bg-secondary/80"
              } p-2 border hover:bg-foreground/5 text-sm`}>
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex justify-between items-center px-2 py-2">
            <span className="text-sm flex items-center justify-center">
              Theme
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
                <RadioGroupItem
                  value="dark"
                  id="dark"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="dark"
                  className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
                  <MoonIcon className="w-3 h-3" />
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="flex justify-between"
            asChild>
            <Link href={"/"}>
              Log out
              <LogOutIcon className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const AvatarMenu = () => {
  const { setTheme, theme } = useTheme();
  const navLinks = [
    {
      id: 1,
      name: "Profile",
      path: "/dashboard/profile",
      icon: <HouseIcon className="w-4 h-4" />,
    },
    {
      id: 2,
      name: "Settings",
      path: "/dashboard/settings",
      icon: <ChartAreaIcon className="w-4 h-4" />,
    },
    {
      id: 3,
      name: "Billing",
      path: "/dashboard/billing",
      icon: <CreditCardIcon className="w-4 h-4" />,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback className="text-sm">RF</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-6 min-w-52 text-foreground/80">
        <DropdownMenuLabel className="text-foreground">
          My Account
        </DropdownMenuLabel>
        {/* {navLinks.map((nav) => (
          <DropdownMenuItem
            key={nav.id}
            className="flex flex-row justify-between items-center cursor-pointer">
            {nav.name}
            {nav.icon}
          </DropdownMenuItem>
        ))} */}
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
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={"/"} className="flex justify-between w-full items-center">
            Log out
            <LogOutIcon className="w-4 h-4" />
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent>
          <SelectFormBody setState={setOpen} />
        </PopoverContent>
      </Popover>
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

  const BadgeColor = (status: formStatus) => {
    switch (status) {
      case "published":
        return (
          <Badge2 variant={"green"} uppercase>
            {status}
          </Badge2>
        );
      case "draft":
        return (
          <Badge2 variant={"orange"} uppercase>
            {status}
          </Badge2>
        );
      case "inactive":
        return (
          <Badge2 variant={"gray"} uppercase>
            {status}
          </Badge2>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center sm:justify-start items-center mt-8 sm:mt-0">
        <h1 className="text-xl font-semibold">Your forms</h1>
      </div>
      <div className="flex flex-col gap-0">
        {formList.map((form) => (
          <Link
            onClick={() => setState(false)}
            href={`${form.id}`}
            key={form.id}
            className={`${
              currentForm === form.id &&
              "bg-foreground/5 hover:bg-foreground/10"
            } flex justify-between hover:bg-foreground/5 px-2 cursor-pointer items-center h-9`}>
            <div className="flex justify-center items-center gap-2">
              <span className="text-xs">{form.title}</span>
            </div>
            {BadgeColor(form.status)}
          </Link>
        ))}
      </div>
      <div className="flex justify-between flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4">
        <Button
          onClick={() => setState(false)}
          type="button"
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          Cancel
        </Button>
        <CreateForm>
          <Button variant={"secondary"} size={"sm"} className="w-full sm:w-fit">
            New form
          </Button>
        </CreateForm>
      </div>
    </div>
  );
};

export default Nav;
