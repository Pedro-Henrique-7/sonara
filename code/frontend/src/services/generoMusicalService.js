// Função relacionada a genero

const URL_BASE = "http://localhost:8080/v1/sonara/generoMusical";

export async function buscarGeneroMusical() {
  const response = await fetch(URL_BASE);
  if (response.ok) {
    const json = await response.json();
    console.log(json);
    return json;
  }
  throw new Error("Erro ao buscar Gêneros Musical");
}
