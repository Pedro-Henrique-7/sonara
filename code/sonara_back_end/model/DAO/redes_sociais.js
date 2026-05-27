/******************************************************************************
 * Objetivo: DAO responsável pela conexão de redes sociais
 * Data: 29/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todas as redes sociais
const getSelectAllSocialMidia = async function () {
    try {

        return await knexDatabase('tb_redes_sociais')
            .orderBy('id_redes_sociais', 'desc')

    } catch (error) {
        console.error('[DAO socialMidia] getSelectAllSocialMidia:', error.message)
        return false
    }
}

// Retorna rede social por ID
const getSelectByIdSocialMidia = async function (id_redes_sociais) {
    try {

        const result = await knexDatabase('tb_redes_sociais')
            .where({ id_redes_sociais })

        return result.length > 0
            ? result
            : false

    } catch (error) {
        console.error('[DAO socialMidia] getSelectByIdSocialMidia:', error.message)
        return false
    }
}

// Retorna último ID cadastrado
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_redes_sociais')
            .select('id_redes_sociais')
            .orderBy('id_redes_sociais', 'desc')
            .first()

        return result
            ? result.id_redes_sociais
            : false

    } catch (error) {
        console.error('[DAO socialMidia] getSelectLastID:', error.message)
        return false
    }
}

// Insere rede social
const setInsertSocialMidia = async function (redes_sociais, trx = null) {
    try {

        const result = await db(trx)('tb_redes_sociais')
            .insert({
                link: redes_sociais.link,
                tipo_id: redes_sociais.tipo_id,
                usuario_id: redes_sociais.usuario_id
            })

        return result[0]

    } catch (error) {
        console.error('[DAO socialMidia] setInsertSocialMidia:', error.message)
        return false
    }
}

// Atualiza rede social
const setUpdateSocialMidia = async function (redes_sociais, trx = null) {
    try {

        const dados = {}

        if (redes_sociais.link !== undefined)
            dados.link = redes_sociais.link

        if (redes_sociais.tipo_id !== undefined)
            dados.tipo_id = redes_sociais.tipo_id

        if (redes_sociais.usuario_id !== undefined)
            dados.usuario_id = redes_sociais.usuario_id

        if (Object.keys(dados).length === 0)
            return true

        const result = await db(trx)('tb_redes_sociais')
            .where({
                id_redes_sociais: redes_sociais.id_redes_sociais
            })
            .update(dados)

        return result > 0

    } catch (error) {
        console.error('[DAO socialMidia] setUpdateSocialMidia:', error.message)
        return false
    }
}

// Deleta rede social
const setDeleteSocialMidia = async function (id_redes_sociais, trx = null) {
    try {

        const result = await db(trx)('tb_redes_sociais')
            .where({ id_redes_sociais })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO socialMidia] setDeleteSocialMidia:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllSocialMidia,
    getSelectByIdSocialMidia,
    setInsertSocialMidia,
    setUpdateSocialMidia,
    getSelectLastID,
    setDeleteSocialMidia
}