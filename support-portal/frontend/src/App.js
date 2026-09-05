import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Tickets from './pages/Tickets';
import PrivateRoute from './components/PrivateRoute';
import MapSearch from './components/MapSearch';

function App(){
  const navigate = useNavigate();
  const loggedIn = !!localStorage.getItem('token');

  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="brand">PG Support Portal</h1>
        <nav>
          {loggedIn ? (
            <>
              <Link to="/">Dashboard</Link>
              <Link to="/customers">Customers</Link>
              <Link to="/tickets">Tickets</Link>
              <Link to="/map">Map</Link>
              <button className="btn-link" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
          <Route path="/tickets" element={<PrivateRoute><Tickets /></PrivateRoute>} />
          <Route path="/map" element={<PrivateRoute><MapSearch /></PrivateRoute>} />
        </Routes>
      </main>

      <footer className="app-footer">© PG Management</footer>
    </div>
  );
}

export default App;
