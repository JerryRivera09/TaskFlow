
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Ocurrió un error");
    }

    return data;
  }

  async function loadTasks() {
    try {
      setError("");
      const data = await request("/api/tasks");
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function createTask(event) {
    event.preventDefault();

    try {
      const task = await request("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      setTasks((current) => [task, ...current]);
      setTitle("");
      setDescription("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTask(task) {
    try {
      const updated = await request(
        `/api/tasks/${task.id}/completed`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !task.completed }),
        }
      );

      setTasks((current) =>
        current.map((item) => item.id === updated.id ? updated : item)
      );
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function editTask(task) {
    const newTitle = window.prompt("Nuevo título:", task.title);

    if (newTitle === null) return;

    const newDescription = window.prompt(
      "Nueva descripción:",
      task.description || ""
    );

    if (newDescription === null) return;

    try {
      const updated = await request(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
        }),
      });

      setTasks((current) =>
        current.map((item) => item.id === updated.id ? updated : item)
      );
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(task) {
    if (!window.confirm(`¿Eliminar "${task.title}"?`)) return;

    try {
      await request(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      setTasks((current) =>
        current.filter((item) => item.id !== task.id)
      );
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="container">
      <header className="header">
        <span className="logo">TF</span>
        <span className="brand">TaskFlow</span>
      </header>

      <section className="intro">
        <p className="eyebrow">TU ESPACIO DE PRODUCTIVIDAD</p>
        <h1>Organiza tus ideas.</h1>
        <p>Pequeños pasos, grandes resultados.</p>
      </section>

      <section className="task-panel">
        <h2>Crear una tarea</h2>

        <form onSubmit={createTask}>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej. Aprender React"
            maxLength={150}
            required
          />

          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="¿Qué necesitas hacer?"
            rows={3}
          />

          <button type="submit">+ Agregar tarea</button>
        </form>
      </section>

      <section className="tasks-section">
        <div className="tasks-heading">
          <h2>Mis tareas</h2>
          <span className="counter">{tasks.length}</span>
        </div>

        <p className="task-summary">
          Completadas: {completedCount} de {tasks.length}
        </p>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p>Cargando tareas...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">¡Agrega tu primera tarea!</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <article
                className={`task-card ${task.completed ? "completed" : ""}`}
                key={task.id}
              >
                <input
                  className="task-checkbox"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task)}
                  aria-label={`Completar ${task.title}`}
                />

                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.description || "Sin descripción"}</p>
                  <span className="task-id">Tarea #{task.id}</span>
                </div>

                <div className="task-actions">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => editTask(task)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteTask(task)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;