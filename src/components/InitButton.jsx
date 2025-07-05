import React from 'react';

const InitButton = ({ show, onStart, disabled }) => (
  show ? (
    <div className="init">
      <button onClick={onStart} disabled={disabled}>
        {disabled ? 'Cargando...' : 'Comienza a dibujar'}
      </button>
    </div>
  ) : null
);

export default InitButton;