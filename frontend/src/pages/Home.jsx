import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Usuario', email: '' });

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const userName = localStorage.getItem('userName') || 'Usuario';
    const userEmail = localStorage.getItem('userEmail') || '';
    setUser({ name: userName, email: userEmail });
  }, []);

  const handleLogout = () => {
    // Limpiar localStorage y redirigir a login
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <h2>CyberMonkey</h2>
          <nav className="menu">
            <Link to="/home">Inicio</Link>
            <Link to="/profile">Estadísticas</Link>
            <Link to="/tasks">Tareas</Link>
          </nav>
        </div>
        <img src="/src/assets/cybermonkey-logo.png" alt="CyberMonkey" />
      </aside>

      {/* Main content */}
      <main className="main">
        {/* Header */}
        <div className="header">
          <div>
            <h1>Bienvenido, {user.name}</h1>
            <p>Simplificando tu día a día</p>
            {user.email && <small>{user.email}</small>}
          </div>
          <div className="profile">
            <Link to="/profile">Perfil</Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className="content">
          <div className="card">
            <h2>Recompensas</h2>
            <p>¡Bienvenido a CyberMonkey! Comienza a gestionar tus tareas.</p>
          </div>
          <div className="card">
            <h2>Estadísticas Rápidas</h2>
            <p>0 tareas completadas</p>
            <p>0 días de racha</p>
          </div>
          <div className="card">
            <h2>Próximas actividades</h2>
            <p>No hay tareas pendientes</p>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          © 2025 CyberMonkey — Todos los derechos reservados
        </div>
      </main>
    </div>
  );
}

export default Home;