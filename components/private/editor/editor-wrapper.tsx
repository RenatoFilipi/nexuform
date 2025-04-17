"use client";

import useEditorStore from "@/stores/editor";
import useUserStore from "@/stores/user";
import { fallbackColor, minWidth640 } from "@/utils/constants";
import { EBlock, EForm, EProfile, ESubscription, ETheme } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMedia } from "react-use";
import EditorContent from "./editor-content";
import EditorContentMobile from "./editor-content-mobile";
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
  const isDesktop = useMedia(minWidth640);

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

      const primaryColor =
        props.theme.custom_primary_color.trim() !== "" ? props.theme.custom_primary_color : fallbackColor;

      editor.setTheme({
        ...props.theme,
        nebulaform_branding: props.subscription.plan !== "pro",
        custom_primary_color: primaryColor,
      });
      return null;
    },
  });

  return (
    <div className="flex w-full flex-1 gap-4 relative pt-12 max-h-dvh overflow-hidden">
      {query.isPending && (
        <div className="flex justify-center items-center w-full">
          <LoaderIcon className="w-6 h-6 animate-spin" />
        </div>
      )}
      {query.isError && <div className="flex justify-center items-center w-full">{t("err_generic")}</div>}
      {!query.isPending && !query.isError && isDesktop && (
        <div className="flex w-full flex-1">
          <EditorContent />
          <EditorTools />
        </div>
      )}
      {!query.isPending && !query.isError && !isDesktop && (
        <div className="flex w-full flex-1">
          <EditorContentMobile />
        </div>
      )}
    </div>
  );
};

export default EditorWrapper;
