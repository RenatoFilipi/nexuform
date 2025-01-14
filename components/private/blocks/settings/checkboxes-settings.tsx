"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useEditorStore from "@/stores/editor";
import { EBlock } from "@/utils/entities";
import { uuid } from "@/utils/functions";
import { setState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useState } from "react";

const CheckboxesSettings = ({
  block,
  setState,
}: {
  block: EBlock;
  setState: setState<boolean>;
}) => {
  const { id } = block;
  const { updateBlock, removeBlock } = useEditorStore();
  const [options, setOptions] = useState<string[]>(block.options ?? []);
  const [optionValue, setOptionValue] = useState("");

  useQuery({
    queryKey: [options],
    queryFn: () => {
      updateBlock(id, { ...block, options });
      return null;
    },
  });

  const onAddOption = () => {
    const id = uuid();
    const option = `${id}---${optionValue}`;
    const optionsCollection = [...options, option];
    setOptions(optionsCollection);
  };
  const onDeleteOption = (value: string) => {};

  return (
    <div className="h-full flex flex-col gap-8 overflow-y-auto">
      <div className="flex justify-center sm:justify-start items-center gap-3">
        <Badge variant={"indigo"} uppercase>
          Checkboxes
        </Badge>
      </div>
      <div className="h-full flex flex-col gap-4 overflow-y-auto">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
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
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={block.description ?? ""}
            onChange={(e) => {
              updateBlock(id, { ...block, description: e.target.value });
            }}
          />
        </div>
        <div className="grid gap-3 overflow-y-auto">
          <Label htmlFor="options">Options</Label>
          <div className="flex flex-col overflow-y-auto gap-3">
            <div className="flex justify-center items-center gap-4">
              <Input
                value={optionValue}
                onChange={(e) => {
                  setOptionValue(e.target.value);
                }}
              />
              <Button
                variant={"secondary"}
                size={"sm"}
                onClick={() => {
                  onAddOption();
                  setOptionValue("");
                }}>
                Add Option
              </Button>
            </div>
            <div className="flex flex-col gap-2 w-full overflow-y-auto">
              {options.map((opt) => {
                const section = opt.split("---");
                const id = section[0];
                const value = section[1];
                return (
                  <div
                    key={id}
                    className="flex justify-between items-center bg-foreground/5 rounded px-2 py-1">
                    <span className="text-xs">{value}</span>
                    <button
                      onClick={() => {
                        onDeleteOption(opt);
                      }}>
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="required">Required</Label>
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
          Remove Block
        </Button>
        <Button
          onClick={() => setState(false)}
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          Close
        </Button>
      </div>
    </div>
  );
};

export default CheckboxesSettings;
