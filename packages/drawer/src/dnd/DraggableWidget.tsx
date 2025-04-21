import type { PropsWithChildren, FC } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { IWidget } from "@metaflux/core";

type DraggableWidgetProps = PropsWithChildren<{
  widget: IWidget;
}>;

const DraggableWidget: FC<DraggableWidgetProps> = ({ widget, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: widget.widgetId,
    data: widget,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

export default DraggableWidget;
