
const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

const URL_BASE = `${import.meta.env.VITE_API_URL}`;

export async function cadastrarEndereco(endereco) {
  const response = await fetch(`${URL_BASE}/enderecoEvento/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(endereco),
  });
  return response.json();
}

export async function buscarCep(cep) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (response.ok) {
    return response.json();
  }
  throw new Error("Erro ao buscar CEP");
}

export async function buscarLatLong(endereco) {
  if (!endereco || !endereco.trim()) {
    return null;
  }

  if (!GEOAPIFY_API_KEY) {
    console.error("VITE_GEOAPIFY_API_KEY não configurada no .env");
    return null;
  }

  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    endereco
  )}&format=json&limit=1&apiKey=${GEOAPIFY_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar latitude e longitude");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return null;
  }

  const resultado = data.results[0];

  return {
    lat: resultado.lat,
    lng: resultado.lon,
    endereco_formatado: resultado.formatted,
  };
}
