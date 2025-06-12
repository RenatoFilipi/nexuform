import { DeleteAccountAction } from "@/app/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUserStore from "@/stores/user";
import { createClient } from "@/utils/supabase/client";
import { TSetState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { ReactNode, useState, useTransition } from "react";
import { toast } from "sonner";

const AccountDelete = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);
  const [error] = useQueryState("error");

  useQuery({
    queryKey: [error],
    queryFn: () => {
      if (error !== null) {
        toast.error(error);
      }
      return null;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay className="backdrop-blur-sm" />
        <AlertDialogContent className="flex flex-col w-full sm:min-w-[650px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex justify-start items-center gap-2">
              <AlertCircleIcon className="w-5 h-5 text-destructive" />
              {t("label_delete_personal_account")}
            </AlertDialogTitle>
            <AlertDialogDescription className="hidden">{t("desc_delete_personal_account")}</AlertDialogDescription>
          </AlertDialogHeader>
          <Body setState={setOpen} />
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};
const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();
  const { email } = useUserStore();
  const [value, setValue] = useState("");

  const onDeleteAccount = async () => {
    startTransition(async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!data || error) {
        toast.error(t("err_delete_personal_account"));
        return;
      }
      const formData = new FormData();
      formData.append("userId", data.user.id);
      await DeleteAccountAction(formData);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="bg-foreground p-3 rounded text-background border-transparent">
          <span className="text-sm font-semibold">{t("desc_delete_personal_account")}</span>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="account_email">{t("label_type_delete_personal_account")}</Label>
          <Input id="account_email" type="email" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <Alert variant={"destructive"} className="p-4 bg-red-100">
          <AlertDescription className="font-medium">{t("label_delete_personal_account_alert")}</AlertDescription>
        </Alert>
      </div>
      <div className="flex justify-between items-center">
        <Button disabled={isPending} variant={"outline"} size={"sm"} onClick={() => setState(false)}>
          {t("label_cancel")}
        </Button>
        <Button disabled={email !== value || isPending} onClick={onDeleteAccount} variant={"destructive"} size={"sm"}>
          {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
          {t("label_delete_personal_account")}
        </Button>
      </div>
    </div>
  );
};
export default AccountDelete;
