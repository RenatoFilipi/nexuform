"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { setState } from "@/helpers/types";
import { BlockProps } from "@/models/form";
import useEditorStore from "@/stores/editor";

const LongAnswerBlock = ({
  block,
  setState,
}: {
  block: BlockProps;
  setState: setState<boolean>;
}) => {
  const { id } = block;
  const { updateBlock, removeBlock } = useEditorStore();

  return (
    <div className="h-full flex flex-col gap-8 pt-4">
      <div className="flex justify-start items-center gap-3">
        <h1 className="text-xl font-semibold">Settings</h1>
        <Badge variant={"indigo"}>Long answer</Badge>
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
        <div className="grid gap-1.5">
          <Label htmlFor="max-character-limit">Max character limit</Label>
          <Input
            type="number"
            id="max-character-limit"
            value={block.max_character_limit ?? 100}
            onChange={(e) =>
              updateBlock(id, {
                ...block,
                max_character_limit: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="show-character-limit">Show character limit</Label>
          <Switch
            id="show-character-limit"
            checked={block.show_character_limit ?? false}
            onCheckedChange={(checked: boolean) => {
              updateBlock(id, { ...block, show_character_limit: checked });
            }}
          />
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
      <div className="flex justify-between gap-4 items-center">
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

export default LongAnswerBlock;
