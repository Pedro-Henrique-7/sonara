const URL_BASE = `${import.meta.env.VITE_API_URL}/evento`;
const URL_FOTO = `${import.meta.env.VITE_API_URL}/foto`;

export async function buscarEventos() {
  const response = await fetch(URL_BASE);
  if (response.ok) return await response.json();
  throw new Error("Erro ao buscar Eventos");
}

export async function buscarEventosPorId(id) {
  const response = await fetch(`${URL_BASE}/${id}`);
  const json = await response.json();
  if (response.ok) return json;
  throw new Error(json.message ?? "Erro ao buscar Evento");
}

export async function cadastrarEvento(dadosEvento) {
  const response = await fetch(URL_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosEvento),
  });
  const json = await response.json();
  if (response.ok) return json;
  throw new Error(json.message ?? "Erro ao cadastrar evento");
}

export async function atualizarEvento(id, dadosEvento) {
  const response = await fetch(`${URL_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosEvento),
  });
  const json = await response.json();
  if (response.ok) return json;
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
  if (response.ok) return json;
  throw new Error(json.message ?? "Erro ao enviar foto");
}

/**
 * Substitui uma foto existente.
 * PUT /foto/:id_foto → FormData: foto (file) + evento_id
 *
 * @param {number} idFoto  
 * @param {File}   file   
 * @param {number} eventoId 
 */


export async function atualizarFotoEvento(idFoto, file, eventoId) {
  const fd = new FormData();
  fd.append("foto", file);
  fd.append("evento_id", String(eventoId));

  const response = await fetch(`${URL_FOTO}/${idFoto}`, {
    method: "PUT",
    body: fd,
  });
  const json = await response.json();
  if (response.ok) return json;
  throw new Error(json.message ?? "Erro ao atualizar foto");
}


export async function deletarFotoEvento(idFoto) {
  const response = await fetch(`${URL_FOTO}/${idFoto}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (response.ok) return json;
  throw new Error(json.message ?? "Erro ao deletar foto");
}