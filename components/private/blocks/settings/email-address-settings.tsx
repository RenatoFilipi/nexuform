"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useEditorStore from "@/stores/editor";
import { EBlock } from "@/utils/entities";
import { TSetState } from "@/utils/types";
import { CircleHelpIcon } from "lucide-react";
import { useState } from "react";

const EmailAddressSettings = ({
  block,
  setState,
}: {
  block: EBlock;
  setState: TSetState<boolean>;
}) => {
  const { id } = block;
  const { updateBlock, removeBlock, blocks } = useEditorStore();
  const [isIdentifierAvailable] = useState(
    blocks.some((e) => e.is_identifier === true && e.id !== id)
  );

  return (
    <div className="h-full flex flex-col gap-8 overflow-y-auto">
      <div className="flex justify-center sm:justify-start items-center gap-3">
        <Badge variant={"indigo"} uppercase>
          Email Address
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
        <div className="grid gap-3">
          <Label htmlFor="placeholder">Placeholder</Label>
          <Input
            id="placeholder"
            value={block.placeholder ?? ""}
            onChange={(e) => {
              updateBlock(id, { ...block, placeholder: e.target.value });
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
        {!isIdentifierAvailable && (
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center gap-2">
              <Label htmlFor="identifier">Mark as Identifier</Label>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <CircleHelpIcon className="w-4 h-4 text-foreground/80" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      When enabled, this block will be used as an identifier{" "}
                      <br /> for specific actions or configurations.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              id="identifier"
              checked={block.is_identifier}
              onCheckedChange={(checked: boolean) => {
                updateBlock(id, { ...block, is_identifier: checked });
              }}
            />
          </div>
        )}
      </div>
      <div className="flex justify-between gap-4 items-center flex-col sm:flex-row">
        <Button
          onClick={() => setState(false)}
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          Close
        </Button>
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
      </div>
    </div>
  );
};

export default EmailAddressSettings;
