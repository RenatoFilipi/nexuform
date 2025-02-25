import * as React from "react";

interface IProps {
  form: string;
}

export const NewSubmissionEmailTemplate: React.FC<Readonly<IProps>> = ({ form }) => {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-xl font-bold text-gray-900">🎉 New Submission Received!</h1>
      <p className="mt-4 text-gray-700">
        You just received a new submission for your form:
        <span className="font-semibold text-blue-600"> {form}</span>
      </p>
      <p className="mt-2 text-gray-600">Check your submissions to review the details.</p>
    </div>
  );
};
