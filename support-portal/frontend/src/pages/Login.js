import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    try{
      await api.login({ email, password });
      navigate('/');
    }catch(err){
      setError(err?.data?.message || 'Login failed');
    }finally{ setLoading(false); }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit" className="btn" disabled={loading}>{loading ? 'Please wait...' : 'Login'}</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
