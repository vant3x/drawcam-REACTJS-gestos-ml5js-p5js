import { useState, useContext } from "react"
import appContext from "./../../../context/app/appContext";

import { Slider } from "../../ui/slider";


const colors = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
  "#FFC0CB",
  "#A52A2A",
  "#808080",
  "#C0C0C0",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#654321",
  "#D2691E",
  "#FF6347",
  "#40E0D0",
];

export default function ColorsControlComponent() {
  const AppContext = useContext(appContext);

  const { currentColor, setCurrentColor, brushSize, setBrushSize, brushOpacity, setBrushOpacity } = AppContext;
  return (
    <>
      <div className="bg-gray-800 border-t border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className="w-12 h-12 rounded border-2 border-gray-600 cursor-pointer shadow-lg"
              style={{ backgroundColor: currentColor }}
              title="Color actual"
            />
            <div className="grid grid-cols-12 gap-1">
              {colors.map((color) => (
                <button
                  key={color+Math.random()}
                  className={`w-6 h-6 rounded border transition-all hover:scale-110 ${
                    currentColor === color
                      ? "border-white border-2 shadow-lg"
                      : "border-gray-600"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Tamaño:</span>
              <Slider
                value={brushSize}
                onValueChange={setBrushSize}
                max={100}
                min={1}
                step={1}
                className="w-24"
              />
              <span className="text-sm w-8">{brushSize[0]}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Opacidad:</span>
              <Slider
                value={brushOpacity}
                onValueChange={setBrushOpacity}
                max={100}
                min={1}
                step={1}
                className="w-24"
              />
              <span className="text-sm w-8">{brushOpacity[0]}%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
