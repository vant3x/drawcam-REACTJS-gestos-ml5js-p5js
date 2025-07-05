import { useState, useEffect, useRef } from 'react';
import useML5Loader from './useML5HandPose';
import HandPosePainterClass from '../classes/HandPosePainterP5';

const useHandPosePainter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showInit, setShowInit] = useState(false);
  const [error, setError] = useState(null);
  
  const containerRef = useRef(null);
  const handPosePainterRef = useRef(null);
  
  const { isML5Loaded, loadError } = useML5Loader();

  useEffect(() => {
    if (isML5Loaded) {
      setIsLoading(false);
      setShowInit(true);
    }
    if (loadError) {
      setError(loadError);
      setIsLoading(false);
    }
  }, [isML5Loaded, loadError]);

  const startCamera = async () => {
    if (handPosePainterRef.current || !isML5Loaded) return;

    setShowInit(false);
    setIsLoading(true);
    setError(null);

    try {
      handPosePainterRef.current = new HandPosePainterClass(
        containerRef.current,
        () => {
          setIsLoading(false);
          setIsInitialized(true);
        },
        (errorMsg) => {
          setError(errorMsg);
          setIsLoading(false);
          setShowInit(true);
          // Limpiar la referencia si hay error
          if (handPosePainterRef.current) {
            handPosePainterRef.current.destroy();
            handPosePainterRef.current = null;
          }
        }
      );
    } catch (err) {
      setError('Error al inicializar la cámara: ' + err.message);
      setIsLoading(false);
      setShowInit(true);
    }
  };

  const clearPainting = () => {
    if (handPosePainterRef.current) {
      handPosePainterRef.current.clearPainting();
    }
  };

  const cleanup = () => {
    if (handPosePainterRef.current) {
      handPosePainterRef.current.destroy();
      handPosePainterRef.current = null;
      setIsInitialized(false);
      setShowInit(false);
    }
  };

  return {
    isLoading,
    isInitialized,
    showInit,
    error,
    containerRef,
    startCamera,
    clearPainting,
    cleanup,
    canStart: isML5Loaded && !isLoading
  };
};

export default useHandPosePainter;