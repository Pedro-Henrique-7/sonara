/******************************************************************************
 * Objetivo: DAO de evento
 * Data: 26/05/2026
 * Autor: Davi de Alemida Santos
 * Versão: 2.0
 *****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

const getSelectAllEvent = async function () {
    try {
        return await knexDatabase('vw_evento_artista_completo')
    } catch (error) {
        console.error('[DAO evento] getSelectAllEvent:', error.message)
        return false
    }
}

const getSelectByIdEvent = async function (id_evento) {
    try {
        const result = await knexDatabase('vw_evento_artista_completo')
            .where({ id_evento })

        return result.length > 0 ? result : false
    } catch (error) {
        console.error('[DAO evento] getSelectByIdEvent:', error.message)
        return false
    }
}

const setInsertEvent = async function (evento, trx = null) {
    try {
        const result = await db(trx)('tb_evento').insert({
            nome: evento.nome,
            descricao: evento.descricao,
            local: evento.local,
            data: evento.data,
            hora_inicio: evento.hora_inicio,
            hora_fim: evento.hora_fim
        })

        return result[0]
    } catch (error) {
        console.error('[DAO evento] setInsertEvent:', error.message)
        return false
    }
}

const setUpdateEvent = async function (evento, trx = null) {
    try {
        const dados = {}

        if (evento.nome !== undefined) dados.nome = evento.nome
        if (evento.descricao !== undefined) dados.descricao = evento.descricao
        if (evento.local !== undefined) dados.local = evento.local
        if (evento.data !== undefined) dados.data = evento.data
        if (evento.hora_inicio !== undefined) dados.hora_inicio = evento.hora_inicio
        if (evento.hora_fim !== undefined) dados.hora_fim = evento.hora_fim

        if (Object.keys(dados).length === 0) return true

        const result = await db(trx)('tb_evento')
            .where({ id_evento: evento.id_evento })
            .update(dados)

        return result > 0
    } catch (error) {
        console.error('[DAO evento] setUpdateEvent:', error.message)
        return false
    }
}

const setDeleteEvent = async function (id_evento, trx = null) {
    try {
        const result = await db(trx)('tb_evento')
            .where({ id_evento })
            .del()

        return result > 0
    } catch (error) {
        console.error('[DAO evento] setDeleteEvent:', error.message)
        return false
    }
}

module.exports = {
    knexDatabase,
    getSelectAllEvent,
    getSelectByIdEvent,
    setInsertEvent,
    setUpdateEvent,
    setDeleteEvent
}