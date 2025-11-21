import React, { useState } from "react";
import { useAccessibility } from "../hooks/useAccessibility";
import "../styles/GlobalAccessibility.css";

const GlobalAccessibilityButton = () => {
  const { accessibilityMode, toggleAccessibilityMode } = useAccessibility();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = (e) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  const handleMainButtonClick = () => {
    if (!isCollapsed) {
      toggleAccessibilityMode();
    }
  };

  return (
    <div
      className={`global-accessibility-container ${
        isCollapsed ? "collapsed" : ""
      }`}
    >
      <button
        onClick={handleMainButtonClick}
        className={`global-accessibility-btn ${
          accessibilityMode ? "active" : ""
        } ${isCollapsed ? "collapsed" : ""}`}
        aria-label={
          accessibilityMode
            ? "Desactivar modo accesibilidad"
            : "Activar modo accesibilidad"
        }
        disabled={isCollapsed} // Deshabilitado cuando está colapsado
      >
        {/* Solo mostrar contenido cuando NO está colapsado */}
        {!isCollapsed && (
          <>
            <p className="accessibility-title">Modo accesibilidad</p>
            <span className="accessibility-text">
              {accessibilityMode ? "ENCENDIDO" : "APAGADO"}
            </span>
          </>
        )}
      </button>

      {/* Botón de toggle SEPARADO - siempre visible */}
      <button
        className="accessibility-toggle"
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Expandir botón" : "Colapsar botón"}
        onFocus={(e) => e.target.blur()}
      >
        <span className="toggle-arrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 15 15"
          >
            <path
              fill="currentColor"
              d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"
            />
          </svg>
        </span>
        <span className="accessibility-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 6q-.825 0-1.412-.587T10 4t.588-1.412T12 2t1.413.588T14 4t-.587 1.413T12 6M9 21V9H4q-.425 0-.712-.288T3 8t.288-.712T4 7h16q.425 0 .713.288T21 8t-.288.713T20 9h-5v12q0 .425-.288.713T14 22t-.712-.288T13 21v-5h-2v5q0 .425-.288.713T10 22t-.712-.288T9 21"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default GlobalAccessibilityButton;
