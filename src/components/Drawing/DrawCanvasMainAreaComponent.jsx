import { useState, useContext, useRef, useEffect } from "react";
import p5 from "p5";
import appContext from "../../context/app/appContext";
import { Brush, Circle, Minus, AudioLines } from "lucide-react";
import ColorsControlComponent from "./Controls/ColorsControlComponent";
import CameraDrawContentComponent from "./CameraDrawContentComponent";
import VoiceControlOptions from "./Controls/VoiceControlOptions";

const brushes = [
  { name: "Pincel", icon: Brush, size: 5 },
  { name: "Lápiz", icon: Minus, size: 2 },
  { name: "Marcador", icon: Brush, size: 15 },
  { name: "Aerógrafo", icon: Circle, size: 25 },
];

export default function DrawCanvasAreaComponent({ onActivateVoice, onDeactivateVoice, isVoiceActive, voiceControlRef }) {
  const AppContext = useContext(appContext);
  const sketchRef = useRef();

VoiceControlOptions


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
      // Dimensiones del canvas original y destino
      const originalWidth = 700;
      const originalHeight = 490;
      const targetWidth = 550;
      const targetHeight = 400;
      
      // Calcular factor de escala manteniendo proporción
      const scaleX = targetWidth / originalWidth;
      const scaleY = targetHeight / originalHeight;
      const scale = Math.min(scaleX, scaleY); // Usar el menor para mantener proporción
      
      // Dimensiones escaladas
      const scaledWidth = originalWidth * scale;
      const scaledHeight = originalHeight * scale;
      
      // Offsets para centrar
      const offsetX = (targetWidth - scaledWidth) / 2;
      const offsetY = (targetHeight - scaledHeight) / 2;

      p.setup = () => {
        p.createCanvas(targetWidth, targetHeight).parent(sketchRef.current);
      };

      p.draw = () => {
        p.background(255);
        
        if (paintingRef) {
          p.push();
          p.translate(offsetX, offsetY);
          p.scale(scale);
          p.image(paintingRef, 0, 0);
          p.pop();
        }
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
              className="bg-white rounded-lg shadow-2xl mx-autos  relative "
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
                <VoiceControlOptions  ref={voiceControlRef} />



        </div>

        <ColorsControlComponent />
      </div>
    </>
  );
}
