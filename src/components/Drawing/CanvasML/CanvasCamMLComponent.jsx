import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import appContext from "./../../../context/app/appContext";

import useML5HandPose from "../../../hooks/useML5HandPose";
import useP5Sketch from "../../../hooks/useP5Sketch";

import { colors } from './../Controls/ColorsControlComponent';

export default function CanvasCamera5Component({ colorDisplayRect, canvasCurrentWidth, canvasCurrentHeight, zoom }) {
  const AppContext = useContext(appContext);

  const {
    gestureMode,
    cameraActive,
    setIsChangeColorWithHand,
    setClearCanvas,
    setBrushSize,
    setPaintingRef,
    setCurrentColor,
    currentColor,
    isChangeWithHandColor
  } = AppContext;

  const [appState, setAppState] = useState("init");

  const handsRef = useRef([]);
  const appStateRef = useRef("init");
  const videoRef = useRef(null);
  const paintingRef = useRef(null);
  const previousPosRef = useRef({ x: 0, y: 0 });
  const isInitializedRef = useRef(false);
  const strokeWidthRef = useRef(8);

  const currentColorRef = useRef(currentColor);
  const isChangeWithHandColorRef = useRef(isChangeWithHandColor);

    const colorDisplayRectRef = useRef(null);
    const zoomRef = useRef(zoom);

      // Referencias para detección de swipe
  const leftHandPositionsRef = useRef([]);
  const swipeDetectionActiveRef = useRef(false);
  const lastSwipeTimeRef = useRef(0);


  const { isML5Loaded, startDetection } = useML5HandPose((results) => {
    handsRef.current = results;
  });

    useEffect(() => {
    currentColorRef.current = currentColor;
  }, [currentColor]);


  useEffect(() => {
    isChangeWithHandColorRef.current = isChangeWithHandColor; 
  }, [isChangeWithHandColor]);
  // 2. Actualiza la ref del div de color y del zoom cuando cambian las props
  useEffect(() => {
    colorDisplayRectRef.current = colorDisplayRect;
    zoomRef.current = zoom;
  }, [colorDisplayRect, zoom]);

  const detectSwipe = useCallback((currentPos) => {
    const positions = leftHandPositionsRef.current;
    const now = Date.now();
    
    // Agregar posición actual con timestamp
    positions.push({ x: currentPos.x, y: currentPos.y, time: now });
    
    // Mantener solo las últimas 10 posiciones (aproximadamente 300ms de historial)
    if (positions.length > 10) {
      positions.shift();
    }
    
    // Necesitamos al menos 5 posiciones para detectar swipe
    if (positions.length < 5) return;
    
    const firstPos = positions[0];
    const lastPos = positions[positions.length - 1];
    const timeDiff = lastPos.time - firstPos.time;
    const xDiff = lastPos.x - firstPos.x;
    const yDiff = lastPos.y - firstPos.y;
    
    // Detectar swipe horizontal (izquierda a derecha o derecha a izquierda)
    if (timeDiff > 100 && timeDiff < 800) { // Entre 100ms y 800ms
      const horizontalDistance = Math.abs(xDiff);
      const verticalDistance = Math.abs(yDiff);
      
      // El movimiento horizontal debe ser mayor que el vertical
      if (horizontalDistance > 50 && horizontalDistance > verticalDistance * 2) {
        // Evitar múltiples detecciones del mismo swipe
        if (now - lastSwipeTimeRef.current > 1000) { // 1 segundo entre swipes
          lastSwipeTimeRef.current = now;
          
          if (xDiff > 0) {
            console.log("🔄 SWIPE DETECTADO: Izquierda a Derecha");
          } else {
            console.log("🔄 SWIPE DETECTADO: Derecha a Izquierda");
          }
          
          // Limpiar posiciones después de detectar swipe
          leftHandPositionsRef.current = [];
        }
      }
    }
  }, []);


  const clearPainting = useCallback(() => {
    if (paintingRef.current) {
      paintingRef.current.clear();

      if (window.p5 && window.p5.instance) {
        window.p5.instance.redraw();
      }
    }
  }, []);

  const sketch = useCallback(
    (p) => {
      p.setup = () => {
        p.createCanvas(720, 490);
        paintingRef.current = p.createGraphics(710, 490);
        setPaintingRef(paintingRef.current);
        paintingRef.current.clear();
        isInitializedRef.current = true;
        p.noLoop(); // Detiene el bucle de dibujo automático
      };

      p.draw = () => {
        if (
          !isInitializedRef.current ||
          appStateRef.current !== "running" ||
          !videoRef.current ||
          !paintingRef.current
        ) {
          p.background(0);
          return;
        }

        p.image(videoRef.current, 0, 0, p.width, p.height);
        p.image(paintingRef.current, 0, 0);

        // Usa handsRef.current para acceder a los datos de las manos

        const currentHands = handsRef.current;
        let handIsOverColorPicker = false;

        if (currentHands.length > 0) {
          let rightHand, leftHand;

          // Separar las manos detectadas en izquierda y derecha
          for (let hand of currentHands) {
            if (hand.handedness === "Right") {
              const index = hand.index_finger_tip;
              const thumb = hand.thumb_tip;
              rightHand = { index, thumb };
            }
            if (hand.handedness === "Left") {
              const index = hand.index_finger_tip;
              const thumb = hand.thumb_tip;
              leftHand = { index, thumb };
            }
          }

          if (leftHand && leftHand.index && leftHand.thumb) {

            const { index, thumb } = leftHand;
            const x = (index.x + thumb.x) * 0.5;
            const y = (index.y + thumb.y) * 0.5;
            // Calcular grosor basado en la distancia entre dedos
            const pinchDistance = p.dist(index.x, index.y, thumb.x, thumb.y);
            const newStrokeWidth = Math.max(2, Math.min(50, pinchDistance));

            if (newStrokeWidth !== strokeWidthRef.current) {
              strokeWidthRef.current = newStrokeWidth;
              setBrushSize([Math.round(newStrokeWidth)]);
            }

            p.fill(255, 0, 255); // Color magenta como en el ejemplo
            p.noStroke();
            p.circle(x, y, strokeWidthRef.current);

            // Texto mostrando el grosor actual
            p.fill(255);
            p.textAlign(p.CENTER);
            p.text(
              `Grosor: ${Math.round(strokeWidthRef.current)}`,
              x,
              y - strokeWidthRef.current / 2 - 10
            );
            if (isChangeWithHandColorRef.current) {
              // Activar detección de swipe y rastrear posición de la mano izquierda
              swipeDetectionActiveRef.current = true;
              detectSwipe({ x, y });
              
              // Indicador visual de que la detección de swipe está activa
              p.push();
              p.fill(0, 255, 255, 100); // Cyan semitransparente
              p.noStroke();
              p.circle(x, y, strokeWidthRef.current + 20);
              p.fill(255);
              p.textAlign(p.CENTER);
              p.text("Color mode", x, y + strokeWidthRef.current / 2 + 25);
              p.pop();
            } else {
              // Si no está en modo cambio de color, limpiar historial de posiciones
              if (swipeDetectionActiveRef.current) {
                leftHandPositionsRef.current = [];
                swipeDetectionActiveRef.current = false;
              }
            }
          } else {
            // Si no se detecta mano izquierda, limpiar historial
            if (swipeDetectionActiveRef.current) {
              leftHandPositionsRef.current = [];
            }
          }

          if (rightHand && rightHand.index && rightHand.thumb) {
            const { index, thumb } = rightHand;

            const x = (index.x + thumb.x) * 0.5;
            const y = (index.y + thumb.y) * 0.5;

            const distance = p.dist(index.x, index.y, thumb.x, thumb.y);
            if (distance < 20) {
              const p5Color = p.color(currentColorRef.current);

              paintingRef.current.stroke(p5Color);
              paintingRef.current.strokeWeight(strokeWidthRef.current * 0.5);
              paintingRef.current.line(
                previousPosRef.current.x,
                previousPosRef.current.y,
                x,
                y
              );
            }

            previousPosRef.current = { x, y };

            // Dibujar indicadores visuales
            p.fill(255, 0, 0);
            p.noStroke();
            p.circle(index.x, index.y, 10);
            p.fill(0, 255, 0);
            p.circle(thumb.x, thumb.y, 10);
            p.stroke(255);
            p.strokeWeight(2);
            p.line(index.x, index.y, thumb.x, thumb.y);
            p.fill(255);
            p.noStroke();
            p.textAlign(p.CENTER);
            p.text(
              Math.round(distance),
              (index.x + thumb.x) / 2,
              (index.y + thumb.y) / 2 - 15
            );
           
            const rect = colorDisplayRectRef.current;
            const currentZoom = zoomRef.current / 100; 
 
            if (rect) {
              const fingerX = index.x;
              const fingerY = index.y;

              const unscaledColorDivX = rect.x / currentZoom;
              const unscaledColorDivY = rect.y / currentZoom;
              const unscaledColorDivWidth = rect.width / currentZoom;
              const unscaledColorDivHeight = rect.height / currentZoom;

              if (
                fingerX >= unscaledColorDivX &&
                fingerX <= unscaledColorDivX + unscaledColorDivWidth &&
                fingerY >= unscaledColorDivY &&
                fingerY <= unscaledColorDivY + unscaledColorDivHeight
              ) {
                console.log('hay ', colors.length, ' colores')
                console.log("¡Mano sobre el div de Color!");
                setIsChangeColorWithHand(true)
                console.log(isChangeWithHandColor)
              
                p.push();
                p.noFill();
                p.stroke(0, 255, 0); // Color verde para resaltar
                p.strokeWeight(4);
                p.rect(unscaledColorDivX, unscaledColorDivY, unscaledColorDivWidth, unscaledColorDivHeight);
                p.pop();
              }
            }
          }
        } else {
          // Si no hay manos detectadas, limpiar historial de swipe
          if (swipeDetectionActiveRef.current) {
            leftHandPositionsRef.current = [];
          }
        }
      };

      p.keyPressed = () => {
        if (p.key === "c" || p.key === "C") {
          clearPainting();
        }
      };
    },
    [clearPainting, detectSwipe]
  );

  const { containerRef, p5Instance } = useP5Sketch(sketch);

  useEffect(() => {
    appStateRef.current = appState;
    // Controla el bucle de p5.js basado en el estado de la app
    if (p5Instance) {
      if (appState === "running") {
        p5Instance.loop(); // Inicia el bucle de dibujo
      } else {
        p5Instance.noLoop(); // Detiene el bucle
        p5Instance.redraw(); //
      }
    }
  }, [appState, p5Instance]);

  useEffect(() => {
    if (
      cameraActive &&
      appState === "init" &&
      isInitializedRef.current &&
      p5Instance &&
      !videoRef.current
    ) {
      videoRef.current = p5Instance.createCapture(p5Instance.VIDEO, {
        flipped: true,
      });
      videoRef.current.hide();

      const checkVideoReady = () => {
        if (videoRef.current && videoRef.current.elt.readyState >= 2) {
          startDetection(videoRef.current);
          setAppState("running");
        } else {
          setTimeout(checkVideoReady, 100);
        }
      };
      checkVideoReady();
    } else if (!cameraActive && appState === "running") {
      // Lógica para detener la cámara
      if (videoRef.current) {
        if (videoRef.current.elt.srcObject) {
          videoRef.current.elt.srcObject
            .getTracks()
            .forEach((track) => track.stop());
        }
        videoRef.current = null;
      }
      setAppState("init");
      p5Instance.noLoop();
      p5Instance.redraw();
    }
  }, [appState, p5Instance, startDetection, cameraActive]);

  const handleStart = useCallback(() => {
    if (isML5Loaded) {
      setAppState("loading");
    }
  }, [isML5Loaded]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "c") {
        clearPainting();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearPainting]);

  useEffect(() => {
    setClearCanvas(clearPainting);
  }, [clearPainting]);

  return (
    <>
      <div ref={containerRef} className="canvas-container" />

      {!isML5Loaded && (
        <div className="library-loading">
          Cargando librerías ML5JS y activando cámara...
        </div>
      )}
    </>
  );
}