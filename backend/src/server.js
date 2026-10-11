
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Comprobar el estado del backend y la base de datos
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      message: "TaskFlow conectado con PostgreSQL",
    });
  } catch (error) {
    console.error("Error en PostgreSQL:", error.message);

    res.status(500).json({
      status: "error",
      message: "No se pudo conectar con la base de datos",
    });
  }
});

// Obtener todas las tareas
app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al consultar las tareas" });
  }
});

// Crear una tarea
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description = "" } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        error: "El título es obligatorio",
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description)
       VALUES ($1, $2)
       RETURNING *`,
      [title.trim(), description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la tarea" });
  }
});


const validId = (id) => /^\d+$/.test(id) && Number(id) > 0;

// Editar el título y la descripción de una tarea
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description = "" } = req.body;

    if (!validId(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        error: "El título es obligatorio",
      });
    }

    if (title.trim().length > 150) {
      return res.status(400).json({
        error: "El título no puede superar 150 caracteres",
      });
    }

    if (typeof description !== "string") {
      return res.status(400).json({
        error: "La descripción debe ser texto",
      });
    }

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2
       WHERE id = $3
       RETURNING *`,
      [title.trim(), description, Number(id)]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar la tarea" });
  }
});

// Marcar una tarea como completada o pendiente
app.patch("/api/tasks/:id/completed", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (!validId(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        error: "completed debe ser true o false",
      });
    }

    const result = await pool.query(
      `UPDATE tasks
       SET completed = $1
       WHERE id = $2
       RETURNING *`,
      [completed, Number(id)]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la tarea" });
  }
});

// Eliminar una tarea
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING id",
      [Number(id)]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la tarea" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});