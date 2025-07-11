import { useState, useContext } from "react";
import appContext from "./../../context/app/appContext";
import { Brush, Circle, Minus } from "lucide-react";
import ColorsControlComponent from "./Controls/ColorsControlComponent";
import CanvasCamera5Component from "./CanvasML/CanvasCamMLComponent";

const brushes = [
  { name: "Pincel", icon: Brush, size: 5 },
  { name: "Lápiz", icon: Minus, size: 2 },
  { name: "Marcador", icon: Brush, size: 15 },
  { name: "Aerógrafo", icon: Circle, size: 25 },
];

export default function CameraDrawContentComponent() {
  const AppContext = useContext(appContext);

  const {
    currentTool,
    currentColor,
    brushSize,
    brushOpacity,
    currentBrush,
    gestureMode,
    zoom,
    setIsDrawing,
    isDrawing,
  } = AppContext;
  return (
    <>
       <div
            className="bg-white rounded-lg shadow-2xl mx-autos  relative"
            style={{ width: "700px", height: "500px" }}
          >
            {/* Canvas simulado */}
            <div
              className="w-full h-[100%] rounded-lg cursor-crosshair relative overflow-hidden"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top left",
              }}
              onMouseDown={() => setIsDrawing(true)}
              onMouseUp={() => setIsDrawing(false)}
            >
              {/* Simulación de dibujo */}
              <CanvasCamera5Component/>
              {/* Indicador de herramienta activa */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                {currentTool === "brush" &&
                  `Pincel ${brushes[currentBrush].name}`}
                {currentTool === "eraser" && "Borrador"}
                {currentTool === "text" && "Texto"}
                {currentTool === "rectangle" && "Rectángulo"}
                {currentTool === "circle" && "Círculo"}
                {currentTool === "3d" && "Editor 3D"}
                {currentTool === "move" && "Mover"}
              </div>

              {/* Indicador de modo de gesto */}
              <div className="absolute top-4 right-4 bg-blue-600 bg-opacity-80 text-white px-3 py-1 rounded text-sm">
                Modo:{" "}
                {gestureMode === "draw"
                  ? "Dibujo"
                  : gestureMode === "navigate"
                  ? "Navegación"
                  : "Color"}
              </div>
            </div>
          </div>
    </>
  );
}
