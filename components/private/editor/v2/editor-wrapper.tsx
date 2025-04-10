"use client";

import useEditorStore from "@/stores/editor";
import useUserStore from "@/stores/user";
import { EBlock, EForm, EProfile, ESubscription, ETheme } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import EditorContent from "./editor-content";
import EditorTools from "./editor-tools";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  subscription: ESubscription;
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
}

const EditorWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const editor = useEditorStore();
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["editorData"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      user.setSubscription(props.subscription);
      editor.setForm(props.form);
      editor.setTheme(props.theme);
      editor.setBlocks(props.blocks);
      editor.setBlocksReadyOnly(props.blocks);
      editor.setTheme({ ...props.theme, nebulaform_branding: props.subscription.plan !== "pro" });
      return null;
    },
  });

  return (
    <div className="mt-12 flex w-full h-full flex-1 gap-4 relative">
      {query.isPending && (
        <div className="flex justify-center items-center w-full">
          <LoaderIcon className="w-6 h-6 animate-spin" />
        </div>
      )}
      {query.isError && <div className="flex justify-center items-center w-full">{t("err_generic")}</div>}
      {!query.isPending && !query.isError && (
        <div className="flex w-full flex-1 relative">
          <EditorContent />
          <EditorTools />
        </div>
      )}
    </div>
  );
};

export default EditorWrapper;
