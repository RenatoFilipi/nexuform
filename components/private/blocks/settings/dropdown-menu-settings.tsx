"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useEditorStore from "@/stores/editor";
import { EBlock } from "@/utils/entities";
import { TSetState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const DropdownMenuSettings = ({ block, setState }: { block: EBlock; setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const { id } = block;
  const { updateBlock, removeBlock } = useEditorStore();
  const [options, setOptions] = useState<string[]>(block.options ?? []);
  const [input, setInput] = useState("");

  useQuery({
    queryKey: [options],
    queryFn: () => {
      updateBlock(id, { ...block, options });
      return null;
    },
  });

  const onAddOption = () => {
    if (input === "".trim()) return;
    const check = options.find((x) => x.toLowerCase() === input.toLowerCase());
    if (check) return;
    const newOptions = [...options, input];
    setOptions(newOptions);
    updateBlock(id, { ...block, options: newOptions });
    setInput("");
  };
  const onDeleteOption = (value: string) => {
    const newOptions = options.filter((opt) => opt !== value);
    setOptions(newOptions);
    updateBlock(id, { ...block, options: newOptions });
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex justify-center sm:justify-start items-center gap-3">
        <Badge variant={"primary"} uppercase>
          {t("label_dropdown_menu")}
        </Badge>
      </div>
      <div className="h-full flex flex-col gap-8 overflow-y-auto pr-4">
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="name">{t("label_block_name")}</Label>
            <span className="text-xs text-foreground/60">{t("desc_block_name")}</span>
          </div>
          <Input
            type="text"
            id="name"
            value={block.name}
            onChange={(e) => {
              updateBlock(id, { ...block, name: e.target.value });
            }}
          />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="description">{t("label_block_desc")}</Label>
            <span className="text-xs text-foreground/60">{t("desc_block_desc")}</span>
          </div>
          <Textarea
            id="description"
            value={block.description ?? ""}
            onChange={(e) => {
              updateBlock(id, { ...block, description: e.target.value });
            }}
          />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="options">{t("label_block_options")}</Label>
            <span className="text-xs text-foreground/60">{t("desc_block_options")}</span>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto">
            <div className="flex justify-center items-center gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} />
              <Button size={"icon"} variant={"outline"} onClick={onAddOption}>
                <PlusIcon />
              </Button>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto">
              {options.map((opt, index) => {
                return (
                  <div key={index} className="bg-foreground/5 p-1 flex justify-between items-center px-2">
                    <span className="text-xs">{opt}</span>
                    <button
                      onClick={() => {
                        onDeleteOption(opt);
                      }}>
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="grid gap-1">
            <Label htmlFor="required">{t("label_block_required")}</Label>
            <p className="text-xs text-foreground/60">{t("desc_block_required")}</p>
          </div>
          <Switch
            id="required"
            checked={block.required}
            onCheckedChange={(checked: boolean) => {
              updateBlock(id, { ...block, required: checked });
            }}
          />
        </div>
      </div>
      <div className="flex justify-between gap-4 items-center flex-col sm:flex-row">
        <Button
          onClick={() => {
            removeBlock(block.id);
            setState(false);
          }}
          variant={"destructive_outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          {t("label_remove_block")}
        </Button>
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          {t("label_close")}
        </Button>
      </div>
    </div>
  );
};

export default DropdownMenuSettings;
