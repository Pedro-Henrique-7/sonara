const URL_BASE = `${import.meta.env.VITE_API_URL}/evento`;

export async function buscarEventos() {
  const response = await fetch(URL_BASE);

  if (response.ok) {
    const json = await response.json();

    return json;
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dadosEvento),
  });
 
  const json = await response.json();
 
  if (response.ok) {
    return json;
  }
 
  throw new Error(json.message ?? "Erro ao cadastrar evento");
}

