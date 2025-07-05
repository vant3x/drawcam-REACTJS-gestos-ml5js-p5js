import { useRef, useEffect } from 'react';
import p5 from 'p5';

const useP5Sketch = (sketchFn, dependencies = []) => {
  const containerRef = useRef(null);
  const p5InstanceRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && sketchFn) {
      // Limpiar instancia anterior si existe
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
      
      // Crear nueva instancia
      p5InstanceRef.current = new p5(sketchFn, containerRef.current);
    }

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [sketchFn]);

  return { containerRef, p5Instance: p5InstanceRef.current };
};

export default useP5Sketch;