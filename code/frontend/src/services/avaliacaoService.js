const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/sonara'

export async function avaliarEvento({ numero_estrelas, usuario_id, evento_id }) {
    const data_avaliacao = new Date().toISOString().slice(0, 19).replace('T', ' ')

    const response = await fetch(`${URL_BASE}/avaliacaoEvento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_estrelas, usuario_id, evento_id, data_avaliacao })
    })

    const json = await response.json()

    if (!response.ok) {
        throw new Error(json?.message || 'Erro ao avaliar evento.')
    }

    return json
}

export async function avaliarArtista({ numero_estrelas, usuario_id, artista_id }) {
    const data_avaliacao = new Date().toISOString().slice(0, 19).replace('T', ' ')

    const response = await fetch(`${URL_BASE}/avaliacaoArtista`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_estrelas, usuario_id, artista_id, data_avaliacao })
    })

    const json = await response.json()

    if (!response.ok) {
        throw new Error(json?.message || 'Erro ao avaliar artista.')
    }

    return json
}

export async function buscarAvaliacaoEvento(usuario_id, evento_id) {
    const res = await fetch(
        `${URL_BASE}/avaliacaoEvento/usuario/${usuario_id}/evento/${evento_id}`
    )

    if (res.status === 404) return null

    if (!res.ok) {
        throw new Error('Erro ao buscar avaliação do evento.')
    }

    const json = await res.json()
    return json?.response?.avaliacaoEvento || null
}

export async function atualizarAvaliacaoEvento({ id, numero_estrelas, usuario_id, evento_id }) {
    const data_avaliacao = new Date().toISOString().slice(0, 19).replace('T', ' ')

    const response = await fetch(`${URL_BASE}/avaliacaoEvento/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_estrelas, usuario_id, evento_id, data_avaliacao })
    })

    const json = await response.json()

    if (!response.ok) {
        throw new Error(json?.message || 'Erro ao atualizar avaliação do evento.')
    }

    return json
}

export async function atualizarAvaliacaoArtista({ id, numero_estrelas, usuario_id, artista_id }) {
    const data_avaliacao = new Date().toISOString().slice(0, 19).replace('T', ' ')

    const response = await fetch(`${URL_BASE}/avaliacaoArtista/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_estrelas, usuario_id, artista_id, data_avaliacao })
    })

    const json = await response.json()

    if (!response.ok) {
        throw new Error(json?.message || 'Erro ao atualizar avaliação do artista.')
    }

    return json
}

export async function buscarAvaliacaoArtista(usuario_id, artista_id) {
    const res = await fetch(
        `${URL_BASE}/avaliacaoArtista/usuario/${usuario_id}/artista/${artista_id}`
    )

    if (res.status === 404) return null

    if (!res.ok) {
        throw new Error('Erro ao buscar avaliação do artista.')
    }

    const json = await res.json()
    return json?.response?.avaliacaoArtista || null
}