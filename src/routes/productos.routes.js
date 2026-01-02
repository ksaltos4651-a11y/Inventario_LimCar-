const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/productos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/productos
router.post("/", async (req, res) => {
  try {
    const { codigo, nombre, categoria, cantidad, precio } = req.body;

    const result = await pool.query(
      `INSERT INTO productos(codigo, nombre, categoria, cantidad, precio)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [codigo, nombre, categoria, cantidad, precio]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/productos/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, categoria, cantidad, precio } = req.body;

    await pool.query(
      `UPDATE productos
       SET codigo=$1, nombre=$2, categoria=$3, cantidad=$4, precio=$5
       WHERE id=$6`,
      [codigo, nombre, categoria, cantidad, precio, id]
    );

    res.json({ msg: "Producto actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/productos/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM productos WHERE id=$1", [id]);
    res.json({ msg: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/productos/movimiento  {producto_id, tipo: "entrada"/"salida", cantidad}
router.post("/movimiento", async (req, res) => {
  try {
    const { producto_id, tipo, cantidad } = req.body;

    const producto = await pool.query(
      "SELECT cantidad FROM productos WHERE id=$1",
      [producto_id]
    );

    if (producto.rows.length === 0) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    let nuevaCantidad = producto.rows[0].cantidad;

    if (tipo === "entrada") {
      nuevaCantidad += cantidad;
    } else if (tipo === "salida") {
      if (nuevaCantidad < cantidad) {
        return res.status(400).json({ msg: "Cantidad insuficiente" });
      }
      nuevaCantidad -= cantidad;
    } else {
      return res.status(400).json({ msg: "Tipo inválido" });
    }

    await pool.query(
      "UPDATE productos SET cantidad=$1 WHERE id=$2",
      [nuevaCantidad, producto_id]
    );

    await pool.query(
      "INSERT INTO historial(producto_id, tipo, cantidad) VALUES ($1,$2,$3)",
      [producto_id, tipo, cantidad]
    );

    res.json({ msg: "Movimiento registrado", cantidad_actual: nuevaCantidad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
