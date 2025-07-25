import {
  SELECT_TOOL,
  RESET_STATE,
  SET_BRUSH_SIZE,
  SELECT_COLOR,
  SET_BRUSH_OPACITY,
  SELECT_BRUSH,
  GESTURE_MODE,
  SET_CAMERA_ACTIVE,
  SELECT_ZOOM,
  IS_DRAWING,
  SET_CLEAR_CANVAS,
  SET_START_HAND_POSE_DETECTION,
  SET_PAINTING_REF,
  IS_CHANGE_HAND_COLOR,
  VOICE_CONTROL_STATUS,
  VOICE_CONTROL_MODE_CONTROL
} from "../../types";

const appReducer = (state, action) => {
  const initialLayers = [
    { id: "1", name: "Fondo", visible: true, opacity: 100 },
    { id: "2", name: "Capa 1", visible: true, opacity: 100 },
  ];

  switch (action.type) {
    case RESET_STATE:
      return {
        ...state,
        currentTool: "brush",
        brushOpacity: [100],
        currentBrush: 0,
        currentColor: "#FFFF00",
        brushSize: [5],
        isChangeWithHandColor: false,
        loading: null,
        ocrActive: false,
        gestureMode: "draw",
        cameraActive: false,
        layers: initialLayers,
        zoom: 100,
        img2img: null,
        base64: "",
        isDrawing: false,
        startHandPoseDetection: null,
        voiceControlStatus: false,
        clearCanvas: null,
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
        gestureMode: action.payload,
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
        isDrawing: action.payload,
      };
    case SET_START_HAND_POSE_DETECTION:
      return {
        ...state,
        startHandPoseDetection: action.payload,
      };
    case SET_CLEAR_CANVAS:
      return {
        ...state,
        clearCanvas: action.payload,
      };
    case SET_PAINTING_REF:
      return {
        ...state,
        paintingRef: action.payload,
      };
    case IS_CHANGE_HAND_COLOR:
      return {
        ...state,
        isChangeWithHandColor: action.payload,
      };
    default:
      return state;
  }
};

export default appReducer;
