"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import useEditorStore from "@/stores/editor";
import { minWidth640 } from "@/utils/constants";
import { IFormStatus } from "@/utils/interfaces";
import { TSetState } from "@/utils/types";
import { BookDashedIcon, GlobeIcon, PencilOffIcon } from "lucide-react";
import { useState } from "react";
import { useMedia } from "react-use";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";
import FormDelete from "./form-delete";

const statusList: IFormStatus[] = [
  {
    status: "draft",
    label: "Draft",
    description:
      "The form is currently being created or edited and is not yet available for users to fill out.",
    icon: <BookDashedIcon className="w-4 h-4" />,
  },
  {
    status: "published",
    label: "Published",
    description:
      "The form is live and available for users to fill out and submit.",
    icon: <GlobeIcon className="w-4 h-4" />,
  },
  {
    status: "inactive",
    label: "Inactive",
    description:
      "The form is no longer active and cannot be filled out or submitted by users.",
    icon: <PencilOffIcon className="w-4 h-4" />,
  },
];

const FormSettings = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex flex-col min-w-[450px]">
          <SheetHeader>
            <SheetTitle className="text-xl font-medium">Settings</SheetTitle>
            <SheetDescription>
              Configure your form preferences and update settings as needed.
            </SheetDescription>
          </SheetHeader>
          <Body setState={setOpen} />
        </SheetContent>
      </Sheet>
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

const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const { form, setForm } = useEditorStore();

  const onSetName = (value: string) => {
    setForm({ ...form, name: value });
  };
  const onSetDescription = (value: string) => {
    setForm({ ...form, description: value });
  };
  const onSetSubmitText = (value: string) => {
    setForm({ ...form, submit_text: value });
  };
  const onSetStatus = (value: string) => {
    setForm({ ...form, status: value });
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pt-4 sm:pt-0">
      <div className="flex flex-1 overflow-y-auto gap-6 px-1 flex-col sm:pr-2">
        <div className="flex flex-col gap-4 flex-1">
          <div className="grid gap-3">
            <Label>Name</Label>
            <Input
              type="text"
              value={form.name}
              onChange={(e) => onSetName(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label>Description (Optional)</Label>
            <Textarea
              value={form.description ?? ""}
              onChange={(e) => onSetDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label>Submit text</Label>
            <Input
              type="text"
              value={form.submit_text}
              onChange={(e) => onSetSubmitText(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label>Status</Label>
            <div className="flex flex-col gap-4">
              <div className="grid gap-3 overflow-y-auto grid-cols-3">
                {statusList.map((statusItem, index) => {
                  return (
                    <button
                      onClick={() => onSetStatus(statusItem.status)}
                      key={index}
                      className={`${
                        statusItem.status === form.status &&
                        "bg-primary/20 border-primary/20 hover:bg-primary/10"
                      } border rounded hover:bg-foreground/5 flex flex-col gap-2 h-20 py-3 px-2`}>
                      <div className="flex flex-col justify-between h-full">
                        {statusItem.icon}
                        <span className="text-sm">{statusItem.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2 flex-col sm:flex-row">
        <Button
          onClick={() => setState(false)}
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          Close
        </Button>
        <FormDelete formId={form.id} formName={form.name}>
          <Button
            variant={"destructive_outline"}
            size={"sm"}
            className="w-full sm:w-fit">
            Delete Form
          </Button>
        </FormDelete>
      </div>
    </div>
  );
};

export default FormSettings;
