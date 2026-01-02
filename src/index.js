const express = require("express");
const cors = require("cors");
require("dotenv").config();

process.on("exit", (code) => console.log("Process exit with code:", code));
process.on("SIGINT", () => console.log("SIGINT received"));
process.on("SIGTERM", () => console.log("SIGTERM received"));
process.on("uncaughtException", (err) => console.error("uncaughtException:", err));
process.on("unhandledRejection", (err) => console.error("unhandledRejection:", err));

const productosRoutes = require("./routes/productos.routes");
const authRoutes = require("./routes/auth.routes");
const historialRoutes = require("./routes/historial.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/productos", productosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/historial", historialRoutes);

app.get("/", (req, res) => res.send("API Inventario Limcar OK"));

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

setInterval(() => {}, 10000);
