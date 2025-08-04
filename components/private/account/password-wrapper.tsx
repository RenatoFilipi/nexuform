"use client";

import useUserStore from "@/stores/user";
import { EProfile } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { TAppState } from "@/utils/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
}

const PasswordWrapper = (props: IProps) => {
  const user = useUserStore();
  const t = useTranslations("app");

  const query = useQuery({
    queryKey: ["password-data"],
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
        <h1 className="text-xl font-semibold">{t("label_password")}</h1>
      </div>
      <div className="flex flex-col gap-6">
        <Password />
      </div>
    </div>
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
          <p className="text-sm text-muted-foreground">{t("desc_password")}</p>
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
};

export default PasswordWrapper;
