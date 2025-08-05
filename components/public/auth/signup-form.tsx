"use client";

import { signUpAction } from "@/app/actions/auth-actions";
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
      <div className="flex justify-center items-center text-center px-4">
        <div className="flex flex-col items-center gap-6">
          <Link href="/" className="group flex justify-center items-center">
            <Card className="flex justify-center items-center px-3 py-4 hover:bg-muted-foreground/10">
              <Brand type="logo" className="fill-primary h-5" />
            </Card>
          </Link>
          <div className="flex flex-col justify-center items-center text-center gap-2">
            <h1 className="text-2xl font-semibold">{t("label_confirm_email")}</h1>
            <p className="text-sm text-muted-foreground">{t("desc_confirm_email")}</p>
            <Button variant={"secondary"} size={"sm"} className="mt-4" asChild>
              <Link href={"/login"}>{t("label_login")}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="flex sm:max-w-xl w-full justify-center items-center p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
          <div className="flex flex-col justify-center items-center gap-6">
            <div className="flex w-full justify-center">
              <Link href="/" className="group flex justify-center items-center">
                <Card className="flex justify-center items-center px-3 py-4 hover:bg-muted-foreground/10">
                  <Brand type="logo" className="fill-primary h-5" />
                </Card>
              </Link>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center text-center">
              <span className="text-2xl font-semibold">{t("label_signup_headline")}</span>
              <p className="text-muted-foreground text-sm">{t("desc_signup_headline")}</p>
            </div>
          </div>
          <Card className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
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
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
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
                          autoComplete="new-password"
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
              <p className="text-muted-foreground text-sm">
                {t.rich("label_signup_consent", {
                  terms: (chunks) => (
                    <Link href="/legal/terms" className="text-foreground hover:underline">
                      {chunks}
                    </Link>
                  ),
                  privacy: (chunks) => (
                    <Link href="/legal/privacy" className="text-foreground hover:underline">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <Button type="submit" variant="default" size="sm" className="w-full" disabled={isPending}>
                {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
                {t("label_signup")}
              </Button>
              <p className="flex justify-center items-center text-center text-muted-foreground text-sm gap-1">
                {t("desc_login")}
                <Link href={"/login"} className="text-foreground hover:underline">
                  {t("label_login")}
                </Link>
              </p>
            </div>
          </Card>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
