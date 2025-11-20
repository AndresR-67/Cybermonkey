import { useState, useEffect } from 'react';

export const useAccessibility = () => {
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  useEffect(() => {
    // Leer del localStorage al cargar
    const savedMode = localStorage.getItem('globalAccessibilityMode');
    if (savedMode === 'true') {
      setAccessibilityMode(true);
      document.body.classList.add('global-accessibility-mode');
    }
  }, []);

  const toggleAccessibilityMode = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    
    if (newMode) {
      document.body.classList.add('global-accessibility-mode');
      localStorage.setItem('globalAccessibilityMode', 'true');
    } else {
      document.body.classList.remove('global-accessibility-mode');
      localStorage.setItem('globalAccessibilityMode', 'false');
    }
  };

  return { accessibilityMode, toggleAccessibilityMode };
};