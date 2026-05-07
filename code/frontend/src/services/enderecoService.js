// arquivo para funções relacionadas ao endereco

const URL_BASE = `http://localhost:8080/v1/sonara`

export async function cadastrarEndereco(endereco){
    const response = await fetch (`${URL_BASE}/endereco/`,{
         method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(endereco)
    })
    return response.json()
}

export async function buscarCep(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    if(response.ok){
        return response.json()
    }
    throw new Error('Erro ao buscar CEP')

    
}
export async function buscarLatLong (endereco){
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json`
    console.log(url)

    const response = await fetch(url)
    const data = await response.json()

    if (data.length > 0) {
        return {
            lat: data[0].lat,
            lng: data[0].lon
        }
    }

    return null
}