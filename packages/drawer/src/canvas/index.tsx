import { useEffect, useMemo, useState } from "react";
import type { FC } from "react";
import { Button, Empty, Form, Spin, Typography } from "antd";
import { nanoid } from "nanoid";
import { useTranslation } from "react-i18next";

import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { IWidget, IWidgetBase } from "@metaflux/core";
import { DraggableWidget, DroppableArea, SortableWidget } from "../dnd";
import RenderExampleWidget from "./RenderExampleWidget";
import WidgetPropertiesPanel from "../properties";
import { useDrawerStore } from "../store";
import { DRAWER_I18N_NS } from "../i18n";
import styles from "../styles/drawer.less";

const { Title, Text } = Typography;

export interface CanvasProps {
  sectionIndex: number;
  availableWidgets?: IWidgetBase[];
  loading?: boolean;
}

const Canvas: FC<CanvasProps> = ({
  sectionIndex,
  availableWidgets = [],
  loading = false,
}) => {
  const { t } = useTranslation(DRAWER_I18N_NS);
  const [isDroppedAreaEmpty, setIsDroppedAreaEmpty] = useState(true);
  const [focusedWidgetId, setFocusedWidgetId] = useState<string>();

  const { widgets, getSectionWidgets, updateSectionWidgets } = useDrawerStore();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 3 } }),
  );

  const renderQueue = useMemo(
    () => getSectionWidgets(sectionIndex) ?? [],
    [widgets, sectionIndex],
  );

  useEffect(() => {
    setIsDroppedAreaEmpty(renderQueue.length === 0);
  }, [renderQueue]);

  function initWidgetItem(data: IWidgetBase): IWidget {
    const id = `widget_${nanoid()}`;
    return {
      ...JSON.parse(JSON.stringify(data)),
      widgetId: id,
      defaultValue: "",
    };
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    if (
      !active.id.toString().startsWith("widget_") &&
      over.id === "droppable-area"
    ) {
      const widget = initWidgetItem(active.data.current as IWidgetBase);
      updateSectionWidgets(sectionIndex, [...renderQueue, widget]);
      setFocusedWidgetId(widget.widgetId);
    } else if (active.id !== over.id) {
      if (!active.id.toString().startsWith("widget_")) {
        const idx = renderQueue.findIndex(
          (item) => item.widgetId === over.id,
        );
        const widget = initWidgetItem(active.data.current as IWidgetBase);
        updateSectionWidgets(sectionIndex, [
          ...renderQueue.slice(0, idx),
          widget,
          ...renderQueue.slice(idx),
        ]);
        setFocusedWidgetId(widget.widgetId);
      } else {
        updateSectionWidgets(sectionIndex, () => {
          const activeIdx = renderQueue.findIndex(
            (item) => item.widgetId === active.id,
          );
          const overIdx = renderQueue.findIndex(
            (item) => item.widgetId === over.id,
          );
          setFocusedWidgetId(renderQueue[activeIdx].widgetId);
          return arrayMove(renderQueue, activeIdx, overIdx);
        });
      }
    }
  }

  return (
    <div className={styles["panel-container"]}>
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <div className={styles["widgets-panel"]}>
          <header>
            <Title level={5}>{t("widgets")}</Title>
          </header>
          <main>
            {loading && <Spin tip={t("loadingWidgets")} />}
            {availableWidgets.map((t_widget) => (
              <DraggableWidget key={t_widget.fieldKey} widget={t_widget}>
                <Button
                  type="dashed"
                  size="small"
                  style={{ width: "100%", height: "45px" }}
                  onClick={() => {
                    const data = initWidgetItem(t_widget);
                    updateSectionWidgets(sectionIndex, [
                      ...renderQueue,
                      data,
                    ]);
                    setFocusedWidgetId(data.widgetId);
                  }}
                >
                  <Text ellipsis style={{ width: 90 }}>
                    {t_widget.label}
                  </Text>
                </Button>
              </DraggableWidget>
            ))}
          </main>
        </div>

        <div className={styles["form-design-panel"]}>
          <header>
            <Title level={5}>{t("formDesign")}</Title>
          </header>
          <main>
            <DroppableArea>
              {isDroppedAreaEmpty ? (
                <Empty description={t("dragWidgetsHint")} />
              ) : (
                <SortableContext
                  items={renderQueue.map((item) => item.widgetId)}
                  strategy={verticalListSortingStrategy}
                >
                  <Form labelCol={{ span: 6 }}>
                    {renderQueue.map((item, idx) => (
                      <SortableWidget
                        key={item.widgetId}
                        id={item.widgetId}
                        idx={idx}
                        setFocus={() => setFocusedWidgetId(item.widgetId)}
                      >
                        <Form.Item
                          label={item.label}
                          className={styles.item}
                          style={{
                            backgroundColor:
                              focusedWidgetId === item.widgetId
                                ? "#f0f5ff"
                                : "transparent",
                            outline:
                              focusedWidgetId === item.widgetId
                                ? "1px solid #d6e4ff"
                                : "none",
                          }}
                        >
                          <RenderExampleWidget item={item} />
                        </Form.Item>
                      </SortableWidget>
                    ))}
                  </Form>
                </SortableContext>
              )}
            </DroppableArea>
          </main>
        </div>

        <div className={styles["widget-properties-panel"]}>
          <header>
            <Title level={5}>{t("properties")}</Title>
          </header>
          <main>
            {!focusedWidgetId && (
              <Empty description={t("selectWidgetHint")} />
            )}
            {focusedWidgetId && (
              <WidgetPropertiesPanel
                sectionIndex={sectionIndex}
                widgetId={focusedWidgetId}
                handleResetWidgetId={() => setFocusedWidgetId("")}
              />
            )}
          </main>
        </div>
      </DndContext>
    </div>
  );
};

export default Canvas;
