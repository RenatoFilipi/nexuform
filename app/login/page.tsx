"use client";

import Nav from "@/components/public/nav";
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
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative">
      <div className="fixed sm:top-5 top-2 w-full flex sm:justify-center justify-between items-center px-4">
        <Link href={"/"}>
          <Image alt="logo" src={"/logo.svg"} width={40} height={40}></Image>
        </Link>
        <div className="flex sm:hidden">
          <Nav>
            <Button variant={"ghost"} size={"icon"}>
              <Menu className="w-8 h-8" />
            </Button>
          </Nav>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full sm:max-w-96 flex flex-col gap-6 justify-center items-center sm:p-0 px-12">
          <h1 className="text-2xl font-bold">Login</h1>
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
          <div className="flex flex-col w-full gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Link
              href={"/reset-password"}
              className="text-sm hover:underline text-primary">
              Forgot password?
            </Link>
          </div>
        </form>
      </Form>
      <div className="fixed bottom-5 w-full flex justify-center items-center">
        <span className="text-sm">
          Don&apos;t have an account?{" "}
          <Link href={"/signup"} className="hover:underline text-primary">
            Sign Up
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
