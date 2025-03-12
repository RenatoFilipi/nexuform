import { DeleteAccountAction } from "@/app/actions";
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
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { ReactNode, useState, useTransition } from "react";
import { toast } from "sonner";

const SettingsAccountDelete = ({ children }: { children: ReactNode }) => {
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
        <AlertDialogOverlay className="bg-destructive/40" />
        <AlertDialogContent className="flex flex-col w-full sm:min-w-[650px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Personal Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action will <strong className="text-destructive">permanently delete all of your forms</strong>, along
              with all the related data. This includes all responses, settings, and any associated files. Once deleted,
              this data cannot be recovered. Please proceed with caution.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Body setState={setOpen} />
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();
  const { email } = useUserStore();
  const [value, setValue] = useState("");

  const onDeleteAccount = async () => {
    startTransition(async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!data || error) {
        toast.error("An unexpected error occurred while deleting this account.");
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
        <div className="grid gap-3">
          <Label htmlFor="account_email">Type your related account email to continue.</Label>
          <Input id="account_email" type="email" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <Alert variant={"destructive"} className="p-4 bg-red-100">
          <AlertDescription className="text-sm font-semibold">
            This action is not reversible. Once confirmed, all your forms and associated data will be permanently
            deleted. Please be absolutely certain before proceeding.
          </AlertDescription>
        </Alert>
      </div>
      <div className="flex justify-between items-center">
        <Button disabled={isPending} variant={"outline"} size={"sm"} onClick={() => setState(false)}>
          Cancel
        </Button>
        <Button disabled={email !== value} onClick={onDeleteAccount} variant={"destructive"} size={"sm"}>
          {isPending && <Loader2Icon className="animate-spin w-4 h-4 mr-2" />}
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default SettingsAccountDelete;
