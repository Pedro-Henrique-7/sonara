const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

const getSelectAllOrganizer = async function () {
    try {
        return await knexDatabase('tb_organizador')
            .orderBy('id_organizador', 'desc')
    } catch (error) {
        console.error('[DAO organizador] getSelectAllOrganizer:', error.message)
        return false
    }
}

const getSelectByIdOrganizerUser = async function (usuario_id, trx = null) {
    try {
        const result = await db(trx)('tb_organizador')
            .where({ usuario_id })
            .first()

        return result || {}
    } catch (error) {
        console.error('[DAO organizador] getSelectByIdOrganizerUser:', error.message)
        return {}
    }
}

const getSelectByIdOrganizer = async function (id_organizador) {
    try {
        const result = await knexDatabase('tb_organizador')
            .where({ id_organizador })

        return result.length > 0 ? result : false
    } catch (error) {
        console.error('[DAO organizador] getSelectByIdOrganizer:', error.message)
        return false
    }
}

const setInsertOrganizer = async function (organizador, trx = null) {
    try {
        const result = await db(trx)('tb_organizador').insert({
            usuario_id: organizador.usuario_id
        })

        return result[0]
    } catch (error) {
        console.error('[DAO organizador] setInsertOrganizer:', error.message)
        return false
    }
}

const setUpdateOrganizer = async function (organizador, trx = null) {
    try {
        const result = await db(trx)('tb_organizador')
            .where({ id_organizador: organizador.id_organizador })
            .update({
                usuario_id: organizador.usuario_id
            })

        return result > 0
    } catch (error) {
        console.error('[DAO organizador] setUpdateOrganizer:', error.message)
        return false
    }
}

const setDeleteOrganizer = async function (id_organizador, trx = null) {
    try {
        const result = await db(trx)('tb_organizador')
            .where({ id_organizador })
            .del()

        return result > 0
    } catch (error) {
        console.error('[DAO organizador] setDeleteOrganizer:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllOrganizer,
    getSelectByIdOrganizer,
    setInsertOrganizer,
    setUpdateOrganizer,
    getSelectByIdOrganizerUser,
    setDeleteOrganizer
}