/******************************************************************************
 * Objetivo: DAO responsável pela conexão de avaliação de artistas
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todas as avaliações
const getSelectAllArtistReview = async function () {
    try {
        return await knexDatabase('tb_avaliacao_artista')
            .orderBy('id_avaliacao_artista', 'desc')

    } catch (error) {
        console.error('[DAO artistReview] getSelectAllArtistReview:', error.message)
        return false
    }
}

// Retorna avaliação pelo ID
const getSelectByIdArtistReview = async function (id_avaliacao_artista) {
    try {

        const result = await knexDatabase('tb_avaliacao_artista')
            .where({ id_avaliacao_artista })

        return result.length > 0 ? result : false

    } catch (error) {
        console.error('[DAO artistReview] getSelectByIdArtistReview:', error.message)
        return false
    }
}

// Retorna último ID cadastrado
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_avaliacao_artista')
            .select('id_avaliacao_artista')
            .orderBy('id_avaliacao_artista', 'desc')
            .first()

        return result ? result.id_avaliacao_artista : false

    } catch (error) {
        console.error('[DAO artistReview] getSelectLastID:', error.message)
        return false
    }
}

// Insere nova avaliação
const setInsertArtistReview = async function (artista, trx = null) {
    try {

        const result = await db(trx)('tb_avaliacao_artista')
            .insert({
                numero_estrelas: artista.numero_estrelas,
                usuario_id: artista.usuario_id,
                artista_id: artista.artista_id,
                data_avaliacao: artista.data_avaliacao
            })

        return result[0]

    } catch (error) {
        console.error('[DAO artistReview] setInsertArtistReview:', error.message)
        return false
    }
}

// Atualiza avaliação
const setUpdateArtistReview = async function (artista, trx = null) {
    try {

        const dados = {}

        if (artista.numero_estrelas !== undefined)
            dados.numero_estrelas = artista.numero_estrelas

        if (artista.usuario_id !== undefined)
            dados.usuario_id = artista.usuario_id

        if (artista.artista_id !== undefined)
            dados.artista_id = artista.artista_id

        if (artista.data_avaliacao !== undefined)
            dados.data_avaliacao = artista.data_avaliacao

        if (Object.keys(dados).length === 0)
            return true

        const result = await db(trx)('tb_avaliacao_artista')
            .where({
                id_avaliacao_artista: artista.id_avaliacao_artista
            })
            .update(dados)

        return result > 0

    } catch (error) {
        console.error('[DAO artistReview] setUpdateArtistReview:', error.message)
        return false
    }
}

// Deleta avaliação
const setDeleteArtistReview = async function (id_avaliacao_artista, trx = null) {
    try {

        const result = await db(trx)('tb_avaliacao_artista')
            .where({ id_avaliacao_artista })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO artistReview] setDeleteArtistReview:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllArtistReview,
    getSelectByIdArtistReview,
    getSelectLastID,
    setInsertArtistReview,
    setUpdateArtistReview,
    setDeleteArtistReview
}