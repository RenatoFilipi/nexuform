import usePublicStore from "@/stores/public";
import SuccessDesign from "../../private/design/success-design";

const SubmissionSuccess = () => {
  const { form, theme } = usePublicStore();

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
