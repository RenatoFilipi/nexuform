export interface FormSubmissionItemProps {
  id: string;
  form_id: string;
  email: string;
  submitted_at: string;
}

const FormSubmissionItem = ({
  id,
  email,
  submitted_at,
  form_id,
}: FormSubmissionItemProps) => {
  return (
    <div>
      <span>{email}</span>
    </div>
  );
};

export default FormSubmissionItem;
