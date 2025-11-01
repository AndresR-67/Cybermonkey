import { Link } from 'react-router-dom';
import '../styles/CreateTask.css';

function CreateTask() {
  return (
    <div className="create-task-container">
      <div className="container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo">CyberMonkey</div>
          <div className="menu">
            <Link to="/home"><button>🏠 Inicio</button></Link>
            <Link to="/profile"><button>📊 Estadísticas</button></Link>
            <Link to="/tasks"><button>📝 Tareas</button></Link>
          </div>
          <div className="character">
            <img src="/src/assets/cybermonkey-character.png" alt="CyberMonkey" />
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          <h1>Crear nueva tarea</h1>
          <p>Completa los campos para agregar tu nueva actividad</p>

          <form>
            <div className="form-group">
              <label htmlFor="titulo">Título de la tarea</label>
              <input type="text" id="titulo" placeholder="Ej: Proyecto de IA" />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <input type="text" id="descripcion" placeholder="Detalles de la tarea" />
            </div>

            <div className="form-group">
              <label htmlFor="fecha">Fecha de vencimiento</label>
              <input type="date" id="fecha" />
            </div>

            <div className="form-group priority">
              <label htmlFor="prioridad">Prioridad</label>
              <select id="prioridad">
                <option>Baja</option>
                <option>Media</option>
                <option>Alta</option>
              </select>
            </div>

            <div className="buttons">
              <button type="submit">Guardar tarea</button>
              <Link to="/tasks">
                <button type="button" className="cancel">Cancelar</button>
              </Link>
            </div>
          </form>

          <footer>
            © 2025 CyberMonkey – Todos los derechos reservados
          </footer>
        </main>
      </div>
    </div>
  );
}

export default CreateTask;