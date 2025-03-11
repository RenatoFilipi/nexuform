import useEditorStore from "@/stores/editor";
import { TColor } from "@/utils/types";
import SuccessDesign from "../blocks/success-design";

const EditorPreviewSuccess = () => {
  const { form, theme } = useEditorStore();

  return (
    <SuccessDesign
      brand={form.nebulaform_branding}
      color={theme.primary_color as TColor}
      preview
      title={form.success_title}
      description={form.success_description}
    />
  );
};

export default EditorPreviewSuccess;
