/******************************************************************************
 * Objetivo: DAO responsável pela conexão de status do artista no evento
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todos os status de evento/artista
const getSelectAllArtistEventStatus = async function () {
    try {

        return await knexDatabase('tb_evento_artista_status')
            .orderBy('id_evento_artista_status', 'desc')

    } catch (error) {
        console.error('[DAO artistEventStatus] getSelectAllArtistEventStatus:', error.message)
        return false
    }
}

// Retorna status pelo ID
const getSelectByIdArtistEventStatus = async function (id_evento_artista_status) {
    try {

        const result = await knexDatabase('tb_evento_artista_status')
            .where({ id_evento_artista_status })

        return result.length > 0 ? result : false

    } catch (error) {
        console.error('[DAO artistEventStatus] getSelectByIdArtistEventStatus:', error.message)
        return false
    }
}

// Retorna último ID cadastrado
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_evento_artista_status')
            .select('id_evento_artista_status')
            .orderBy('id_evento_artista_status', 'desc')
            .first()

        return result
            ? result.id_evento_artista_status
            : false

    } catch (error) {
        console.error('[DAO artistEventStatus] getSelectLastID:', error.message)
        return false
    }
}

// Insere novo status
const setInsertArtistEventStatus = async function (evento_artista_status, trx = null) {
    try {

        const result = await db(trx)('tb_evento_artista_status')
            .insert({
                evento_artista_id: evento_artista_status.evento_artista_id,
                status_id: evento_artista_status.status_id,
                data_hora: evento_artista_status.data_hora || null
            })

        return result[0]

    } catch (error) {
        console.error('[DAO artistEventStatus] setInsertArtistEventStatus:', error.message)
        return false
    }
}

// Atualiza status
const setUpdateArtistEventStatus = async function (evento_artista_status, trx = null) {
    try {

        const dados = {}

        if (evento_artista_status.evento_artista_id !== undefined)
            dados.evento_artista_id = evento_artista_status.evento_artista_id

        if (evento_artista_status.status_id !== undefined)
            dados.status_id = evento_artista_status.status_id

        if (evento_artista_status.data_hora !== undefined)
            dados.data_hora = evento_artista_status.data_hora

        if (Object.keys(dados).length === 0)
            return true

        const result = await db(trx)('tb_evento_artista_status')
            .where({
                id_evento_artista_status:
                    evento_artista_status.id_evento_artista_status
            })
            .update(dados)

        return result > 0

    } catch (error) {
        console.error('[DAO artistEventStatus] setUpdateArtistEventStatus:', error.message)
        return false
    }
}

// Deleta status
const setDeleteArtistEventStatus = async function (
    id_evento_artista_status,
    trx = null
) {
    try {

        const result = await db(trx)('tb_evento_artista_status')
            .where({ id_evento_artista_status })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO artistEventStatus] setDeleteArtistEventStatus:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllArtistEventStatus,
    getSelectByIdArtistEventStatus,
    setInsertArtistEventStatus,
    setUpdateArtistEventStatus,
    setDeleteArtistEventStatus,
    getSelectLastID
}