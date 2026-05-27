/******************************************************************************
 * Objetivo: DAO responsável pela conexão de status dos eventos
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todos os status dos eventos
const getSelectAllStatusEvent = async function () {
    try {

        return await knexDatabase('tb_evento_status')
            .orderBy('id_evento_status', 'desc')

    } catch (error) {
        console.error('[DAO statusEvent] getSelectAllStatusEvent:', error.message)
        return false
    }
}

// Retorna status pelo ID
const getSelectByIdStatusEvent = async function (
    id_evento_status
) {
    try {

        const result = await knexDatabase('tb_evento_status')
            .where({ id_evento_status })

        return result.length > 0
            ? result
            : false

    } catch (error) {
        console.error('[DAO statusEvent] getSelectByIdStatusEvent:', error.message)
        return false
    }
}

// Retorna último ID cadastrado
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_evento_status')
            .select('id_evento_status')
            .orderBy('id_evento_status', 'desc')
            .first()

        return result
            ? result.id_evento_status
            : false

    } catch (error) {
        console.error('[DAO statusEvent] getSelectLastID:', error.message)
        return false
    }
}

// Insere novo status do evento
const setInsertStatusEvent = async function (
    evento_status,
    trx = null
) {
    try {

        const result = await db(trx)('tb_evento_status')
            .insert({
                evento_id: evento_status.evento_id,
                status_id: evento_status.status_id,
                data_hora: evento_status.data_hora || null
            })

        return result[0]

    } catch (error) {
        console.error('[DAO statusEvent] setInsertStatusEvent:', error.message)
        return false
    }
}

// Atualiza status do evento
const setUpdateStatusEvent = async function (
    evento_status,
    trx = null
) {
    try {

        const dados = {}

        if (evento_status.evento_id !== undefined)
            dados.evento_id = evento_status.evento_id

        if (evento_status.status_id !== undefined)
            dados.status_id = evento_status.status_id

        if (evento_status.data_hora !== undefined)
            dados.data_hora = evento_status.data_hora

        if (Object.keys(dados).length === 0)
            return true

        const result = await db(trx)('tb_evento_status')
            .where({
                id_evento_status: evento_status.id_evento_status
            })
            .update(dados)

        return result > 0

    } catch (error) {
        console.error('[DAO statusEvent] setUpdateStatusEvent:', error.message)
        return false
    }
}

// Remove status do evento
const setDeleteStatusEvent = async function (
    id_evento_status,
    trx = null
) {
    try {

        const result = await db(trx)('tb_evento_status')
            .where({ id_evento_status })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO statusEvent] setDeleteStatusEvent:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllStatusEvent,
    getSelectByIdStatusEvent,
    setInsertStatusEvent,
    setUpdateStatusEvent,
    setDeleteStatusEvent,
    getSelectLastID
}