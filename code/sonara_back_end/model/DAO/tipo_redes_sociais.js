/******************************************************************************
 * Objetivo: DAO responsável pela conexão de tipos de redes sociais
 * Data: 29/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todos os tipos de redes sociais
const getSelectAllTypeSocialMidia = async function () {
    try {

        return await knexDatabase('tb_tipo_redes_sociais')
            .orderBy('id_tipo_redes_sociais', 'desc')

    } catch (error) {
        console.error('[DAO typeSocialMidia] getSelectAllTypeSocialMidia:', error.message)
        return false
    }
}

// Retorna tipo por ID
const getSelectByIdTypeSocialMidia = async function (id_tipo_redes_sociais) {
    try {

        const result = await knexDatabase('tb_tipo_redes_sociais')
            .where({ id_tipo_redes_sociais })

        return result.length > 0
            ? result
            : false

    } catch (error) {
        console.error('[DAO typeSocialMidia] getSelectByIdTypeSocialMidia:', error.message)
        return false
    }
}

// Retorna último ID
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_tipo_redes_sociais')
            .select('id_tipo_redes_sociais')
            .orderBy('id_tipo_redes_sociais', 'desc')
            .first()

        return result
            ? result.id_tipo_redes_sociais
            : false

    } catch (error) {
        console.error('[DAO typeSocialMidia] getSelectLastID:', error.message)
        return false
    }
}

// Insere tipo de rede social
const setInsertTypeSocialMidia = async function (tipo_redes_sociais, trx = null) {
    try {

        const result = await db(trx)('tb_tipo_redes_sociais')
            .insert({
                nome: tipo_redes_sociais.nome
            })

        return result[0]

    } catch (error) {
        console.error('[DAO typeSocialMidia] setInsertTypeSocialMidia:', error.message)
        return false
    }
}

// Atualiza tipo de rede social
const setUpdateTypeSocialMidia = async function (tipo_redes_sociais, trx = null) {
    try {

        const dados = {}

        if (tipo_redes_sociais.nome !== undefined)
            dados.nome = tipo_redes_sociais.nome

        if (Object.keys(dados).length === 0)
            return true

        const result = await db(trx)('tb_tipo_redes_sociais')
            .where({
                id_tipo_redes_sociais: tipo_redes_sociais.id_tipo_redes_sociais
            })
            .update(dados)

        return result > 0

    } catch (error) {
        console.error('[DAO typeSocialMidia] setUpdateTypeSocialMidia:', error.message)
        return false
    }
}

// Deleta tipo de rede social
const setDeleteTypeSocialMidia = async function (id_tipo_redes_sociais, trx = null) {
    try {

        const result = await db(trx)('tb_tipo_redes_sociais')
            .where({ id_tipo_redes_sociais })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO typeSocialMidia] setDeleteTypeSocialMidia:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllTypeSocialMidia,
    getSelectByIdTypeSocialMidia,
    setInsertTypeSocialMidia,
    setUpdateTypeSocialMidia,
    getSelectLastID,
    setDeleteTypeSocialMidia
}