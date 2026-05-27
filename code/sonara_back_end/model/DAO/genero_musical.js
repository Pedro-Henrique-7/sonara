/******************************************************************************
 * Objetivo: DAO responsável pela conexão de gêneros musicais
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todos os gêneros musicais
const getSelectAllMusicalGeners = async function () {
    try {

        return await knexDatabase('tb_genero_musical')
            .orderBy('id_genero_musical', 'desc')

    } catch (error) {
        console.error('[DAO musicalGenres] getSelectAllMusicalGeners:', error.message)
        return false
    }
}

// Retorna gênero musical por usuário
const getSelectByIdgendersMusicsUser = async function (usuario_id) {
    try {

        const result = await knexDatabase('tb_genero_musical')
            .where({ id_usuario: usuario_id })
            .first()

        return result || {}

    } catch (error) {
        console.error('[DAO musicalGenres] getSelectByIdgendersMusicsUser:', error.message)
        return {}
    }
}

// Retorna gênero musical por ID
const getSelectByIdGender = async function (id_genero_musical) {
    try {

        const result = await knexDatabase('tb_genero_musical')
            .where({ id_genero_musical })

        return result.length > 0
            ? result
            : false

    } catch (error) {
        console.error('[DAO musicalGenres] getSelectByIdGender:', error.message)
        return false
    }
}

// Retorna último ID
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_genero_musical')
            .select('id_genero_musical')
            .orderBy('id_genero_musical', 'desc')
            .first()

        return result
            ? result.id_genero_musical
            : false

    } catch (error) {
        console.error('[DAO musicalGenres] getSelectLastID:', error.message)
        return false
    }
}

// Insere gênero musical
const setInsertMusicalGeners = async function (generoMusical, trx = null) {
    try {

        const result = await db(trx)('tb_genero_musical')
            .insert({
                nome: generoMusical.nome
            })

        return result[0]

    } catch (error) {
        console.error('[DAO musicalGenres] setInsertMusicalGeners:', error.message)
        return false
    }
}

// Atualiza gênero musical
const setUpdateMusicalGeners = async function (generoMusical, trx = null) {
    try {

        const dados = {}

        if (generoMusical.nome !== undefined)
            dados.nome = generoMusical.nome

        if (Object.keys(dados).length === 0)
            return true

        const result = await db(trx)('tb_genero_musical')
            .where({
                id_genero_musical: generoMusical.id_genero_musical
            })
            .update(dados)

        return result > 0

    } catch (error) {
        console.error('[DAO musicalGenres] setUpdateMusicalGeners:', error.message)
        return false
    }
}

// Deleta gênero musical
const setDeleteMusicalGeners = async function (id_genero_musical, trx = null) {
    try {

        const result = await db(trx)('tb_genero_musical')
            .where({ id_genero_musical })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO musicalGenres] setDeleteMusicalGeners:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllMusicalGeners,
    getSelectByIdgendersMusicsUser,
    getSelectByIdGender,
    setInsertMusicalGeners,
    setUpdateMusicalGeners,
    getSelectLastID,
    setDeleteMusicalGeners
}