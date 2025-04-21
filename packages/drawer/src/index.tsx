import { DndContext } from "@dnd-kit/core";

/**
 * Drawer component for MetaFlux
 * @returns
 */
const MetaFluxDrawer = () => {
  return (
    <div>
      <DndContext>
        {/* Widgets Panel */}
        <div>
          <header>Widgets</header>
          <main>{/* default widgets */}</main>
        </div>
        {/* Canvas Panel */}
        <div>
          <header>Canvas</header>
          <main>canvas</main>
        </div>
        {/* Properties Panel */}
        <div>
          <header>Properties</header>
          <main>{/* default properties */}Properties</main>
        </div>
      </DndContext>
    </div>
  );
};

export default MetaFluxDrawer;
