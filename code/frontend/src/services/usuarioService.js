import axios from 'axios'

const URL_BASE = `http://localhost:8080/v1/sonara`

export async function cadastrarUsuario(usuario) {

    try {
        const response = await fetch(`${URL_BASE}/usuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        })

        return response.json()

    } catch (error) {

        return { error: 'Erro ao cadastrar usuário' }

    }

}

export async function loginUsuario(email, senha) {

    try {

        const response = await axios.post(
            `${URL_BASE}/usuario/login`,
            { email, senha }
        )

        return response.data

    } catch (error) {

        throw error

    }

}


export async function atualizarUsuario(id, usuario) {
    try {
        const response = await fetch(`${URL_BASE}/usuario/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        })
        return response.json()
    } catch (error) {
        return { erro: true, mensagem: 'Erro ao atualizar usuário' }
    }
}

export async function deletarUsuario(id) {
    try {
        const response = await fetch(`${URL_BASE}/usuario/${id}`, {
            method: 'DELETE'
        })
        return response.json()
    } catch (error) {
        return { erro: true, mensagem: 'Erro ao deletar usuário' }
    }
}