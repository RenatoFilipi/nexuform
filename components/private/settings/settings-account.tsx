import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useUserStore from "@/stores/user";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SettingsAccountDelete from "./settings-account-delete";

const SettingsAccount = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col">
        <h1 className="font-semibold text-base">Account Preferences</h1>
        <p className="text-xs text-foreground/70">
          Customize your profile, account settings, and preferences to tailor your Nebulaform experience.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <AccountProfile />
        <AccountDelete />
      </div>
    </div>
  );
};
const AccountProfile = () => {
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
      <form onSubmit={profileHandler.handleSubmit(onProfileSubmit)} className="flex flex-col gap-4 p-4 border rounded">
        <div className="flex flex-col">
          <h2 className="text-base font-semibold">Profile Information</h2>
          <p className="text-xs text-foreground/70">Manage and update your personal details.</p>
        </div>
        <div className="flex gap-4 flex-col">
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
            variant={"default"}
            type="submit"
            size={"sm"}
            className="w-full sm:w-fit">
            {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
            Save Profile
          </Button>
        </div>
      </form>
    </Form>
  );
};
const AccountDelete = () => {
  return (
    <div className="flex flex-col gap-2 rounded border p-4 border-destructive/50">
      <div className="flex justify-between sm:justify-start items-center gap-4">
        <h2 className="text-base font-semibold">Delete account</h2>
        <Badge variant={"red"}>Danger Zone</Badge>
      </div>
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <p className="text-xs text-foreground/80">
          Delete your account and all its associated data. This action is not reversible, so please continue with
          caution.
        </p>
        <SettingsAccountDelete>
          <Button variant={"destructive_outline"} size={"sm"} className="w-full sm:w-fit">
            Delete Account
          </Button>
        </SettingsAccountDelete>
      </div>
    </div>
  );
};

export default SettingsAccount;
