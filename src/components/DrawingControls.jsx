const DrawingControls = ({ show, onClear }) => {
    if (!show) return null;
    
    return (
      <div className="controls">
      <button onClick={onClear}>
        Limpiar espacio <i className="fa-solid fa-eraser"></i>
      </button>
    </div>
    );
  };
  
  export default DrawingControls;