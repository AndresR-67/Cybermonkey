// src/utils/niveles.js

// Tabla base de niveles
export const niveles = [
  { nivel: 1, titulo: "Principiante", xp_min: 0, xp_max: 99 },
  { nivel: 2, titulo: "Aprendiz", xp_min: 100, xp_max: 249 },
  { nivel: 3, titulo: "Iniciado", xp_min: 250, xp_max: 499 },
  { nivel: 4, titulo: "Competente", xp_min: 500, xp_max: 999 },
  { nivel: 5, titulo: "Avanzado", xp_min: 1000, xp_max: 1999 },
  { nivel: 6, titulo: "Experto", xp_min: 2000, xp_max: 3499 },
  { nivel: 7, titulo: "Maestro", xp_min: 3500, xp_max: 4999 },
  { nivel: 8, titulo: "Élite", xp_min: 5000, xp_max: 6999 },
  { nivel: 9, titulo: "Pro", xp_min: 7000, xp_max: 9999 },
  { nivel: 10, titulo: "Leyenda", xp_min: 10000, xp_max: 14999 }
];

// Función principal: devuelve toda la info del nivel
export function calcularNivel(xp) {
  let regla = niveles.find(n => xp >= n.xp_min && xp <= n.xp_max);

  // Caso niveles infinitos (supera los 14999 XP)
  if (!regla) {
    const ultimo = niveles[niveles.length - 1];

    const extra = Math.floor((xp - ultimo.xp_max) / 5000);
    const nivelExtra = ultimo.nivel + extra;

    const xp_min = ultimo.xp_max + (extra * 5000) + 1;
    const xp_max = xp_min + 4999;

    regla = {
      nivel: nivelExtra,
      titulo: `Leyenda+${extra}`,
      xp_min,
      xp_max
    };
  }

  const xp_faltante = regla.xp_max - xp + 1;
  const rango = regla.xp_max - regla.xp_min + 1;
  const progreso = ((xp - regla.xp_min) / rango) * 100;

  return {
    nivel: regla.nivel,
    titulo: regla.titulo,
    xp_min: regla.xp_min,
    xp_max: regla.xp_max,
    xp_faltante,
    porcentaje_progreso: Math.min(100, Math.max(0, progreso.toFixed(2)))
  };
}
