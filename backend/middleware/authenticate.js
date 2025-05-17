import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Acesso não autorizado' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verificado:', req.user);
    next();
  } catch (error) {
    console.error('Erro ao verificar o token:', error);
    res.status(401).json({ message: 'Token inválido' });
  }
};