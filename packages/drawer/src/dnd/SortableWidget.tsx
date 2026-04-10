import type { PropsWithChildren, FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableWidgetProps = PropsWithChildren<{
  id: string;
  idx: number;
  setFocus: (idx: number) => void;
}>;

const SortableWidget: FC<SortableWidgetProps> = ({
  id,
  children,
  idx,
  setFocus,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => setFocus(idx)}
    >
      {children}
    </div>
  );
};

export default SortableWidget;
