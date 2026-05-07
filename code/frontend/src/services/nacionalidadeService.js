// Função relacionada a nacionalidade

const URL_BASE = "http://localhost:8080/v1/sonara/nacionalidade";

export async function buscarNacionalidades() {
        const response = await fetch(URL_BASE)
    if(response.ok){
        return response.json()
    }
    throw new Error('Erro ao buscar Nacionalidades')

    
}