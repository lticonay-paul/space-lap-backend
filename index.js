import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import laptopsRouter from './routes/laptops.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://space-lap-8kdu.vercel.app'
  ]
}));
app.use(express.json());

app.use('/api/laptops', laptopsRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => res.json({ message: 'Space Lap API funcionando' }));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
