"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BlockProps } from "@/models/form";

const ShortAnswerBlock = ({ block }: { block: BlockProps }) => {
  return (
    <div className="h-full flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Settings</h1>
      <div className="h-full flex flex-col gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="max-character-limit">Max character limit</Label>
          <Input type="number" id="max-character-limit" />
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="show-character-limit">Show character limit</Label>
          <Switch id="show-character-limit" />
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="required">Required</Label>
          <Switch id="required" />
        </div>
      </div>
      <div className="flex justify-end items-center">
        <Button variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          Close
        </Button>
      </div>
    </div>
  );
};

export default ShortAnswerBlock;
