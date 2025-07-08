import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useAppStore from "@/stores/app";
import { TSetState } from "@/utils/types";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import WipUI from "../../shared/custom/wip-ui";

const MembersInvite = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col w-full max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <Body setState={setOpen} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const app = useAppStore();

  return (
    <div className="flex flex-col gap-4">
      <WipUI context="invite" />
      <div>
        <Button variant={"outline"} size={"sm"} onClick={() => setState(false)}>
          {t("label_close")}
        </Button>
      </div>
    </div>
  );
};

export default MembersInvite;
