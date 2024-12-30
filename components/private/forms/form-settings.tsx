"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useEditorStore from "@/stores/editor";
import { minWidth640 } from "@/utils/constants";
import { FormSettingsStatusProps } from "@/utils/interfaces";
import { setState } from "@/utils/types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { BookDashedIcon, GlobeIcon, PencilOffIcon } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";
import FormDelete from "./form-delete";

const statusList: FormSettingsStatusProps[] = [
  {
    status: "draft",
    label: "Draft",
    description:
      "The form is currently being created or edited and is not yet available for users to fill out.",
    icon: <BookDashedIcon className="w-5 h-5" />,
  },
  {
    status: "published",
    label: "Published",
    description:
      "The form is live and available for users to fill out and submit.",
    icon: <GlobeIcon className="w-5 h-5" />,
  },
  {
    status: "inactive",
    label: "Inactive",
    description:
      "The form is no longer active and cannot be filled out or submitted by users.",
    icon: <PencilOffIcon className="w-5 h-5" />,
  },
];

const FormSettings = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col ">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Settings</DialogTitle>
            <DialogDescription>
              Configure your form preferences and update settings as needed.
            </DialogDescription>
          </DialogHeader>
          <Body setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-medium">Settings</DrawerTitle>
          <DrawerDescription>
            Configure your form preferences and update settings as needed.
          </DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ setState }: { setState: setState<boolean> }) => {
  const {
    name,
    setName,
    submitLabel,
    setSubmitLabel,
    description,
    setDescription,
    id,
    status,
    setStatus,
  } = useEditorStore();

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pt-4 sm:pt-0">
      <div className="flex flex-1 overflow-y-auto gap-6 px-1 flex-col sm:pr-2">
        <div className="flex flex-col gap-4 flex-1">
          <div className="grid gap-3">
            <Label>Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label>Description (Optional)</Label>
            <Textarea
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label>Submit Button</Label>
            <Input
              type="text"
              value={submitLabel}
              onChange={(e) => setSubmitLabel(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <Label>Status</Label>
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 overflow-y-auto grid-cols-3">
              {statusList.map((statusItem, index) => {
                return (
                  <button
                    onClick={() => setStatus(statusItem.status)}
                    key={index}
                    className={`${
                      statusItem.status === status &&
                      "bg-primary/10 border-primary hover:bg-primary/10"
                    } border rounded hover:bg-foreground/10 flex flex-col gap-2 py-4`}>
                    <div className="flex justify-center w-full items-center gap-2 flex-col">
                      {statusItem.icon}
                      <span className="text-sm font-medium text-foreground/80">
                        {statusItem.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2 flex-col sm:flex-row">
        <FormDelete formId={id}>
          <Button
            variant={"destructive_outline"}
            size={"sm"}
            className="w-full sm:w-fit">
            Delete Form
          </Button>
        </FormDelete>
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
