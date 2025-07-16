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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAppStore from "@/stores/app";
import { ETeamMemberProfile } from "@/utils/entities";
import { applyContext } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TSetState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ReactNode, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const MembersUpdate = ({
  children,
  self,
  member,
}: {
  children: ReactNode;
  self: boolean;
  member: ETeamMemberProfile;
}) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="backdrop-blur-sm">
        <AlertDialogContent className="flex flex-col w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("label_update_member")}</AlertDialogTitle>
            <AlertDialogDescription>{t("desc_update_member")}</AlertDialogDescription>
          </AlertDialogHeader>
          <Body setState={setOpen} self={self} member={member} />
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

const Body = ({
  setState,
  self,
  member,
}: {
  setState: TSetState<boolean>;
  self: boolean;
  member: ETeamMemberProfile;
}) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();
  const isOwner = app.context.isOrgOwner;
  const isYou = app.teamMemberProfile.profile_id === member.profile_id;
  const isStaff = app.teamMemberProfile.role === "staff";

  const formSchema = z.object({
    name: z.string().min(2, { message: t("required_name") }),
    lastName: z.string().min(2, { message: t("required_last_name") }),
    role: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: member.name, lastName: member.last_name, role: member.role },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const tmp = await supabase
        .from("team_member_profiles")
        .update({
          name: values.name,
          last_name: values.lastName,
          role: values.role,
        })
        .eq("id", member.id)
        .select("*")
        .single();

      if (tmp.error) {
        toast.error(t("err_generic"));
        return;
      }
      const updatedTMPs = app.teamMemberProfiles.map((x) => (x.id === tmp.data.id ? tmp.data : x));

      if (member.profile_id === app.teamMemberProfile.profile_id) {
        app.setTeamMemberProfile(tmp.data);
      }
      const updatedContext = applyContext(tmp.data, app.organization);

      app.setTeamMemberProfiles(updatedTMPs);
      app.setContext(updatedContext);
      toast.success(t("success_generic"));
      setState(false);
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("label_name")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input id="name" type="text" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("label_last_name")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input id="lastName" type="text" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={`${(isOwner && isYou) || isStaff ? "hidden" : ""}`}>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("label_role")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={(isOwner && isYou) || isStaff}>
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
          <div className="flex flex-col-reverse sm:flex-row gap-2 w-full justify-between">
            <Button
              disabled={isPending}
              type="button"
              onClick={() => setState(false)}
              variant="outline"
              size="sm"
              className="w-full sm:w-fit gap-2">
              {t("label_close")}
            </Button>
            <Button disabled={isPending} type="submit" variant={"secondary"} size={"sm"}>
              {t("label_update_member")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MembersUpdate;
