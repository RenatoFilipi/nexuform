import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useUserStore from "@/stores/user";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SettingsAccountDelete from "./settings-account-delete";

const SettingsAccount = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-6">
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
    <Form {...profileHandler}>
      <form onSubmit={profileHandler.handleSubmit(onProfileSubmit)} className="flex flex-col gap-4 w-full border p-4">
        <div className="flex flex-col">
          <h2 className="text-base font-semibold">{t("label_profile_info")}</h2>
          <p className="text-xs text-foreground/70">{t("desc_profile_info")}</p>
        </div>
        <div className="flex gap-4 flex-col">
          <FormField
            control={profileHandler.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
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
              <FormItem className="flex-1">
                <FormLabel>{t("label_last_name")}</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end items-center">
          <Button
            disabled={appState === "loading"}
            variant={"secondary"}
            type="submit"
            size={"sm"}
            className="w-full sm:w-fit">
            {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
            {t("label_save_profile")}
          </Button>
        </div>
      </form>
    </Form>
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
    <Form {...passwordHandler}>
      <form onSubmit={passwordHandler.handleSubmit(onPasswordSubmit)} className="flex flex-col gap-4 w-full border p-4">
        <div className="flex flex-col">
          <h2 className="text-base font-semibold">{t("label_password")}</h2>
          <p className="text-xs text-foreground/70">{t("desc_password")}</p>
        </div>
        <div className="flex flex-col gap-4">
          <FormField
            control={passwordHandler.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1">
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
        </div>
        <div className="flex justify-end items-center">
          <Button type="submit" size="sm" variant="secondary" className="w-full sm:w-fit">
            {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
            {t("label_update_password")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
const AccountDelete = () => {
  const t = useTranslations("app");

  return (
    <div className="flex flex-col gap-2 border-2 p-4 border-destructive/50">
      <div className="flex justify-between sm:justify-start items-center gap-4">
        <h2 className="text-base font-semibold">{t("label_delete_account")}</h2>
        <Badge variant={"red"}>{t("label_danger_zone")}</Badge>
      </div>
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <p className="text-xs text-foreground/80">{t("desc_delete_account")}</p>
        <SettingsAccountDelete>
          <Button variant={"destructive"} size={"sm"} className="w-full sm:w-fit">
            {t("label_delete_account")}
          </Button>
        </SettingsAccountDelete>
      </div>
    </div>
  );
};

export default SettingsAccount;
