import React, { useReducer } from "react";
import appContext from "./appContext";
import appReducer from "./appReducer";

import { SELECT_TOOL, RESET_STATE, SELECT_COLOR, SET_BRUSH_SIZE, SET_BRUSH_OPACITY } from "../../types";



const AppState = ({ children }) => {

    const initialLayers = 
    [
        { id: "1", name: "Fondo", visible: true, opacity: 100 },
        { id: "2", name: "Capa 1", visible: true, opacity: 100 },
      ];
  

  const initialState = {
    currentTool: 'brush',
    brushOpacity: [100],
    brushSize: [5],
    currentColor:  "#FFFF00",
    loading: null,
    ocrActive: false,
    gestureMode: 'draw',
    cameraActive: false,
    layers:  initialLayers,
    zoom: 100,
    img2img: null,
    base64: "",
  };

  // crear dispatch y state
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setCurrentTool = (currentTool) => {
    dispatch({
      type: SELECT_TOOL,
      payload: currentTool,
    });
  };

  const setCurrentColor = (currentColor) => {
    dispatch({
      type: SELECT_COLOR,
      payload: currentColor,
    });
  };

  const setBrushSize = (brushSize) => {
    dispatch({
      type: SET_BRUSH_SIZE,
      payload: brushSize,
    });
  };

  const   setBrushOpacity
  = (brushOpacity) => {
    dispatch({
      type: SET_BRUSH_OPACITY,
      payload: brushOpacity,
    });
  };


  const resetState = () => {
    dispatch({
      type: RESET_STATE,
    });
  };



  return (
    <appContext.Provider
    value={{
        currentTool: state.currentTool,
        zoom: state.zoom,
        brushOpacity: state.brushOpacity,
        brushSize: state.brushSize,
        currentColor: state.currentColor,
        loading:state.zoom,
        ocrActive: state.zoom,
        gestureMode: state.gestureMode,
        cameraActive: state.cameraActive,
        layers:  state.layers,
        img2img: state.zoom,
        base64: state.zoom,
        setCurrentTool,
        setCurrentColor,
        setBrushSize,
        setBrushOpacity,
        resetState
    }}>  
    {children}
    </appContext.Provider>
  );
};

export default AppState;