"use client";

import { signInAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { appName } from "@/utils/envs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon, LoaderIcon, MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FormHeader from "./form-header";

const LoginForm = () => {
  const t = useTranslations("auth");
  const [error] = useQueryState("error");
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((prev) => !prev);

  useQuery({
    queryKey: [error],
    queryFn: () => {
      if (error) toast.error(error);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  const formSchema = z.object({
    email: z.string().email(t("required_email")),
    password: z.string().min(8, { message: t("required_n_password", { n: 8 }) }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      await signInAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-4 mx-auto">
        <FormHeader
          title={t("label_login_into", { platform: appName })}
          desc={t("desc_signup")}
          path="/signup"
          link={t("label_signup")}
        />
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("label_email")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input id="email" type="email" {...field} autoComplete="email" />
                  <MailIcon
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("label_password")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="password"
                    type={isVisible ? "text" : "password"}
                    {...field}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Forgot Password */}
        <div className="text-sm text-right">
          <Link href="/password/reset" className="text-blue-600 hover:underline">
            {t("label_forgot_password")}
          </Link>
        </div>
        {/* Submit Button */}
        <Button type="submit" variant="default" size="sm" className="w-full" disabled={isPending}>
          {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
          {t("submit_login")}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
