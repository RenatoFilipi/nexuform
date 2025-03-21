"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UpdatePasswordForm = () => {
  const t = useTranslations("auth");
  const [appState, setAppState] = useState<TAppState>("idle");
  const [code] = useQueryState("code");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

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
    console.log(values);
  };

  return (
    <Form {...passwordHandler}>
      <form
        onSubmit={passwordHandler.handleSubmit(onPasswordSubmit)}
        className="w-full flex flex-col gap-6 justify-center items-center">
        <div className="flex justify-start w-full flex-col gap-2">
          <h1 className="text-xl font-medium">{t("label_update_password")}</h1>
          <span className="text-sm text-foreground/80">{t("desc_update_password")}</span>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <FormField
            control={passwordHandler.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">{t("label_password")}</FormLabel>
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
        <div className="flex flex-col w-full gap-4">
          <Button disabled={appState === "loading"} variant="secondary" type="submit" size="sm" className="w-full">
            {appState === "loading" && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
            {t("label_update_password")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdatePasswordForm;
