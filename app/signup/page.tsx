"use client";

import Nav from "@/components/public/nav";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

const Signup = () => {
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    email: z.string(),
    password: z.string(),
  });

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
      <div className="flex justify-center items-center gap-4"></div>
      <div className="fixed bottom-5 w-full flex justify-center items-center">
        <span className="text-sm">
          Already have an account?{" "}
          <Link href={"/login"} className="hover:underline text-primary">
            Log In
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Signup;
