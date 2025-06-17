"use client";

import { signUpAction } from "@/app/actions/auth";
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

const SignupForm = () => {
  const t = useTranslations("auth");
  const [success] = useQueryState("success");
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
  });

  const formSchema = z.object({
    first_name: z.string().min(2, { message: t("required_first_name") }),
    last_name: z.string().min(2, { message: t("required_last_name") }),
    email: z.string().email({ message: t("required_email") }),
    password: z.string().min(8, { message: t("required_n_password", { n: 8 }) }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password, first_name, last_name } = values;
    startTransition(async () => {
      const formData = new FormData();
      formData.append("first_name", first_name);
      formData.append("last_name", last_name);
      formData.append("email", email);
      formData.append("password", password);
      await signUpAction(formData);
    });
  };

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold">{t("label_confirm_email")}</h1>
          <p className="text-sm text-muted-foreground">{t("desc_confirm_email")}</p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md mx-auto flex flex-col gap-4">
        <FormHeader
          title={t("label_signup_into", { platform: appName })}
          desc={t("desc_login")}
          path="/login"
          link={t("label_login")}
        />

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("label_first_name")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input id="first_name" type="text" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("label_last_name")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input id="last_name" type="text" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  <MailIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
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
                  <Input id="password" type={isVisible ? "text" : "password"} {...field} autoComplete="new-password" />
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

        {/* Consent & Submit */}
        <div className="flex flex-col gap-4 text-sm">
          <p className="text-muted-foreground">
            {t.rich("label_signup_consent", {
              terms: (chunks) => (
                <Link href="/legal/terms" className="text-blue-600 hover:underline">
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link href="/legal/privacy" className="text-blue-600 hover:underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <Button type="submit" variant="default" size="sm" className="w-full" disabled={isPending}>
            {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
            {t("label_signup")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
