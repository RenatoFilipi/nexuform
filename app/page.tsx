"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex fixed top-0 py-3 p-2 w-full justify-around">
        <Link href={"/"}>
          <Image alt="brand" src={"/brand.svg"} width={180} height={0} />
        </Link>
        <div className="flex justify-center items-center gap-4">
          <Button variant={"outline"} size={"sm"}>
            Login
          </Button>
          <Button size={"sm"}>Get Started</Button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-9 text-center p-4">
        <div className="flex justify-center items-center flex-col gap-2">
          <h1 className="font-bold sm:text-5xl text-3xl">Streamline Feedback</h1>
          <h1 className="font-bold sm:text-5xl text-3xl">With Intuitive Forms</h1>
        </div>
        <p className="sm:text-lg">
          Transform Your Business Landscape through Strategic Decision-Making with Data Insights.
        </p>
      </div>
    </div>
  );
};

export default Home;
