const URL_BASE = `${import.meta.env.VITE_API_URL}/artista`;

export async function listarArtistas() {
  const response = await fetch(URL_BASE);
  const json = await response.json();

  if (response.ok) {
    return json;
  }

  throw new Error(json.message ?? "Erro ao buscar artistas.");
}

export async function buscarArtistaPorId(idArtista) {
  const response = await fetch(`${URL_BASE}/${idArtista}`);
  const json = await response.json();

  if (response.ok) {
    return json;
  }

  throw new Error(json.message ?? "Erro ao buscar artista.");
}