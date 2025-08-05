import { templateColors } from "@/utils/constants";
import { CheckIcon } from "lucide-react";
import { HexColorPicker } from "react-colorful";

interface IProps {
  color: string;
  onColorChange: (value: string) => void;
  allowCustom: boolean;
}

const ColorPicker = ({ color, onColorChange, allowCustom }: IProps) => {
  return (
    <div className="flex flex-col gap-4">
      {allowCustom && <HexColorPicker color={color} onChange={onColorChange} />}
      <div className="grid grid-cols-10 gap-2">
        {templateColors.map((c, index) => (
          <button
            key={index}
            onClick={() => onColorChange(c)}
            className={`w-7 h-7 cursor-pointer rounded-full hover:scale-110 transition-transform border-2 flex justify-center items-center`}
            style={{ backgroundColor: c }}
            title={c}>
            {color === c && <CheckIcon className="w-3 h-3 text-white" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
