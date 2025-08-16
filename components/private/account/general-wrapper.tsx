"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useUserStore from "@/stores/user";
import { EProfile } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import AccountDelete from "./account-delete";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
}

const GeneralWrapper = (props: IProps) => {
  const user = useUserStore();
  const t = useTranslations("app");

  const query = useQuery({
    queryKey: ["general-data"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">{t("label_account_settings")}</h1>
      </div>
      <div className="flex flex-col gap-6">
        <Profile />
        <Delete />
      </div>
    </div>
  );
};

const Profile = () => {
  const t = useTranslations("app");
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const { profile, setProfile } = useUserStore();

  const profileSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  });
  const profileHandler = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.first_name,
      lastName: profile.last_name,
    },
  });
  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    setAppState("loading");
    const { firstName, lastName } = values;
    const { data, error } = await supabase
      .from("profiles")
      .update({ first_name: firstName, last_name: lastName })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (error) {
      toast.error(t("err_generic"));
      setAppState("idle");
      console.log(error);
      return;
    }
    setProfile(data);
    toast.success(t("suc_update_profile"));
    setAppState("idle");
  };

  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-1 w-full">
          <h1 className="font-semibold text-lg">{t("label_profile_info")}</h1>
          <p className="text-sm text-muted-foreground">{t("desc_profile_info")}</p>
        </div>
        <Form {...profileHandler}>
          <form onSubmit={profileHandler.handleSubmit(onProfileSubmit)} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-4 w-full">
              <FormField
                control={profileHandler.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("label_first_name")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileHandler.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("label_last_name")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" disabled={appState === "loading"} type="submit" className="w-fit">
                {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
                {t("label_save_profile")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};
const Delete = () => {
  const t = useTranslations("app");

  return (
    <Card className="flex flex-col sm:flex-row justify-between items-center gap-8 p-4 sm:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-lg">{t("label_delete_account")}</h1>
        <p className="text-sm text-muted-foreground">{t("desc_delete_account")}</p>
      </div>
      <div className="flex justify-end items-center w-full">
        <AccountDelete>
          <Button variant="destructive_outline" size="sm" className="">
            <AlertTriangleIcon className="w-4 h-4 mr-2" />
            {t("label_delete_account")}
          </Button>
        </AccountDelete>
      </div>
    </Card>
  );
};

export default GeneralWrapper;
