import { useState, useContext } from "react";
import appContext from "./../../context/app/appContext";
import {
    Camera,
    Play,
    Pause
  } from "lucide-react";

  import { Button } from "../ui/button";


export default function CameraActiveComponent() {
    const AppContext = useContext(appContext);

    const [showCameraContent, setShowCamera] = useState(false);

    const { gestureMode, cameraActive, setCameraActive } = AppContext;

    const startCamera = () => {
      setCameraActive(!cameraActive);
      setTimeout(() => {
        setShowCamera(true);
      }, 1300);
    };

  return (
    <div className="p-4 border-b border-gray-700">
      <h3 className="text-sm font-semibold mb-3 flex items-center">
        <Camera className="h-4 w-4 mr-2" />
        Control por Gestos
      </h3>
      <div className="w-full h-32 bg-gray-900 rounded border border-gray-600 flex items-center justify-center relative overflow-hidden">
        {cameraActive && !showCameraContent && (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <div className="text-xs text-green-400">Activando la cámara...</div>
            <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          
        )  }

        {
            !cameraActive && (
                <div className="text-center text-gray-500">
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-xs">Cámara desactivada</div>
                </div>
              )
        }

        {
          cameraActive  &&  showCameraContent && (
                <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <div className="text-xs text-green-400">Detectando gestos...</div>
            <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
            )
        }
      
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
  );
}
