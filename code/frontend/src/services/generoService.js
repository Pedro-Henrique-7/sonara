// Função relacionada a genero

const URL_BASE = `${import.meta.env.VITE_API_URL}/genero`;

export async function buscarGeneros() {
        const response = await fetch(URL_BASE)
    if(response.ok){
        return response.json()
    }
    throw new Error('Erro ao buscar Gêneros')

    
}