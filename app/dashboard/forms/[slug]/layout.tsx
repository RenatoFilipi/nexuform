import FormNav from "@/components/private/form/form-nav";

const FormLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 mt-14 mb-14 sm:mb-0 flex flex-col h-dvh">
      <FormNav />
      <div className="px-2 sm:px-52 pt-8">{children}</div>
    </div>
  );
};

export default FormLayout;
