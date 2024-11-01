"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { minWidth640 } from "@/helpers/constants";
import { formStatus, setState } from "@/helpers/types";
import useEditorStore from "@/stores/editor";
import { BookDashedIcon, GlobeIcon, PenOffIcon } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";

interface statusProps {
  status: formStatus;
  label: string;
  description: string;
  icon: JSX.Element | null;
}

const statusList: statusProps[] = [
  {
    status: "draft",
    label: "Draft",
    description:
      "The form is currently being created or edited and is not yet available for users to fill out.",
    icon: <BookDashedIcon className="w-5 h-5 text-primary" />,
  },
  {
    status: "published",
    label: "Published",
    description:
      "The form is live and available for users to fill out and submit.",
    icon: <GlobeIcon className="w-5 h-5 text-primary" />,
  },
  {
    status: "inactive",
    label: "Inactive",
    description:
      "The form is no longer active and cannot be filled out or submitted by users.",
    icon: <PenOffIcon className="w-5 h-5 text-primary" />,
  },
];

const FormSettings = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="min-w-[700px] p-0">
          <Body setState={setOpen} />
        </DialogContent>
      </Dialog>
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
  const store = useEditorStore();

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto sm:p-6">
      <h1 className="text-xl font-semibold">Settings</h1>
      <div className="flex flex-1 overflow-y-auto gap-6 px-1 flex-col">
        <div className="flex flex-col gap-4 flex-1">
          <div className="grid gap-1.5">
            <Label>Name</Label>
            <Input
              type="text"
              value={store.name}
              onChange={(e) => store.setName(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Description</Label>
            <Textarea
              value={store.description ?? ""}
              onChange={(e) => store.setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Submit label</Label>
            <Input
              type="text"
              value={store.submitLabel}
              onChange={(e) => store.setSubmitLabel(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 flex flex-col gap-1.5">
          <Label>Status</Label>
          <div className="grid gap-3 overflow-y-auto grid-cols-1">
            {statusList.map((status, index) => {
              return (
                <button
                  onClick={() => store.setStatus(status.status)}
                  key={index}
                  className={`${
                    status.status === store.status &&
                    "bg-primary/10 border-primary hover:bg-primary/10"
                  } border rounded hover:bg-foreground/10 p-2 flex flex-col gap-2`}>
                  <div className="flex gap-2 items-center">
                    {status.icon}
                    <span className="text-sm font-semibold">
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-start">{status.description}</p>
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
