// src/pages/CreateTask.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaChartBar, FaTasks } from 'react-icons/fa';
import '../styles/CreateTask.css';
import { createActividad, updateActividad } from '../api/actividadApi';

function CreateTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const tareaEdit = location.state?.tarea || null;

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [prioridad, setPrioridad] = useState("Media");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (tareaEdit) {
      setTitulo(tareaEdit.titulo || "");
      setDescripcion(tareaEdit.descripcion || "");
      setFecha(
        tareaEdit.fecha_vencimiento
          ? new Date(tareaEdit.fecha_vencimiento).toISOString().split("T")[0]
          : ""
      );
      setPrioridad(
        tareaEdit.prioridad
          ? tareaEdit.prioridad.charAt(0).toUpperCase() + tareaEdit.prioridad.slice(1)
          : "Media"
      );
    }
  }, [tareaEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim()) {
      alert("El título es obligatorio");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        titulo,
        descripcion,
        prioridad: prioridad.toLowerCase(),
        fecha_vencimiento: fecha || null
      };

      if (tareaEdit) {
        await updateActividad(tareaEdit.id_actividad, payload);
      } else {
        await createActividad(payload);
      }

      navigate("/tasks");
    } catch (error) {
      console.error("Error al guardar tarea:", error);
      alert("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-task-container">
      <div className="container">
        {/* Sidebar */}
        <aside className={`sidebar-create ${sidebarOpen ? '' : 'closed'}`}>
          {/* Título arriba */}
          <div className="sidebar-title-create">CyberMonkey</div>

          {/* Menú con iconos */}
          <nav className="menu-create" style={{ marginTop: '3rem' }}>
            <Link to="/home" className={window.location.pathname === '/home' ? 'active' : ''}>
              <FaHome className="icon" /><span>Inicio</span>
            </Link>
            <Link to="/estadisticas" className={window.location.pathname === '/estadisticas' ? 'active' : ''}>
              <FaChartBar className="icon" /><span>Estadísticas</span>
            </Link>
            <Link to="/tasks" className={window.location.pathname === '/tasks' ? 'active' : ''}>
              <FaTasks className="icon" /><span>Tareas</span>
            </Link>
          </nav>

          {/* Logo abajo */}
          <img src="/src/assets/home.png" alt="CyberMonkey" className="sidebar-logo" />
        </aside>

        {/* Botón hamburguesa */}
        <button
          className="menu-toggle-create"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        {/* Main */}
        <main className={`main ${sidebarOpen ? '' : 'closed'}`}>
          <h1>{tareaEdit ? "Editar tarea" : "Crear nueva tarea"}</h1>
          <p>Completa los campos para {tareaEdit ? "editar" : "agregar"} tu actividad</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="titulo">Título de la tarea</label>
              <input
                type="text"
                id="titulo"
                placeholder="Ej: Proyecto de IA"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <input
                type="text"
                id="descripcion"
                placeholder="Detalles de la tarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha">Fecha de vencimiento</label>
              <input
                type="date"
                id="fecha"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>

            <div className="form-group priority">
              <label htmlFor="prioridad">Prioridad</label>
              <select
                id="prioridad"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
              >
                <option>Baja</option>
                <option>Media</option>
                <option>Alta</option>
              </select>
            </div>

            <div className="buttons">
              <button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar tarea"}
              </button>
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
