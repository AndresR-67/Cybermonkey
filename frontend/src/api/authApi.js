// frontend/src/api/authApi.js

export async function loginRequest(identifier, contrasena) {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ identifier, contrasena })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  return data; // Contiene { token, user }
}
