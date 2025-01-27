"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { CheckCircleIcon, FileEditIcon, XCircleIcon } from "lucide-react";
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
      "The form is being created or edited. It’s not available for users to access yet.",
    icon: <FileEditIcon className="w-5 h-5 text-blue-500" />,
  },
  {
    status: "published",
    label: "Published",
    description:
      "The form is live and can be accessed, filled out, and submitted by users.",
    icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
  },
  {
    status: "inactive",
    label: "Inactive",
    description:
      "The form is no longer available for users to fill out or submit.",
    icon: <XCircleIcon className="w-5 h-5 text-red-500" />,
  },
];

const FormSettings = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex flex-col min-w-[550px]">
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

  const description = statusList.find(
    (x) => x.status === form.status
  )?.description;

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
          <div className="grid gap-4">
            <Label className="text-sm font-medium text-foreground">
              Status
            </Label>
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 overflow-y-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {statusList.map((statusItem, index) => (
                  <button
                    key={index}
                    onClick={() => onSetStatus(statusItem.status)}
                    className={`border rounded-lg p-4 flex flex-col gap-2 items-center justify-between hover:bg-foreground/10 ${
                      statusItem.status === form.status
                        ? "bg-primary/5 border-primary text-primary"
                        : "border-muted text-foreground/80"
                    }`}>
                    <div className="flex items-center justify-center p-2 rounded-full bg-muted/20 text-primary">
                      {statusItem.icon}
                    </div>
                    <span className="text-sm font-medium">
                      {statusItem.label}
                    </span>
                  </button>
                ))}
              </div>
              <Alert variant="info" className="mt-2">
                <AlertDescription className="text-sm text-foreground/70 text-center">
                  {description}
                </AlertDescription>
              </Alert>
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
