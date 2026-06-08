/******************************************************************************
 * Objetivo: DAO responsável pela conexão de avaliações de eventos
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todas as avaliações de eventos
const getSelectAllEventReview = async function () {
    try {

         return await knexDatabase('tb_avaliacao_evento')
            .orderBy('id_avaliacao_evento', 'desc')

    } catch (error) {
        return false
    }
}

// Retorna avaliação pelo ID
const getSelectByIdEventReview = async function (id_avaliacao_evento) {
    try {

        const result = await knexDatabase('tb_avaliacao_evento')
            .where({ id_avaliacao_evento })

        return result.length > 0 ? result : false

    } catch (error) {
        console.error('[DAO eventReview] getSelectByIdEventReview:', error.message)
        return false
    }
}

// Retorna último ID cadastrado
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_avaliacao_evento')
            .select('id_avaliacao_evento')
            .orderBy('id_avaliacao_evento', 'desc')
            .first()

        return result ? result.id_avaliacao_evento : false

    } catch (error) {
        console.error('[DAO eventReview] getSelectLastID:', error.message)
        return false
    }
}

// Insere nova avaliação
const setInsertEventReview = async function (evento, trx = null) {
    try {

        const result = await db(trx)('tb_avaliacao_evento')
            .insert({
                numero_estrelas: evento.numero_estrelas,
                usuario_id: evento.usuario_id,
                evento_id: evento.evento_id,
                data_avaliacao: evento.data_avaliacao
            })

        return result[0]

    } catch (error) {
        console.error('[DAO eventReview] setInsertEventReview:', error.message)
        return false
    }
}

// Atualiza avaliação
const setUpdateEventReview = async function (evento, trx = null) {
    try {

        const dados = {}

        if (evento.numero_estrelas !== undefined)
            dados.numero_estrelas = evento.numero_estrelas

        if (evento.usuario_id !== undefined)
            dados.usuario_id = evento.usuario_id

        if (evento.evento_id !== undefined)
            dados.evento_id = evento.evento_id

        if (evento.data_avaliacao !== undefined)
            dados.data_avaliacao = evento.data_avaliacao

        if (Object.keys(dados).length === 0)
            return true

        const result = await db(trx)('tb_avaliacao_evento')
            .where({
                id_avaliacao_evento: evento.id_avaliacao_evento
            })
            .update(dados)

        return result > 0

    } catch (error) {
        console.error('[DAO eventReview] setUpdateEventReview:', error.message)
        return false
    }
}

// Deleta avaliação
const setDeleteEventReview = async function (id_avaliacao_evento, trx = null) {
    try {

        const result = await db(trx)('tb_avaliacao_evento')
            .where({ id_avaliacao_evento })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO eventReview] setDeleteEventReview:', error.message)
        return false
    }
}

const getSelectByUsuarioEvento = async function (usuario_id, evento_id) {
    try {
        const result = await knexDatabase('tb_avaliacao_evento')
            .where({ usuario_id, evento_id })
            .first()
 
        return result || null
    } catch (error) {
        console.error('[DAO eventReview] getSelectByUsuarioEvento:', error.message)
        return null
    }
}

module.exports = {
    getSelectAllEventReview,
    getSelectByIdEventReview,
    getSelectLastID,
    getSelectByUsuarioEvento,
    setInsertEventReview,
    setUpdateEventReview,
    setDeleteEventReview
}