import Brand2 from "@/components/core/brand-2";
import ModeToggle2 from "@/components/core/mode-toggle2";
import ShineBorder from "@/components/magicui/shine-border";
import Nav from "@/components/public/nav";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex fixed top-0 w-full justify-between sm:justify-around sm:px-5 px-3 h-14 bg-background/80 z-10 backdrop-blur-md items-center">
        <Link href={"/"} className="flex justify-center items-center">
          <Brand2 type="logo_text" className="h-7 fill-foreground" />
        </Link>
        <div className="hidden sm:flex justify-center items-center gap-4">
          <Button variant={"outline"} size={"sm"} asChild>
            <Link href={"/login"}>Login</Link>
          </Button>
          <Button variant={"default"} size={"sm"} asChild>
            <Link href={"/signup"}>Get Started</Link>
          </Button>
        </div>
        <div className="flex sm:hidden">
          <Nav>
            <Button variant={"ghost"} size={"icon"}>
              <Menu className="w-6 h-6" />
            </Button>
          </Nav>
        </div>
      </div>
      <div className="sm:mt-36 mt-20 relative flex flex-col justify-center items-center px-4 sm:px-0 flex-1 gap-14">
        <div className="flex justify-center items-center flex-col gap-6 w-full">
          <div className="flex flex-col justify-center items-center w-full text-center gap-6">
            <h1 className="font-bold text-3xl sm:text-6xl max-w-[43.5rem]">
              Streamline Feedback With{" "}
              <span className="text-primary">Intuitive Forms.</span>
            </h1>
            <p className="max-w-xl text-base font-normal text-foreground/80">
              Transform Your Business Landscape through Strategic
              Decision-Making with Data Insights.
            </p>
          </div>
          <div className="flex justify-center items-center gap-4">
            <Button variant={"outline"}>View Demo</Button>
            <Button asChild variant={"secondary"}>
              <Link href={"/dashboard/forms"}>
                Start Free Trial
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="mb-20">
          <ShineBorder
            className="relative rounded-lg border"
            color={["#89FF4D", "#89FF4D", "#89FF4D"]}>
            <Image
              alt="hero preview feature"
              src={"/dash.webp"}
              width={1000}
              height={500}
            />
          </ShineBorder>
        </div>
      </div>
      <footer className="flex justify-center items-center w-full h-12 absolute bottom-0 border-t">
        <span className="text-xs text-foreground/80 sm:text-center">
          © 2023{" "}
          <Link href="/" className="hover:underline">
            Nebulaform
          </Link>
          . All Rights Reserved.
        </span>
        <div className="absolute right-4 hidden sm:flex">
          <ModeToggle2 />
        </div>
      </footer>
    </div>
  );
};

export default Home;
