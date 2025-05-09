"use client";

import { ResetPasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, LoaderIcon, MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ResetPasswordForm = () => {
  const t = useTranslations("auth");
  const [error] = useQueryState("error");
  const [success] = useQueryState("success");
  const [isPending, startTransition] = useTransition();

  useQuery({
    queryKey: [error],
    queryFn: () => {
      if (error !== null) toast.error(error);
      return null;
    },
  });
  const formSchema = z.object({
    email: z.string().email(t("required_email")),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email } = values;
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      await ResetPasswordAction(formData);
    });
  };

  if (success) {
    return (
      <div className="flex flex-col justify-center items-center gap-6">
        <div className="flex justify-center items-center p-2 rounded-full bg-primary/20">
          <CheckIcon className="w-10 h-10 text-primary" />
        </div>
        <div className="flex flex-col justify-center items-center text-center gap-2">
          <h1 className="font-semibold text-xl">{t("label_suc_request_password")}</h1>
          <span className="text-foreground/70 text-sm">{t("desc_suc_request_password")}</span>
        </div>
        <Button variant={"default"} size={"sm"} className="w-full" asChild>
          <Link href={"/login"}>{t("label_go_back_login")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-6 justify-center items-center">
        <div className="flex justify-start w-full flex-col gap-2">
          <h1 className="text-xl font-medium">{t("label_reset_password")}</h1>
          <span className="text-sm text-foreground/80">{t("desc_reset_password")}</span>
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
        </div>
        <div className="flex flex-col w-full gap-6">
          <Button disabled={isPending} variant="default" type="submit" size="sm" className="w-full">
            {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
            {t("label_reset_password")}
          </Button>
          <div className="flex justify-center items-center w-full">
            <Link href={"/login"} className="hover:underline text-blue-600 text-sm">
              {t("label_go_back_login")}
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
