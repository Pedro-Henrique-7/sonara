import { useEffect, useRef } from "react";
import "./telaMapa.css";
import HeaderUsuario from "./headerUsuario";

export default function MapaEvento() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // CSS do Leaflet
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (mapInstanceRef.current || !window.L || !mapRef.current) return;

      mapInstanceRef.current = window.L.map(mapRef.current, {
        center: [-23.5505, -46.6333],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="main-wrapper">
      <HeaderUsuario />
      <div ref={mapRef} className="mapa-container" />
    </div>
  );
}
