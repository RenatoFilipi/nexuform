import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useUserStore from "@/stores/user";
import { minWidth640 } from "@/utils/constants";
import { TSetState } from "@/utils/types";
import { ConstructionIcon, DownloadIcon } from "lucide-react";
import { useState } from "react";
import { useMedia } from "react-use";
import ChangePlans from "../core/change-plans";

const SubmissionsExport = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex flex-col min-w-[550px] gap-3">
          <SheetHeader>
            <SheetTitle>Export</SheetTitle>
            <SheetDescription>
              Easily export your data for reporting, analysis, or backup
              purposes.
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
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Export</DrawerTitle>
          <DrawerDescription>
            Easily export your data for reporting, analysis, or backup purposes.
          </DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const { subscription } = useUserStore();
  const isAllowedToExport = subscription.plan === "pro";
  return (
    <div className="flex flex-col justify-center items-center h-full">
      {isAllowedToExport && (
        <div className="flex justify-center items-center flex-1">
          <div className="flex flex-col justify-center items-center gap-3">
            <ConstructionIcon />
            <span className="text-sm text-foreground/80">
              Under Development
            </span>
          </div>
        </div>
      )}
      {!isAllowedToExport && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex justify-center items-center p-2 rounded bg-primary/10">
              <DownloadIcon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-foreground/80">
              Unlock submissions export by upgrading to the <strong>Pro</strong>{" "}
              plan.
            </span>
            <ChangePlans>
              <Button variant="default" size="sm" className="w-auto">
                Upgrade to Pro
              </Button>
            </ChangePlans>
          </div>
        </div>
      )}
      <div className="flex w-full justify-end items-center">
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default SubmissionsExport;
