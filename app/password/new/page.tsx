"use client";

import Brand from "@/components/core/brand";
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
import { appState } from "@/utils/types";
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

const New = () => {
  const [appState, setAppState] = useState<appState>("idle");
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z.object({
    password: z.string().min(8, { message: "Must be atleast 8 characters." }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 sm:flex hidden w-full relative bg-gradient-to-b from-black to-primary">
        <Brand
          type="logo_text"
          className="h-8 fill-white absolute top-6 left-6"
        />
      </div>
      <div className="flex flex-1 justify-center items-center w-full relative">
        <Link href={"/"} className="fixed top-6 flex sm:hidden">
          <Brand type="logo" className="h-8 fill-foreground" />
        </Link>
        <div className="absolute top-3 left-3 hidden sm:flex gap-2 justify-between items-center">
          <Button variant={"ghost"} size={"sm"} asChild>
            <Link href={"/"}>
              <ChevronLeftIcon className="w-4 h-4 mr-" />
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
                <h1 className="text-xl font-medium">Create new password</h1>
                <p className="text-sm text-foreground/80">
                  Create a password with at least 8 characters, including
                  letters, numbers, and special characters.
                </p>
              </div>
              <div className="flex flex-col justify-center items-center w-full gap-4">
                <div className="flex flex-col gap-3 w-full">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl>
                          <div className="flex justify-center items-center gap-2">
                            <Input
                              id="password"
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
                <div className="flex flex-col w-full gap-4">
                  <Button
                    disabled={appState === "loading"}
                    variant={"secondary"}
                    type="submit"
                    size={"sm"}
                    className="w-full">
                    {appState === "loading" && (
                      <LoaderIcon className="animate-spin w-4 h-4" />
                    )}
                    {appState === "idle" && "Create new password"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default New;
