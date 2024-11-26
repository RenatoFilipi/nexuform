"use client";

import GenericLoader from "@/components/core/generic-loader";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { minWidth640 } from "@/helpers/constants";
import { formatDateRelativeToNow } from "@/helpers/functions";
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
  formId,
  submitted_at,
}: {
  children: React.ReactNode;
  subId: string;
  formId: string;
  sender: string;
  submitted_at: string;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="min-w-[600px]">
          <Body
            setState={setOpen}
            subId={subId}
            sender={sender}
            formId={formId}
            submitted_at={submitted_at}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 h-[90%]">
        <Body
          setState={setOpen}
          subId={subId}
          sender={sender}
          formId={formId}
          submitted_at={submitted_at}
        />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  subId,
  formId,
  sender,
  submitted_at,
}: {
  setState: setState<boolean>;
  subId: string;
  formId: string;
  sender: string;
  submitted_at: string;
}) => {
  const [appState, setAppState] = useState<appState>("loading");
  const [blocks, setBlocks] = useState<BlockResponseProps[]>([]);

  useQuery({
    queryKey: ["formSubmissionView", subId],
    queryFn: () => {
      const sub = formSubmissionList.find((x) => x.id === subId);
      const settings = formSettingsList.find((x) => x.id === formId);

      if (!sub || !settings) {
        setAppState("idle");
        return null;
      }

      const blocksResponse = settings.blocks.map((x) => {
        return {
          formId,
          name: x.name,
          response: sub.blocks.find((z) => z.block_id === x.id)?.value ?? "",
        };
      });

      setBlocks(blocksResponse);
      setAppState("idle");
      return null;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="pt-4 sm:pt-0 flex justify-center sm:justify-start items-center text-sm gap-2 flex-col sm:flex-row">
        <span className="font-semibold text-xl">{sender}</span>
        <span className="text-foreground/80">
          {formatDateRelativeToNow(submitted_at)}
        </span>
      </div>
      {appState === "loading" && (
        <div className="flex justify-center items-center h-full">
          <GenericLoader className="w-8 h-8" />
        </div>
      )}
      {appState === "idle" && (
        <div className="h-full flex flex-col">
          {blocks.map((b, i) => {
            return (
              <div key={i} className="flex flex-col gap-2">
                <p className="font-semibold">{b.name}</p>
                <p className="text-sm text-foreground/50">{b.response}</p>
              </div>
            );
          })}
        </div>
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
