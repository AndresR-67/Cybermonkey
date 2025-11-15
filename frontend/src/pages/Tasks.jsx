// src/pages/Tasks.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHome, FaChartBar, FaFolder, FaEdit, FaTrash, 
  FaStickyNote, FaPlus, FaUserCircle 
} from 'react-icons/fa';
import '../styles/Tasks.css';
import {
  getActividades,
  completeActividad,
  deleteActividad,
  addNota,
  getNotas
} from '../api/actividadApi';
import logo from "../assets/home.png"; // Reciclamos logo de Estadisticas

function Tasks() {
  const navigate = useNavigate();
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notaModal, setNotaModal] = useState({ abierta: false, notas: [], tituloTarea: "", idActividad: null });
  const [notaTemp, setNotaTemp] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    fetchTareas();
  }, []);

  const fetchTareas = async () => {
    setLoading(true);
    try {
      const data = await getActividades();
      setTareas(data.actividades);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeActividad(id);
      setTareas((prev) =>
        prev.map((t) =>
          t.id_actividad === id ? { ...t, estado: "completada" } : t
        )
      );
    } catch (error) {
      console.error("Error al completar tarea:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta tarea?")) return;
    try {
      await deleteActividad(id);
      setTareas((prev) => prev.filter((t) => t.id_actividad !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  const handleVerNotas = async (tarea) => {
    try {
      const data = await getNotas(tarea.id_actividad);
      setNotaModal({
        abierta: true,
        notas: data.notas || [],
        tituloTarea: tarea.titulo,
        idActividad: tarea.id_actividad
      });
      setNotaTemp("");
    } catch (error) {
      console.error("Error al cargar notas:", error);
      alert("No se pudieron cargar las notas de esta tarea.");
    }
  };

  const handleCerrarModal = () => {
    setNotaModal({ abierta: false, notas: [], tituloTarea: "", idActividad: null });
    setNotaTemp("");
  };

  const handleAgregarNota = async () => {
    if (!notaTemp.trim()) return;

    try {
      const nuevaNota = await addNota(notaModal.idActividad, notaTemp);
      setNotaModal((prev) => ({
        ...prev,
        notas: [...prev.notas, nuevaNota.nota]
      }));
      setNotaTemp("");
    } catch (error) {
      console.error("Error al agregar nota:", error);
      alert("No se pudo guardar la nota. Intenta nuevamente.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredTareas = tareas.filter((t) =>
    t.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tasks-container">
      {/* Sidebar */}
      <aside className={`sidebar-tasks ${sidebarOpen ? '' : 'closed'}`}>
        {/* Título arriba */}
        <div className="sidebar-title-tasks">CyberMonkey</div>

        {/* Menú con iconos más abajo */}
        <nav className="menu-tasks" style={{ marginTop: '3rem' }}>
          <Link to="/home" className={window.location.pathname === '/home' ? 'active' : ''}>
            <FaHome className="icon" /><span>Inicio</span>
          </Link>
          <Link to="/estadisticas" className={window.location.pathname === '/estadisticas' ? 'active' : ''}>
            <FaChartBar className="icon" /><span>Estadísticas</span>
          </Link>
          <Link to="/tasks" className={window.location.pathname === '/tasks' ? 'active' : ''}>
            <FaFolder className="icon" /><span>Tareas</span>
          </Link>
        </nav>

        {/* Logo abajo */}
        <img src={logo} alt="CyberMonkey" className="sidebar-logo" />
      </aside>

      {/* Botón hamburguesa */}
      <button
        className="menu-toggle-tasks"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Main content */}
      <main className={`main-tasks ${sidebarOpen ? '' : 'closed'}`}>
        <div className="header-tasks">
          <div>
            <h2>Mis tareas</h2>
            <p>Gestiona y organiza tus actividades</p>
          </div>

          {/* USER MENU */}
          <div className="user-menu">
            <FaUserCircle
              className="user-icon"
              onClick={() => setOpenMenu(!openMenu)}
            />
            {openMenu && (
              <div className="dropdown">
                <Link to="/profile">Perfil</Link>
                <button onClick={handleLogout}>Cerrar Sesión</button>
              </div>
            )}
          </div>
        </div>

        <Link to="/create-task">
          <button className="btn-add"><FaPlus /> Nueva Tarea</button>
        </Link>

        <div className="filters">
          <input
            type="text"
            placeholder="Buscar tarea..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span>Filtrar estado | Fecha / prioridad / nombre</span>
        </div>

        {loading ? (
          <p>Cargando tareas...</p>
        ) : (
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
              {filteredTareas.map((t) => (
                <tr key={t.id_actividad}>
                  <td>
                    <input
                      type="checkbox"
                      checked={t.estado === "completada"}
                      onChange={() => handleComplete(t.id_actividad)}
                    />
                  </td>
                  <td>{t.titulo}</td>
                  <td>{t.fecha_vencimiento ? new Date(t.fecha_vencimiento).toLocaleDateString() : "-"}</td>
                  <td className={`priority ${t.prioridad}`}>
                    {t.prioridad.charAt(0).toUpperCase() + t.prioridad.slice(1)}
                  </td>
                  <td className="actions">
                    <button onClick={() => navigate("/create-task", { state: { tarea: t } })}><FaEdit /></button>
                    <button onClick={() => handleVerNotas(t)}><FaStickyNote /></button>
                    <button onClick={() => handleDelete(t.id_actividad)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
              {filteredTareas.length === 0 && (
                <tr>
                  <td colSpan="5">No se encontraron tareas.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Modal de notas */}
        {notaModal.abierta && (
          <div className="modal">
            <div className="modal-content">
              <h3>Notas de "{notaModal.tituloTarea}"</h3>
              <ul>
                {notaModal.notas.length === 0 && <li>No hay notas</li>}
                {notaModal.notas.map((n, i) => (
                  <li key={i}>{n.contenido}</li>
                ))}
              </ul>

              <div className="add-note">
                <textarea
                  placeholder="Escribe una nota..."
                  value={notaTemp}
                  onChange={(e) => setNotaTemp(e.target.value)}
                />
                <button type="button" onClick={handleAgregarNota}><FaPlus /> Guardar nota</button>
              </div>

              <button className="close-btn" onClick={handleCerrarModal}>Cerrar</button>
            </div>
          </div>
        )}

        <div className="footer">
          © 2025 CyberMonkey – Todos los derechos reservados
        </div>
      </main>
    </div>
  );
}

export default Tasks;
