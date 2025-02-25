import { NewSubmissionEmailTemplate } from "@/components/emails/new-submission";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "New Submission",
    react: await NewSubmissionEmailTemplate({ form: "" }),
  });

  if (error) {
    return res.status(400).json(error);
  }
  res.status(200).json(data);
};
