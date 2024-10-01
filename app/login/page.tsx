"use client";

import DotPattern from "@/components/magicui/dot-pattern";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { minWidth640 } from "@/helpers/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { z } from "zod";

const Login = () => {
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

  const matches = useMediaQuery({ query: minWidth640 });

  return (
    <div className="border min-h-screen flex">
      <div className="flex-1 flex justify-center items-center w-full relative">
        <Link href={"/"} className="fixed top-6 flex sm:hidden">
          <Image alt="logo" src={"/logo.svg"} height={0} width={45} />
        </Link>
        <Button
          variant={"outline"}
          size={"sm"}
          className="fixed top-5 left-5 hidden sm:flex"
          asChild>
          <Link href={"/"}>Go back</Link>
        </Button>
        <div className="w-full flex justify-center items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full sm:max-w-96 flex flex-col gap-10 justify-center items-center sm:p-0 px-12">
              <div className="flex justify-start w-full flex-col gap-2">
                <h1 className="text-xl font-semibold">Login</h1>
                <span className="text-sm text-foreground/80">
                  Don&apos;t have an account?{" "}
                  <Link href={"/signup"} className="hover:underline text-info">
                    Sign Up
                  </Link>
                </span>
              </div>
              <div className="flex flex-col justify-center items-center w-full gap-4">
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
                <div className="flex flex-col w-full gap-4">
                  <Link
                    href={"/reset-password"}
                    className="text-sm hover:underline text-foreground/80 hover:text-info">
                    Forgot password?
                  </Link>
                  <Button
                    variant={"secondary"}
                    type="submit"
                    size={"sm"}
                    className="w-full">
                    Login
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="bg-primary/40 flex-1 sm:flex hidden justify-center items-center w-full relative">
        <Image alt="brand logo" src={"/brand.svg"} height={0} width={280} />
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom_right,white,white,white)] "
          )}
        />
      </div>
    </div>
  );
};

export default Login;
