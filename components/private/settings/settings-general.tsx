import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useUserStore from "@/stores/user";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import AccountDelete from "./account-delete";

const SettingsGeneral = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col">
        <h1 className="font-semibold text-base">User Preferences</h1>
        <p className="text-xs text-foreground/70">
          Customize your profile, account settings, and preferences to tailor your Nebulaform experience.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <GeneralProfile />
        <GeneralPassword />
        <GeneralDeleteAccount />
      </div>
    </div>
  );
};
const GeneralProfile = () => {
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const { profile, setProfile } = useUserStore();

  const profileSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  });
  const profileHandler = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.first_name,
      lastName: profile.last_name,
    },
  });
  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    setAppState("loading");
    const { firstName, lastName } = values;
    const { data, error } = await supabase
      .from("profiles")
      .update({ first_name: firstName, last_name: lastName })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (error) {
      toast.error("Error on updating profile.");
      setAppState("idle");
      console.log(error);
      return;
    }
    setProfile(data);
    toast.success("Profile updated.");
    setAppState("idle");
  };

  return (
    <Form {...profileHandler}>
      <form onSubmit={profileHandler.handleSubmit(onProfileSubmit)} className="flex flex-col border rounded p-4 gap-4">
        <div className="flex flex-col">
          <h2 className="text-base font-semibold">Profile Information</h2>
          <p className="text-xs text-foreground/70">Manage and update your personal details.</p>
        </div>
        <div className="flex gap-4">
          <FormField
            control={profileHandler.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileHandler.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end items-center">
          <Button disabled={appState === "loading"} variant={"secondary"} type="submit" size={"sm"}>
            {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
            Save Profile
          </Button>
        </div>
      </form>
    </Form>
  );
};
const GeneralPassword = () => {
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
        className="flex flex-col border rounded p-4 gap-4">
        <div className="flex flex-col">
          <h2 className="text-base font-semibold">Password Update</h2>
          <p className="text-xs text-foreground/70">
            Update your password to enhance security. Choose a strong password that includes letters, numbers, and
            special characters.
          </p>
        </div>
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
          <Button type="submit" size="sm" variant="secondary">
            {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
            Update Password
          </Button>
        </div>
      </form>
    </Form>
  );
};
const GeneralDeleteAccount = () => {
  return (
    <div className="flex flex-col border p-4 gap-2 rounded">
      <div className="flex justify-start items-center gap-4">
        <h2 className="text-base font-semibold">Delete account</h2>
        <Badge variant={"red"}>Danger Zone</Badge>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-foreground/80">
          Delete your account and all its associated data. This action is not reversible, so please continue with
          caution.
        </p>
        <AccountDelete>
          <Button variant={"destructive_outline"} size={"sm"}>
            Delete Account
          </Button>
        </AccountDelete>
      </div>
    </div>
  );
};

export default SettingsGeneral;
