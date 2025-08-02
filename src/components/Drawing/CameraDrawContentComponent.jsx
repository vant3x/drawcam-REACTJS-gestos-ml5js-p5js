import { useState, useContext, useRef, useEffect } from "react";
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
    cameraActive
  } = AppContext;

    // 1. Crea una referencia para el div de "Color"
    const colorDisplayRef = useRef(null);
    // 2. Estado para guardar las dimensiones y posición del div de "Color"
    const [colorDisplayRect, setColorDisplayRect] = useState(null);
    const canvasWrapperRef = useRef(null); 
  
   
  useEffect(() => {
    // Asegurarse de que ambas referencias existan antes de calcular
    if (colorDisplayRef.current && canvasWrapperRef.current) {
      const colorRect = colorDisplayRef.current.getBoundingClientRect();
      const wrapperRect = canvasWrapperRef.current.getBoundingClientRect();

      // Calcular las coordenadas del div de color RELATIVAS al contenedor base (700x494)
      setColorDisplayRect({
        x: colorRect.left - wrapperRect.left,
        y: colorRect.top - wrapperRect.top,
        width: colorRect.width,
        height: colorRect.height,
      });
    }
  }, [cameraActive, currentColor]);
  return (
    <>
       <div
            className="bg-white rounded-lg shadow-2xl mx-autos  relative"    ref={canvasWrapperRef} 
            style={{ width: "700px", height: "494px" }}
          >
        
            <div
              className="w-full h-[100%] rounded-lg cursor-crosshair relative overflow-hidden"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top left",
              }}
              onMouseDown={() => setIsDrawing(true)}
              onMouseUp={() => setIsDrawing(false)}
            >
              <CanvasCamera5Component
                zoom={zoom} />
              {/* Indicador de herramienta activa */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm w-[30%]" >
                Dibuja usando tu dedo indice y pulgar
              </div>

            {  /*

              color

              */}

{
  cameraActive && (
    <div ref={colorDisplayRef} 
  className={`absolute bottom-10 left-4 bg-opacity-50 px-3 py-1 rounded text-sm ${
    currentColor === '#ffffff' || 
    currentColor === 'white' || 
    currentColor === '#fff' || 
    currentColor === '#FFFFFF' || 
    currentColor === '#FFF' ||
    currentColor?.toLowerCase() === '#ffffff' ||
    currentColor?.toLowerCase() === '#fff' ||
    currentColor?.toLowerCase() === 'white'
      ? 'text-black' 
      : 'text-white'
  }`}
  style={{ backgroundColor: currentColor }}
>
                Color
              </div>
  )
}

              {/* Indicador de modo de gesto */}
              <div className="absolute top-4 right-4 bg-blue-600 bg-opacity-80 text-white px-3 py-1 rounded text-sm">
                Modo:{" "}
                Cámara
              </div>

              
            </div>
          </div>
    </>
  );
}
