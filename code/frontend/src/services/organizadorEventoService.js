const URL_BASE = `${import.meta.env.VITE_API_URL}`;

export async function buscarEventosDoOrganizador(organizador_id) {
  const response = await fetch(
    `${URL_BASE}/eventosDoOrganizador/${organizador_id}`
  );
  const json = await response.json();
  if (response.ok) return json;
  throw new Error(json.message ?? "Erro ao buscar eventos do organizador");
}

export async function buscarEventoPorId(id) {
  const response = await fetch(`${URL_BASE}/evento/${id}`);
  const json = await response.json();
  if (response.ok) return json;
  throw new Error(json.message ?? "Erro ao buscar evento");
}

export async function atualizarEvento(id, dados) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${URL_BASE}/evento/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(dados),
  });
  const json = await response.json();
  if (response.ok) return json;
  throw new Error(json.message ?? "Erro ao atualizar evento");
}

export async function excluirEvento(id) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${URL_BASE}/evento/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const json = await response.json();
  if (response.ok) return json;
  throw new Error(json.message ?? "Erro ao excluir evento");
}

export async function buscarCep(cep) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (response.ok) return response.json();
  throw new Error("Erro ao buscar CEP");
}