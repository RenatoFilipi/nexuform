"use client";

import { signUpAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon, LoaderIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const SignupForm = () => {
  const [success] = useQueryState("success");
  const [error] = useQueryState("error");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const formSchema = z.object({
    email: z.string().email({ message: "Must be a valid email" }),
    password: z.string().min(8, { message: "Password needs to be atleast 8 characters long" }),
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

  useQuery({
    queryKey: [error],
    queryFn: () => {
      if (error !== null) {
        toast.error(error);
      }
      return null;
    },
  });

  return (
    <>
      {success === null && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-6 justify-center items-center">
            <div className="flex justify-start w-full flex-col gap-2">
              <h1 className="text-xl font-medium">Sign up</h1>
              <span className="text-sm text-foreground/80">
                Already have an account?{" "}
                <Link href={"/login"} className="hover:underline text-info dark:text-blue-500">
                  Log in
                </Link>
              </span>
            </div>
            <div className="flex flex-col justify-center items-center w-full gap-6">
              <div className="flex flex-col gap-3 w-full">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
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
                      <FormLabel htmlFor="password">Password</FormLabel>
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
                  By signing up for an account, you agree to all{" "}
                  <Link href={"/legal/terms"} className="text-info hover:underline dark:text-blue-500">
                    terms of service
                  </Link>{" "}
                  and{" "}
                  <Link href={"/legal/privacy"} className="text-info hover:underline dark:text-blue-500">
                    privacy policy.
                  </Link>
                </p>
                <Button variant={"secondary"} type="submit" size={"sm"} className="w-full">
                  {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
                  Sign up
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
      {success !== null && (
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-2xl font-medium">Confirm your email</h1>
            <p className="text-sm text-foreground/80 text-center">{success}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupForm;
