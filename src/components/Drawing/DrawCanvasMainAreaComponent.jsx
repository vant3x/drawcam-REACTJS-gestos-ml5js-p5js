import { useState, useContext, useRef, useEffect } from "react";
import p5 from "p5";
import appContext from "../../context/app/appContext";
import { Brush, Circle, Minus } from "lucide-react";
import ColorsControlComponent from "./Controls/ColorsControlComponent";
import CameraDrawContentComponent from "./CameraDrawContentComponent";

const brushes = [
  { name: "Pincel", icon: Brush, size: 5 },
  { name: "Lápiz", icon: Minus, size: 2 },
  { name: "Marcador", icon: Brush, size: 15 },
  { name: "Aerógrafo", icon: Circle, size: 25 },
];

export default function DrawCanvasAreaComponent() {
  const AppContext = useContext(appContext);
  const sketchRef = useRef();

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
    paintingRef,
  } = AppContext;

  useEffect(() => {
    if (!paintingRef) return;

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(550, 400).parent(sketchRef.current);
      };

      p.draw = () => {
        p.background(255);
        p.image(paintingRef, 0, 0);
      };
    };

    let p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
    };
  }, [paintingRef]);

  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* Canvas */}
        <div className="flex-1 bg-gray-700 p-4 overflow-auto">
          <div className="flex gap-4 h-full">
            <div
              className="bg-white rounded-lg shadow-2xl mx-autos  relative"
              style={{ width: "550px", height: "400px" }}
            >
              {/* Canvas simulado */}
              <div
                ref={sketchRef}
                className="w-full h-[100%] rounded-lg cursor-crosshair relative overflow-hidden"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top left",
                }}
                onMouseDown={() => setIsDrawing(true)}
                onMouseUp={() => setIsDrawing(false)}
              >
                {/* Simulación de dibujo */}
          
    

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

            <CameraDrawContentComponent />
          </div>
        </div>

        <ColorsControlComponent />
      </div>
    </>
  );
}
