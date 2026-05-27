/******************************************************************************
 * Objetivo: DAO responsável pela conexão de fotos dos eventos
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todas as fotos
const getSelectAllPicture = async function () {
    try {

        return await knexDatabase('tb_foto')
            .orderBy('id_foto', 'desc')

    } catch (error) {
        console.error('[DAO picture] getSelectAllPicture:', error.message)
        return false
    }
}

// Retorna fotos pelo ID do evento
const getSelectByIdEvent = async function (evento_id) {
    try {

        const result = await knexDatabase('tb_foto')
            .where({ evento_id })

        return result.length > 0
            ? result
            : false

    } catch (error) {
        console.error('[DAO picture] getSelectByIdEvent:', error.message)
        return false
    }
}

// Retorna foto pelo ID
const getSelectByIdPicture = async function (id_foto) {
    try {

        const result = await knexDatabase('tb_foto')
            .where({ id_foto })

        return result.length > 0
            ? result
            : false

    } catch (error) {
        console.error('[DAO picture] getSelectByIdPicture:', error.message)
        return false
    }
}

// Retorna último ID cadastrado
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_foto')
            .select('id_foto')
            .orderBy('id_foto', 'desc')
            .first()

        return result
            ? result.id_foto
            : false

    } catch (error) {
        console.error('[DAO picture] getSelectLastID:', error.message)
        return false
    }
}

// Insere nova foto
const setInsertPicture = async function (foto, trx = null) {
    try {

        const result = await db(trx)('tb_foto')
            .insert({
                foto: foto.foto,
                evento_id: foto.evento_id
            })

        return result[0]

    } catch (error) {
        console.error('[DAO picture] setInsertPicture:', error.message)
        return false
    }
}

// Atualiza foto
const setUpdatePicture = async function (foto, trx = null) {
    try {

        const result = await db(trx)('tb_foto')
            .where({
                id_foto: foto.id
            })
            .update({
                foto: foto.foto,
                evento_id: foto.evento_id
            })

        return result > 0

    } catch (error) {

        console.error('[DAO picture] setUpdatePicture:', error.message)
        return false
    }
}

// Remove foto
const setDeletePicture = async function (id_foto, trx = null) {
    try {

        const result = await db(trx)('tb_foto')
            .where({ id_foto })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO picture] setDeletePicture:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllPicture,
    getSelectByIdPicture,
    getSelectByIdEvent,
    setInsertPicture,
    setUpdatePicture,
    getSelectLastID,
    setDeletePicture
}