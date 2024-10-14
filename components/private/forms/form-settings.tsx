"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { minWidth640 } from "@/helpers/constants";
import { formStatus, setState } from "@/helpers/types";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";

const statusList: { status: formStatus; label: string; description: string }[] =
  [
    {
      status: "draft",
      label: "Draft",
      description:
        "The form is currently being created or edited and is not yet available for users to fill out.",
    },
    {
      status: "published",
      label: "Published",
      description:
        "The form is live and available for users to fill out and submit.",
    },
    {
      status: "inactive",
      label: "Inactive",
      description:
        "The form is no longer active and cannot be filled out or submitted by users.",
    },
  ];

const FormSettings = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="min-w-[400px] p-0">
          <Body setState={setOpen} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3">
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ setState }: { setState: setState<boolean> }) => {
  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto sm:p-6">
      <h1 className="text-xl font-semibold">Settings</h1>
      <div className="flex flex-1 flex-col overflow-y-auto gap-4 px-1">
        <div className="grid gap-1.5">
          <Label>Name</Label>
          <Input />
        </div>
        <div className="grid gap-1.5">
          <Label>Description</Label>
          <Textarea />
        </div>
        <div className="overflow-y-auto flex-1 flex flex-col gap-1.5">
          <Label>Status</Label>
          <div className="grid gap-6 overflow-y-auto">
            {statusList.map((status, index) => {
              return (
                <button key={index} className="border p-3">
                  <div>
                    <span className="text-sm">{status.label}</span>
                    <p className="text-xs">{status.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center">
        <Button
          onClick={() => setState(false)}
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          Close
        </Button>
      </div>
    </div>
  );
};

export default FormSettings;
