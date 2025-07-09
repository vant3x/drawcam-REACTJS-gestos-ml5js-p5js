import { useState } from "react"
import { Button } from "../../ui/button"
import { Slider } from "../../ui/slider"
import { Badge } from "../../ui/badge"
import { Separator } from "../../ui/separator"
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
import { Alert, AlertDescription } from "../../ui/alert"
import { Textarea } from "../../ui/textarea";

export default function ToolsPanelContainer()  {
    return (
        <>
      <div className="bg-gray-800 border-b border-gray-700 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
              <Download className="h-4 w-4" />
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