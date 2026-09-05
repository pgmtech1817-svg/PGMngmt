const AUTH_BASE = process.env.REACT_APP_AUTH_URL || 'http://localhost:4000/api';
const PG_BASE = process.env.REACT_APP_PG_URL || 'http://localhost:4001/api';

function getToken(){ return localStorage.getItem('token'); }
function setToken(t){ localStorage.setItem('token', t); }

async function request(base, path, { method='GET', body, headers={} }={}){
  const token = getToken();
  const h = { 'Content-Type':'application/json', ...headers };
  if (token) h['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${base}${path}`, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let data = text ? JSON.parse(text) : null;
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export default {
  // Auth service
  login: (creds) => request(AUTH_BASE, '/auth/login', { method: 'POST', body: creds }).then(r => { setToken(r.token); localStorage.setItem('user', JSON.stringify(r.user)); return r; }),
  // PG service
  getCustomers: () => request(PG_BASE, '/customers'),
  createCustomer: (c) => request(PG_BASE, '/customers', { method: 'POST', body: c }),
  getTickets: () => request(PG_BASE, '/tickets'),
  createTicket: (t) => request(PG_BASE, '/tickets', { method: 'POST', body: t }),
  updateTicket: (id, payload) => request(PG_BASE, `/tickets/${id}`, { method: 'PUT', body: payload })
}
