"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { minute } from "@/utils/constants";
import { ETemplate_block } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const NewTemplatePreview = ({ children, id, name }: { children: React.ReactNode; id: string; name: string }) => {
  const t = useTranslations("app");
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["templateBlocks", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("templates_blocks").select("*").eq("template_id", id);
      if (error) throw new Error(error.message);
      console.log(data);
      return { blocks: data };
    },
    staleTime: 60 * minute,
    gcTime: 60 * minute,
    refetchOnWindowFocus: false,
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-h-[90%] min-w-[90%]">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center w-full">
            <h1 className="font-medium">{name}</h1>
            <div className="flex justify-center items-center gap-4">
              <Button onClick={() => setOpen(false)} variant={"outline"} size={"sm"}>
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                {t("label_go_back")}
              </Button>
              <Button variant={"default"} size={"sm"}>
                Use Template
              </Button>
            </div>
          </div>
          {isPending && (
            <div className="flex justify-center items-center flex-1">
              <LoaderIcon className="w-7 h-7 animate-spin" />
            </div>
          )}
          {isError && (
            <div className="flex justify-center items-center flex-1">
              <span>{t("err_generic")}</span>
            </div>
          )}
          {!isPending && !isError && <BlocksPreview blocks={data.blocks} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BlocksPreview = ({ blocks }: { blocks: ETemplate_block[] }) => {
  return (
    <div>
      <div>
        {blocks.map((block) => {
          return <div key={block.id}>{block.name}</div>;
        })}
      </div>
    </div>
  );
};

export default NewTemplatePreview;
