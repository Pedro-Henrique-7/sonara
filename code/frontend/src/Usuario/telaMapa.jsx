import { useEffect, useRef, useState } from "react";
import "./telaMapa.css";
import HeaderUsuario from "./headerUsuario";

function obterUsuarioLogado() {
  try {
    const raw = sessionStorage.getItem("usuario");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Tenta várias estratégias de busca até achar coordenadas
async function buscarCoordenadas(endereco) {
  // Estratégias em ordem do mais específico ao mais genérico
  const tentativas = [
    // 1. Endereço completo com número
    `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}, Brasil`,
    // 2. Sem número
    `${endereco.logradouro}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}, Brasil`,
    // 3. Só cidade e estado (garante que pelo menos centraliza na cidade)
    `${endereco.cidade}, ${endereco.estado}, Brasil`,
  ].filter(Boolean);

  for (const query of tentativas) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "pt-BR" },
        cache: "no-store",
      });
      const dados = await res.json();
      if (dados.length > 0) {
        return {
          lat: parseFloat(dados[0].lat),
          lng: parseFloat(dados[0].lon),
          // zoom menor se só achou a cidade
          zoom: query.includes(endereco.logradouro) ? 16 : 13,
        };
      }
    } catch {
      // tenta a próxima estratégia
    }
  }

  return null;
}

export default function MapaEvento() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [erro, setErro] = useState("");
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    carregarLeaflet();
    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const carregarLeaflet = () => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (window.L) {
      iniciarMapa();
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = iniciarMapa;
      script.onerror = () => setErro("Não foi possível carregar o mapa.");
      document.head.appendChild(script);
    }
  };

  const iniciarMapa = async () => {
    if (mapInstanceRef.current || !mapRef.current) return;

    const usuario = obterUsuarioLogado();

    // Mapa base provisório
    mapInstanceRef.current = window.L.map(mapRef.current, {
      center: [-23.5505, -46.6333],
      zoom: 13,
    });
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstanceRef.current);

    if (!usuario) {
      setErro("Você precisa estar logado para ver sua localização no mapa.");
      return;
    }

    // 1. Tenta lat/lng direto do banco
    let lat = parseFloat(usuario?.endereco?.latitude);
    let lng = parseFloat(usuario?.endereco?.longitude);
    let zoom = 16;

    // 2. Banco null → busca pelo endereço completo
    if (isNaN(lat) || isNaN(lng)) {
      const endereco = usuario?.endereco;
      if (endereco) {
        setBuscando(true);
        const coords = await buscarCoordenadas(endereco);
        setBuscando(false);
        if (coords) {
          lat = coords.lat;
          lng = coords.lng;
          zoom = coords.zoom;
        }
      }
    }

    const temCoordenada = !isNaN(lat) && !isNaN(lng);

    if (temCoordenada) {
      const nomeExibido = usuario?.nome_artistico || usuario?.nome || "Usuário";
      mapInstanceRef.current.setView([lat, lng], zoom);
      window.L.marker([lat, lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(`📍 ${nomeExibido}`)
        .openPopup();
    } else {
      setErro(
        "Não foi possível determinar sua localização. Verifique se o endereço foi cadastrado corretamente.",
      );
    }
  };

  return (
    <div className="main-wrapper">
      <HeaderUsuario />

      <div className="mapa-page">
        <div className="mapa-card">
          {buscando && (
            <div className="mapa-info" role="status">
              Localizando endereço cadastrado…
            </div>
          )}
          {erro && (
            <div className="mapa-erro" role="alert">
              {erro}
            </div>
          )}
          <div ref={mapRef} className="mapa-container" />
        </div>
      </div>
    </div>
  );
}
