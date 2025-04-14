import { tailwindColors } from "@/utils/constants";
import { HexColorPicker } from "react-colorful";

const ColorPicker = ({
  color,
  onColorChange,
  allowCustom,
}: {
  color: string;
  onColorChange: (value: string) => void;
  allowCustom: boolean;
}) => {
  return (
    <div>
      {allowCustom && <HexColorPicker color={color} onChange={onColorChange} />}
      <div className="grid grid-cols-10 gap-2">
        {tailwindColors.map((color, index) => (
          <button
            key={index}
            onClick={() => onColorChange(color)}
            className="w-6 h-6 rounded cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
