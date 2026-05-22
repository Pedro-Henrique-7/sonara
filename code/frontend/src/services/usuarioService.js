const URL_BASE = `${import.meta.env.VITE_API_URL}`

export async function cadastrarUsuario(usuario, foto = null) {
    try {
        const formData = new FormData();
        formData.append('dados', JSON.stringify(usuario));
        if (foto) formData.append('foto', foto);

        const response = await fetch(`${URL_BASE}/usuario`, {
            method: 'POST',
            body: formData
        });
        return response.json();
    } catch {
        return { error: 'Erro ao cadastrar usuário' };
    }
}

export async function loginUsuario(email, senha) {
    const response = await fetch(`${URL_BASE}/usuario/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || data.error || 'Erro ao fazer login')
    }

    return data
}

export async function atualizarUsuario(id, usuario) {
    try {
        const token = sessionStorage.getItem("token");
        const formData = new FormData();
        formData.append('dados', JSON.stringify(usuario));

        const response = await fetch(`${URL_BASE}/usuario/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        return response.json();
    } catch {
        return { erro: true, mensagem: 'Erro ao atualizar usuário' };
    }
}

export async function atualizarFotoUsuario(id, arquivo) {
    try {
        const token = sessionStorage.getItem("token");
        const formData = new FormData();
        formData.append("foto", arquivo);

        const response = await fetch(`${URL_BASE}/usuario/${id}/foto`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        return response.json();
    } catch {
        return { erro: true, mensagem: 'Erro ao atualizar foto' };
    }
}

export async function deletarUsuario(id) {
    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${URL_BASE}/usuario/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    } catch {
        return { erro: true, mensagem: 'Erro ao deletar usuário' };
    }
}
