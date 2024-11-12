import { BlockProps } from "@/models/form";
import useEditorStore from "@/stores/editor";
import Block from "../blocks/block";

const BlocksGroup = ({ blocks }: { blocks: BlockProps[] }) => {
  const { setBlocks } = useEditorStore();

  return (
    <div className="w-full flex flex-col items-center justify-start gap-2">
      {blocks.map((block) => (
        <div
          key={block.id}
          className="flex justify-center items-center gap-2 w-full">
          <Block {...block} />
        </div>
      ))}
    </div>
  );
};

export default BlocksGroup;
