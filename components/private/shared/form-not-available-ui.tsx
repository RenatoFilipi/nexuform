import { Button } from "@/components/ui/button";
import Link from "next/link";

const FormNotAvailableUI = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center gap-4">
        <span className="text-sm text-foreground/80">This form is not available or does not exist.</span>
        <div className="flex justify-center items-center w-full">
          <Button variant={"outline"} size={"xs"}>
            <Link href={"/"}>Go Back</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormNotAvailableUI;
