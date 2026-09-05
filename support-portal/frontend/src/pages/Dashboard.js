import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard(){
  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    async function load(){
      try{
        const c = await api.getCustomers();
        const t = await api.getTickets();
        setCustomers(c);
        setTickets(t);
      }catch(e){ setError('Failed to load data'); }
      finally{ setLoading(false); }
    }
    load();
  },[]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const totalBeds = customers.reduce((acc)=>acc, 0); // placeholder
  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid">
        <div className="card">
          <h3>Customers</h3>
          <p>{customers.length}</p>
        </div>
        <div className="card">
          <h3>Tickets</h3>
          <p>{tickets.length}</p>
        </div>
      </div>

      <section>
        <h3>Recent Customers</h3>
        <ul>
          {customers.slice(0,5).map(c => <li key={c.id}>{c.name} — {c.email}</li>)}
        </ul>
      </section>
    </div>
  );
}
