"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon, MailIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ResetPasswordForm = () => {
  const [error] = useQueryState("error");
  const [isPending, startTransition] = useTransition();

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
    email: z.string().email("Email is required."),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-6 justify-center items-center">
        <div className="flex justify-start w-full flex-col gap-2">
          <h1 className="text-xl font-medium">Reset your password</h1>
          <span className="text-sm text-foreground/80">
            To reset your password, enter the email address you use to log in.
          </span>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
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
        <div className="flex flex-col w-full gap-4">
          <Button disabled={isPending} variant="default" type="submit" size="sm" className="w-full">
            {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
            Reset Password
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
