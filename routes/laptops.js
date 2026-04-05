import express from 'express';
import pool from '../db.js';
import { upload } from '../cloudinary.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET todas las laptops
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM laptops ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST subir imagen ← DEBE IR ANTES DE /:id
router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file.path;
    res.json({ url: imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST crear laptop
router.post('/', verifyToken, async (req, res) => {
  const { name, brand, price, ram, ssd, stock, offer, image_url, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO laptops (name, brand, price, ram, ssd, stock, offer, image_url, description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [name, brand, price, ram, ssd, stock, offer, image_url, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT editar laptop
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, brand, price, ram, ssd, stock, offer, image_url, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE laptops SET name=$1, brand=$2, price=$3, ram=$4, ssd=$5, stock=$6, offer=$7, image_url=$8, description=$9 WHERE id=$10 RETURNING *',
      [name, brand, price, ram, ssd, stock, offer, image_url, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE borrar laptop
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM laptops WHERE id=$1', [id]);
    res.json({ message: 'Laptop eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET una laptop por ID con sus reseñas
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const laptop = await pool.query('SELECT * FROM laptops WHERE id=$1', [id]);
    if (laptop.rows.length === 0) return res.status(404).json({ error: 'Laptop no encontrada' });
    const reviews = await pool.query('SELECT * FROM reviews WHERE laptop_id=$1 ORDER BY created_at DESC', [id]);
    res.json({ ...laptop.rows[0], reviews: reviews.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST agregar reseña
router.post('/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { author, rating, comment } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reviews (laptop_id, author, rating, comment) VALUES ($1,$2,$3,$4) RETURNING *',
      [id, author, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;