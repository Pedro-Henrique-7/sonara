const URL_BASE = `${import.meta.env.VITE_API_URL}/evento`;
const URL_FOTO = `${import.meta.env.VITE_API_URL}/foto`;

export async function buscarEventos() {
  const response = await fetch(URL_BASE);
  if (response.ok) {
    return await response.json();
  }
  throw new Error("Erro ao buscar Eventos");
}

export async function buscarEventosPorId(id) {
  const response = await fetch(`${URL_BASE}/${id}`);
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  throw new Error(json.message ?? "Erro ao buscar Eventos");
}

export async function cadastrarEvento(dadosEvento) {
  const response = await fetch(URL_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosEvento),
  });
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  throw new Error(json.message ?? "Erro ao cadastrar evento");
}

export async function atualizarEvento(id, dadosEvento) {
  const response = await fetch(`${URL_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosEvento),
  });
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  throw new Error(json.message ?? "Erro ao atualizar evento");
}

export async function uploadFotoEvento(eventoId, file) {
  const fd = new FormData();
  fd.append("foto", file);
  fd.append("evento_id", String(eventoId));

  const response = await fetch(URL_FOTO, {
    method: "POST",
    body: fd,
  });
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  throw new Error(json.message ?? "Erro ao enviar foto");
}