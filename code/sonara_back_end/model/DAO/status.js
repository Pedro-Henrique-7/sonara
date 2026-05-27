/******************************************************************************
 * Objetivo: DAO responsável pela conexão de status
 * Data: 29/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todos os status
const getSelectAllStatus = async function () {
    try {

        return await knexDatabase('tb_status')
            .orderBy('id_status', 'desc')

    } catch (error) {
        console.error('[DAO status] getSelectAllStatus:', error.message)
        return false
    }
}

// Retorna status por ID
const getSelectByIdStatus = async function (id_status) {
    try {

        const result = await knexDatabase('tb_status')
            .where({ id_status })

        return result.length > 0
            ? result
            : false

    } catch (error) {
        console.error('[DAO status] getSelectByIdStatus:', error.message)
        return false
    }
}

// Retorna último ID cadastrado
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_status')
            .select('id_status')
            .orderBy('id_status', 'desc')
            .first()

        return result
            ? result.id_status
            : false

    } catch (error) {
        console.error('[DAO status] getSelectLastID:', error.message)
        return false
    }
}

// Insere status
const setInsertStatus = async function (status, trx = null) {
    try {

        const result = await db(trx)('tb_status')
            .insert({
                nome: status.nome
            })

        return result[0]

    } catch (error) {
        console.error('[DAO status] setInsertStatus:', error.message)
        return false
    }
}

// Atualiza status
const setUpdateStatus = async function (status, trx = null) {
    try {

        const dados = {}

        if (status.nome !== undefined)
            dados.nome = status.nome

        if (Object.keys(dados).length === 0)
            return true

        const result = await db(trx)('tb_status')
            .where({
                id_status: status.id_status
            })
            .update(dados)

        return result > 0

    } catch (error) {
        console.error('[DAO status] setUpdateStatus:', error.message)
        return false
    }
}

// Deleta status
const setDeleteStatus = async function (id_status, trx = null) {
    try {

        const result = await db(trx)('tb_status')
            .where({ id_status })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO status] setDeleteStatus:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllStatus,
    getSelectByIdStatus,
    setInsertStatus,
    setUpdateStatus,
    getSelectLastID,
    setDeleteStatus
}