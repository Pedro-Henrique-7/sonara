
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"


export async function candidatarArtista(dados) {
    const token = sessionStorage.getItem('token')

    const response = await fetch(`${BASE_URL}/eventoArtista/candidatar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(dados),
    })

    // FIX: retorna o JSON diretamente — não deixa o componente chamar .json() de novo
    return response.json()
}

export async function buscarCandidaturas() {
    const token = sessionStorage.getItem('token')

    const response = await fetch(`${BASE_URL}/eventoArtista`, {
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    })

    return response.json()
}