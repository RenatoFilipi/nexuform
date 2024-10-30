import Brand from "@/components/core/brand";
import { ModeToggle } from "@/components/core/mode-toggle";
import { BorderBeam } from "@/components/magicui/border-beam";
import Nav from "@/components/public/nav";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex fixed top-0 w-full sm:justify-around justify-between px-3 h-14 bg-background/80 z-10 backdrop-blur-md items-center">
        <Link href={"/"} className="flex justify-center items-center">
          <Brand type="logo_text" className="h-7 fill-foreground" />
        </Link>
        <div className="hidden sm:flex justify-center items-center gap-4">
          <Button variant={"outline"} size={"sm"} asChild>
            <Link href={"/login"}>Login</Link>
          </Button>
          <Button variant={"secondary"} size={"sm"} asChild>
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
      <div className="mt-20 relative flex flex-col justify-center items-center px-4 sm:px-0 flex-1 gap-14">
        <div className="flex justify-center items-center flex-col gap-6 w-full">
          <div className="flex flex-col justify-center items-center w-full text-center gap-6">
            <h1 className="font-bold text-3xl sm:text-6xl max-w-[43.5rem]">
              Streamline Feedback With{" "}
              <span className="bg-gradient-to-r from-[#75BDFF] via-[#FF75E9] to-[#FFA775] inline-block text-transparent bg-clip-text">
                Intuitive Forms.
              </span>
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
          <div className="relative rounded-lg border p-2">
            <BorderBeam borderWidth={3} colorTo="#75BDFF" colorFrom="#FFA775" />
            <Image
              alt="hero preview feature"
              src={"/dash.webp"}
              width={1200}
              height={500}
            />
          </div>
        </div>
        <footer className="flex justify-center items-center w-full h-12 absolute bottom-0 border-t">
          <span className="text-sm text-foreground/80 sm:text-center">
            © 2023{" "}
            <Link href="/" className="hover:underline">
              Nebulaform
            </Link>
            . All Rights Reserved.
          </span>
          <div className="absolute right-4 sm:flex hidden">
            <ModeToggle />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
