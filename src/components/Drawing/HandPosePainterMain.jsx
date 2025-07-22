{/*import React, { useRef, useEffect, useState, useCallback } from "react";

import Instructions from "../Instructions";
import LoadingMessage from "../LoadingMessage";
import InitButton from "../InitButton";
import DrawingControls from "./../DrawingControls";
import useML5HandPose from "../../hooks/useML5HandPose";
import useP5Sketch from "../../hooks/useP5Sketch";
import './../../App.css';
const HandPosePainter = () => {
  const [appState, setAppState] = useState("init");

  const handsRef = useRef([]); 
  const appStateRef = useRef("init"); 
  const videoRef = useRef(null);
  const paintingRef = useRef(null);
  const previousPosRef = useRef({ x: 0, y: 0 });
  const isInitializedRef = useRef(false);

  const { isML5Loaded, startDetection } = useML5HandPose((results) => {
    handsRef.current = results; 
  });

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
        p.createCanvas(640, 480);
        paintingRef.current = p.createGraphics(640, 480);
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

        p.image(videoRef.current, 0, 0);

        // Usa handsRef.current para acceder a los datos de las manos
        const currentHands = handsRef.current;
        if (currentHands.length > 0) {
          const hand = currentHands[0];
          const index = hand.index_finger_tip;
          const thumb = hand.thumb_tip;

          if (index && thumb) {
            const x = (index.x + thumb.x) * 0.5;
            const y = (index.y + thumb.y) * 0.5;

            const distance = p.dist(index.x, index.y, thumb.x, thumb.y);
            if (distance < 20) {
              paintingRef.current.stroke(255, 255, 0);
              paintingRef.current.strokeWeight(8);
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
          }
        }
    
        p.image(paintingRef.current, 0, 0);
      };

      p.keyPressed = () => {
        if (p.key === "c" || p.key === "C") {
          clearPainting();
        }
      };
    },
    [clearPainting]
  ); 

  // Hook para P5 Sketch: monta el lienzo y proporciona la instancia de p5.js
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
      appState === "loading" &&
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
    }
  }, [appState, p5Instance, startDetection]); 



  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "c") {
        clearPainting();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearPainting]);

    // Función para iniciar la aplicación (llamada por el botón)
    const handleStart = useCallback(() => {
      if (isML5Loaded) {
        setAppState("loading");
      }
    }, [isML5Loaded]);

  return (
    <div className="app">
      <div className="container">
        <div ref={containerRef} className="canvas-container" />

        <Instructions />

        {!isML5Loaded && (
          <div className="library-loading">Cargando librerías ML5JS...</div>
        )}

        <LoadingMessage show={appState === "loading"} />

        <InitButton
          show={appState === "init"}
          onStart={handleStart}
          disabled={!isML5Loaded}
        />

        <DrawingControls
          show={appState === "running"}
          onClear={clearPainting}
        />
      </div>

      <footer className="footer">&copy; Alevante</footer>
    </div>
  );
};

export default HandPosePainter;
*/}