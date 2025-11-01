import { Link } from 'react-router-dom';
import '../styles/Profile.css';

function Profile() {
  return (
    <div className="profile-container">
      <div className="container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo">CyberMonkey</div>
          <div className="menu">
            <Link to="/home"><button>🏠 Inicio</button></Link>
            <Link to="/profile"><button className="active">📊 Estadísticas</button></Link>
            <Link to="/tasks"><button>📝 Tareas</button></Link>
          </div>
          <div className="character">
            <img src="/src/assets/cybermonkey-character.png" alt="CyberMonkey" />
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          <h1>Mi perfil</h1>
          <p>Gestiona tu información personal y progreso</p>

          <div className="profile-header">
            <div className="avatar">👤</div>
            <div className="profile-info">
              <h2>Juan Perez</h2>
              <p>juanperez@example.com</p>
              <p>juan perez</p>
            </div>
          </div>

          <div className="cards">
            <div className="card">
              <h3>Progreso y estadísticas</h3>
              <ul>
                <li>🔥 250 puntos</li>
                <li>⚡ Racha activa</li>
                <li>📅 5 días seguidos</li>
              </ul>
            </div>

            <div className="card">
              <h3>Seguridad</h3>
              <ul>
                <li>🔑 Cambiar contraseña</li>
                <li>🛠️ Recuperar acceso</li>
              </ul>
            </div>
          </div>

          <footer>
            © 2025 CyberMonkey – Todos los derechos reservados
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Profile;