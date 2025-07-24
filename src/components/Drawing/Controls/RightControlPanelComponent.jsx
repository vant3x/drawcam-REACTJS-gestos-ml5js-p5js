import { useState, useContext, useEffect } from "react";
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
  Pause,
  Download
} from "lucide-react";

import { createWorker } from "tesseract.js";

import CameraActiveComponent from "../CameraActiveComponent";

export default function RightPanelControlComponent() {
  const [ocrResult, setOcrResult] = useState("");
  const [sketchPrompt, setSketchPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState("");

  const [imageData, setImageData] = useState(null);

  const AppContext = useContext(appContext);

  const { gestureMode, paintingRef, clearCanvas } = AppContext;

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

  const canvasToImage = () => {
    if (!paintingRef || !paintingRef.canvas) {
      console.warn("paintingRef no está disponible o no tiene canvas");
      return null;
    }

    try {
      // Convertir el canvas de p5 a base64
      const dataURL = paintingRef.canvas.toDataURL('image/png');
      return dataURL;
    } catch (error) {
      console.error("Error al convertir canvas a imagen:", error);
      return null;
    }
  };

  // Función principal de OCR usando el paintingRef
  const performOCRFromCanvas = async () => {
    if (!paintingRef) {
      setOcrResult("No hay dibujo disponible para procesar");
      return;
    }

    setIsProcessing(true);
    setOcrProgress("Preparando imagen...");
    setOcrResult("");

    try {
      // 1. Convertir canvas a imagen
      const imageData = canvasToImage();
      if (!imageData) {
        setOcrResult("Error: No se pudo convertir el dibujo a imagen");
        setIsProcessing(false);
        return;
      }

      // 2. Crear worker con múltiples idiomas
      setOcrProgress("Inicializando OCR...");
      const worker = await createWorker(['eng', 'spa']);

      // 3. Procesar con OCR
      const { data: { text, confidence } } = await worker.recognize(
        imageData,
        {
          lang: 'eng+spa' // Inglés y español simultáneamente
        },
        {
          logger: m => {
            console.log(m);
            if (m.status === 'recognizing text') {
              setOcrProgress(`Reconociendo texto... ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );

      // 4. Mostrar resultados
      if (text.trim()) {
        setOcrResult(`Texto detectado (${Math.round(confidence)}% confianza): ${text}`);
      } else {
        setOcrResult("No se detectó texto en el dibujo. Intenta con trazos más claros.");
      }

      // 5. Limpiar worker
      await worker.terminate();

    } catch (error) {
      console.error("Error durante el OCR:", error);
      setOcrResult("Error al procesar el dibujo. Inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
      setOcrProgress("");
    }
  };

    const downloadImage = (image) => {
    if (!paintingRef ||  !paintingRef.canvas) {
      console.error("La referencia al canvas de dibujo no está disponible.");
      alert("No hay nada que descargar todavía.");
      return;
    }

    const base64Image = paintingRef.canvas.toDataURL("image/png");

   
    console.log("Imagen en Base64:", base64Image);

    const link = document.createElement("a");
    link.href = base64Image;
    link.download =`dibujo_${new Date().getTime()}.png`; 

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              onClick={performOCRFromCanvas}
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
              onClick={downloadImage}
            >
            Descargar dibujo con imagen de fondo  <Download className="h-4 w-4" />
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
