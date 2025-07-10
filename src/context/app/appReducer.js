import { SELECT_TOOL, RESET_STATE, SET_BRUSH_SIZE, SELECT_COLOR,  SET_BRUSH_OPACITY, SELECT_BRUSH, GESTURE_MODE, SET_CAMERA_ACTIVE, SELECT_ZOOM, IS_DRAWING } from "../../types";

const appReducer = (state, action) => {
  const initialLayers = [
    { id: "1", name: "Fondo", visible: true, opacity: 100 },
    { id: "2", name: "Capa 1", visible: true, opacity: 100 },
  ];

  switch (action.type) {
    case SELECT_TOOL:
      return {
        ...state,
        currentTool: action.payload,
      };

    case RESET_STATE:
      return {
        ...state,
        currentTool: "brush",
        brushOpacity: [100],
        currentBrush: 0,
        currentColor:"#FFFF00",
        brushSize: "",
        loading: null,
        ocrActive: false,
        gestureMode: "draw",
        cameraActive: false,
        layers: initialLayers,
        zoom: 100,
        img2img: null,
        base64: "",
        isDrawing: false
      };

    case SELECT_TOOL:
      return {
        ...state,
        currentTool: action.payload,
      };

    case SELECT_COLOR:
      return {
        ...state,
        currentColor: action.payload,
      };

    case SET_BRUSH_SIZE:
      return {
        ...state,
        brushSize: action.payload,
      };
    case SET_BRUSH_OPACITY:
      return {
        ...state,
        brushOpacity: action.payload,
      };
    case SELECT_BRUSH:
      return {
        ...state,
        currentBrush: action.payload,
      };
    case GESTURE_MODE:
      return {
        ...state,
        currentBrush: action.payload,
      };
    case SET_CAMERA_ACTIVE:
      return {
        ...state,
        cameraActive: action.payload,
      };
    case SELECT_ZOOM:
    return {
      ...state,
      zoom: action.payload,
    };
    case IS_DRAWING:
      return {
        ...state,
        isDrawing: action.isDrawing
      }
    default:
      return state;
  }
};

export default appReducer;
