import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import '../styles/Estadistica.css'; 
import '../App.css';
import { FaHome, FaChartBar, FaFolder } from "react-icons/fa";
import logo from "../assets/home.png"; 

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Estadisticas() {
  const [actividades, setActividades] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [racha, setRacha] = useState(0);
  const [eficiencia, setEficiencia] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [completadas, setCompletadas] = useState(0);
  const [diasUltimaSemana, setDiasUltimaSemana] = useState([]);
  const [rachaDiaria, setRachaDiaria] = useState([]);
  const [heatmapValues, setHeatmapValues] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const TOKEN = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
  const TOKEN = localStorage.getItem("token");
  if (!TOKEN) return;

  // Obtener actividades
  fetch(`${API_URL}/actividades`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
    .then(res => res.json())
    .then(data => {
      const acts = data.actividades || [];
      setActividades(acts);

      const completadasCount = acts.filter(a => a.estado === 'completada').length;
      setCompletadas(completadasCount);

      const pendientesCount = acts.length - completadasCount;
      setPendientes(pendientesCount > 0 ? pendientesCount : 0);
    })
    .catch(err => console.error("Error cargando actividades:", err));

  // Obtener historial
  fetch(`${API_URL}/historial`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
    .then(res => res.json())
    .then(data => {
      const hist = data.historial || [];
      setHistorial(hist);

      // Eficiencia
      const tiempos = {};
      hist.forEach(h => {
        if (h.accion?.toUpperCase() === 'CREAR') tiempos[h.id_actividad] = new Date(h.fecha);
        if (h.accion?.toUpperCase() === 'COMPLETAR' && tiempos[h.id_actividad]) {
          tiempos[h.id_actividad] = (new Date(h.fecha) - tiempos[h.id_actividad]) / 1000;
        }
      });
      const tiemposValidos = Object.values(tiempos).filter(t => t);
      setEficiencia(
        tiemposValidos.length > 0
          ? tiemposValidos.reduce((a, b) => a + b, 0) / tiemposValidos.length
          : 0
      );

      // Racha diaria y heatmap
      const hoy = new Date();
      const ultimos30 = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date();
        d.setDate(hoy.getDate() - (29 - i));
        return d.toISOString().split('T')[0];
      });
      setDiasUltimaSemana(ultimos30);

      const rachaArr = ultimos30.map(dia =>
        hist.some(h => h.accion?.toUpperCase() === 'COMPLETAR' && h.fecha.startsWith(dia)) ? 1 : 0
      );
      setRachaDiaria(rachaArr.filter(r => r > 0));

      setHeatmapValues(
        hist
          .filter(h => h.accion?.toUpperCase() === 'COMPLETAR')
          .map(h => ({ date: h.fecha.split('T')[0], count: 1 }))
      );
    })
    .catch(err => console.error("Error cargando historial:", err));

  // Racha actual
  fetch(`${API_URL}/usuarios/perfil`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
    .then(res => res.json())
    .then(data => {
      if (data.racha_actual > 0) setRacha(data.racha_actual);
    })
    .catch(err => console.error("Error cargando racha actual:", err));
}, []);

  const eliminadas = historial.filter(h => h.accion?.toUpperCase() === 'ELIMINAR').length;
  const efectividad = (actividades.length + eliminadas) > 0
    ? Math.round((completadas / (actividades.length + eliminadas)) * 100)
    : 0;

  return (
    <div className="estadisticas-container">
  <aside className={`sidebar-estadisticas ${sidebarOpen ? '' : 'closed'}`}>
    {/* Título arriba */}
    <div className="sidebar-title-universal">CyberMonkey</div>

    {/* Menú con iconos */}
    <nav className="menu-estadisticas">
      <Link to="/home" className={window.location.pathname === '/home' ? 'active' : ''}>
        <FaHome className="icon" />
        <span>Inicio</span>
      </Link>
      <Link to="/estadisticas" className={window.location.pathname === '/estadisticas' ? 'active' : ''}>
        <FaChartBar className="icon" />
        <span>Estadísticas</span>
      </Link>
      <Link to="/tasks" className={window.location.pathname === '/tasks' ? 'active' : ''}>
        <FaFolder className="icon" />
        <span>Tareas</span>
      </Link>
    </nav>

    {/* Logo abajo */}
    <img src={logo} alt="CyberMonkey" className="sidebar-logo" />
  </aside>

  {/* Botón hamburguesa fuera de la sidebar */}
  <button
    className="menu-toggle-estadisticas"
    onClick={() => setSidebarOpen(!sidebarOpen)}
  >
    ☰
  </button>

      {/* Main */}
         <main className={`main-estadisticas ${sidebarOpen ? '' : 'closed'}`}>
        <h1>Estadísticas</h1>
        <p>Visualiza tu rendimiento y hábitos de actividad</p>

        <div className="cards-estadisticas">

          {racha > 0 && rachaDiaria.length > 0 && (
            <div className="card-estadisticas">
              <h3>🔥 Racha diaria</h3>
              <p>{racha} días consecutivos</p>
              <Line
                data={{
                  labels: diasUltimaSemana,
                  datasets: [{
                    label: 'Racha diaria',
                    data: rachaDiaria,
                    borderColor: '#FF9800',
                    fill: false,
                  }]
                }}
              />
            </div>
          )}

          {actividades.length > 0 && (
            <div className="card-estadisticas">
              <h3>📊 Actividades</h3>
              <Doughnut
                data={{
                  labels: ['Completadas', 'Pendientes'],
                  datasets: [{
                    data: [completadas, pendientes],
                    backgroundColor: ['#4CAF50', '#F44336']
                  }]
                }}
              />
              <p>Completadas: {completadas}</p>
              <p>Pendientes: {pendientes}</p>
            </div>
          )}

          {historial.length > 0 && (
            <div className="card-estadisticas">
              <h3>📈 Acciones históricas</h3>
              <Bar
                data={{
                  labels: ['CREAR', 'COMPLETAR', 'MODIFICAR', 'ELIMINAR', 'NOTA'],
                  datasets: [{
                    label: 'Cantidad de acciones',
                    data: [
                      historial.filter(h => h.accion?.toUpperCase() === 'CREAR').length,
                      historial.filter(h => h.accion?.toUpperCase() === 'COMPLETAR').length,
                      historial.filter(h => h.accion?.toUpperCase() === 'MODIFICAR').length,
                      historial.filter(h => h.accion?.toUpperCase() === 'ELIMINAR').length,
                      historial.filter(h => h.accion?.toUpperCase() === 'NOTA').length
                    ].filter(count => count > 0),
                    backgroundColor: '#2196F3'
                  }]
                }}
                options={{ responsive: true }}
              />
            </div>
          )}

          {eficiencia > 0 && (
            <div className="card-estadisticas">
              <h3>⏱️ Eficiencia</h3>
              <p>Tiempo promedio en completar tareas: {Math.round(eficiencia)} segundos</p>
            </div>
          )}

          {efectividad > 0 && (
            <div className="card-estadisticas">
              <h3>⚖️ Efectividad</h3>
              <p>{efectividad}% de tareas completadas vs vencidas/eliminadas</p>
            </div>
          )}

          {heatmapValues.length > 0 && diasUltimaSemana.length > 0 && (
            <div className="card-estadisticas">
              <h3>📅 Tendencias de actividad</h3>
              <CalendarHeatmap
                startDate={diasUltimaSemana[0]}
                endDate={diasUltimaSemana[diasUltimaSemana.length - 1]}
                values={heatmapValues}
                classForValue={value => value ? 'heatmap-day-active' : 'heatmap-day-inactive'}
              />
              <p>Proyección: manteniendo tu ritmo, podrías completar {Math.round(completadas / 30 * 7)} tareas la próxima semana.</p>
            </div>
          )}

        </div>

        <footer>
          © 2025 CyberMonkey – Todos los derechos reservados
        </footer>
      </main>
    </div>
  );
}

export default Estadisticas;
