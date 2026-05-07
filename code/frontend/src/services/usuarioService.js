// arquivo para funções relacionadas ao usuario, como login, cadastro e etc

const URL_BASE = `http://localhost:8080/v1/sonara`

export async function cadastrarUsuario(usuario){
    const response = await fetch(`${URL_BASE}/usuario`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
    return response.json()
}