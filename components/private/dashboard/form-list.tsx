"use client";

import { EForm } from "@/utils/entities";
import FormCard from "./form-card";

const FormList = ({ forms }: { forms: EForm[] }) => {
  if (forms.length === 0) {
    return (
      <div className="flex justify-center items-center h-full flex-1">
        <div className="flex flex-col justify-center items-center gap-3">
          <span className="text-lg font-medium">No form to show</span>
          <span className="text-sm text-center">
            Create your very first form and start collecting responses
            effortlessly.
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </div>
  );
};

export default FormList;
