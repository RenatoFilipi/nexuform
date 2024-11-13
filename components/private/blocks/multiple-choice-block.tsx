"use client";

import { Badge2 } from "@/components/ui/badge2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { setState } from "@/helpers/types";
import { BlockProps } from "@/models/form";
import useEditorStore from "@/stores/editor";
import { useQuery } from "@tanstack/react-query";
import { Tag, TagInput } from "emblor";
import { XIcon } from "lucide-react";
import { useState } from "react";

const MultipleChoiceBlock = ({
  block,
  setState,
}: {
  block: BlockProps;
  setState: setState<boolean>;
}) => {
  const { id } = block;
  const { updateBlock, removeBlock } = useEditorStore();
  const [localTags, setLocalTags] = useState<Tag[]>(block.options ?? []);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  useQuery({
    queryKey: [localTags],
    queryFn: () => {
      updateBlock(id, { ...block, options: localTags });
      return null;
    },
  });

  const removeTag = (id: string) => {
    console.log(id);
    const updatedTags = localTags.filter((tag) => tag.id !== id);
    setLocalTags(updatedTags);
  };

  return (
    <div className="h-full flex flex-col gap-8 pt-4 overflow-y-auto">
      <div className="flex justify-start items-center gap-3">
        <h1 className="text-xl font-semibold">Settings</h1>
        <Badge2 variant={"indigo"}>Multiple choice</Badge2>
      </div>
      <div className="h-full flex flex-col gap-4 overflow-y-auto">
        <div className="grid gap-1.5">
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
        <div className="grid gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={block.description ?? ""}
            onChange={(e) => {
              updateBlock(id, { ...block, description: e.target.value });
            }}
          />
        </div>
        <div className="grid gap-1.5 overflow-y-auto">
          <Label htmlFor="options">Options</Label>
          <div>
            <TagInput
              tags={localTags}
              setTags={(newTags) => {
                setLocalTags(newTags);
              }}
              placeholder="Add an option"
              styleClasses={{
                input: "w-full",
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
              inlineTags={false}
              direction="column"
              customTagRenderer={(tag) => (
                <div
                  key={tag.id}
                  className="rounded p-1 px-2 flex justify-between items-center border bg-foreground/5">
                  <span className="text-xs">{tag.text}</span>
                  <button onClick={() => removeTag(tag.id)}>
                    <XIcon className="w-3 h-3" />
                  </button>
                </div>
              )}
            />
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
      <div className="flex justify-between items-center">
        <Button
          onClick={() => {
            removeBlock(block.id);
            setState(false);
          }}
          variant={"destructive_outline"}
          size={"sm"}>
          Remove Block
        </Button>
        <Button
          onClick={() => setState(false)}
          variant={"secondary"}
          size={"sm"}
          className="w-full sm:w-fit">
          Close
        </Button>
      </div>
    </div>
  );
};

export default MultipleChoiceBlock;
