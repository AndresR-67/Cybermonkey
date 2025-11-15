// frontend/src/api/authApi.js

export async function loginRequest(identifier, contrasena) {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, contrasena })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");
  return data; // Contiene { token, user }
}


export async function registerRequest({ nombres, apellidos, username, correo, contrasena, foto_perfil }) {
  const res = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombres, apellidos, username, correo, contrasena, foto_perfil })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al crear la cuenta");
  return data; // Contiene { user }
}
