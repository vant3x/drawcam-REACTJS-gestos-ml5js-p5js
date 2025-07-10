import { useState, useContext } from "react";
import appContext from "./../../context/app/appContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Brush,
  Circle,
  Minus,
} from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import ToolsPanelContainer from "./Controls/ToolsPanelContainer";
import LayersArea from "./Controls/LayersArea";
import LeftToolControlComponent from "./Controls/LeftControlComponent";
import ColorsControlComponent from "./Controls/ColorsControlComponent";
import RightPanelControlComponent from "./Controls/RightControlPanelComponent";

const brushes = [
  { name: "Pincel", icon: Brush, size: 5 },
  { name: "Lápiz", icon: Minus, size: 2 },
  { name: "Marcador", icon: Brush, size: 15 },
  { name: "Aerógrafo", icon: Circle, size: 25 },
];

export default function HandPoseDrawingUIContainer() {
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
    isDrawing
  } = AppContext;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Barra de herramientas superior */}

      <ToolsPanelContainer currentTool={currentTool} />
      <div className="flex flex-1">
        {/* Panel izquierdo - Herramientas */}
        <LeftToolControlComponent />

        {/* Área principal */}
        <div className="flex-1 flex flex-col">
          {/* Canvas */}
          <div className="flex-1 bg-gray-700 p-4 overflow-auto">
            <div
              className="bg-white rounded-lg shadow-2xl mx-auto relative"
              style={{ width: "1200px", height: "680px" }}
            >
              {/* Canvas simulado */}
              <div
                className="w-full h-full rounded-lg cursor-crosshair relative overflow-hidden"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top left",
                }}
                onMouseDown={() => setIsDrawing(true)}
                onMouseUp={() => setIsDrawing(false)}
              >
                {/* Simulación de dibujo */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 100 200 Q 200 100 300 200 T 500 200"
                    stroke={currentColor}
                    strokeWidth={brushSize[0]}
                    fill="none"
                    strokeLinecap="round"
                    opacity={brushOpacity[0] / 100}
                  />
                  <circle
                    cx="600"
                    cy="300"
                    r="50"
                    stroke={currentColor}
                    strokeWidth={brushSize[0]}
                    fill="none"
                    opacity={brushOpacity[0] / 100}
                  />
                  <text
                    x="200"
                    y="500"
                    fontSize="48"
                    fill={currentColor}
                    opacity={brushOpacity[0] / 100}
                  >
                    Hola Mundo
                  </text>
                </svg>

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
          </div>

          {/* Barra inferior - Colores */}
          <ColorsControlComponent />
        </div>

        {/* Panel derecho */}
        <RightPanelControlComponent/>        
      </div>
    </div>
  );
}
