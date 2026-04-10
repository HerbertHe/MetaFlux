import type { PropsWithChildren } from "react";
import { useDroppable } from "@dnd-kit/core";

export default function DroppableArea(props: PropsWithChildren) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable-area",
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: isOver ? "#f5f5f5" : "transparent",
        padding: "10px",
        height: "100%",
      }}
    >
      {props.children}
    </div>
  );
}
