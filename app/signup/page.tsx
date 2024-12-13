"use client";

import { default as Brand } from "@/components/core/brand";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { appStage, appState } from "@/helpers/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon, EyeClosedIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [appState, setAppState] = useState<appState>("idle");
  const [appStage, setAppStage] = useState<appStage>("stage01");

  const formSchema = z.object({
    email: z.string(),
    password: z.string(),
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
        <div className="w-full flex justify-center items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full sm:max-w-96 flex flex-col gap-10 justify-center items-center sm:p-0 px-12">
              <div className="flex justify-start w-full flex-col gap-2">
                <h1 className="text-xl font-semibold">Sign up</h1>
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
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col w-full gap-6">
                  <p className="text-xs text-foreground/80">
                    By signing up for an account, you agree to all{" "}
                    <Link
                      href={"/"}
                      className="text-info hover:underline dark:text-blue-500">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href={"/"}
                      className="text-info hover:underline dark:text-blue-500">
                      privacy policy.
                    </Link>
                  </p>
                  <Button
                    variant={"secondary"}
                    type="submit"
                    size={"sm"}
                    className="w-full">
                    Sign up
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="flex-1 sm:flex hidden justify-center items-center w-full relative bg-primary">
        <Brand type="logo_text" className="h-14 fill-black" />
      </div>
    </div>
  );
};

export default Signup;
