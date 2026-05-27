/******************************************************************************
 * Objetivo: DAO responsável pela conexão de endereço dos eventos
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todos os endereços dos eventos
const getSelectAllAddressEvent = async function () {
    try {

        return await knexDatabase('tb_endereco_evento')
            .orderBy('id_endereco_evento', 'desc')

    } catch (error) {
        console.error('[DAO addressEvent] getSelectAllAddressEvent:', error.message)
        return false
    }
}

// Retorna endereço pelo ID do evento
const getSelectByIdAddressEventEvent = async function (evento_id) {
    try {

        const result = await knexDatabase('tb_endereco_evento')
            .where({ evento_id })
            .first()

        return result || {}

    } catch (error) {
        console.error('[DAO addressEvent] getSelectByIdAddressEventEvent:', error.message)
        return {}
    }
}

// Retorna endereço pelo ID do endereço
const getSelectByIdAddressEvent = async function (id_endereco_evento) {
    try {

        const result = await knexDatabase('tb_endereco_evento')
            .where({ id_endereco_evento })
            .first()

        return result || {}

    } catch (error) {
        console.error('[DAO addressEvent] getSelectByIdAddressEvent:', error.message)
        return {}
    }
}

// Retorna último ID cadastrado
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_endereco_evento')
            .select('id_endereco_evento')
            .orderBy('id_endereco_evento', 'desc')
            .first()

        return result ? result.id_endereco_evento : false

    } catch (error) {
        console.error('[DAO addressEvent] getSelectLastID:', error.message)
        return false
    }
}

// Insere novo endereço
const setInsertAddressEvent = async function (endereco_evento, trx = null) {
    try {

        const result = await db(trx)('tb_endereco_evento')
            .insert({
                cep: endereco_evento.cep,
                cidade: endereco_evento.cidade,
                estado: endereco_evento.estado,
                logradouro: endereco_evento.logradouro,
                numero: endereco_evento.numero,
                complemento: endereco_evento.complemento,
                bairro: endereco_evento.bairro,
                evento_id: endereco_evento.evento_id
            })

        return result[0]

    } catch (error) {
        console.error('[DAO addressEvent] setInsertAddressEvent:', error.message)
        return false
    }
}

// Atualiza endereço
const setUpdateAddressEvent = async function (endereco_evento, trx = null) {
    try {

        const dados = {}

        if (endereco_evento.cep !== undefined)
            dados.cep = endereco_evento.cep

        if (endereco_evento.cidade !== undefined)
            dados.cidade = endereco_evento.cidade

        if (endereco_evento.estado !== undefined)
            dados.estado = endereco_evento.estado

        if (endereco_evento.logradouro !== undefined)
            dados.logradouro = endereco_evento.logradouro

        if (endereco_evento.numero !== undefined)
            dados.numero = endereco_evento.numero

        if (endereco_evento.complemento !== undefined)
            dados.complemento = endereco_evento.complemento

        if (endereco_evento.bairro !== undefined)
            dados.bairro = endereco_evento.bairro

        if (endereco_evento.evento_id !== undefined)
            dados.evento_id = endereco_evento.evento_id

        if (Object.keys(dados).length === 0)
            return true

        const result = await db(trx)('tb_endereco_evento')
            .where({
                id_endereco_evento: endereco_evento.id_endereco_evento
            })
            .update(dados)

        return result > 0

    } catch (error) {
        console.error('[DAO addressEvent] setUpdateAddressEvent:', error.message)
        return false
    }
}

// Deleta endereço
const setDeleteAddressEvent = async function (id_endereco_evento, trx = null) {
    try {

        const result = await db(trx)('tb_endereco_evento')
            .where({ id_endereco_evento })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO addressEvent] setDeleteAddressEvent:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllAddressEvent,
    getSelectByIdAddressEvent,
    getSelectByIdAddressEventEvent,
    getSelectLastID,
    setInsertAddressEvent,
    setUpdateAddressEvent,
    setDeleteAddressEvent
}