interface IProps {
  numeric: boolean;
  uppercase: boolean;
  name: string;
  description: string | null;
  required: boolean;
  position: number;
}

const BlockHeaderDesign = ({ name, description, numeric, uppercase, required, position }: IProps) => {
  return (
    <div className="grid gap-1">
      <div className="flex gap-2 justify-start items-center">
        {numeric && <span className="text-sm">{position}.</span>}
        <h1 className={`${uppercase && "uppercase"} text-sm font-semibold`}>
          {name} {required && <span className="text-destructive">*</span>}
        </h1>
      </div>
      {description && <span className="text-xs text-muted-foreground">{description}</span>}
    </div>
  );
};

export default BlockHeaderDesign;
