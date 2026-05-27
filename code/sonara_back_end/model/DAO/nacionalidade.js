/******************************************************************************
 * Objetivo: DAO responsável pela conexão de nacionalidades
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todas as nacionalidades
const getSelectAllNationality = async function () {
    try {

        return await knexDatabase('tb_nacionalidade')
            .orderBy('id_nacionalidade', 'desc')

    } catch (error) {
        console.error('[DAO nationality] getSelectAllNationality:', error.message)
        return false
    }
}

// Retorna nacionalidade por ID
const getSelectByIdNationality = async function (id_nacionalidade) {
    try {

        const result = await knexDatabase('tb_nacionalidade')
            .where({ id_nacionalidade })

        return result.length > 0
            ? result
            : false

    } catch (error) {
        console.error('[DAO nationality] getSelectByIdNationality:', error.message)
        return false
    }
}

// Retorna último ID cadastrado
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_nacionalidade')
            .select('id_nacionalidade')
            .orderBy('id_nacionalidade', 'desc')
            .first()

        return result
            ? result.id_nacionalidade
            : false

    } catch (error) {
        console.error('[DAO nationality] getSelectLastID:', error.message)
        return false
    }
}

// Insere nacionalidade
const setInsertNationality = async function (nacionalidade, trx = null) {
    try {

        const result = await db(trx)('tb_nacionalidade')
            .insert({
                nome: nacionalidade.nome
            })

        return result[0]

    } catch (error) {
        console.error('[DAO nationality] setInsertNationality:', error.message)
        return false
    }
}

// Atualiza nacionalidade
const setUpdateNationality = async function (nacionalidade, trx = null) {
    try {

        const dados = {}

        if (nacionalidade.nome !== undefined)
            dados.nome = nacionalidade.nome

        if (Object.keys(dados).length === 0)
            return true

        const result = await db(trx)('tb_nacionalidade')
            .where({
                id_nacionalidade: nacionalidade.id_nacionalidade
            })
            .update(dados)

        return result > 0

    } catch (error) {
        console.error('[DAO nationality] setUpdateNationality:', error.message)
        return false
    }
}

// Deleta nacionalidade
const setDeleteNationality = async function (id_nacionalidade, trx = null) {
    try {

        const result = await db(trx)('tb_nacionalidade')
            .where({ id_nacionalidade })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO nationality] setDeleteNationality:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllNationality,
    getSelectByIdNationality,
    setInsertNationality,
    setUpdateNationality,
    getSelectLastID,
    setDeleteNationality
}