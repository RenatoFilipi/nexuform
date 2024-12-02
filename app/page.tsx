import Brand from "@/components/core/brand";
import ModeToggle2 from "@/components/core/mode-toggle2";
import Hero from "@/components/public/hero";
import Nav from "@/components/public/nav";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex fixed top-0 w-full justify-between sm:justify-around sm:px-5 px-3 h-14 bg-background/80 z-10 backdrop-blur-md items-center">
        <Link href={"/"} className="flex justify-center items-center">
          <Brand type="logo_text" className="h-7 fill-foreground" />
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
        <Hero />
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
