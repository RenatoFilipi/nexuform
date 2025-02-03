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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SettingsGeneral = () => {
  const profileSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  });
  const passwordSchema = z.object({ password: z.string() });
  const profileHandler = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });
  const passwordHandler = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });
  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    console.log(values);
  };
  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col">
        <h1 className="font-semibold text-xl">User Preferences</h1>
        <p className="text-sm text-foreground/80">
          Manage your profile, account settings, and preferences for your
          Nebulaform experience
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <Form {...profileHandler}>
          <form
            onSubmit={profileHandler.handleSubmit(onProfileSubmit)}
            className="flex flex-col border rounded">
            <div className="px-4 py-2 border-b bg-[#F8F8F8] dark:bg-foreground/5">
              <h2 className="">Profile Information</h2>
            </div>
            <div className="p-4 flex gap-4">
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
            <div className="border-t p-4 flex justify-end items-center">
              <Button type="submit" size={"sm"}>
                Save
              </Button>
            </div>
          </form>
        </Form>
        <Form {...passwordHandler}>
          <form
            onSubmit={passwordHandler.handleSubmit(onPasswordSubmit)}
            className="flex flex-col border rounded">
            <div className="px-4 py-2 border-b bg-[#F8F8F8] dark:bg-foreground/5">
              <h2 className="">Password</h2>
            </div>
            <div className="p-4 flex flex-col gap-4">
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
            <div className="border-t p-4 flex justify-end items-center">
              <Button type="submit" size={"sm"}>
                Save
              </Button>
            </div>
          </form>
        </Form>
        <div className="flex flex-col border p-4 gap-2 rounded">
          <div className="text-lg font-semibold">Delete account</div>
          <p className="text-sm text-foreground/80">
            Delete your account and all its associated data. This action is not
            reversible, so please continue with caution.
          </p>
          <div className="flex justify-between items-center">
            <Badge variant={"red"}>Danger Zone</Badge>
            <Button variant={"destructive_outline"} size={"sm"}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsGeneral;
