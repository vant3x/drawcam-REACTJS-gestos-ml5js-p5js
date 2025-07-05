import { useState, useEffect, useCallback } from 'react';

const useML5HandPose = (onHandsDetected) => {
  const [handPose, setHandPose] = useState(null);
  const [isML5Loaded, setIsML5Loaded] = useState(false);

  useEffect(() => {
    const loadML5 = async () => {
      if (!window.ml5) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/ml5@1/dist/ml5.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Esperar a que ml5 esté completamente cargado
      while (!window.ml5 || !window.ml5.handPose) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const hp = window.ml5.handPose({ flipped: true });
      setHandPose(hp);
      setIsML5Loaded(true);
    };

    loadML5().catch(console.error);
  }, []);

  const startDetection = useCallback((video) => {
    if (handPose && video) {
      handPose.detectStart(video, onHandsDetected);
    }
  }, [handPose, onHandsDetected]);

  return { handPose, isML5Loaded, startDetection };
};

export default useML5HandPose;