import { useState, useContext } from "react"
import { Button } from "../../ui/button"
import { Slider } from "../../ui/slider"
import { Badge } from "../../ui/badge"
import { Separator } from "../../ui/separator"
import {
  Brush,
  Eraser,
  Camera,
  Type,
  Download,
  Upload,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Move,
  Square,
  Circle,
  Pyramid

} from "lucide-react"
import { Alert, AlertDescription } from "../../ui/alert"
import { Textarea } from "../../ui/textarea";
import appContext from "./../../../context/app/appContext";


export default function ToolsPanelContainer({currentTool})  {

  const AppContext = useContext(appContext);

  const { cameraActive, zoom, setCurrentTool, setZoom, paintingRef } = AppContext;


  const downloadImage = (image) => {
    if (!paintingRef ||  !paintingRef.canvas) {
      console.error("La referencia al canvas de dibujo no está disponible.");
      alert("No hay nada que descargar todavía.");
      return;
    }

    const base64Image = paintingRef.canvas.toDataURL("image/png");

    // -> Aquí tienes el base64 que también solicitaste. Puedes usarlo como necesites.
    console.log("Imagen en Base64:", base64Image);

    const link = document.createElement("a");
    link.href = base64Image;
    link.download =`dibujo_${new Date().getTime()}.png`; 

    // 4. Simulamos un clic en el enlace para descargar y lo removemos
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  

    return (

        
        <>
      <div className="bg-gray-800 border-b border-gray-700 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
    { /*       <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
              <Upload className="h-4 w-4" />
    </Button>*/}
            <Button onClick={()=> downloadImage()} variant="ghost" size="sm" className="text-white hover:bg-gray-700">
            Descargar dibujo  <Download className="h-4 w-4" />
            </Button>

            
            <Separator orientation="vertical" className="h-6 bg-gray-600" />
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
              <Redo className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 bg-gray-600" />
            <Button
              variant={currentTool === "move" ? "default" : "ghost"}
              size="sm"
              className="text-white hover:bg-gray-700"
              onClick={() => setCurrentTool("move")}
            >
              <Move className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "brush" ? "default" : "ghost"}
              size="sm"
              className="text-white hover:bg-gray-700"
              onClick={() => setCurrentTool("brush")}
            >
              <Brush className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "eraser" ? "default" : "ghost"}
              size="sm"
              className="text-white hover:bg-gray-700"
              onClick={() => setCurrentTool("eraser")}
            >
              <Eraser className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "text" ? "default" : "ghost"}
              size="sm"
              className="text-white hover:bg-gray-700"
              onClick={() => setCurrentTool("text")}
            >
              <Type className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 bg-gray-600" />
            <Button
              variant={currentTool === "rectangle" ? "default" : "ghost"}
              size="sm"
              className="text-white hover:bg-gray-700"
              onClick={() => setCurrentTool("rectangle")}
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "circle" ? "default" : "ghost"}
              size="sm"
              className="text-white hover:bg-gray-700"
              onClick={() => setCurrentTool("circle")}
            >
              <Circle className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "circle" ? "default" : "ghost"}
              size="sm"
              className="text-white hover:bg-gray-700"
              onClick={() => setCurrentTool("3d")}
            >
              <Pyramid className="h-4 w-4" />3D
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant={cameraActive ? "default" : "secondary"} className="px-3">
              <Camera className="h-3 w-3 mr-1" />
              {cameraActive ? "Gestos Activos" : "Cámara Inactiva"}
            </Badge>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Zoom:</span>
              <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm w-12 text-center">{zoom}%</span>
              <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(400, zoom + 25))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
        </>
    );
}