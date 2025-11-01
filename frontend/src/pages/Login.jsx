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
      // Simulamos una petición a la API (aquí iría tu lógica real)
      console.log('Datos de login:', formData);
      
      // Simulamos un delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validación básica (en producción esto vendría del backend)
      if (formData.email && formData.password) {
        // Guardamos en localStorage para simular sesión
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', formData.email);
        
        // Redirigimos a Home
        navigate('/home');
      } else {
        alert('Por favor completa todos los campos');
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al iniciar sesión');
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