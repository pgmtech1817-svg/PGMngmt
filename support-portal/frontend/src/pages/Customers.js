import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Customers(){
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name:'', email:'', company:'', phone:'' });
  const [error, setError] = useState(null);

  useEffect(()=>{ load(); },[]);
  async function load(){ setLoading(true); try{ const c = await api.getCustomers(); setList(c); }catch(e){ setError('Failed'); } finally{ setLoading(false); } }

  async function create(e){ e.preventDefault(); setError(null); try{ const saved = await api.createCustomer(form); setList(prev => [saved, ...prev]); setForm({ name:'', email:'', company:'', phone:'' }); }catch(err){ setError('Create failed'); } }

  return (
    <div>
      <h2>Customers</h2>
      <div className="two-col">
        <div>
          <form onSubmit={create} className="card">
            <h3>Add Customer</h3>
            <label>Name</label>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            <label>Email</label>
            <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
            <label>Company</label>
            <input value={form.company} onChange={e=>setForm({...form, company:e.target.value})} />
            <label>Phone</label>
            <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
            <button className="btn" type="submit">Add</button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>

        <div>
          <div className="card">
            <h3>Customer List</h3>
            {loading ? <div>Loading...</div> : (
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Phone</th></tr></thead>
                <tbody>
                  {list.map(c => (
                    <tr key={c.id}><td>{c.name}</td><td>{c.email}</td><td>{c.company}</td><td>{c.phone}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
