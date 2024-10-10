"use client";

import FormResponseView from "@/components/private/forms/form-response-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formList } from "@/mocks/forms";
import { BookIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type state = "loading" | "no_submissions" | "has_submissions" | "error";

const Form = () => {
  const [state] = useState<state>("has_submissions");
  const pathname = usePathname();
  const currentFormId = pathname.split("/")[3];
  const currentForm = formList.find((x) => x.id === currentFormId);

  return (
    <div className="flex flex-col h-full gap-6 sm:gap-10 my-6 mx-3 sm:mx-12 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-4 sm:gap-8">
          <div className="flex justify-center items-center gap-2">
            <BookIcon className="w-5 h-5" />
            <span className="font-semibold">{currentForm?.title}</span>
          </div>
          <Badge>{currentForm?.status}</Badge>
        </div>
        <Button variant={"secondary"} size={"sm"} asChild>
          <Link href={`/dashboard/editor/${currentFormId}`}>Edit Form</Link>
        </Button>
      </div>
      <div className="h-full border flex flex-col">
        <div className="border-b p-2">
          <span className="text-base">Submissions</span>
        </div>
        {/* loading */}
        {state === "loading" && (
          <div className="flex justify-center items-center h-full">
            <Loader2Icon className="w-6 h-6 animate-spin" />
          </div>
        )}
        {/* no submissions */}
        {state === "no_submissions" && (
          <div className="flex justify-center items-center h-full">
            <span className="text-foreground/80">No submissions to show.</span>
          </div>
        )}
        {/* has submissions */}
        {state === "has_submissions" && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="overflow-x-auto">
                <TableCell className="truncate">re.rosa98@gmail.com</TableCell>
                <TableCell
                  className="text-right truncate"
                  suppressHydrationWarning>
                  {new Date().toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <FormResponseView>
                    <Button variant={"outline"} size={"sm"}>
                      View responses
                    </Button>
                  </FormResponseView>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Form;
