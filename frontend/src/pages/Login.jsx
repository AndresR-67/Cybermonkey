import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          identifier: formData.email,
          contrasena: formData.password
        })
      });

      if (!res.ok) {
        throw new Error("Error en las credenciales");
      }

      const data = await res.json();

      // Guardamos el token y el usuario completo
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigimos
      navigate("/home");

    } catch (error) {
      console.error("Error en login:", error);
      alert("Credenciales incorrectas o servidor no disponible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        {/* Columna izquierda */}
        <div className="left">
          <h1>Bienvenido!</h1>
          <p>Por favor ingresa tus datos</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input 
                type="email" 
                name="email"
                placeholder="Correo Electrónico" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input 
                type="password" 
                name="password"
                placeholder="Contraseña" 
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Inicia sesión'}
            </button>
          </form>

          <div className="register">
            No tienes una cuenta? <Link to="/register">Regístrate</Link>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="right"></div>
      </div>
    </div>
  );
}

export default Login;
