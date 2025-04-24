import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useUserStore from "@/stores/user";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LoaderIcon, LockIcon, Trash2Icon, User2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SettingsAccountDelete from "./settings-account-delete";

const SettingsAccount2 = () => {
  const t = useTranslations("app");
  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="font-bold tracking-tight">{t("label_account_settings")}</h1>
        <p className="text-xs text-foreground/70">{t("desc_account_settings")}</p>
      </div>
      <div className="flex flex-col gap-8 pb-10">
        <AccountProfile />
        <AccountPassword />
        <AccountDelete />
      </div>
    </div>
  );
};
const AccountProfile = () => {
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <User2Icon className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-base">{t("label_profile_info")}</CardTitle>
            <CardDescription className="text-xs">{t("desc_profile_info")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...profileHandler}>
          <form onSubmit={profileHandler.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Button
                variant={"secondary"}
                size={"sm"}
                disabled={appState === "loading"}
                type="submit"
                className="w-full md:w-auto">
                {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
                {t("label_save_profile")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
const AccountPassword = () => {
  const t = useTranslations("app");
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const passwordSchema = z.object({
    password: z
      .string()
      .min(8, { message: t("required_n_char", { n: 8 }) })
      .regex(/[0-9]/, { message: t("required_n_number", { n: 1 }) })
      .regex(/[a-z]/, { message: t("required_n_lower", { n: 1 }) })
      .regex(/[A-Z]/, { message: t("required_n_upper", { n: 1 }) })
      .regex(/[\W_]/, { message: t("required_n_special", { n: 1 }) }),
  });

  const passwordHandler = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setAppState("loading");
    const { password } = values;
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(t("err_generic"));
      setAppState("idle");
      passwordHandler.setValue("password", "");
      return;
    }
    toast.success(t("suc_update_password"));
    setAppState("idle");
    passwordHandler.setValue("password", "");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <LockIcon className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-base">{t("label_password")}</CardTitle>
            <CardDescription className="text-xs">{t("desc_password")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...passwordHandler}>
          <form onSubmit={passwordHandler.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField
              control={passwordHandler.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("label_new_password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input id={id} type={isVisible ? "text" : "password"} {...field} />
                      <button
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={isVisible ? "Hide password" : "Show password"}
                        aria-pressed={isVisible}>
                        {isVisible ? (
                          <EyeOffIcon size={16} strokeWidth={2} aria-hidden="true" />
                        ) : (
                          <EyeIcon size={16} strokeWidth={2} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                variant={"secondary"}
                size={"sm"}
                type="submit"
                className="w-full md:w-auto"
                disabled={appState === "loading"}>
                {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
                {t("label_update_password")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
const AccountDelete = () => {
  const t = useTranslations("app");

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Trash2Icon className="w-5 h-5 text-destructive" />
          <div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-base">{t("label_delete_account")}</CardTitle>
            </div>
            <CardDescription className="text-xs">{t("desc_delete_account")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SettingsAccountDelete>
            <Button variant={"destructive"} size={"sm"} className="w-full md:w-auto">
              {t("label_delete_account")}
            </Button>
          </SettingsAccountDelete>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsAccount2;
