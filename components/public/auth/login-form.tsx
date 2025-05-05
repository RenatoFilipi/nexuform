"use client";

import { signInAction } from "@/app/actions/auth";
import Brand from "@/components/shared/core/brand";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

const LoginForm = () => {
  const t = useTranslations("auth");
  const [error] = useQueryState("error");
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  useQuery({
    queryKey: [error],
    queryFn: () => {
      if (error !== null) {
        toast.error(error);
      }
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
    defaultValues: {
      email: "",
      password: "",
    },
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-6 justify-center items-center">
        <div className="flex w-full flex-col justify-center gap-4">
          <div className="flex justify-center items-center">
            <Brand type="logo" className="fill-foreground w-12 h-12" />
          </div>
          <div className="flex justify-center w-full flex-col gap-2 items-center">
            <h1 className="text-2xl font-medium">{t("label_login_into", { platform: "Nebulaform" })}</h1>
            <span className="text-sm text-muted-foreground">
              {t("desc_signup")}{" "}
              <Link href={"/signup"} className="hover:underline text-info dark:text-blue-500">
                {t("label_signup")}
              </Link>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">{t("label_email")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input id="email" type="email" {...field} />
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <MailIcon size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
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
                  <FormLabel htmlFor="password">{t("label_password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input id="password" type={isVisible ? "text" : "password"} {...field} />
                      <button
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={isVisible ? "Hide password" : "Show password"}
                        aria-pressed={isVisible}
                        aria-controls="password">
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
            <div className="flex justify-start items-center w-full">
              <Link href={"/password/reset"} className="text-sm hover:underline text-info dark:text-blue-500">
                {t("label_forgot_password")}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full gap-4">
          <Button disabled={isPending} variant="default" type="submit" size="sm" className="w-full">
            {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
            {t("submit_login")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
