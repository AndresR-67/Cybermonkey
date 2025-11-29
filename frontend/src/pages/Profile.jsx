import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaHome, FaChartBar, FaFolder, FaUserCircle, FaLock, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import "../styles/Home.css";
import "../styles/Profile.css";
import { useTypingGlitch } from "../hooks/useTypingGlitch";
import logo from "../assets/home.png";
import { actualizarPerfil, cambiarContrasena, eliminarCuenta } from "../api/usuarioApi";

function Profile() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Estados para los formularios
  const [mostrarEditarInfo, setMostrarEditarInfo] = useState(false);
  const [mostrarCambiarPass, setMostrarCambiarPass] = useState(false);
  const [mostrarEliminarCuenta, setMostrarEliminarCuenta] = useState(false);

  // Estados para formulario de editar información
  const [formInfo, setFormInfo] = useState({
    nombres: "",
    apellidos: "",
    correo: ""
  });

  // Estados para formulario de cambiar contraseña
  const [formPassword, setFormPassword] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmarContrasena: ""
  });

  // Estados para eliminar cuenta
  const [contrasenaEliminar, setContrasenaEliminar] = useState("");

  // Estados de carga y mensajes
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const mensajes = [
    "Optimiza tu código interno, versión por versión.",
    "Un maestro del sistema también entiende su propio perfil.",
    "Actualizarte a ti mismo es la mejor mejora.",
    "La disciplina es tu parche de seguridad.",
    "No eres NPC. Toma control de tus parámetros."
  ];

  const [randomMsg] = useState(() =>
    mensajes[Math.floor(Math.random() * mensajes.length)]
  );

  const { displayed, isDone } = useTypingGlitch(randomMsg, 35);
  const [showGlitch, setShowGlitch] = useState(false);

  useEffect(() => {
    if (!isDone) return setShowGlitch(false);
    const enable = setTimeout(() => setShowGlitch(true), 100);
    const disable = setTimeout(() => setShowGlitch(false), 2600);
    return () => { clearTimeout(enable); clearTimeout(disable); };
  }, [isDone]);

  const API_URL = import.meta.env.VITE_API_URL;

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  fetch(`${API_URL}/usuarios/perfil`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      setPerfil(data);
      setFormInfo({
        nombres: data.nombres,
        apellidos: data.apellidos,
        correo: data.correo
      });
    })
    .catch(err => console.error("Error cargando perfil:", err));
}, [navigate]);


  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Mostrar mensaje temporal
  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 4000);
  };

  // EDITAR INFORMACIÓN
  const handleEditarInfo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const datos = await actualizarPerfil(formInfo);
      setPerfil({ ...perfil, ...datos });
      mostrarMensaje("success", "Información actualizada correctamente");
      setMostrarEditarInfo(false);
    } catch (error) {
      mostrarMensaje("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // CAMBIAR CONTRASEÑA
  const handleCambiarPassword = async (e) => {
    e.preventDefault();

    if (formPassword.nuevaContrasena !== formPassword.confirmarContrasena) {
      mostrarMensaje("error", "Las contraseñas no coinciden");
      return;
    }

    if (formPassword.nuevaContrasena.length < 6) {
      mostrarMensaje("error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await cambiarContrasena(formPassword.contrasenaActual, formPassword.nuevaContrasena);
      mostrarMensaje("success", "Contraseña cambiada correctamente");
      setMostrarCambiarPass(false);
      setFormPassword({ contrasenaActual: "", nuevaContrasena: "", confirmarContrasena: "" });
    } catch (error) {
      mostrarMensaje("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ELIMINAR CUENTA
  const handleEliminarCuenta = async (e) => {
    e.preventDefault();

    if (!contrasenaEliminar) {
      mostrarMensaje("error", "Debes ingresar tu contraseña");
      return;
    }

    setLoading(true);

    try {
      await eliminarCuenta(contrasenaEliminar);
      mostrarMensaje("success", "Cuenta eliminada correctamente");
      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 2000);
    } catch (error) {
      mostrarMensaje("error", error.message);
      setLoading(false);
    }
  };

  if (!perfil) return <div className="loading neon-text">Cargando...</div>;

  return (
    <div className="home-container">

      {/* SIDEBAR */}
      <aside className={`sidebar sidebar-yellow ${sidebarOpen ? "" : "closed"}`}>
        <div className="sidebar-top">
          <h2 className="sidebar-title">CyberMonkey</h2>

          <nav className="menu">
            <Link to="/home"><FaHome className="icon" /><span>Inicio</span></Link>
            <Link to="/estadisticas"><FaChartBar className="icon" /><span>Estadísticas</span></Link>
            <Link to="/tasks"><FaFolder className="icon" /><span>Tareas</span></Link>
          </nav>
        </div>
        <img src={logo} alt="CyberMonkey" className="sidebar-logo" />
      </aside>

      {/* BOTON HAMBURGUESA */}
      <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

      {/* PRINCIPAL */}
      <main className="main">

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

        {/* HEADER */}
        <header className="header">
          <div className="header-text">
            <h1 className="header-title">Tu Perfil</h1>
            <p
              className={`cyber-message ${showGlitch ? "glitch" : ""}`}
              data-text={randomMsg}
            >
              {displayed}
            </p>
          </div>
        </header>

        {/* MENSAJE DE ESTADO */}
        {mensaje.texto && (
          <div className={`mensaje ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        {/* CONTENIDO */}
        <div className="content">

          {/* CARD: INFORMACIÓN DEL USUARIO */}
          <div className="card">
            <h2>Información Personal</h2>
            <p><strong>Nombre:</strong> {perfil.nombres}</p>
            <p><strong>Apellidos:</strong> {perfil.apellidos}</p>
            <p><strong>Correo:</strong> {perfil.correo}</p>
            <p><strong>Nivel actual:</strong> {perfil.nivel_actual}</p>
            <p><strong>XP acumulada:</strong> {perfil.xp_total}</p>
          </div>

          {/* CARD: OPCIONES DE PERFIL */}
          <div className="card">
            <h2>Opciones de Cuenta</h2>

            <button 
              className="profile-btn"
              onClick={() => setMostrarEditarInfo(!mostrarEditarInfo)}
            >
              <FaEdit className="icon" /> Editar información
            </button>

            <button 
              className="profile-btn"
              onClick={() => setMostrarCambiarPass(!mostrarCambiarPass)}
            >
              <FaLock className="icon" /> Cambiar contraseña
            </button>

            <button 
              className="profile-btn danger"
              onClick={() => setMostrarEliminarCuenta(!mostrarEliminarCuenta)}
            >
              <FaTrash className="icon" /> Eliminar cuenta
            </button>
          </div>

          {/* CARD: ESTADO */}
          <div className="card">
            <h2>Estado del Perfil</h2>
            <p><strong>Último inicio de sesión:</strong> {perfil.ultimo_login || "No disponible"}</p>
            <p><strong>Miembro desde:</strong> {perfil.fecha_creacion?.slice(0,10)}</p>
          </div>
        </div>

        {/* FORMULARIO: EDITAR INFORMACIÓN */}
        {mostrarEditarInfo && (
          <div className="form-overlay">
            <div className="form-container">
              <div className="form-header">
                <h3>Editar Información</h3>
                <FaTimes 
                  className="close-icon" 
                  onClick={() => setMostrarEditarInfo(false)}
                />
              </div>
              <form onSubmit={handleEditarInfo}>
                <div className="form-group">
                  <label>Nombres:</label>
                  <input
                    type="text"
                    value={formInfo.nombres}
                    onChange={(e) => setFormInfo({...formInfo, nombres: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Apellidos:</label>
                  <input
                    type="text"
                    value={formInfo.apellidos}
                    onChange={(e) => setFormInfo({...formInfo, apellidos: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Correo:</label>
                  <input
                    type="email"
                    value={formInfo.correo}
                    onChange={(e) => setFormInfo({...formInfo, correo: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* FORMULARIO: CAMBIAR CONTRASEÑA */}
        {mostrarCambiarPass && (
          <div className="form-overlay">
            <div className="form-container">
              <div className="form-header">
                <h3>Cambiar Contraseña</h3>
                <FaTimes 
                  className="close-icon" 
                  onClick={() => setMostrarCambiarPass(false)}
                />
              </div>
              <form onSubmit={handleCambiarPassword}>
                <div className="form-group">
                  <label>Contraseña Actual:</label>
                  <input
                    type="password"
                    value={formPassword.contrasenaActual}
                    onChange={(e) => setFormPassword({...formPassword, contrasenaActual: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nueva Contraseña:</label>
                  <input
                    type="password"
                    value={formPassword.nuevaContrasena}
                    onChange={(e) => setFormPassword({...formPassword, nuevaContrasena: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirmar Contraseña:</label>
                  <input
                    type="password"
                    value={formPassword.confirmarContrasena}
                    onChange={(e) => setFormPassword({...formPassword, confirmarContrasena: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Cambiando..." : "Cambiar Contraseña"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* FORMULARIO: ELIMINAR CUENTA */}
        {mostrarEliminarCuenta && (
          <div className="form-overlay">
            <div className="form-container form-danger">
              <div className="form-header">
                <h3>⚠️ Eliminar Cuenta</h3>
                <FaTimes 
                  className="close-icon" 
                  onClick={() => setMostrarEliminarCuenta(false)}
                />
              </div>
              <p className="warning-text">
                Esta acción es <strong>irreversible</strong>. Se eliminarán todos tus datos, progreso, logros y medallas.
              </p>
              <form onSubmit={handleEliminarCuenta}>
                <div className="form-group">
                  <label>Confirma tu contraseña:</label>
                  <input
                    type="password"
                    value={contrasenaEliminar}
                    onChange={(e) => setContrasenaEliminar(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </div>
                <button type="submit" className="btn-submit btn-danger" disabled={loading}>
                  {loading ? "Eliminando..." : "Eliminar mi cuenta"}
                </button>
              </form>
            </div>
          </div>
        )}

        <footer className="footer">
          © 2025 CyberMonkey – Perfil de Usuario
        </footer>

      </main>
    </div>
  );
}

export default Profile;