"use client";

import { signInAction } from "@/app/actions/auth-actions";
import Brand from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
      <div className="flex sm:max-w-xl w-full justify-center items-center p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
          <div className="flex flex-col justify-center items-center gap-8">
            <div className="flex w-full justify-center">
              <Link href="/" className="group flex justify-center items-center">
                <Brand type="primary_logo_text" className="fill-foreground h-10" />
              </Link>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center text-center">
              <span className="text-2xl font-semibold">{t("label_login_headline")}</span>
              <p className="text-muted-foreground text-sm">{t("desc_login_headline")}</p>
            </div>
          </div>
          <Card className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-4">
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
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
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
                  <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground hover:underline">
                    {t("label_forgot_password")}
                  </Link>
                </div>
              </div>
              {/* Password Field */}
            </div>
            <div className="flex flex-col gap-5">
              {/* Submit Button */}
              <Button type="submit" variant="default" size="sm" className="w-full" disabled={isPending}>
                {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
                {t("submit_login")}
              </Button>
              <p className="flex justify-center items-center text-center text-muted-foreground text-sm gap-1">
                {t("desc_signup")}
                <Link href={"/signup"} className="text-foreground hover:underline">
                  {t("label_signup")}
                </Link>
              </p>
            </div>
          </Card>
        </form>
      </div>
    </Form>
  );
};

export default LoginForm;
