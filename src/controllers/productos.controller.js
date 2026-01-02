const pool = require("../routes/db");

const getProductos = async (req, res) => {
  const result = await pool.query("SELECT * FROM productos ORDER BY id");
  res.json(result.rows);
};

const createProducto = async (req, res) => {
  try {
    const { codigo, nombre, categoria, cantidad, precio } = req.body;

    const result = await pool.query(
      `INSERT INTO productos (codigo, nombre, categoria, cantidad, precio)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [codigo, nombre, categoria, cantidad, precio]
    );

    res.json(result.rows[0]); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, precio, stock } = req.body;

  await pool.query(
    "UPDATE productos SET nombre=$1, categoria=$2, precio=$3, stock=$4 WHERE id=$5",
    [nombre, categoria, precio, stock, id]
  );

  res.json({ msg: "Producto actualizado" });
};

const deleteProducto = async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM productos WHERE id=$1", [id]);

  res.json({ msg: "Producto eliminado" });
};

const movimientoProducto = async (req, res) => {
 const createProducto = async (req, res) => {
  try {
    const { codigo, nombre, categoria, cantidad, precio } = req.body;

    const result = await pool.query(
      `INSERT INTO productos (codigo, nombre, categoria, cantidad, precio)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [codigo, nombre, categoria, cantidad, precio]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


  let nuevoStock = producto.rows[0].stock;

  if (tipo === "entrada") {
    nuevoStock += cantidad;
  } else if (tipo === "salida") {
    if (nuevoStock < cantidad) {
      return res.status(400).json({ msg: "Stock insuficiente" });
    }
    nuevoStock -= cantidad;
  } else {
    return res.status(400).json({ msg: "Tipo inválido" });
  }

  await pool.query(
    "UPDATE productos SET stock=$1 WHERE id=$2",
    [nuevoStock, producto_id]
  );


  await pool.query(
    "INSERT INTO historial(producto_id, tipo, cantidad) VALUES ($1,$2,$3)",
    [producto_id, tipo, cantidad]
  );

  res.json({ msg: "Movimiento registrado", stock_actual: nuevoStock });
};

module.exports = {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  movimientoProducto,
};
