import useSubmissionStore from "@/stores/submission";
import { TColor } from "@/utils/types";
import SuccessDesign from "../../private/blocks/success-design";

const SubmissionSuccess = () => {
  const { form, theme } = useSubmissionStore();

  return (
    <SuccessDesign
      brand={form.nebulaform_branding}
      color={theme.custom_primary_color as TColor}
      preview={false}
      title={form.success_title}
      description={form.success_description}
    />
  );
};

export default SubmissionSuccess;
