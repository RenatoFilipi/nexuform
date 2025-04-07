"use client";

import useEditorStore from "@/stores/editor";
import useUserStore from "@/stores/user";
import { EBlock, EForm, EProfile, ESubscription, ETheme } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { useTransition } from "react";
import EditorContent from "./editor-content";
import EditorTips from "./editor-tips";
import EditorTools from "./editor-tools";

interface Props {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
  profile: EProfile;
  subscription: ESubscription;
  locale: string;
  email: string;
}

const EditorWrapper = ({ form, theme, blocks, profile, subscription, locale, email }: Props) => {
  const editor = useEditorStore();
  const user = useUserStore();
  const [isPending, startTransition] = useTransition();

  const query = useQuery({
    queryKey: ["EditorData"],
    queryFn: () => {
      startTransition(() => {
        user.setLocale(locale);
        user.setEmail(email);
        user.setProfile(profile);
        user.setSubscription(subscription);
        editor.setForm(form);
        editor.setBlocks(blocks);
        editor.setBlocksReadyOnly(blocks);
        editor.setTheme({ ...theme, nebulaform_branding: subscription.plan !== "pro" });
      });
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="mt-12 flex w-full h-full flex-1 gap-4 relative">
      <div className="flex flex-1">
        {!isPending && !editor.preview && <EditorTools />}
        {!isPending && editor.blocks.length <= 0 && (
          <div className="flex justify-center items-center w-full sm:ml-[56px]">
            <EditorTips />
          </div>
        )}
        {!isPending && editor.blocks.length >= 1 && <EditorContent />}
      </div>
    </div>
  );
};

export default EditorWrapper;
