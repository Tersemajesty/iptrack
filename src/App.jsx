import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './App.css'

// Fix Leaflet marker issue in React
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const App = () => {
  const [ip, setIp] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const GEOLOCATION_API_KEY = " at_mwS0HZhsirHUTKfQoErUqN3RAn1fX"; // Replace with your key

  // Fetch IP Location Data
  const fetchLocation = async () => {
    if (!ip) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${GEOLOCATION_API_KEY}&ipAddress=${ip}`
      );
      const data = response.data;
      setLocation({
        lat: data.location.lat,
        lng: data.location.lng,
        city: data.location.city,
        region: data.location.region,
        country: data.location.country,
        isp: data.isp,
      });
    } catch (error) {
      console.error("Error fetching location:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>IP Address Tracker</h2>
        
        <div className="input-group">
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Enter IP Address"
          />
          <button onClick={fetchLocation}>Search</button>
        </div>

        {loading && <p>Fetching location...</p>}

        {location && (
          <div className="info">
            <p><strong>Location:</strong> {location.city}, {location.region}, {location.country}</p>
            <p><strong>ISP:</strong> {location.isp}</p>
          </div>
        )}
      </div>

      {location && (
        <div className="map-container">
          <MapContainer center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={false} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                <strong>IP:</strong> {location.ip} <br />
                <strong>City:</strong> {location.city} <br />
                <strong>Region:</strong> {location.region} <br />
                <strong>Country:</strong> {location.country} <br />
                <strong>Timezone:</strong> {location.timezone} <br />
                <strong>ISP:</strong> {location.isp}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default App;
