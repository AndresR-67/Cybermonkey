import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./styles/theme.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import Estadisticas from "./pages/Estadisticas";
import ProtectedRoute from "./components/ProtectedRoute";
import GlobalAccessibilityButton from "./components/GlobalAccessibilityButton";

function App() {
  return (
    <div className="App">
      <GlobalAccessibilityButton />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-task"
          element={
            <ProtectedRoute>
              <CreateTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estadisticas"
          element={
            <ProtectedRoute>
              <Estadisticas />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
