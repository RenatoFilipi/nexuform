"use client";

import { minWidth640 } from "@/helpers/constants";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const FormSettings = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="min-w-[400px]">
          <Body />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 h-[90%]">
        <Body />
      </DrawerContent>
    </Drawer>
  );
};

const Body = () => {
  return (
    <div className="flex justify-center items-center h-full">Form Settings</div>
  );
};

export default FormSettings;
