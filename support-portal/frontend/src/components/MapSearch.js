import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const PG_BASE = process.env.REACT_APP_PG_URL || 'http://localhost:4001/api';

export default function MapSearch(){
  const [query, setQuery] = useState('');
  const [center, setCenter] = useState([19.075983,72.877655]);
  const [markers, setMarkers] = useState([]);
  const [radiusKm, setRadiusKm] = useState(5);

  async function geocode(q){
    try{
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'PGM-Local' } });
      const json = await res.json();
      if (json && json.length) return { lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon) };
    } catch(e){ console.error(e); }
    return null;
  }

  async function onSearch(e){
    e && e.preventDefault();
    if (!query) return;
    const loc = await geocode(query);
    if (!loc) { alert('Location not found'); return; }
    setCenter([loc.lat, loc.lon]);
    const resp = await fetch(`${PG_BASE}/pgs/search?lat=${loc.lat}&lng=${loc.lon}&radiusKm=${radiusKm}`);
    if (!resp.ok) { alert('Search failed'); return; }
    const data = await resp.json();
    setMarkers(data);
  }

  return (
    <div style={{ display:'flex' }}>
      <div style={{ width: 350, padding: 10 }}>
        <form onSubmit={onSearch}>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search location or address..." style={{ width:'100%' }} />
          <div style={{ marginTop:8 }}>
            <label>Radius: </label>
            <select value={radiusKm} onChange={e=>setRadiusKm(e.target.value)}>
              <option value={1}>1 km</option>
              <option value={3}>3 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
            </select>
            <button style={{ marginLeft:8 }} type="submit">Search</button>
          </div>
        </form>
        <ul>
          {markers.map(m => (
            <li key={m.id}>{m.name} — {m.distanceKm? m.distanceKm.toFixed(2): '?'} km</li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, height: 600 }}>
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map(m => (
            <Marker key={m.id} position={[m.latitude, m.longitude]}>
              <Popup>
                <strong>{m.name}</strong><br />
                {m.address}<br />
                {m.googleMapLink ? <a href={m.googleMapLink} target="_blank" rel="noreferrer">Open in Google Maps</a> : null}
              </Popup>
            </Marker>
          ))}
          <Circle center={center} radius={radiusKm*1000} />
        </MapContainer>
      </div>
    </div>
  );
}
