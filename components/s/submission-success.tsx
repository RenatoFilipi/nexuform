import { CheckIcon } from "lucide-react";
import Link from "next/link";
import Brand from "../core/brand";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";

const SubmissionSuccess = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <Card className="flex flex-col gap-16 w-[500px] mt-20 p-8">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-primary/10 p-3">
              <CheckIcon className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              Form Submitted Successfully!
            </CardTitle>
          </div>
          <p className="text-center text-lg text-foreground/70">
            Thank you for submitting your form. We have received your information and will process it shortly.
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 flex-col">
          <div className="text-center">
            <span className="font-medium text-primary text-sm">Want to create a form like this?</span>
          </div>
          <Button asChild size="lg" variant={"outline"} className="w-full">
            <Link href="/login" className="flex items-center justify-center gap-2">
              <Brand type="logo" className="w-4 h-4 fill-primary" />
              Access Nebulaform
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SubmissionSuccess;
