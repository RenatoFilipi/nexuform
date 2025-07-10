"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useUserStore from "@/stores/user";
import { EOrganization, EProfile, ESubscription } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon, EyeIcon, EyeOffIcon, LoaderIcon, LockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import AccountDelete from "./account-delete";

interface IProps {
  profile: EProfile;
  subscription: ESubscription;
  email: string;
  locale: string;
  organizations: EOrganization[];
}

const AccountWrapper = (props: IProps) => {
  const user = useUserStore();
  const t = useTranslations("app");

  const query = useQuery({
    queryKey: ["settings-data"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setProfile(props.profile);
      user.setSubscription(props.subscription);
      user.setEmail(props.email);
      user.setOrganizations(props.organizations);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">{t("label_account_settings")}</h1>
      </div>
      {/* content */}
      <div className="flex flex-col gap-6">
        <Profile />
        <Password />
        <Delete />
      </div>
    </div>
  );
};
const Header = ({ desc, icon, name }: { icon: React.ReactNode; name: string; desc: string }) => {
  return (
    <div className="flex items-start gap-4 border-gray-100 dark:border-gray-800">
      <div className="p-3 rounded bg-primary-50 text-primary-600 dark:text-primary-400 bg-primary/10">{icon}</div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
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
          <h1 className="font-semibold text-base">{t("label_profile_info")}</h1>
          <p className="text-xs text-muted-foreground">{t("desc_profile_info")}</p>
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
const Password = () => {
  const t = useTranslations("app");
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const [isVisible, setIsVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[\W_]/.test(password)) strength += 1;
    return strength;
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    passwordHandler.setValue("password", e.target.value);
    setPasswordStrength(calculateStrength(e.target.value));
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setAppState("loading");
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      toast.success(t("suc_update_password"));
      passwordHandler.reset();
      setPasswordStrength(0);
    } catch (error) {
      toast.error(t("err_generic"));
      console.error(error);
    } finally {
      setAppState("idle");
    }
  };

  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-1 w-full">
          <h1 className="font-semibold text-base">{t("label_password")}</h1>
          <p className="text-xs text-muted-foreground">{t("desc_password")}</p>
        </div>
        <Form {...passwordHandler}>
          <form onSubmit={passwordHandler.handleSubmit(onPasswordSubmit)} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-6 w-full">
              <FormField
                control={passwordHandler.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("label_new_password")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isVisible ? "text" : "password"}
                          {...field}
                          onChange={onPasswordChange}
                          className="pr-10"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={toggleVisibility}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          {isVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    {passwordStrength > 0 && (
                      <div className="mt-2">
                        <div className="flex gap-1 h-1.5">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`flex-1 rounded-full ${
                                level <= passwordStrength
                                  ? level <= 2
                                    ? "bg-red-400"
                                    : level <= 4
                                    ? "bg-yellow-400"
                                    : "bg-green-500"
                                  : "bg-gray-200 dark:bg-gray-700"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {passwordStrength <= 2
                            ? t("label_password_weak")
                            : passwordStrength <= 4
                            ? t("label_password_medium")
                            : t("label_password_strong")}
                        </p>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={appState === "loading" || passwordStrength < 3}
                  type="submit"
                  className="w-fit">
                  {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
                  {t("label_update_password")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Header
        icon={<LockIcon className="w-5 h-5 text-primary" />}
        name={t("label_password")}
        desc={t("desc_password")}
      />

      <Form {...passwordHandler}>
        <form onSubmit={passwordHandler.handleSubmit(onPasswordSubmit)} className="space-y-6">
          <FormField
            control={passwordHandler.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("label_new_password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={isVisible ? "text" : "password"}
                      {...field}
                      onChange={onPasswordChange}
                      className="pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      {isVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </FormControl>
                {passwordStrength > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 rounded-full ${
                            level <= passwordStrength
                              ? level <= 2
                                ? "bg-red-400"
                                : level <= 4
                                ? "bg-yellow-400"
                                : "bg-green-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {passwordStrength <= 2
                        ? t("label_password_weak")
                        : passwordStrength <= 4
                        ? t("label_password_medium")
                        : t("label_password_strong")}
                    </p>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={appState === "loading" || passwordStrength < 3}
              type="submit"
              className="w-full md:w-auto">
              {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
              {t("label_update_password")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
const Delete = () => {
  const t = useTranslations("app");

  return (
    <Card className="flex flex-col sm:flex-row justify-between items-center gap-8 p-4 sm:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-base">{t("label_delete_account")}</h1>
        <p className="text-xs text-muted-foreground">{t("desc_delete_account")}</p>
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
export default AccountWrapper;
