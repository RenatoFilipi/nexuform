"use client";

import Brand from "@/components/core/brand";
import { ModeToggle } from "@/components/core/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Signup = () => {
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
          <Brand type="logo" className="h-7 fill-foreground" />
        </Link>
        <div className="fixed top-5 left-5 hidden sm:flex gap-4">
          <Button variant={"outline"} size={"sm"} className="" asChild>
            <Link href={"/"}>Go back</Link>
          </Button>
          <ModeToggle />
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
                          <Input type="password" {...field} />
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
      <div className="flex-1 sm:flex hidden justify-center items-center w-full relative bg-gradient-to-r from-[#75BDFF] via-[#FF75E9] to-[#FFA775]">
        <Brand type="logo_text" className="h-14 fill-black" />
      </div>
    </div>
  );
};

export default Signup;
