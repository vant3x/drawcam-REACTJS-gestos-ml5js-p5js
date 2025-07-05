import React from 'react';

const LoadingMessage = ({ show }) => {
  if (!show) return null;
  return (
    <div className="loading">
      Cargando el modelo de ML5JS...
    </div>
  );
};

export default LoadingMessage;