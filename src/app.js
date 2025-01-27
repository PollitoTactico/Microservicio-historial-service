const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Configurar Express
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Para parsear los cuerpos de las solicitudes

// Conectar con la base de datos MongoDB
mongoose.connect("mongodb://localhost:27017/historialDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.log("Error de conexión a MongoDB: ", err));

// Modelo de película para ver después
const historialSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  release_date: { type: String },
  addedAt: { type: Date, default: Date.now }
});

const Historial = mongoose.model("Historial", historialSchema);

// Rutas del microservicio

// Agregar una película al historial
app.post("/api/historial", async (req, res) => {
  const { userId, movieId, title, release_date } = req.body;

  if (!userId || !movieId || !title) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const nuevaPelícula = new Historial({
      userId,
      movieId,
      title,
      release_date
    });
    await nuevaPelícula.save();
    res.status(201).json({ message: "Película agregada al historial" });
  } catch (error) {
    res.status(500).json({ error: "Error interno al agregar película al historial" });
  }
});

// Obtener todas las películas de un usuario en su historial
app.get("/api/historial/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const peliculas = await Historial.find({ userId });
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ error: "Error interno al obtener el historial" });
  }
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Historial service running on http://localhost:${PORT}`));
