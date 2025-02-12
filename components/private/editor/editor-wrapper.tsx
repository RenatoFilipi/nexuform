"use client";

import useEditorStore from "@/stores/editor";
import useUserStore from "@/stores/user";
import {
  EBlock,
  EForm,
  EProfile,
  ESubscription,
  ETheme,
} from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { useTransition } from "react";
import EditorPreview from "./editor-preview";
import EditorPreviewGroup from "./editor-preview-group";
import EditorTips from "./editor-tips";
import EditorTools from "./editor-tools";

const EditorWrapper = ({
  form,
  theme,
  blocks,
  profile,
  subscription,
}: {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
  profile: EProfile;
  subscription: ESubscription;
}) => {
  const editorStore = useEditorStore();
  const userStore = useUserStore();
  const [isPending, startTransition] = useTransition();

  const query = useQuery({
    queryKey: ["EditorData"],
    queryFn: () => {
      startTransition(() => {
        editorStore.setForm(form);
        editorStore.setTheme(theme);
        editorStore.setBlocks(blocks);
        editorStore.setBlocksReadyOnly(blocks);
        userStore.setProfile(profile);
        userStore.setSubscription(subscription);
        if (subscription.plan !== "pro") {
          editorStore.setTheme({ ...theme, nebulaform_branding: true });
        }
      });
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  if (editorStore.preview)
    return (
      <div className="flex flex-col relative w-full overflow-y-auto h-full flex-1 mt-14">
        <div className="flex w-full h-full justify-center items-start bg-foreground/5">
          <EditorPreviewGroup />
        </div>
      </div>
    );

  return (
    <div className="flex flex-col relative w-full overflow-y-auto h-full flex-1 mt-14">
      <div className="flex flex-1 overflow-y-auto">
        <div className="sm:w-[380px] fixed top-0 h-screen pt-14 w-full">
          <EditorTools />
        </div>
        <div className="hidden sm:flex flex-1 overflow-y-auto justify-center items-center ml-[380px]">
          {!isPending && editorStore.blocks.length <= 0 && (
            <div className="flex justify-center items-center">
              <EditorTips />
            </div>
          )}
          {!isPending && editorStore.blocks.length >= 1 && <EditorPreview />}
        </div>
      </div>
    </div>
  );
};

export default EditorWrapper;
