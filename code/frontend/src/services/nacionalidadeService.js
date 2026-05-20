// Função relacionada a nacionalidade

const URL_BASE = `${import.meta.env.VITE_API_URL}/nacionalidade`;

export async function buscarNacionalidades() {
        const response = await fetch(URL_BASE)
    if(response.ok){
        return response.json()
    }
    throw new Error('Erro ao buscar Nacionalidades')

    
}