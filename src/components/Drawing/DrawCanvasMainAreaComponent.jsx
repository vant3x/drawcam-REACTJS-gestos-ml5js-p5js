import { useState, useContext, useRef, useEffect } from "react";
import p5 from "p5";
import appContext from "../../context/app/appContext";
import { Brush, Circle, Minus, AudioLines } from "lucide-react";
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

          <div className="absolute w-[20%] bottom-52 border border-gray-950 px-6 py-4 mt-4">
              <h3 className="flex text-bold font-bold text-white">Controles por voz <AudioLines className="ml-2 mr-2"/></h3>
              <ul className="ml-10 mt-4 list-disc">
                <li>Cambiar tamaño</li>
                <li>Cambiar Color</li>
                <li>Activar Transcripción</li>
                <li>Generar Imagen de boceto</li>
                <li>Bloquear capa y activar seguimiento</li>
                <li>Descargar dibujo</li>
                <li>Limpiar canvas</li>
              </ul>
            </div>


        </div>

        <ColorsControlComponent />
      </div>
    </>
  );
}
