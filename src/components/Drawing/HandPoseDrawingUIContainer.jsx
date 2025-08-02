import { useState, useContext, useRef } from "react";
import appContext from "./../../context/app/appContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import ToolsPanelContainer from "./Controls/ToolsPanelContainer";
import LayersArea from "./Controls/LayersArea";
import LeftToolControlComponent from "./Controls/LeftControlComponent";
import RightPanelControlComponent from "./Controls/RightControlPanelComponent";
import DrawCanvasAreaComponent from "./DrawCanvasMainAreaComponent";



export default function HandPoseDrawingUIContainer() {
  const AppContext = useContext(appContext);

  const {
    currentTool,
  } = AppContext;

  const [isVoiceActiveState, setIsVoiceActiveState] = useState(false); // Estado para el UI del botón
  const voiceControlRef = useRef(null); // Ref para 
  // Función que se pasa al BotonActivadorComponente para activar la voz
  const activateVoiceFromButton = () => {
    if (voiceControlRef.current) {
      voiceControlRef.current.startListeningExternal();
      setIsVoiceActiveState(true); // Actualiza el estado para el UI del botón
    }
  };

  // Función que se pasa al BotonActivadorComponente para desactivar la voz
  const deactivateVoiceFromButton = () => {
    if (voiceControlRef.current) {
      voiceControlRef.current.stopListeningExternal();
      setIsVoiceActiveState(false); // Actualiza el estado para el UI del botón
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Barra de herramientas superior */}

      <ToolsPanelContainer currentTool={currentTool} />
      <div className="flex flex-1">
        {/* Panel izquierdo - Herramientas */}
        <LeftToolControlComponent />

        {/* Área principal */}
      
        <DrawCanvasAreaComponent   onActivateVoice={activateVoiceFromButton}
          onDeactivateVoice={deactivateVoiceFromButton}
          isVoiceActive={isVoiceActiveState} voiceControlRef={voiceControlRef} />

        {/* Panel derecho */}
        <RightPanelControlComponent  onActivateVoice={activateVoiceFromButton}
          onDeactivateVoice={deactivateVoiceFromButton}
          isVoiceActive={isVoiceActiveState} />
      </div>
    </div>
  );
}
