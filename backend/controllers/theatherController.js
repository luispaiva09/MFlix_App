import Theater from '../models/theater.js';

// Novo Teatro
export async function addTheater(req, res) {
  const { name, location } = req.body;
  try {
    const newTheater = new Theater({ name, location });
    await newTheater.save();
    res.status(201).json(newTheater);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao adicionar o teatro', error: err.message });
  }
}

// Listar Teatros
export async function getTheaters(req, res) {
  try {
    const theaters = await Theater.find();
    res.json(theaters);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar teatros', error: err.message });
  }
}

