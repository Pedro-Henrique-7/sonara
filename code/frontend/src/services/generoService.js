// Função relacionada a genero

const URL_BASE = "http://localhost:8080/v1/sonara/genero";

export async function buscarGeneros() {
        const response = await fetch(URL_BASE)
    if(response.ok){
        return response.json()
    }
    throw new Error('Erro ao buscar Gêneros')

    
}