"use client";

import GenericLoader from "@/components/core/generic-loader";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { minWidth640 } from "@/helpers/constants";
import { BlockResponseProps } from "@/helpers/interfaces";
import { appState, setState } from "@/helpers/types";
import { formSettingsList, formSubmissionList } from "@/mocks/forms";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";

const FormSubmissionView = ({
  children,
  subId,
  sender,
}: {
  children: React.ReactNode;
  subId: string;
  sender: string;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="min-w-[600px]">
          <Body setState={setOpen} subId={subId} sender={sender} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 h-[90%]">
        <Body setState={setOpen} subId={subId} sender={sender} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  subId,
  sender,
}: {
  setState: setState<boolean>;
  subId: string;
  sender: string;
}) => {
  const [appState, setAppState] = useState<appState>("loading");
  const [blocks, setBlocks] = useState<BlockResponseProps[]>([]);

  useQuery({
    queryKey: ["formSubmissionView", subId],
    queryFn: () => {
      const sub = formSubmissionList.find((x) => x.id === subId);
      const blocks = formSettingsList.find((x) => x.id === subId)?.blocks ?? [];

      if (!sub) {
        setAppState("idle");
        return null;
      }
      setAppState("idle");
      return null;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="pt-4 sm:pt-0 flex justify-center sm:justify-start items-center">
        <span>{sender}</span>
      </div>
      {appState === "loading" && (
        <div className="flex justify-center items-center h-full">
          <GenericLoader className="w-8 h-8" />
        </div>
      )}
      {appState === "idle" && (
        <div className="h-full flex flex-col border">body</div>
      )}
      <div className="flex sm:justify-end justify-center items-center">
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

export default FormSubmissionView;
