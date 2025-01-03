"use client";

import { signUpAction } from "@/app/actions";
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
import { useQuery } from "@tanstack/react-query";
import { EyeClosedIcon, EyeIcon, LoaderIcon } from "lucide-react";
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

  const formSchema = z.object({
    email: z.string().email({ message: "Must be a valid email" }),
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
            className="w-full  flex flex-col gap-10 justify-center items-center ">
            <div className="flex justify-start w-full flex-col gap-2">
              <h1 className="text-xl font-medium">Sign up</h1>
              <span className="text-sm text-foreground/80">
                Already have an account?{" "}
                <Link
                  href={"/login"}
                  className="hover:underline text-info dark:text-blue-500">
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
                              <EyeIcon className="w-4 h-4" />
                            ) : (
                              <EyeClosedIcon className="w-4 h-4" />
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
                  {isPending ? (
                    <LoaderIcon className="animate-spin w-4 h-4" />
                  ) : (
                    "Sign up"
                  )}
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
