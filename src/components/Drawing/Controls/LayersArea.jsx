import { useState } from "react";

export default function LayersArea() {
  const [activeLayer, setActiveLayer] = useState("2");
  
  const addLayer = () => {
    const newLayer = {
      id: Date.now().toString(),
      name: `Capa ${layers.length}`,
      visible: true,
      opacity: 100,
    };
    setLayers([...layers, newLayer]);
    setActiveLayer(newLayer.id);
  };

  const toggleLayerVisibility = (layerId) => {
    setLayers(
      layers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };
  return (
    <div className="p-4 border-b border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Capas</h3>
        <Button onClick={addLayer} size="sm" variant="ghost">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-1">
        {layers
          .slice()
          .reverse()
          .map((layer) => (
            <div
              key={layer.id}
              className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                activeLayer === layer.id
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setActiveLayer(layer.id)}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLayerVisibility(layer.id);
                }}
              >
                {layer.visible ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
              </Button>
              <span className="text-sm flex-1">{layer.name}</span>
              <span className="text-xs text-gray-400">{layer.opacity}%</span>
            </div>
          ))}
      </div>
    </div>
  );
}
