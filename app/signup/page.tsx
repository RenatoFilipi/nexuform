"use client";

import { default as Brand } from "@/components/core/brand";
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
import { appStage, appState } from "@/helpers/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeftIcon,
  EyeClosedIcon,
  EyeIcon,
  LoaderIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [appState, setAppState] = useState<appState>("idle");
  const [appStage, setAppStage] = useState<appStage>("stage01");

  const formSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password needs to be atleast 8 characters long" }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setAppState("loading");
    setTimeout(() => {
      setAppState("idle");
      setAppStage("stage02");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex justify-center items-center w-full relative">
        <Link href={"/"} className="fixed top-6 flex sm:hidden">
          <Brand type="logo" className="h-8 fill-foreground" />
        </Link>
        <div className="fixed top-3 left-3 hidden sm:flex gap-2">
          <Button variant={"outline"} size={"sm"} asChild>
            <Link href={"/"}>
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              Go back
            </Link>
          </Button>
        </div>
        {appStage === "stage01" && (
          <div className="w-full flex justify-center items-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full sm:max-w-96 flex flex-col gap-10 justify-center items-center sm:p-0 px-12">
                <div className="flex justify-start w-full flex-col gap-2">
                  <h1 className="text-xl font-medium">Sign up</h1>
                  <span className="text-sm text-foreground/80">
                    Already have an account?{" "}
                    <Link
                      href={"/login"}
                      className="hover:underline text-info dark:text-blue-500">
                      Log In
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
                            <Input type="email" {...field} />
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
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="flex justify-center items-center gap-2">
                              <Input
                                type={showPassword ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant={"ghost"}
                                size={"icon"}
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                  <EyeIcon className="w-5 h-5" />
                                ) : (
                                  <EyeClosedIcon className="w-5 h-5" />
                                )}
                              </Button>
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
                      <Link
                        href={"/legal/terms"}
                        className="text-info hover:underline dark:text-blue-500">
                        terms of service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href={"/legal/privacy"}
                        className="text-info hover:underline dark:text-blue-500">
                        privacy policy.
                      </Link>
                    </p>
                    <Button
                      variant={"secondary"}
                      type="submit"
                      size={"sm"}
                      className="w-full">
                      {appState === "loading" && (
                        <LoaderIcon className="animate-spin w-4 h-4" />
                      )}
                      {appState === "idle" && "Sign up"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        )}
        {appStage === "stage02" && (
          <div className="w-full flex justify-center items-center">
            <div className="flex justify-center items-center gap-4 flex-col sm:max-w-96 sm:p-0 px-12">
              <h1 className="text-2xl font-medium">Confirm your email</h1>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-foreground/80">
                  We&apos;ve sent you a confirmation email. Please check your
                  inbox and click the link to verify your account.
                </p>
                <p className="text-xs text-foreground/60">
                  If you don&apos;t see the email, check your spam folder or
                  request a new confirmation email.
                </p>
              </div>
              <Button variant={"secondary"} size={"sm"} className="w-full">
                Resend confirmation email
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 sm:flex hidden justify-center items-center w-full relative bg-primary">
        <Brand type="logo_text" className="h-20 fill-black" />
      </div>
    </div>
  );
};

export default Signup;
