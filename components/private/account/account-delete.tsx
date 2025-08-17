import { deleteAccountAction } from "@/app/actions/auth-actions";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useUserStore from "@/stores/user";
import { createClient } from "@/utils/supabase/client";
import { TSetState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircle, LoaderIcon, SkullIcon } from "lucide-react";
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
              <AlertCircle className="text-destructive w-6 h-6" />
              {t("label_delete_personal_account")}
            </AlertDialogTitle>
            <AlertDialogDescription className="hidden">{t("label_action_undone")}</AlertDialogDescription>
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
      await deleteAccountAction(formData);
    });
  };

  return (
    <div className="flex flex-1 flex-col justify-between gap-6">
      <Card className="relative p-10 shadow h-full flex flex-col justify-center items-center w-full overflow-hidden backdrop-blur-md">
        <div className="flex justify-center items-center py-10 flex-col gap-10">
          {/* Ícone animado */}
          <div className="flex justify-center items-center gap-12 relative">
            <motion.div
              animate={{
                x: 0,
                opacity: 1,
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0 0 rgba(220, 38, 38, 0.7)",
                  "0 0 20px 10px rgba(220, 38, 38, 0.2)",
                  "0 0 0 0 rgba(220, 38, 38, 0)",
                ],
                borderColor: ["rgb(220 38 38 / 0.7)", "rgb(220 38 38 / 0.3)", "rgb(220 38 38 / 0.7)"],
              }}
              transition={{
                delay: 0.2,
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center gap-4 p-6 bg-destructive/10 rounded-2xl border border-destructive/30 shadow-lg backdrop-blur-md z-10">
              <SkullIcon className="text-destructive w-10 h-10" />
            </motion.div>
          </div>

          {/* Conteúdo principal */}
          <div className="flex flex-col gap-6 justify-center items-center text-center max-w-md">
            <span className="text-sm sm:text-base text-muted-foreground">{t("desc_delete_personal_account")}</span>

            <div className="flex flex-col gap-5 w-full">
              <Badge
                variant={"destructive"}
                className="text-center text-destructive font-semibold w-full flex justify-center items-center">
                {t("label_type_delete_personal_account")}
              </Badge>

              <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
                <Input
                  id="account_email"
                  type="email"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="flex-1 focus:ring-destructive focus:border-destructive"
                />
                <Button
                  disabled={email !== value || isPending}
                  onClick={onDeleteAccount}
                  variant={"destructive_outline"}
                  size={"sm"}
                  className="w-full sm:w-auto font-medium transition-all duration-300 hover:scale-105">
                  {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
                  {t("label_delete_personal_account")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Botão cancelar */}
      <div className="flex justify-start items-center gap-4">
        <Button
          disabled={isPending}
          variant={"outline"}
          size={"sm"}
          onClick={() => setState(false)}
          className="transition-all duration-300">
          {t("label_cancel")}
        </Button>
      </div>
    </div>
  );
};
export default AccountDelete;
