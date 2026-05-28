const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

const getSelectAllArtistGendersSong = async function () {
    try {
        return await knexDatabase('tb_artista_genero_musical')
            .orderBy('id_artista_genero_musical', 'desc')
    } catch (error) {
        console.error('[DAO artista_genero_musical] getSelectAllArtistGendersSong:', error.message)
        return false
    }
}

const getSelectByIdArtistGendersSong = async function (id_artista_genero_musical) {
    try {
        const result = await knexDatabase('tb_artista_genero_musical')
            .where({ id_artista_genero_musical })

        return result.length > 0 ? result : false
    } catch (error) {
        console.error('[DAO artista_genero_musical] getSelectByIdArtistGendersSong:', error.message)
        return false
    }
}

const setInsertArtistGendersSong = async function (artista_genero_musical, trx = null) {
    try {
        const result = await db(trx)('tb_artista_genero_musical').insert({
            genero_musical_id: artista_genero_musical.genero_musical_id,
            artista_id: artista_genero_musical.artista_id
        })

        return result[0]
    } catch (error) {
        console.error('[DAO artista_genero_musical] setInsertArtistGendersSong:', error.message)
        return false
    }
}
const getSelectLastId= async function () {
    try {

        const result = await knexDatabase('tb_artista_genero_musical')
            .select('id_artista_genero_musical')
            .orderBy('id_artista_genero_musical', 'desc')
            .first()

        return result
            ? result.id_artista_genero_musical
            : false

    } catch (error) {
        console.error('[DAO artista_genero_musical] getSelectLastIDArtistGendersSong:', error.message)
        return false
    }
}

const setUpdateArtistGendersSong = async function (artista_genero_musical, trx = null) {
    try {
        const dados = {}

        if (artista_genero_musical.genero_musical_id !== undefined)
            dados.genero_musical_id = artista_genero_musical.genero_musical_id

        if (artista_genero_musical.artista_id !== undefined)
            dados.artista_id = artista_genero_musical.artista_id

        if (Object.keys(dados).length === 0) return true

        const result = await db(trx)('tb_artista_genero_musical')
            .where({
                id_artista_genero_musical: artista_genero_musical.id_artista_genero_musical
            })
            .update(dados)

        return result > 0
    } catch (error) {
        console.error('[DAO artista_genero_musical] setUpdateArtistGendersSong:', error.message)
        return false
    }
}

// Deleta todos os gêneros de um artista pelo artista_id
const setDeleteArtistGendersSong = async function (artista_id, trx = null) {
    try {
        const result = await db(trx)('tb_artista_genero_musical')
            .where({ artista_id })
            .del()

        return result >= 0
    } catch (error) {
        console.error('[DAO artista_genero_musical] setDeleteArtistGendersSong:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllArtistGendersSong,
    getSelectByIdArtistGendersSong,
    setInsertArtistGendersSong,
    setUpdateArtistGendersSong,
    getSelectLastId,
    setDeleteArtistGendersSong
}