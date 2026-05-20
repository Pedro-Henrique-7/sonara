// Função relacionada a genero

const URL_BASE = `${import.meta.env.VITE_API_URL}/generoMusical`;

export async function buscarGeneroMusical() {
  const response = await fetch(URL_BASE);
  if (response.ok) {
    const json = await response.json();
    console.log(json);
    return json;
  }
  throw new Error("Erro ao buscar Gêneros Musical");
}
