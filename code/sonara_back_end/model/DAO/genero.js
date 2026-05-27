/******************************************************************************
 * Objetivo: DAO responsável pela conexão de gêneros
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 2.0
*****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)
const db = (trx) => trx || knexDatabase

// Retorna todos os gêneros
const getSelectAllGenders = async function () {
    try {

        return await knexDatabase('tb_genero')
            .orderBy('id_genero', 'desc')

    } catch (error) {
        console.error('[DAO genders] getSelectAllGenders:', error.message)
        return false
    }
}

// Retorna gênero por ID
const getSelectByIdGender = async function (id_genero) {
    try {

        const result = await knexDatabase('tb_genero')
            .where({ id_genero })

        return result.length > 0
            ? result
            : false

    } catch (error) {
        console.error('[DAO genders] getSelectByIdGender:', error.message)
        return false
    }
}

// Retorna último ID
const getSelectLastID = async function () {
    try {

        const result = await knexDatabase('tb_genero')
            .select('id_genero')
            .orderBy('id_genero', 'desc')
            .first()

        return result
            ? result.id_genero
            : false

    } catch (error) {
        console.error('[DAO genders] getSelectLastID:', error.message)
        return false
    }
}

// Insere gênero
const setInsertGenders = async function (genero, trx = null) {
    try {

        const result = await db(trx)('tb_genero')
            .insert({
                nome: genero.nome
            })

        return result[0]

    } catch (error) {
        console.error('[DAO genders] setInsertGenders:', error.message)
        return false
    }
}

// Atualiza gênero
const setUpdateGenders = async function (genero, trx = null) {
    try {

        const dados = {}

        if (genero.nome !== undefined)
            dados.nome = genero.nome

        if (Object.keys(dados).length === 0)
            return true

        const result = await db(trx)('tb_genero')
            .where({
                id_genero: genero.id_genero
            })
            .update(dados)

        return result > 0

    } catch (error) {
        console.error('[DAO genders] setUpdateGenders:', error.message)
        return false
    }
}

// Deleta gênero
const setDeleteGenders = async function (id_genero, trx = null) {
    try {

        const result = await db(trx)('tb_genero')
            .where({ id_genero })
            .del()

        return result > 0

    } catch (error) {
        console.error('[DAO genders] setDeleteGenders:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllGenders,
    getSelectByIdGender,
    setInsertGenders,
    setUpdateGenders,
    getSelectLastID,
    setDeleteGenders
}