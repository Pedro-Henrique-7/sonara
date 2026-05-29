/******************************************************************************
 * Objetivo: DAO responsável pela conexão de artistas em eventos
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todos os vínculos artista/evento
const getSelectAllArtistEvent = async function () {
    try {

        return await knexDatabase('tb_evento_artista')
            .orderBy('id_evento_artista', 'desc')

    } catch (error) {
        console.error('[DAO artistEvent] getSelectAllArtistEvent:', error.message)
        return false
    }
}

// Retorna vínculo pelo ID
const getSelectByIdArtistEvent = async function (id_evento_artista) {
    try {

        const result = await knexDatabase('tb_evento_artista')
            .where({ id_evento_artista })

        return result.length > 0 ? result : false

    } catch (error) {
        console.error('[DAO artistEvent] getSelectByIdArtistEvent:', error.message)
        return false
    }
}
// Retorna vínculos de um evento específico
const getSelectByEventoId = async function (evento_id) {
    try {
        const result = await knexDatabase('vw_evento_artista_inscritos')
            .where('evento_id', evento_id)
            .orderBy('id_evento_artista', 'desc')

        return result.length > 0 ? result : false

    } catch (error) {
        console.error('[DAO artistEvent] getSelectByEventoId:', error.message)
        return false
    }
}


// Retorna último ID cadastrado
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_evento_artista')
            .select('id_evento_artista')
            .orderBy('id_evento_artista', 'desc')
            .first()

        return result
            ? result.id_evento_artista
            : false

    } catch (error) {
        console.error('[DAO artistEvent] getSelectLastID:', error.message)
        return false
    }
}

// Insere vínculo artista/evento
const setInsertArtistEvent = async function (evento_artista, trx = null) {
    try {
        const result = await db(trx)('tb_evento_artista')
            .insert({
                artista_id: evento_artista.artista_id,
                evento_id: evento_artista.evento_id,
                cache_esperado: evento_artista.cache_esperado,
                cache_ofertado: evento_artista.cache_ofertado ?? null,
                cache_final: evento_artista.cache_final ?? null,
                contra_proposta: evento_artista.contra_proposta ?? null,
                sobre_artista: evento_artista.sobre_artista || null,
                motivo_inscricao: evento_artista.motivo_inscricao || null
            })

        return result[0]

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return {
                erro: true,
                tipo: 'DUPLICADO',
                message: 'Este artista já está inscrito neste evento.'
            }
        }

        console.error('[DAO artistEvent] setInsertArtistEvent:', error.message)
        return false
    }
}

// Atualiza vínculo artista/evento
const setUpdateArtistEvent = async function (evento_artista, trx = null) {
    try {

        const dados = {}

        if (evento_artista.artista_id !== undefined)
            dados.artista_id = evento_artista.artista_id

        if (evento_artista.evento_id !== undefined)
            dados.evento_id = evento_artista.evento_id

        if (evento_artista.cache_esperado !== undefined)
            dados.cache_esperado = evento_artista.cache_esperado

        if (evento_artista.cache_ofertado !== undefined)
            dados.cache_ofertado = evento_artista.cache_ofertado

        if (evento_artista.cache_final !== undefined)
            dados.cache_final = evento_artista.cache_final

        if (evento_artista.contra_proposta !== undefined)
            dados.contra_proposta = evento_artista.contra_proposta

        if (evento_artista.sobre_artista !== undefined)
            dados.sobre_artista = evento_artista.sobre_artista

        if (evento_artista.motivo_inscricao !== undefined)
            dados.motivo_inscricao = evento_artista.motivo_inscricao

        if (Object.keys(dados).length === 0)
            return true

        const result = await db(trx)('tb_evento_artista')
            .where({
                id_evento_artista: evento_artista.id_evento_artista
            })
            .update(dados)

        return result > 0

    } catch (error) {
        console.error('[DAO artistEvent] setUpdateArtistEvent:', error.message)
        return false
    }
}

// Remove vínculo artista/evento
const setDeleteArtistEvent = async function (
    id_evento_artista,
    trx = null
) {
    try {

        const result = await db(trx)('tb_evento_artista')
            .where({ id_evento_artista })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO artistEvent] setDeleteArtistEvent:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllArtistEvent,
    getSelectByIdArtistEvent,
    setInsertArtistEvent,
    setUpdateArtistEvent,
    setDeleteArtistEvent,
    getSelectLastID,
    getSelectByEventoId
}