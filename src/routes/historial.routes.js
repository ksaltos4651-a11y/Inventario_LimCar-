const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /api/historial
router.post("/", async (req, res) => {
  try {
    const { producto_id, tipo, cantidad } = req.body;

    await pool.query(
      "INSERT INTO historial(producto_id, tipo, cantidad) VALUES ($1,$2,$3)",
      [producto_id, tipo, cantidad]
    );

    res.json({ msg: "Movimiento registrado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/historial
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT h.*, p.nombre
      FROM historial h
      JOIN productos p ON p.id = h.producto_id
      ORDER BY h.fecha DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
