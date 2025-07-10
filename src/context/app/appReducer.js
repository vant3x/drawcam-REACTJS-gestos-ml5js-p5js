import { SELECT_TOOL, RESET_STATE, SET_BRUSH_SIZE, SET_BRUSH_OPACITY } from "../../types";

const appReducer = (state, action) => {
  const initialLayers = [
    { id: "1", name: "Fondo", visible: true, opacity: 100 },
    { id: "2", name: "Capa 1", visible: true, opacity: 100 },
  ];

  switch (action.type) {
    case SELECT_TOOL:
      return {
        ...state,
        tool: action.payload,
      };

    case UPLOAD_FILE:
      return {
        ...state,
        loading: true,
      };
    case UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        fileName: action.payload.fileName,
        original_name: action.payload.original_name,
        loading: false,
      };
    case UPLOAD_FILE_ERROR:
      return {
        ...state,
        fileMessage: action.payload,
        loading: false,
      };

    case RESET_STATE:
      return {
        ...state,
        currentTool: "brush",
        brushOpacity: [100],
        brushSize: "",
        loading: null,
        ocrActive: false,
        gestureMode: "draw",
        cameraActive: false,
        layers: initialLayers,
        zoom: 100,
        img2img: null,
        base64: "",
      };

    case SELECT_TOOL:
      return {
        ...state,
        currentTool: action.payload,
      };

    case SELECT_COLOR:
      return {
        ...state,
        color: action.payload,
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
    default:
      return state;
  }
};

export default appReducer;
