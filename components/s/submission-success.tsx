import useSubmissionStore from "@/stores/submission";
import { TColor } from "@/utils/types";
import SuccessDesign from "../private/blocks/success-design";

const SubmissionSuccess = () => {
  const { form, theme } = useSubmissionStore();

  return (
    <div className="flex w-full h-dvh p-6">
      <SuccessDesign
        brand={form.nebulaform_branding}
        color={theme.primary_color as TColor}
        preview={false}
        title={form.success_title}
        description={form.success_description}
      />
    </div>
  );
};

export default SubmissionSuccess;
