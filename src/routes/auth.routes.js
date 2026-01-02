const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { cedula, clave } = req.body;

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE cedula=$1 AND clave=$2",
      [cedula, clave]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    }

    res.json({ msg: "Login correcto", usuario: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
