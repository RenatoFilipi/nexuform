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

const ShortTextSettings = ({ block, setState }: { block: EBlock; setState: TSetState<boolean> }) => {
  const { id } = block;
  const { updateBlock, removeBlock } = useEditorStore();

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex justify-center sm:justify-start items-center gap-3">
        <Badge variant={"primary"} uppercase>
          Short Text
        </Badge>
      </div>
      <div className="h-full flex flex-col gap-8 overflow-y-auto pr-4">
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="name">Name</Label>
            <span className="text-xs text-foreground/60">The label displayed above the input field.</span>
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
            <Label htmlFor="description">Description</Label>
            <span className="text-xs text-foreground/60">
              Additional information displayed below the input to guide the user.
            </span>
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
            <Label htmlFor="placeholder">Placeholder</Label>
            <span className="text-xs text-foreground/60">
              A hint text inside the input field before the user types.
            </span>
          </div>
          <Input
            type="text"
            id="placeholder"
            value={block.placeholder ?? ""}
            onChange={(e) => {
              updateBlock(id, { ...block, placeholder: e.target.value });
            }}
          />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="max-character-limit">Max character limit</Label>
            <span className="text-xs text-foreground/60">
              Set the maximum number of characters allowed in this field.
            </span>
          </div>
          <Input
            type="number"
            id="max-character-limit"
            value={block.max_char ?? 100}
            onChange={(e) =>
              updateBlock(id, {
                ...block,
                max_char: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="grid gap-1">
            <Label htmlFor="show-character-limit">Show character limit</Label>
            <p className="text-xs text-foreground/60">
              If enabled, a character counter will be displayed below the field.
            </p>
          </div>
          <Switch
            id="show-character-limit"
            checked={block.show_char ?? false}
            onCheckedChange={(checked: boolean) => {
              updateBlock(id, { ...block, show_char: checked });
            }}
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="grid gap-1">
            <Label htmlFor="required">Required</Label>
            <p className="text-xs text-foreground/60">If enabled, users must fill out this field before submitting.</p>
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
          Remove Block
        </Button>
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          Close
        </Button>
      </div>
    </div>
  );
};

export default ShortTextSettings;
