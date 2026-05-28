// src/services/eventoArtistaService.js

const URL_BASE = `${import.meta.env.VITE_API_URL}/eventoArtista`;

export async function candidatarArtista(dados) {
  const response = await fetch(`${URL_BASE}/candidatar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  const json = await response.json();

  if (response.ok) {
    return json;
  }

  throw new Error(json.message ?? "Erro ao enviar candidatura.");
}

export async function buscarEventoArtista() {
  const response = await fetch(URL_BASE);
  const json = await response.json();

  if (response.ok) {
    return json;
  }

  throw new Error(json.message ?? "Erro ao buscar inscrições.");
}

export async function aprovarArtistaEvento(idEventoArtista) {
  const response = await fetch(`${URL_BASE}/aprovar/${idEventoArtista}`, {
    method: "PUT",
  });

  const json = await response.json();

  if (response.ok) {
    return json;
  }

  throw new Error(json.message ?? "Erro ao aprovar artista.");
}

export async function reprovarArtistaEvento(idEventoArtista) {
  const response = await fetch(`${URL_BASE}/reprovar/${idEventoArtista}`, {
    method: "PUT",
  });

  const json = await response.json();

  if (response.ok) {
    return json;
  }

  throw new Error(json.message ?? "Erro ao reprovar artista.");
}

export async function enviarContraProposta(idEventoArtista, cacheOfertado) {
  const response = await fetch(`${URL_BASE}/contraProposta/${idEventoArtista}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cache_ofertado: cacheOfertado,
    }),
  });

  const json = await response.json();

  if (response.ok) {
    return json;
  }

  throw new Error(json.message ?? "Erro ao enviar contra proposta.");
}

export async function aceitarContraProposta(idEventoArtista) {
  const response = await fetch(
    `${URL_BASE}/aceitarContraProposta/${idEventoArtista}`,
    {
      method: "PUT",
    }
  );

  const json = await response.json();

  if (response.ok) {
    return json;
  }

  throw new Error(json.message ?? "Erro ao aceitar contra proposta.");
}

export async function recusarContraProposta(idEventoArtista) {
  const response = await fetch(
    `${URL_BASE}/recusarContraProposta/${idEventoArtista}`,
    {
      method: "PUT",
    }
  );

  const json = await response.json();

  if (response.ok) {
    return json;
  }

  throw new Error(json.message ?? "Erro ao recusar contra proposta.");
}