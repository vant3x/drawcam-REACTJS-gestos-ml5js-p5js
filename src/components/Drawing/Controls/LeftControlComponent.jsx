export default function LeftToolControlComponent() {
    return (
        <>
             <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-2">
          <Button
            variant={gestureMode === "draw" ? "default" : "ghost"}
            size="sm"
            className="w-12 h-12 text-white hover:bg-gray-700"
            onClick={() => setGestureMode("draw")}
            title="Modo Dibujo"
          >
            <Hand className="h-5 w-5" />
          </Button>
          <Button
            variant={gestureMode === "navigate" ? "default" : "ghost"}
            size="sm"
            className="w-12 h-12 text-white hover:bg-gray-700"
            onClick={() => setGestureMode("navigate")}
            title="Modo Navegación"
          >
            <MousePointer className="h-5 w-5" />
          </Button>
          <Button
            variant={gestureMode === "color" ? "default" : "ghost"}
            size="sm"
            className="w-12 h-12 text-white hover:bg-gray-700"
            onClick={() => setGestureMode("color")}
            title="Modo Color"
          >
            <Pipette className="h-5 w-5" />
          </Button>

          <Separator className="w-8 bg-gray-600" />

          {brushes.map((brush, index) => (
            <Button
              key={index}
              variant={currentBrush === index ? "default" : "ghost"}
              size="sm"
              className="w-12 h-12 text-white hover:bg-gray-700"
              onClick={() => setCurrentBrush(index)}
              title={brush.name}
            >
              <brush.icon className="h-5 w-5" />
            </Button>
          ))}
        </div>
        </>
    )
}