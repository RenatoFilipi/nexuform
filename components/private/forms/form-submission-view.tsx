"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { minWidth640 } from "@/helpers/constants";
import { setState } from "@/helpers/types";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";

const FormSubmissionView = ({
  children,
  subId,
}: {
  children: React.ReactNode;
  subId: string;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent>
          <Body setState={setOpen} subId={subId} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 h-[90%]">
        <Body setState={setOpen} subId={subId} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  subId,
}: {
  setState: setState<boolean>;
  subId: string;
}) => {
  return (
    <div className="flex h-full">
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default FormSubmissionView;
