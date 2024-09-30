import { Card } from "../ui/card";

interface Props {
  title: string;
}

const FormCard = ({ title }: Props) => {
  return <Card className="p-3 flex justify-center items-center h-40">{title}</Card>;
};

export default FormCard;
