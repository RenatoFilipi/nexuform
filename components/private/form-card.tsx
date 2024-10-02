import { Card } from "../ui/card";

interface Props {
  title: string;
}

const FormCard = ({ title }: Props) => {
  return <Card className="flex h-40 p-4">{title}</Card>;
};

export default FormCard;
