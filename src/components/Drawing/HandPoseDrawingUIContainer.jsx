import { useState, useContext } from "react";
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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Barra de herramientas superior */}

      <ToolsPanelContainer currentTool={currentTool} />
      <div className="flex flex-1">
        {/* Panel izquierdo - Herramientas */}
        <LeftToolControlComponent />

        {/* Área principal */}
      
        <DrawCanvasAreaComponent/>

        {/* Panel derecho */}
        <RightPanelControlComponent />
      </div>
    </div>
  );
}
