import p5 from 'p5';

export default class HandPosePainterClass {
  constructor(container, onReady, onError) {
    this.video = null;
    this.handPose = null;
    this.hands = [];
    this.painting = null;
    this.px = 0;
    this.py = 0;
    this.canvas = null;
    this.isInitialized = false;
    this.container = container;
    this.onReady = onReady;
    this.onError = onError;
    this.p5Instance = null;
    this.videoReady = false;
    this.init();
  }

  async init() {
    try {
      // Esperar a que las librerías estén disponibles
      await this.waitForLibraries();
      
      this.p5Instance = new p5((p) => {
        p.preload = () => {
          try {
            this.handPose = window.ml5.handPose({ 
              flipped: true,
              maxHands: 1
            });
          } catch (error) {
            console.error('Error en preload:', error);
            this.onError('Error al inicializar HandPose: ' + error.message);
          }
        };

        p.setup = () => {
          try {
            this.canvas = p.createCanvas(640, 480);
            this.canvas.parent(this.container);
            this.canvas.class('hand-pose-canvas');

            // Crear buffer de pintura
            this.painting = p.createGraphics(640, 480);
            this.painting.clear();

            // Configurar video
            this.setupVideo(p);

          } catch (error) {
            console.error('Error en setup:', error);
            this.onError('Error en setup: ' + error.message);
          }
        };

        p.draw = () => {
          if (!this.isInitialized || !this.video || !this.videoReady) return;

          try {
            // Verificar que el video tenga dimensiones válidas
            if (this.video.width === 0 || this.video.height === 0) return;

            // Dibujar video de fondo
            p.image(this.video, 0, 0, 640, 480);

            // Procesar manos detectadas
            if (this.hands && this.hands.length > 0) {
              this.processHands(p);
            }

            // Superponer pintura sobre video
            p.image(this.painting, 0, 0);
          } catch (error) {
            console.error('Error en draw:', error);
          }
        };

        p.keyPressed = () => {
          if (p.key === "c" || p.key === "C") {
            this.clearPainting();
          }
        };
      });
    } catch (error) {
      console.error('Error al inicializar:', error);
      this.onError('Error al inicializar: ' + error.message);
    }
  }

  async waitForLibraries() {
    let attempts = 0;
    const maxAttempts = 50;
    
    while ((!window.ml5) && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (!window.ml5) {
      throw new Error('ml5.js no está disponible');
    }
  }

  setupVideo(p) {
    // Configurar video con callback simplificado
    this.video = p.createCapture(p.VIDEO, () => {
      console.log('Video capture created');
      this.videoReady = true;
      this.startHandDetection();
      
      if (!this.isInitialized) {
        this.isInitialized = true;
        this.onReady();
      }
    });

    this.video.hide();

    // Fallback timeout para casos donde el callback no se ejecuta
    setTimeout(() => {
      if (!this.isInitialized) {
        console.log('Usando fallback timeout para inicialización');
        this.videoReady = true;
        this.startHandDetection();
        this.isInitialized = true;
        this.onReady();
      }
    }, 3000);
  }

  startHandDetection() {
    if (this.handPose && this.video) {
      try {
        this.handPose.detectStart(this.video, (results) => {
          this.hands = results;
        });
      } catch (error) {
        console.error('Error iniciando detección:', error);
      }
    }
  }

  processHands(p) {
    const hand = this.hands[0];
    if (!hand) return;

    // Manejar diferentes estructuras de datos de ml5
    let indexTip, thumbTip;
    
    // Versión nueva de ml5 (con keypoints)
    if (hand.keypoints) {
      indexTip = hand.keypoints.find(kp => kp.name === 'index_finger_tip');
      thumbTip = hand.keypoints.find(kp => kp.name === 'thumb_tip');
    } 
    // Versión anterior de ml5 (propiedades directas)
    else if (hand.index_finger_tip && hand.thumb_tip) {
      indexTip = hand.index_finger_tip;
      thumbTip = hand.thumb_tip;
    }

    if (indexTip && thumbTip) {
      // Calcular punto medio entre índice y pulgar
      let x = (indexTip.x + thumbTip.x) * 0.5;
      let y = (indexTip.y + thumbTip.y) * 0.5;

      // Dibujar solo si los dedos están cerca
      let d = p.dist(indexTip.x, indexTip.y, thumbTip.x, thumbTip.y);
      if (d < 30) {
        this.painting.stroke(255, 255, 0);
        this.painting.strokeWeight(8);
        if (this.px !== 0 && this.py !== 0) {
          this.painting.line(this.px, this.py, x, y);
        }
      }

      // Actualizar posición anterior
      this.px = x;
      this.py = y;

      // Dibujar indicadores visuales
      this.drawHandIndicators(p, indexTip, thumbTip, d);
    }
  }

  drawHandIndicators(p, index, thumb, distance) {
    // Dibujar puntos en las puntas de los dedos
    p.fill(255, 0, 0);
    p.noStroke();
    p.circle(index.x, index.y, 10);

    p.fill(0, 255, 0);
    p.circle(thumb.x, thumb.y, 10);

    // Dibujar línea entre los dedos
    p.stroke(255);
    p.strokeWeight(2);
    p.line(index.x, index.y, thumb.x, thumb.y);

    // Mostrar distancia
    p.fill(255);
    p.noStroke();
    p.textAlign(p.CENTER);
    p.text(
      Math.round(distance),
      (index.x + thumb.x) / 2,
      (index.y + thumb.y) / 2 - 15
    );
  }

  clearPainting() {
    if (this.painting) {
      this.painting.clear();
    }
  }

  destroy() {
    try {
      if (this.handPose) {
        this.handPose.detectStop?.();
      }
      if (this.video && this.video.elt) {
        const stream = this.video.elt.srcObject;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        this.video.remove();
      }
      if (this.p5Instance) {
        this.p5Instance.remove();
      }
    } catch (error) {
      console.error('Error en destroy:', error);
    }
    
    this.p5Instance = null;
    this.video = null;
    this.handPose = null;
    this.isInitialized = false;
    this.videoReady = false;
  }
}