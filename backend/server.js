const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 5000;

// Configurar la conexión a PostgreSQL
const pool = new Pool({
  user: "postgres", // Cambia por tu usuario de PostgreSQL
  host: "db",
  database: "pruebadocker",
  password: "1234",
  port: 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas CRUD
// Obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error al obtener usuarios");
  }
});

// Crear un nuevo usuario
app.post("/usuarios", async (req, res) => {
  const { nombre, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *",
      [nombre, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error al crear usuario");
  }
});

// Actualizar un usuario
app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;
  try {
    const result = await pool.query(
      "UPDATE usuarios SET nombre = $1, email = $2 WHERE id = $3 RETURNING *",
      [nombre, email, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error al actualizar usuario");
  }
});

// Eliminar un usuario
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.send("Usuario eliminado");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error al eliminar usuario");
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
