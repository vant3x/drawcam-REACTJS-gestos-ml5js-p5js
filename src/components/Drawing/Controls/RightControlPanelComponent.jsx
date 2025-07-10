import { useState, useContext } from "react";
import appContext from "./../../../context/app/appContext";

import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { Textarea } from "../../ui/textarea";
import { Alert, AlertDescription } from "../../ui/alert";

import {
  Brush,
  Circle,
  Minus,
  Pipette,
  Hand,
  MousePointer,
  Camera,
  Play,
  Type,
  ImageIcon,
  RotateCcw,
  Settings,
  Pause
} from "lucide-react";

export default function RightPanelControlComponent() {
  const [ocrResult, setOcrResult] = useState("");
  const [sketchPrompt, setSketchPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const AppContext = useContext(appContext);

  const { gestureMode, cameraActive, setCameraActive } = AppContext;

  const startCamera = () => {
    setCameraActive(!cameraActive);
  };

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

  const clearCanvas = () => {
    // Simular limpieza del canvas
    console.log("Canvas limpiado");
  };

  return (
    <>
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        {/* Cámara de gestos */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold mb-3 flex items-center">
            <Camera className="h-4 w-4 mr-2" />
            Control por Gestos
          </h3>
          <div className="w-full h-32 bg-gray-900 rounded border border-gray-600 flex items-center justify-center relative overflow-hidden">
            {cameraActive ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                <div className="text-xs text-green-400">
                  Detectando gestos...
                </div>
                <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Camera className="h-8 w-8 mx-auto mb-2" />
                <div className="text-xs">Cámara desactivada</div>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <Button onClick={startCamera} size="sm" className="flex-1">
              {cameraActive ? (
                <Pause className="h-4 w-4 mr-1" />
              ) : (
                <Play className="h-4 w-4 mr-1" />
              )}
              {cameraActive ? "Detener" : "Activar"}
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Modo actual:{" "}
            <span className="text-blue-400 capitalize">{gestureMode}</span>
          </div>
        </div>

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
              onClick={clearCanvas}
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
