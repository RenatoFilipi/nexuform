"use client";

import { minWidth640 } from "@/helpers/constants";
import { ReactNode, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

const DeleteForm = ({ children }: { children: ReactNode }) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <Body />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3">
        <Body />
      </DrawerContent>
    </Drawer>
  );
};

const Body = () => {
  return <span>Debug</span>;
};

export default DeleteForm;
