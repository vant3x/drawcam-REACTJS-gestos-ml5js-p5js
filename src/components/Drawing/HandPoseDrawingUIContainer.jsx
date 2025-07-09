import { useState } from "react"
import { Button } from "../ui/button"
import { Slider } from "../ui/slider"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import {
  Brush,
  Eraser,
  RotateCcw,
  Camera,
  Type,
  ImageIcon,
  Settings,
  Play,
  Pause,
  Download,
  Upload,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Move,
  Square,
  Circle,
  Minus,
  Eye,
  EyeOff,
  Plus,
  Pipette,
  Hand,
  MousePointer,
} from "lucide-react"
import { Alert, AlertDescription } from "../ui/alert"
import { Textarea } from "../ui/textarea"
import ToolsPanelContainer from "./Controls/ToolsPanelContainer"
import LayersArea from "./Controls/LayersArea"
import LeftToolControlComponent from "./Controls/LeftControlComponent"

const brushes = [
  { name: "Pincel", icon: Brush, size: 5 },
  { name: "Lápiz", icon: Minus, size: 2 },
  { name: "Marcador", icon: Brush, size: 15 },
  { name: "Aerógrafo", icon: Circle, size: 25 },
]

const colors = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
  "#FFC0CB",
  "#A52A2A",
  "#808080",
  "#C0C0C0",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#654321",
  "#D2691E",
  "#FF6347",
  "#40E0D0",
]

export default function HandPoseDrawingUIContainer() {
  const [currentTool, setCurrentTool] = useState("brush")
  const [currentBrush, setCurrentBrush] = useState(0)
  const [currentColor, setCurrentColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState([5])
  const [brushOpacity, setBrushOpacity] = useState([100])
  const [cameraActive, setCameraActive] = useState(false)
  const [gestureMode, setGestureMode] = useState("draw")
  const [layers, setLayers] = useState([
    { id: "1", name: "Fondo", visible: true, opacity: 100 },
    { id: "2", name: "Capa 1", visible: true, opacity: 100 },
  ])
  const [zoom, setZoom] = useState(100)
  const [ocrResult, setOcrResult] = useState("")
  const [sketchPrompt, setSketchPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)

  const startCamera = () => {
    setCameraActive(!cameraActive)
  }

  const clearCanvas = () => {
    // Simular limpieza del canvas
    console.log("Canvas limpiado")
  }

  const performOCR = async () => {
    setIsProcessing(true)
    setTimeout(() => {
      setOcrResult("Texto reconocido: 'Hola mundo' detectado en el dibujo")
      setIsProcessing(false)
    }, 2000)
  }

  const generateImage = async () => {
    if (!sketchPrompt.trim()) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      alert("Imagen generada con IA (simulado)")
    }, 3000)
  }





  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Barra de herramientas superior */}
      
    <ToolsPanelContainer/>
      <div className="flex flex-1">
        {/* Panel izquierdo - Herramientas */}
        <LeftToolControlComponent/>

        {/* Área principal */}
        <div className="flex-1 flex flex-col">
          {/* Canvas */}
          <div className="flex-1 bg-gray-700 p-4 overflow-auto">
            <div
              className="bg-white rounded-lg shadow-2xl mx-auto relative"
              style={{ width: "1200px", height: "800px" }}
            >
              {/* Canvas simulado */}
              <div
                className="w-full h-full rounded-lg cursor-crosshair relative overflow-hidden"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
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
                  <text x="200" y="500" fontSize="48" fill={currentColor} opacity={brushOpacity[0] / 100}>
                    Hola Mundo
                  </text>
                </svg>

                {/* Indicador de herramienta activa */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                  {currentTool === "brush" && `Pincel ${brushes[currentBrush].name}`}
                  {currentTool === "eraser" && "Borrador"}
                  {currentTool === "text" && "Texto"}
                  {currentTool === "rectangle" && "Rectángulo"}
                  {currentTool === "circle" && "Círculo"}
                  {currentTool === "move" && "Mover"}
                </div>

                {/* Indicador de modo de gesto */}
                <div className="absolute top-4 right-4 bg-blue-600 bg-opacity-80 text-white px-3 py-1 rounded text-sm">
                  Modo: {gestureMode === "draw" ? "Dibujo" : gestureMode === "navigate" ? "Navegación" : "Color"}
                </div>
              </div>
            </div>
          </div>

          {/* Barra inferior - Colores */}
          <div className="bg-gray-800 border-t border-gray-700 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-12 h-12 rounded border-2 border-gray-600 cursor-pointer shadow-lg"
                  style={{ backgroundColor: currentColor }}
                  title="Color actual"
                />
                <div className="grid grid-cols-12 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded border transition-all hover:scale-110 ${
                        currentColor === color ? "border-white border-2 shadow-lg" : "border-gray-600"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCurrentColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Tamaño:</span>
                  <Slider value={brushSize} onValueChange={setBrushSize} max={100} min={1} step={1} className="w-24" />
                  <span className="text-sm w-8">{brushSize[0]}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Opacidad:</span>
                  <Slider
                    value={brushOpacity}
                    onValueChange={setBrushOpacity}
                    max={100}
                    min={1}
                    step={1}
                    className="w-24"
                  />
                  <span className="text-sm w-8">{brushOpacity[0]}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
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
                  <div className="text-xs text-green-400">Detectando gestos...</div>
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
                {cameraActive ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                {cameraActive ? "Detener" : "Activar"}
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Modo actual: <span className="text-blue-400 capitalize">{gestureMode}</span>
            </div>
          </div>

          {/* Capas */}
         <LayersArea/>

          {/* IA Tools */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-sm font-semibold mb-3">Herramientas IA</h3>
            <div className="space-y-2">
              <Button onClick={performOCR} disabled={isProcessing} size="sm" className="w-full">
                <Type className="h-4 w-4 mr-2" />
                {isProcessing ? "Procesando..." : "OCR Texto"}
              </Button>
              <Textarea
                placeholder="Describe cómo mejorar tu boceto..."
                value={sketchPrompt}
                onChange={(e) => setSketchPrompt(e.target.value)}
                rows={2}
                className="text-xs"
              />
              <Button
                onClick={generateImage}
                disabled={isProcessing || !sketchPrompt.trim()}
                size="sm"
                className="w-full"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {isProcessing ? "Generando..." : "Img2Img"}
              </Button>
            </div>
            {ocrResult && (
              <Alert className="mt-2">
                <AlertDescription className="text-xs">{ocrResult}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Acciones rápidas */}
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-3">Acciones</h3>
            <div className="space-y-2">
              <Button onClick={clearCanvas} variant="outline" size="sm" className="w-full bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpiar Canvas
              </Button>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}