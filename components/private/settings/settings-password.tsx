import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const SettingsPassword = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col">
        <h1 className="font-semibold text-base">Password</h1>
        <p className="text-xs text-foreground/70">
          Update your password to enhance security. Choose a strong password that includes letters, numbers, and special
          characters.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <PasswordUpdate />
      </div>
    </div>
  );
};
const PasswordUpdate = () => {
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const passwordSchema = z.object({
    password: z
      .string()
      .min(8, { message: "At least 8 characters" })
      .regex(/[0-9]/, { message: "At least 1 number" })
      .regex(/[a-z]/, { message: "At least 1 lowercase letter" })
      .regex(/[A-Z]/, { message: "At least 1 uppercase letter" })
      .regex(/[\W_]/, { message: "At least 1 special character" }),
  });

  const passwordHandler = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setAppState("loading");
    const { password } = values;
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error("Error on updating the password.");
      setAppState("idle");
      passwordHandler.setValue("password", "");
      return;
    }
    toast.success("Password updated.");
    setAppState("idle");
    passwordHandler.setValue("password", "");
  };

  return (
    <Form {...passwordHandler}>
      <form
        onSubmit={passwordHandler.handleSubmit(onPasswordSubmit)}
        className="flex flex-col gap-4 p-4 border rounded">
        <div className="flex flex-col gap-4">
          <FormField
            control={passwordHandler.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input id={id} type={isVisible ? "text" : "password"} {...field} />
                    <button
                      className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label={isVisible ? "Hide password" : "Show password"}
                      aria-pressed={isVisible}>
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
        <div className="flex justify-end items-center">
          <Button type="submit" size="sm" variant="default" className="w-full sm:w-fit">
            {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
            Update Password
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingsPassword;
