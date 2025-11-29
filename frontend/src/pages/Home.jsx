import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaHome, FaChartBar, FaFolder, FaUserCircle } from "react-icons/fa";
import '../styles/Home.css';
import { useTypingGlitch } from "../hooks/useTypingGlitch";
import logo from "../assets/home.png";
import '../App.css';

const API_URL = import.meta.env.VITE_API_URL;

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
    if (!token) {
      navigate("/login");
      return;
    }

    // PERFIL
    fetch(`${API_URL}/usuarios/perfil`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.clear();
          navigate("/login");
          throw new Error('Sesión expirada');
        }
        if (!res.ok) throw new Error('Error al cargar perfil');
        return res.json();
      })
      .then(data => {
        setPerfil({
          ...data,
          logros: data.logros || [],
          medallas: data.medallas || []
        });
        localStorage.setItem("userName", data.nombres);
      })
      .catch(err => {
        console.error("Error cargando perfil:", err);
        if (err.message !== 'Sesión expirada') {
          localStorage.clear();
          navigate("/login");
        }
      });

    // ACTIVIDADES
    fetch(`${API_URL}/actividades?estado=pendiente`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) return { actividades: [] };
        if (!res.ok) throw new Error('Error al cargar actividades');
        return res.json();
      })
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
  
        <div className="sidebar-title-universal">CyberMonkey</div>

        <nav className="menu">
          <Link to="/home"><FaHome className="icon" /><span>Inicio</span></Link>
          <Link to="/estadisticas"><FaChartBar className="icon" /><span>Estadísticas</span></Link>
          <Link to="/tasks"><FaFolder className="icon" /><span>Tareas</span></Link>
        </nav>

        <img src={logo} alt="CyberMonkey" className="sidebar-logo" />

      </aside>

      <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

      <main className="main">

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

        <div className="content">
          <div className="card">
            <h2>Nivel actual</h2>
            <p className="big-number">{perfil.nivel_actual || 0}</p>
            <p><strong>{perfil.titulo_nivel || 'Sin nivel'}</strong></p>
            <p>XP total: {perfil.xp_total || 0}</p>
            <p>XP para siguiente nivel: {perfil.xp_faltante || 0}</p>
            <p>Progreso: {perfil.progreso_nivel || 0}%</p>
            <p>Rango nivel: {perfil.xp_min_nivel || 0} XP — {perfil.xp_max_nivel || 0} XP</p>
          </div>

          <div className="card">
            <h2>Logros recientes</h2>
            {(!perfil.logros || perfil.logros.length === 0) ? (
              <p>No has obtenido logros aún.</p>
            ) : (
              perfil.logros.map(logro => (
                <div key={logro.id_logro} className="logro-item">
                  <span className="icon">{logro.icono}</span>
                  <strong>{logro.nombre}</strong>
                  <p>{logro.descripcion}</p>
                </div>
              ))
            )}
          </div>

          <div className="card">
            <h2>Medallas</h2>
            {(!perfil.medallas || perfil.medallas.length === 0) ? (
              <p>No tienes medallas todavía.</p>
            ) : (
              perfil.medallas.map(m => (
                <div key={m.id_medalla} className="logro-item">
                  <span className="icon">{m.icono}</span>
                  <strong>{m.nombre}</strong>
                </div>
              ))
            )}
          </div>

          <div className="card">
            <h2>Próximas actividades</h2>
            {actividades.length === 0 ? (
              <p>No tienes actividades pendientes</p>
            ) : (
              actividades.map(a => (
                <div key={a.id_actividad} className="actividad-item">
                  <strong>{a.titulo}</strong>
                  <p>{a.descripcion}</p>
                </div>
              ))
            )}
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
