/******************************************************************************
 * Objetivo: DAO responsável pela conexão de organizadores em eventos
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todos os vínculos organizador/evento
const getSelectAllOrganizerEvent = async function () {
    try {

        return await knexDatabase('tb_evento_organizador')
            .orderBy('id_evento_organizador', 'desc')

    } catch (error) {
        console.error('[DAO organizerEvent] getSelectAllOrganizerEvent:', error.message)
        return false
    }
}

// Retorna vínculo pelo ID
const getSelectByIdOrganizerEvent = async function (
    id_evento_organizador
) {
    try {

        const result = await knexDatabase('tb_evento_organizador')
            .where({ id_evento_organizador })

        return result.length > 0
            ? result
            : false

    } catch (error) {
        console.error('[DAO organizerEvent] getSelectByIdOrganizerEvent:', error.message)
        return false
    }
}

// Retorna eventos do organizador pelo usuário
const getSelectViewEventOrganizer = async function (usuario_id) {
    try {

        const result = await knexDatabase('vw_evento')
            .whereIn(
                'id_evento',
                knexDatabase('tb_evento_organizador as eo')
                    .join(
                        'tb_organizador as org',
                        'org.id_organizador',
                        'eo.organizador_id'
                    )
                    .select('eo.evento_id')
                    .where('org.usuario_id', usuario_id)
            )

        return result.length > 0
            ? result
            : false

    } catch (error) {
        console.error('[DAO organizerEvent] getSelectViewEventOrganizer:', error.message)
        return false
    }
}

// Retorna vínculo pelo ID do evento
const getSelectOrganizerEventByIdEvent = async function (evento_id) {
    try {

        const result = await knexDatabase('tb_evento_organizador')
            .where({ evento_id })

        return result.length > 0
            ? result
            : false

    } catch (error) {
        console.error('[DAO organizerEvent] getSelectOrganizerEventByIdEvent:', error.message)
        return false
    }
}

// Retorna último ID cadastrado
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_evento_organizador')
            .select('id_evento_organizador')
            .orderBy('id_evento_organizador', 'desc')
            .first()

        return result
            ? result.id_evento_organizador
            : false

    } catch (error) {
        console.error('[DAO organizerEvent] getSelectLastID:', error.message)
        return false
    }
}

// Insere vínculo organizador/evento
const setInsertOrganizerEvent = async function (
    evento_organizador,
    trx = null
) {
    try {

        const result = await db(trx)('tb_evento_organizador')
            .insert({
                evento_id: evento_organizador.evento_id,
                organizador_id: evento_organizador.organizador_id
            })

        return result[0]

    } catch (error) {
        console.error('[DAO organizerEvent] setInsertOrganizerEvent:', error.message)
        return false
    }
}

// Atualiza vínculo organizador/evento
const setUpdateOrganizerEvent = async function (
    evento_organizador,
    trx = null
) {
    try {

        const dados = {}

        if (evento_organizador.evento_id !== undefined)
            dados.evento_id = evento_organizador.evento_id

        if (evento_organizador.organizador_id !== undefined)
            dados.organizador_id = evento_organizador.organizador_id

        if (Object.keys(dados).length === 0)
            return true

        const result = await db(trx)('tb_evento_organizador')
            .where({
                id_evento_organizador:
                    evento_organizador.id_evento_organizador
            })
            .update(dados)

        return result > 0

    } catch (error) {
        console.error('[DAO organizerEvent] setUpdateOrganizerEvent:', error.message)
        return false
    }
}

// Remove vínculo organizador/evento
const setDeleteOrganizerEvent = async function (
    id_evento_organizador,
    trx = null
) {
    try {

        const result = await db(trx)('tb_evento_organizador')
            .where({ id_evento_organizador })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO organizerEvent] setDeleteOrganizerEvent:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllOrganizerEvent,
    getSelectByIdOrganizerEvent,
    getSelectViewEventOrganizer,
    getSelectOrganizerEventByIdEvent,
    setInsertOrganizerEvent,
    setUpdateOrganizerEvent,
    setDeleteOrganizerEvent,
    getSelectLastID
}