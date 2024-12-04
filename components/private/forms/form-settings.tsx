"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { minWidth640 } from "@/helpers/constants";
import { FormSettingsStatusProps } from "@/helpers/interfaces";
import { setState } from "@/helpers/types";
import useEditorStore from "@/stores/editor";
import { BookDashedIcon, GlobeIcon, PencilOffIcon } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";
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
        <DialogContent className="min-w-[590px]">
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
    <div className="flex flex-col gap-6 h-full overflow-y-auto pt-4 sm:pt-0">
      <h1 className="text-xl font-semibold">Settings</h1>
      <div className="flex flex-1 overflow-y-auto gap-6 px-1 flex-col">
        <div className="flex flex-col gap-4 flex-1">
          <div className="grid gap-3">
            <Label>Name</Label>
            <Input
              type="text"
              value={store.name}
              onChange={(e) => store.setName(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label>Description (Optional)</Label>
            <Textarea
              value={store.description ?? ""}
              onChange={(e) => store.setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <Label>Status</Label>
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 overflow-y-auto grid-cols-3">
              {statusList.map((status, index) => {
                return (
                  <button
                    onClick={() => store.setStatus(status.status)}
                    key={index}
                    className={`${
                      status.status === store.status &&
                      "bg-primary/10 border-primary hover:bg-primary/10"
                    } border rounded hover:bg-foreground/10 p-2 flex flex-col gap-2`}>
                    <div className="flex justify-center w-full items-center gap-2 flex-col">
                      {status.icon}
                      <span className="text-sm font-semibold">
                        {status.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <Alert variant={"info"}>
              <AlertDescription>
                {statusList.find((x) => x.status === store.status)?.description}
              </AlertDescription>
            </Alert>
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
        <FormDelete formId={store.id}>
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
