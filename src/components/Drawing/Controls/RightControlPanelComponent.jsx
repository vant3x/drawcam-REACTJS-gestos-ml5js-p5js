import { useState, useContext } from "react";
import appContext from "./../../../context/app/appContext";

import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { Textarea } from "../../ui/textarea";
import { Alert, AlertDescription } from "../../ui/alert";

import {
  Type,
  ImageIcon,
  RotateCcw,
  Settings,
  Pause
} from "lucide-react";
import CameraActiveComponent from "../CameraActiveComponent";

export default function RightPanelControlComponent() {
  const [ocrResult, setOcrResult] = useState("");
  const [sketchPrompt, setSketchPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const AppContext = useContext(appContext);

  const { gestureMode, clearCanvas } = AppContext;

  const performOCR = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setOcrResult("Texto reconocido: 'Hola mundo' detectado en el dibujo");
      setIsProcessing(false);
    }, 2000);
  };

  const generateImage = async () => {
    if (!sketchPrompt.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("Imagen generada con IA (simulado)");
    }, 3000);
  };



  const handleClearCanvas = () => {
    if (clearCanvas) { 
      clearCanvas(); 
    } else {
      console.warn("La función clearCanvas no está disponible en el contexto.");
    }
  };

  return (
    <>
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        {/* Cámara de gestos */}
        <CameraActiveComponent/>

        {/* Capas */}
        {/* <LayersArea/>*/}

        {/* IA Tools */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold mb-3">Herramientas IA</h3>
          <div className="space-y-2">
            <Button
              onClick={performOCR}
              disabled={isProcessing}
              size="sm"
              className="w-full"
            >
              <Type className="h-4 w-4 mr-2" />
              {isProcessing ? "Procesando..." : "OCR Texto"}
            </Button>

            <Button
              onClick={generateImage}
              disabled={isProcessing || !sketchPrompt.trim()}
              size="sm"
              className="w-full"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              {isProcessing ? "Generando..." : "Img2Img"}
            </Button>
            <Textarea
              placeholder="Describe cómo mejorar tu boceto..."
              value={sketchPrompt}
              onChange={(e) => setSketchPrompt(e.target.value)}
              rows={2}
              className="text-xs"
            />
          </div>
          {ocrResult && (
            <Alert className="mt-2">
              <AlertDescription className="text-xs">
                {ocrResult}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-3">Acciones</h3>
          <div className="space-y-2">
            <Button
              onClick={handleClearCanvas}
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpiar Canvas
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
