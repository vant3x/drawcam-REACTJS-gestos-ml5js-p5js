import { useReducer } from "react";
import appContext from "./appContext";
import appReducer from "./appReducer";

import {
  SELECT_TOOL,
  RESET_STATE,
  SELECT_COLOR,
  SET_BRUSH_SIZE,
  SET_BRUSH_OPACITY,
  SELECT_BRUSH,
  GESTURE_MODE,
  SET_CAMERA_ACTIVE,
  SELECT_ZOOM,
  IS_DRAWING,
  SET_START_HAND_POSE_DETECTION, 
  SET_CLEAR_CANVAS,
  SET_PAINTING_REF,
  IS_CHANGE_HAND_COLOR,
  VOICE_CONTROL_STATUS,
  VOICE_CONTROL_MODE_CONTROL
} from "../../types";

const AppState = ({ children }) => {
  const initialLayers = [
    { id: "1", name: "Fondo", visible: true, opacity: 100 },
    { id: "2", name: "Capa 1", visible: true, opacity: 100 },
  ];

  const initialState = {
    currentTool: "brush",
    brushOpacity: [100],
    brushSize: [5],
    currentColor: "#FFFF00",
    currentBrush: 0,
    loading: null,
    ocrActive: false,
    isChangeWithHandColor: false,
    gestureMode: "draw",
    cameraActive: false,
    layers: initialLayers,
    zoom: 100,
    img2img: null,
    base64: "",
    isDrawing: false,
    startHandPoseDetection: null, 
    paintingRef: null,
    voiceControlStatus: false,
    clearCanvas: null,
  };



  // crear dispatch y state
  const [state, dispatch] = useReducer(appReducer, initialState);



  const setStartHandPoseDetection = (func) => {
    dispatch({
      type: SET_START_HAND_POSE_DETECTION,
      payload: func,
    });
  };

  const setClearCanvas = (func) => {
    dispatch({
      type: SET_CLEAR_CANVAS,
      payload: func,
    });
  };

  const setPaintingRef = (ref) => {
    dispatch({
      type: SET_PAINTING_REF,
      payload: ref,
    });
  };


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

  const setBrushOpacity = (brushOpacity) => {
    dispatch({
      type: SET_BRUSH_OPACITY,
      payload: brushOpacity,
    });
  };

  const setCurrentBrush = (currentBrush) => {
    dispatch({
      type: SELECT_BRUSH,
      payload: currentBrush,
    });
  };

  const setGestureMode = (gestureMode) => {
    dispatch({
      type: GESTURE_MODE,
      payload: gestureMode,
    });
  };

  const setCameraActive = (cameraActive) => {
    dispatch({
      type: SET_CAMERA_ACTIVE,
      payload: cameraActive,
    });
  };

  const setZoom = (zoom) => {
    dispatch({
      type: SELECT_ZOOM,
      payload: zoom,
    });
  };

  const setIsDrawing = (isDrawing) => {
    dispatch({
      type: IS_DRAWING,
      payload: isDrawing,
    });
  };


  const setIsChangeColorWithHand = (isChangeWithHandColor) => {
    dispatch({
      type: IS_CHANGE_HAND_COLOR,
      payload:  isChangeWithHandColor,
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
        loading: state.zoom,
        currentBrush: state.currentBrush,
        ocrActive: state.zoom,
        gestureMode: state.gestureMode,
        cameraActive: state.cameraActive,
        layers: state.layers,
        img2img: state.zoom,
        base64: state.zoom,
        isDrawing: state.isDrawing,
        isChangeWithHandColor: state.isChangeWithHandColor,
        setCurrentTool,
        setCurrentColor,
        setBrushSize,
        setBrushOpacity,
        setCurrentBrush,
        setGestureMode,
        setCameraActive,
        setZoom,
        setIsDrawing,
        resetState,
        startHandPoseDetection: state.startHandPoseDetection,
        setStartHandPoseDetection,
        clearCanvas: state.clearCanvas,
        setClearCanvas,
        paintingRef: state.paintingRef,
        setPaintingRef,
        setIsChangeColorWithHand
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppState;
