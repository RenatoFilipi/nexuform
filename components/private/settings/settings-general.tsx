import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useSettingsStore from "@/stores/settings";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import AccountDelete from "./account-delete";

const SettingsGeneral = () => {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col">
        <h1 className="font-semibold text-xl">User Preferences</h1>
        <p className="text-sm text-foreground/80">
          Customize your profile, account settings, and preferences to tailor
          your Nebulaform experience.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <GeneralProfile />
        <GeneralPassword />
        <div className="flex flex-col border p-4 gap-2 rounded">
          <div className="text-lg font-semibold">Delete account</div>
          <p className="text-sm text-foreground/80">
            Delete your account and all its associated data. This action is not
            reversible, so please continue with caution.
          </p>
          <div className="flex justify-between items-center">
            <Badge variant={"red"}>Danger Zone</Badge>
            <AccountDelete>
              <Button variant={"destructive_outline"} size={"sm"}>
                Delete Account
              </Button>
            </AccountDelete>
          </div>
        </div>
      </div>
    </div>
  );
};
const GeneralProfile = () => {
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const { profile, setProfile } = useSettingsStore();

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
      <form
        onSubmit={profileHandler.handleSubmit(onProfileSubmit)}
        className="flex flex-col border rounded p-4 gap-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">Profile Information</h2>
          <p className="text-sm text-foreground/80">
            Manage and update your personal details.
          </p>
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
          <Button
            disabled={appState === "loading"}
            variant={"secondary"}
            type="submit"
            size={"sm"}>
            {appState === "loading" && (
              <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
            )}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
const GeneralPassword = () => {
  const [appState, setAppState] = useState<TAppState>("idle");
  const passwordSchema = z.object({ password: z.string() });
  const passwordHandler = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });
  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    console.log(values);
  };

  return (
    <Form {...passwordHandler}>
      <form
        onSubmit={passwordHandler.handleSubmit(onPasswordSubmit)}
        className="flex flex-col border rounded p-4 gap-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">Password Update</h2>
          <p className="text-sm text-foreground/80">
            Update your password to enhance security. Choose a strong password
            that includes letters, numbers, and special characters.
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
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end items-center">
          <Button type="submit" size={"sm"} variant={"secondary"}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingsGeneral;
