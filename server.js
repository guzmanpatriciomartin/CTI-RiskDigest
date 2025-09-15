// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { generateDigestData } = require('./digestGenerator'); // Importa la función del digest

const app = express();
const PORT = 3000;

// Configuración de OpenRouter desde una variable de entorno
// ¡IMPORTANTE! NUNCA expongas tus claves API directamente en el código del cliente.
// Usa variables de entorno para seguridad.
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("ERROR: Por favor, establece la variable de entorno OPENROUTER_API_KEY.");
  console.error("Ejemplo (Linux/macOS): export OPENROUTER_API_KEY=\"tu_clave_real_de_openrouter\"");
  console.error("Ejemplo (Windows CMD): set OPENROUTER_API_KEY=\"tu_clave_real_de_openrouter\"");
  console.error("Ejemplo (Windows PowerShell): $env:OPENROUTER_API_KEY=\"tu_clave_real_de_openrouter\"");
  process.exit(1);
}

// Middlewares
app.use(cors()); // Permite solicitudes desde el frontend (si están en diferentes puertos)
app.use(bodyParser.json()); // Para parsear cuerpos de solicitud JSON
app.use(express.static(__dirname)); // Sirve archivos estáticos desde la carpeta actual (donde está tu HTML)

// Ruta principal para servir tu aplicación HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Nuevo endpoint para generar el digest de noticias, ahora devuelve JSON
app.get('/generate-cybersecurity-digest', async (req, res) => {
  const days = parseInt(req.query.days, 10);

  if (isNaN(days) || days <= 0) {
    return res.status(400).json({ error: "Por favor, especifica un número válido de días para el digest." });
  }

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  console.log(`[SERVER] Generando digest desde ${startDate.toLocaleString()} hasta ${endDate.toLocaleString()}...`);

  try {
    const digestItems = await generateDigestData(startDate, endDate, OPENROUTER_API_KEY);
    res.json(digestItems); // ¡Ahora envía JSON!
  } catch (error) {
    console.error("[SERVER] Error al generar el digest:", error);
    res.status(500).json({ error: "Ocurrió un error al generar el digest de ciberseguridad.", details: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de Riesgos y Ciberseguridad iniciado en http://localhost:${PORT}`);
});