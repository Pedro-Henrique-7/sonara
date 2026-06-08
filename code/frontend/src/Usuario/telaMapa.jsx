import { useEffect, useRef, useState } from "react";
import "./telaMapa.css";
import HeaderUsuario from "./headerUsuario";
import { buscarLatLong, buscarCep } from "../services/enderecoEventoServie";

function obterUsuarioLogado() {
  try {
    const raw = sessionStorage.getItem("usuario");
    if (!raw) return null;

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function obterEventoSelecionado() {
  try {
    const raw = sessionStorage.getItem("eventoSelecionado");

    if (!raw) return null;

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function resolverCoordenadas(endereco) {
  if (!endereco) return null;

  // usa latitude/longitude já salvas
  const lat = parseFloat(endereco.latitude);
  const lng = parseFloat(endereco.longitude);

  if (!isNaN(lat) && !isNaN(lng)) {
    return {
      lat,
      lng,
      zoom: 16,
    };
  }

  // tentativas de busca
  const tentativas = [
    [
      endereco.logradouro,
      endereco.numero,
      endereco.bairro,
      endereco.cidade,
      endereco.estado,
      "Brasil",
    ]
      .filter(Boolean)
      .join(", "),

    [
      endereco.logradouro,
      endereco.bairro,
      endereco.cidade,
      endereco.estado,
      "Brasil",
    ]
      .filter(Boolean)
      .join(", "),

    endereco.cep ? `${endereco.cep}, Brasil` : null,
  ].filter(Boolean);

  for (const query of tentativas) {
    try {
      const coords = await buscarLatLong(query);

      if (coords) {
        return {
          lat: coords.lat,
          lng: coords.lng,
          zoom: 16,
        };
      }
    } catch (err) {
      console.log("erro tentativa:", err);
    }
  }

  // fallback via CEP
  if (endereco.cep) {
    try {
      const dadosCep = await buscarCep(endereco.cep.replace(/\D/g, ""));

      if (dadosCep && !dadosCep.erro) {
        const queryViaCep = [
          dadosCep.logradouro,
          dadosCep.bairro,
          dadosCep.localidade,
          dadosCep.uf,
          "Brasil",
        ]
          .filter(Boolean)
          .join(", ");

        const coords = await buscarLatLong(queryViaCep);

        if (coords) {
          return {
            lat: coords.lat,
            lng: coords.lng,
            zoom: 15,
          };
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  return null;
}

export default function MapaEvento({ evento: eventoProp }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [erro, setErro] = useState("");
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarLeaflet();
    }, 300);

    return () => {
      clearTimeout(timer);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [eventoProp]);

  const carregarLeaflet = () => {
    // css leaflet
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");

      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

      document.head.appendChild(link);
    }

    // js leaflet
    if (window.L) {
      setTimeout(() => {
        iniciarMapa();
      }, 100);

      return;
    }

    const script = document.createElement("script");

    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

    script.onload = () => {
      setTimeout(() => {
        iniciarMapa();
      }, 100);
    };

    script.onerror = () => {
      setErro("Erro ao carregar mapa.");
    };

    document.body.appendChild(script);
  };

  const iniciarMapa = async () => {
    try {
      if (!mapRef.current) return;

      // limpa mapa antigo
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // limpa html do container
      mapRef.current.innerHTML = "";

      // cria mapa
      mapInstanceRef.current = window.L.map(mapRef.current);

      mapInstanceRef.current.setView([-23.5505, -46.6333], 13);

      // tiles
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);

      // evento
      const evento = eventoProp ?? obterEventoSelecionado();

      console.log("evento:", evento);

      // =========================
      // MODO EVENTO
      // =========================
      if (evento) {
        setBuscando(true);

        const coords = await resolverCoordenadas(evento?.endereco);

        setBuscando(false);

        console.log("coords evento:", coords);

        if (coords) {
          mapInstanceRef.current.setView([coords.lat, coords.lng], coords.zoom);

          window.L.marker([coords.lat, coords.lng])
            .addTo(mapInstanceRef.current)
            .bindPopup(`📍 ${evento.nome || "Evento"}`)
            .openPopup();
        } else {
          setErro("Não foi possível localizar o evento.");
        }

        return;
      }

      // =========================
      // MODO USUÁRIO
      // =========================
      const usuario = obterUsuarioLogado();

      console.log("usuario:", usuario);

      if (!usuario) {
        setErro("Usuário não encontrado.");
        return;
      }

      setBuscando(true);

      const coords = await resolverCoordenadas(usuario?.endereco);

      setBuscando(false);

      console.log("coords usuario:", coords);

      if (coords) {
        const nome = usuario?.nome_artistico || usuario?.nome || "Usuário";

        mapInstanceRef.current.setView([coords.lat, coords.lng], coords.zoom);

        window.L.marker([coords.lat, coords.lng])
          .addTo(mapInstanceRef.current)
          .bindPopup(`📍 ${nome}`)
          .openPopup();
      } else {
        setErro("Não foi possível encontrar sua localização.");
      }
    } catch (err) {
      console.log(err);

      setErro("Erro ao iniciar mapa.");
    }
  };

  return (
    <div className="main-wrapper">
      <HeaderUsuario />

      <div className="mapa-page">
        <div className="mapa-card">
          {buscando && <div className="mapa-info">Localizando endereço...</div>}

          {erro && <div className="mapa-erro">{erro}</div>}

          <div ref={mapRef} className="mapa-container" />
        </div>
      </div>
    </div>
  );
}
