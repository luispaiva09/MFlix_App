import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const API_URL = 'http://localhost:8000';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert('Erro ao registar');
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
          <h2 className="register-title">Registar</h2>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nome"
            required
            className="register-input"
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="register-input"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Senha"
            required
            className="register-input"
          />
          <button type="submit" className="register-button">Criar Conta</button>
        </form>
        <p className="login-text">
          Já tens conta?
          <Link to="/login" className="login-link">Faz login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
