// src/utils/niveles.js

// Tabla base de niveles: XP requerida para subir de nivel
export const niveles = [
  { nivel: 1, xp_min: 0, xp_max: 99 },
  { nivel: 2, xp_min: 100, xp_max: 249 },
  { nivel: 3, xp_min: 250, xp_max: 499 },
  { nivel: 4, xp_min: 500, xp_max: 999 },
  { nivel: 5, xp_min: 1000, xp_max: 1999 },
  { nivel: 6, xp_min: 2000, xp_max: 3499 },
  { nivel: 7, xp_min: 3500, xp_max: 4999 },
  { nivel: 8, xp_min: 5000, xp_max: 6999 },
  { nivel: 9, xp_min: 7000, xp_max: 9999 },
  { nivel: 10, xp_min: 10000, xp_max: 14999 }
];

// Devuelve el nivel actual según la cantidad total de XP
export function calcularNivel(xp) {
  const nivel = niveles.find(n => xp >= n.xp_min && xp <= n.xp_max);
  if (nivel) return nivel.nivel;
  // Si supera el último nivel, continúa aumentando cada 5000 XP
  const ultimo = niveles[niveles.length - 1];
  const extra = Math.floor((xp - ultimo.xp_max) / 5000);
  return ultimo.nivel + extra;
}

// Devuelve el XP restante para subir al siguiente nivel
export function xpParaSiguienteNivel(xp) {
  const nivel = calcularNivel(xp);
  const info = niveles.find(n => n.nivel === nivel);
  if (info) return info.xp_max - xp + 1;
  const ultimo = niveles[niveles.length - 1];
  const extraXp = 5000 - ((xp - ultimo.xp_max) % 5000);
  return extraXp;
}
