const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

const getSelectAllArtist = async function () {
    try {
        return await knexDatabase('vw_usuario').where({ tipo_usuario: 'Artista' }).orderBy('artista_id', 'desc')
    } catch (error) {
        console.error('[DAO artista] getSelectAllArtist:', error.message)
        return false
    }
}

const getSelectByIdArtistUser = async function (usuario_id, trx = null) {
    try {
        const result = await db(trx)('tb_artista')
            .where({usuario_id})
            .first()
        return result || null
    } catch (error) {
        console.error('[DAO artista] getSelectByIdArtistUser:', error.message)
        return null
    }
}

const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_artista')
            .select('id_artista')
            .orderBy('id_artista', 'desc')
            .first()

        return result
            ? result.id_artista
            : false

    } catch (error) {

        console.error('[DAO artista] getSelectLastID:', error.message)
        return false
    }
}


const getSelectByIdArtist = async function (artista_id, trx = null) {
    try {
        const result = await db(trx)('vw_usuario')
            .where({ artista_id, tipo_usuario: 'Artista' })
            .first()
        return result || null
    } catch (error) {
        console.error('[DAO artista] getSelectByIdArtistUser:', error.message)
        return null
    }
}

const setInsertArtist = async function (artista, trx = null) {
    try {
        const result = await db(trx)('tb_artista').insert({
            nome_artistico: artista.nome_artistico,
            usuario_id: artista.usuario_id,
            descricao: artista.descricao || ''
        })

        return result[0]
    } catch (error) {
        console.error('[DAO artista] setInsertArtist:', error.message)
        return false
    }
}

const setUpdateArtist = async function (artista, trx = null) {
    try {
        const dados = {}

        if (artista.nome_artistico !== undefined) dados.nome_artistico = artista.nome_artistico
        if (artista.usuario_id !== undefined) dados.usuario_id = artista.usuario_id
        if (artista.descricao !== undefined) dados.descricao = artista.descricao

        if (Object.keys(dados).length === 0) return true

        const result = await db(trx)('tb_artista')
            .where({ id_artista: artista.id_artista })
            .update(dados)

        return result > 0
    } catch (error) {
        console.error('[DAO artista] setUpdateArtist:', error.message)
        return false
    }
}

const setDeleteArtist = async function (id_artista, trx = null) {
    try {
        const result = await db(trx)('tb_artista')
            .where({ id_artista })
            .del()

        return result > 0
    } catch (error) {
        console.error('[DAO artista] setDeleteArtist:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllArtist,
    getSelectByIdArtist,
    setInsertArtist,
    setUpdateArtist,
    getSelectByIdArtistUser,
    setDeleteArtist,
    getSelectLastID
}