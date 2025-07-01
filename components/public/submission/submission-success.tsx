import useSubmissionStore from "@/stores/submission";
import SuccessDesign from "../../private/shared/blocks-design/success-design";

const SubmissionSuccess = () => {
  const { form, theme } = useSubmissionStore();

  return (
    <SuccessDesign
      brand={theme.app_branding}
      color={theme.custom_primary_color}
      preview={false}
      title={form.success_title}
      description={form.success_description}
    />
  );
};

export default SubmissionSuccess;
