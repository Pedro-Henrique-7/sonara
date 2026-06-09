const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

const getSelectAllAddress = async function () {
    try {
        return await knexDatabase('tb_endereco').orderBy('id_endereco', 'desc')
    } catch (error) {
        console.error('[DAO endereco] getSelectAllAddress:', error.message)
        return false
    }
}

const getSelectByIdAddress = async function (id_endereco) {
    try {
        const result = await knexDatabase('tb_endereco')
            .where({ id_endereco })

        return result.length > 0 ? result : false
    } catch (error) {
        console.error('[DAO endereco] getSelectByIdAddress:', error.message)
        return false
    }
}

const getSelectByIdAddressUser = async function (usuario_id, trx = null) {
    try {
        const result = await db(trx)('tb_endereco')
            .where({ usuario_id })
            .first()

        return result || {}
    } catch (error) {
        console.error('[DAO endereco] getSelectByIdAddressUser:', error.message)
        return {}
    }
}

const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_endereco')
            .select('id_endereco')
            .orderBy('id_endereco', 'desc')
            .first()

        return result
            ? result.id_endereco
            : false

    } catch (error) {

        console.error('[DAO endereco] getSelectLastID:', error.message)
        return false
    }
}

const setInsertAddress = async function (endereco, trx = null) {
    try {
        const result = await db(trx)('tb_endereco').insert({
            cep: endereco.cep,
            cidade: endereco.cidade,
            estado: endereco.estado,
            logradouro: endereco.logradouro,
            numero: endereco.numero,
            complemento: endereco.complemento || '',
            bairro: endereco.bairro,
            latitude: endereco.latitude || null,
            longitude: endereco.longitude || null,
            usuario_id: endereco.usuario_id
        })
        console.log(result[0])
        return result[0]
    } catch (error) {
        console.error('[DAO endereco] setInsertAddress:', error.message)
        return false
    }
}

const setUpdateAddress = async function (endereco, trx = null) {
    try {
        const dados = {}

        if (endereco.cep !== undefined) dados.cep = endereco.cep
        if (endereco.cidade !== undefined) dados.cidade = endereco.cidade
        if (endereco.estado !== undefined) dados.estado = endereco.estado
        if (endereco.logradouro !== undefined) dados.logradouro = endereco.logradouro
        if (endereco.numero !== undefined) dados.numero = endereco.numero
        if (endereco.complemento !== undefined) dados.complemento = endereco.complemento || ''
        if (endereco.bairro !== undefined) dados.bairro = endereco.bairro
        if (endereco.usuario_id !== undefined) dados.usuario_id = endereco.usuario_id
        if (endereco.latitude !== undefined) dados.latitude = endereco.latitude || null
        if (endereco.longitude !== undefined) dados.longitude = endereco.longitude || null

        if (Object.keys(dados).length === 0) return true

        let query = db(trx)('tb_endereco')

        if (endereco.id_endereco) {
            query = query.where({ id_endereco: endereco.id_endereco })
        } else if (endereco.usuario_id) {
            query = query.where({ usuario_id: endereco.usuario_id })
        } else {
            return false
        }

        const result = await query.update(dados)

        return result > 0
    } catch (error) {
        console.error('[DAO endereco] setUpdateAddress:', error.message)
        return false
    }
}

const setDeleteAddress = async function (id_endereco, trx = null) {
    try {
        const result = await db(trx)('tb_endereco')
            .where({ id_endereco })
            .del()

        return result > 0
    } catch (error) {
        console.error('[DAO endereco] setDeleteAddress:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllAddress,
    getSelectByIdAddress,
    setInsertAddress,
    setUpdateAddress,
    setDeleteAddress,
    getSelectLastID,
    getSelectByIdAddressUser
}