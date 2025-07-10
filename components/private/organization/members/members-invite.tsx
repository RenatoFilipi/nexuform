import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAppStore from "@/stores/app";
import { createClient } from "@/utils/supabase/client";
import { TSetState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRightIcon, CheckCircle2Icon, LoaderIcon, MailPlusIcon, ZapIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ManageSubscription2 from "../../shared/subscription/manage-subscription2";

const MembersInvite = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="backdrop-blur-sm">
        <AlertDialogContent className="flex flex-col w-full max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("label_invite_member")}</AlertDialogTitle>
            <AlertDialogDescription className="">{t("desc_invite_member")}</AlertDialogDescription>
          </AlertDialogHeader>
          <Body setState={setOpen} />
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();
  const isPro = app.subscription.plan === "pro";

  const formSchema = z.object({
    email: z.string().email(t("label_required_email")),
    role: z.enum(["admin", "staff"]),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", role: "staff" },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const inviterName = `${app.teamMemberProfile.name} ${app.teamMemberProfile.last_name}`;
      const { error } = await supabase.from("invitations").insert({
        email: values.email,
        invited_by: app.teamMemberProfile.id,
        org_id: app.organization.id,
        role: values.role,
        status: "pending",
        org_name: app.organization.name,
        inviter_name: inviterName,
      });
      if (error) {
        toast.error(t("err_generic"));
        return;
      }
      toast.success(t("success_generic"));
      setState(false);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {!isPro && <UpgradeToPro />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-10">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("label_email")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input id="email" type="email" {...field} autoComplete="email" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("label_role")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">{t("label_admin")}</SelectItem>
                        <SelectItem value="staff">{t("label_staff")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-between items-center w-full">
            <Button type="button" variant={"outline"} size={"sm"} onClick={() => setState(false)}>
              {t("label_close")}
            </Button>
            <Button type="submit" variant={"secondary"} size={"sm"} disabled={!isPro || isPending}>
              {!isPending && <MailPlusIcon className="w-4 h-4 mr-2" />}
              {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
              {t("label_invite")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const UpgradeToPro = () => {
  const t = useTranslations("app");
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-purple-600 text-white">
      <div className="relative z-10 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <ZapIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">{t("label_upgrade_pro")}</h3>
          </div>
          <p className="max-w-[85%] text-sm leading-relaxed text-white/90">{t("label_up_members")}</p>
          <div className="mt-2 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-300" />
              <span className="text-sm">{t("label_members_feat_01")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-300" />
              <span className="text-sm">{t("label_members_feat_02")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-300" />
              <span className="text-sm">{t("label_members_feat_03")}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center sm:justify-end">
            <ManageSubscription2 selected="pro">
              <Button size="sm" variant={"secondary"} className="w-full sm:w-fit">
                <ArrowUpRightIcon className="w-4 h-4 mr-2" />
                {t("label_upgrade_pro")}
              </Button>
            </ManageSubscription2>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MembersInvite;
