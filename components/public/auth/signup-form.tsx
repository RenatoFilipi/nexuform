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
  });
  const formSchema = z.object({
    email: z.string().email({ message: t("required_email") }),
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
      await signUpAction(formData);
    });
  };

  if (success) {
    return (
      <div className="flex justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-2">
          <h1 className="text-2xl font-medium">{t("label_confirm_email")}</h1>
          <p className="text-sm text-foreground/80 text-center">{t("desc_confirm_email")}</p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-6 justify-center items-center">
        <FormHeader
          title={t("label_signup_into", { platform: appName })}
          desc={t("desc_login")}
          path="/login"
          link={t("label_login")}
        />
        <div className="flex flex-col justify-center items-center w-full gap-6">
          <div className="flex flex-col gap-3 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("label_email")}</FormLabel>
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
          </div>
          <div className="flex flex-col w-full gap-6">
            <p className="text-xs text-foreground/80">
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
            <Button disabled={isPending} variant={"secondary"} type="submit" size={"sm"} className="w-full">
              {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
              {t("label_signup")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
