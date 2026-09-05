import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Tickets(){
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title:'', description:'', customer_id:'' });
  const [error, setError] = useState(null);

  useEffect(()=>{ load(); },[]);
  async function load(){ setLoading(true); try{ const t = await api.getTickets(); setList(t); }catch(e){ setError('Failed'); } finally{ setLoading(false); } }

  async function create(e){ e.preventDefault(); setError(null); try{ const saved = await api.createTicket({ title: form.title, description: form.description, customer_id: Number(form.customer_id) }); setList(prev => [saved, ...prev]); setForm({ title:'', description:'', customer_id:'' }); }catch(err){ setError('Create failed'); } }

  return (
    <div>
      <h2>Tickets</h2>
      <div className="two-col">
        <div>
          <form onSubmit={create} className="card">
            <h3>Create Ticket</h3>
            <label>Title</label>
            <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
            <label>Description</label>
            <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
            <label>Customer ID</label>
            <input value={form.customer_id} onChange={e=>setForm({...form, customer_id:e.target.value})} />
            <button className="btn" type="submit">Create</button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>

        <div>
          <div className="card">
            <h3>Ticket List</h3>
            {loading ? <div>Loading...</div> : (
              <table className="table">
                <thead><tr><th>Title</th><th>Customer</th><th>Status</th><th>Priority</th></tr></thead>
                <tbody>
                  {list.map(t => (
                    <tr key={t.id}><td>{t.title}</td><td>{t.customer_name || t.customer?.name}</td><td>{t.status}</td><td>{t.priority}</td></tr>
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
