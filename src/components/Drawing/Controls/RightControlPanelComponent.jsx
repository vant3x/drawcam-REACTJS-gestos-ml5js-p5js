import { useState, useContext } from "react";
import appContext from "./../../../context/app/appContext";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Alert, AlertDescription } from "../../ui/alert";
import { Type, ImageIcon, RotateCcw, Settings, Download } from "lucide-react";
import { createWorker } from "tesseract.js";
import CameraActiveComponent from "../CameraActiveComponent";
// Corregido: Importa la función correcta desde la ruta correcta.
import { callGeminiForImageOcr } from "./../../../utils/callGeminiForImageOCR";
import { Loader } from "../../Loader";

export default function RightPanelControlComponent({ onActivateVoice, onDeactivateVoice, isVoiceActive }) {
  const [ocrResult, setOcrResult] = useState("");
  const [sketchPrompt, setSketchPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState("");

  const AppContext = useContext(appContext);
  const { paintingRef, clearCanvas } = AppContext;

  const canvasToImage = () => {
    if (!paintingRef || !paintingRef.canvas) {
      console.warn("paintingRef no está disponible.");
      return null;
    }
    return paintingRef.canvas.toDataURL("image/png");
  };

  const resetOcr = () => {
    setOcrResult("")
  }

  const performOCRFromCanvas = async () => {
    if (!paintingRef) {
      setOcrResult("No hay dibujo para analizar.");
      return;
    }

   

    setIsProcessing(true);
    setOcrProgress("Iniciando OCR...");
    setOcrResult("");

    const imageDataUrl = canvasToImage();
    if (!imageDataUrl) {
      setOcrResult("Error al obtener la imagen del dibujo.");
      setIsProcessing(false);
      return;
    }

    // Lee la API Key aquí, en el componente.
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    try {
      setOcrProgress("Analizando con OCR local (Tesseract)...");
      const worker = await createWorker(["eng", "spa"]);
      /* await worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÁÉÍÓÚáéíóúÑñ.,- ',
      tessedit_pageseg_mode: '6'
      })*/
      const {
        data: { text, confidence },
      } = await worker.recognize(imageDataUrl);
      await worker.terminate();

      console.log(confidence);
      console.log(text);
      if (!text.trim() || confidence < 85) {
        setOcrProgress("Resultado local no confiable. Usando IA.");

        const geminiResult = await callGeminiForImageOcr(
          imageDataUrl,
          geminiApiKey
        );
        setOcrResult(geminiResult);
      } else {
        setOcrResult(`Tesseract (${Math.round(confidence)}%): ${text}`);
      }
    } catch (tesseractError) {
      console.warn(
        "Tesseract.js falló. Usando IA avanzada como respaldo.",
        tesseractError
      );
      setOcrProgress("OCR local falló. Probando con IA avanzada (Gemini)...");

      try {
        const geminiResult = await callGeminiForImageOcr(
          imageDataUrl,
          geminiApiKey
        );
        setOcrResult(geminiResult);
      } catch (geminiError) {
        setOcrResult("Ambos sistemas de OCR (local y IA) fallaron.");
      }
    } finally {
      setIsProcessing(false);
      setOcrProgress("");
    }
  };

  const downloadImage = () => {
    if (!paintingRef || !paintingRef.canvas) return;
    const link = document.createElement("a");
    link.href = paintingRef.canvas.toDataURL("image/png");
    link.download = `dibujo_${new Date().getTime()}.png`;
    link.click();
  };

  const handleClearCanvas = () => {
    if (clearCanvas) clearCanvas();
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      <CameraActiveComponent   onActivateVoice={onActivateVoice} onDeactivateVoice isVoiceActive  resetOcr={resetOcr} />
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold mb-3">Herramientas IA</h3>
        <div className="space-y-2 ">
          <Button
            onClick={performOCRFromCanvas}
            disabled={isProcessing}
            size="sm"
            className="w-full mb-2"
          >
            <Type className="h-4 w-4 mr-2" />
            {isProcessing ? ocrProgress : "OCR Texto"}
          </Button>
          {isProcessing && (
            <div className="flex justify-center items-center h-12 mb-2">
              <Loader />
            </div>
          )}
          {ocrResult && (
            <Alert className="mt-4 mb-2">
              <AlertDescription className="text-xs">
                {ocrResult}
              </AlertDescription>
            </Alert>
          )}
          <Button disabled size="sm" className="w-full mt-4">
            <ImageIcon className="h-4 w-4 mr-2" />
            Img2Img (Próximamente)
          </Button>
          <Textarea
            placeholder="Describe cómo mejorar tu boceto..."
            value={sketchPrompt}
            onChange={(e) => setSketchPrompt(e.target.value)}
            rows={2}
            className="text-xs"
          />
        </div>
      </div>
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
            <Download className="h-4 w-4 mr-2" />
            Descargar Dibujo
          </Button>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
        </div>
      </div>
    </div>
  );
}
