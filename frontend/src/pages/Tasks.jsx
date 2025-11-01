import { Link } from 'react-router-dom';
import '../styles/Tasks.css';

function Tasks() {
  return (
    <div className="tasks-container">
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
        <div className="header">
          <div>
            <h2>Mis tareas</h2>
            <p>Gestiona y organiza tus actividades</p>
          </div>
          <div className="profile">
            <img src="/src/assets/user-avatar.png" alt="Usuario" />
          </div>
        </div>

        <Link to="/create-task">
          <button className="btn-add">+ Nueva Tarea</button>
        </Link>

        <div className="filters">
          <input type="text" placeholder="🔍 Buscar tarea" />
          <span>Filtrar estado | Fecha / prioridad / nombre</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Estado</th>
              <th>Tarea</th>
              <th>Fecha</th>
              <th>Prioridad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="checkbox" /></td>
              <td>Exposición sobre IA</td>
              <td>Sep-23</td>
              <td className="priority alta">Alta</td>
              <td className="actions">✏️ 🗑️</td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>Marco Teórico</td>
              <td>Nov-15</td>
              <td className="priority alta">Alta</td>
              <td className="actions">✏️ 🗑️</td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>Arreglar correcciones tesis</td>
              <td>Sep-10</td>
              <td className="priority alta">Alta</td>
              <td className="actions">✏️ 🗑️</td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>Tarea Inglés IV</td>
              <td>Sep-15</td>
              <td className="priority media">Media</td>
              <td className="actions">✏️ 🗑️</td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>Organizar Laboratorio</td>
              <td>Sep-01</td>
              <td className="priority baja">Baja</td>
              <td className="actions">✏️ 🗑️</td>
            </tr>
          </tbody>
        </table>

        <div className="footer">
          © 2025 CyberMonkey – Todos los derechos reservados
        </div>
      </main>
    </div>
  );
}

export default Tasks;