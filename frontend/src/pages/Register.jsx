import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulamos registro en la API
      console.log('Datos de registro:', formData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.firstName && formData.lastName && formData.email && formData.password) {
        // Guardamos en localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
        
        // Redirigimos a Home
        navigate('/home');
      } else {
        alert('Por favor completa todos los campos');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      alert('Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="container">
        {/* Columna izquierda */}
        <div className="left">
          <p>Gestiona tu tiempo,<br />alcanza tus metas.</p>
          <img src="/src/assets/register-illustration.png" alt="Ilustración escritorio" />
        </div>

        {/* Columna derecha */}
        <div className="right">
          <div className="form-container">
            <h1>Crear <span style={{color: '#fff'}}>Cuenta</span></h1>
            
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <input 
                  type="text" 
                  name="firstName"
                  placeholder="Nombres" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="text" 
                  name="lastName"
                  placeholder="Apellidos" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
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
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>

            <div className="login-link">
              ¿Tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;