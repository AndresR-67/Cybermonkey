import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaHome, FaChartBar, FaFolder, FaUserCircle } from "react-icons/fa";
import '../styles/Home.css';
import { useTypingGlitch } from "../hooks/useTypingGlitch";
import logo from "../assets/home.png";

function Home() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

const mensajes = [
    "El obstáculo es el camino. Compila, depura, avanza.",
    "Lo que controlas es tu mente, no las circunstancias. Optimiza tu código interno.",
    "La acción en sí misma es suficiente. Escribe la siguiente línea.",
    "La pérdida de tiempo es la mayor pérdida. Ejecuta tu propósito antes de que el proceso termine.",
    "Que tu alma sea como un sistema estable: firme, pero adaptable.",
    "Cada decisión escribe una nueva línea en tu futuro.",
    "En un mundo lleno de ruido, sé el algoritmo que encuentra el orden.",
    "El sistema no define tu ruta… tú defines tu sistema.",
    "Hoy puedes actualizar tu versión. Depura sin miedo.",
    "El progreso no se promete, se programa.",
    "Tu mente es tu mejor herramienta. Mantén el sistema operativo limpio.",
    "El caos es solo un bug en construcción.",
    "La disciplina es el mejor firewall.",
    "El héroe de tu historia acaba de loguearse.",
    "Tu XP no miente: sigues subiendo de nivel.",
    "Incluso Goku empezó con 0 de poder.",
    "No necesitas suerte, necesitas probabilidad a tu favor.",
    "Como en Dark Souls… cada derrota te enseña algo.",
    "Mantente determinado. (Sans estaría orgulloso).",
    "El viaje importa más que el loot.",
    "No eres NPC, eres el protagonista.",
    "Algunas rutas requieren reiniciar. Otras, insistir.",
    "Cada día compilas una mejor versión de ti mismo.",
    "Tu progreso es el código que define tu camino.",
    "Un paso más cerca de dominar tu propio sistema.",
    "Sigue avanzando. El log se escribe con cada acción.",
    "A veces solo necesitas ejecutar una instrucción más.",
  ];


  const [randomMsg] = useState(() =>
    mensajes[Math.floor(Math.random() * mensajes.length)]
  );

  const { displayed, isDone } = useTypingGlitch(randomMsg, 35);
  const [showGlitch, setShowGlitch] = useState(false);

  useEffect(() => {
    if (!isDone) return setShowGlitch(false);
    const enable = setTimeout(() => setShowGlitch(true), 120);
    const disable = setTimeout(() => setShowGlitch(false), 2600);
    return () => { clearTimeout(enable); clearTimeout(disable); };
  }, [isDone]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://localhost:3000/api/usuarios/perfil", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPerfil(data);
        localStorage.setItem("userName", data.nombres);
      })
      .catch(err => console.error("Error cargando perfil:", err));

    fetch("http://localhost:3000/api/actividades?estado=pendiente", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setActividades(data.actividades || []))
      .catch(err => console.error("Error cargando actividades:", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!perfil) return <div className="loading neon-text">Cargando...</div>;

  return (
    <div className="home-container">

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
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

      {/* BOTÓN HAMBURGUESA */}
      <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

      {/* CONTENIDO PRINCIPAL */}
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

        {/* HEADER Y MENSAJE MOTIVACIONAL */}
        <header className="header">
          <div className="header-text">
            <h1 className="header-title">Bienvenido, {perfil.nombres}</h1>
            <p
              className={`cyber-message ${showGlitch ? "glitch" : ""}`}
              data-text={randomMsg}
              aria-live="polite"
            >
              {displayed}
            </p>
          </div>
        </header>

        {/* GRID DE TARJETAS */}
        <div className="content">
          <div className="card">
            <h2>Nivel actual</h2>
            <p className="big-number">{perfil.nivel_actual}</p>
            <p><strong>{perfil.titulo_nivel}</strong></p>
            <p>XP total: {perfil.xp_total}</p>
            <p>XP para siguiente nivel: {perfil.xp_faltante}</p>
            <p>Progreso: {perfil.progreso_nivel}%</p>
            <p>Rango nivel: {perfil.xp_min_nivel} XP — {perfil.xp_max_nivel} XP</p>
          </div>

          <div className="card">
            <h2>Logros recientes</h2>
            {perfil.logros.length === 0 ? <p>No has obtenido logros aún.</p> :
              perfil.logros.map(logro => (
                <div key={logro.id_logro} className="logro-item">
                  <span className="icon">{logro.icono}</span>
                  <strong>{logro.nombre}</strong>
                  <p>{logro.descripcion}</p>
                </div>
              ))}
          </div>

          <div className="card">
            <h2>Medallas</h2>
            {perfil.medallas.length === 0 ? <p>No tienes medallas todavía.</p> :
              perfil.medallas.map(m => (
                <div key={m.id_medalla} className="logro-item">
                  <span className="icon">{m.icono}</span>
                  <strong>{m.nombre}</strong>
                </div>
              ))}
          </div>

          <div className="card">
            <h2>Próximas actividades</h2>
            {actividades.length === 0 ? <p>No tienes actividades pendientes</p> :
              actividades.map(a => (
                <div key={a.id_actividad} className="actividad-item">
                  <strong>{a.titulo}</strong>
                  <p>{a.descripcion}</p>
                </div>
              ))}
          </div>
        </div>

        <footer className="footer">
          © 2025 CyberMonkey — Todos los derechos reservados
        </footer>

      </main>
    </div>
  );
}

export default Home;














