/******************************************************************************
 * Objetivo: DAO de usuário — alinhado com vw_usuario_completo
 * Data: 26/05/2026
 * Autor: Davi de Alemida Santos
 * Versão: 3.0
 *****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)

// ─── Listar todos os usuários ──────────────────────────────────────────────────
const getSelectAllUsers = async function () {
    try {
        let sql = `SELECT * FROM vw_usuario_completo`
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
        console.error('[DAO usuario] getSelectAllUsers:', error.message)
        return false
    }
}

// ─── Buscar usuário por ID ─────────────────────────────────────────────────────
const getSelectByIdUsers = async function (id) {
    try {
        let sql = `SELECT * FROM vw_usuario_completo WHERE id_usuario = ${id}`
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
        console.error('[DAO usuario] getSelectByIdUsers:', error.message)
        return false
    }
}

// ─── Buscar organizador pelo usuario_id ───────────────────────────────────────
const getSelectByIdUsersOrganizer = async function (usuario_id) {
    try {
        let sql = `SELECT * FROM tb_organizador WHERE usuario_id = ${usuario_id}`
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
        console.error('[DAO usuario] getSelectByIdUsersOrganizer:', error.message)
        return false
    }
}

// ─── Buscar último ID inserido ─────────────────────────────────────────────────
const getSelectLastID = async function () {
    try {
        let result = await knexDatabase('tb_usuario')
            .max('id_usuario as id_usuario')
            .first()

        return result

    } catch (error) {
        console.error('[DAO usuario] getSelectLastID:', error.message)
        return false
    }
}

// ─── Buscar usuário por e-mail (com senha — para login) ───────────────────────
const getUsuarioByUsuarioEmail = async function (email) {
    try {
        const emailValue = (typeof email === 'object' && email !== null) ? email.email : email

        // Usa a view completa para já trazer todos os dados no login
        let sql = `SELECT * FROM vw_usuario_completo WHERE email = '${emailValue}'`
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]) && result[0].length > 0)
            return result[0][0]
        else
            return false

    } catch (error) {
        console.error('[DAO usuario] getUsuarioByUsuarioEmail:', error.message)
        return false
    }
}

// ─── Buscar senha do usuário (somente para verificação no login) ──────────────
const getSenhaByEmail = async function (email) {
    try {
        let sql = `SELECT id_usuario, senha FROM tb_usuario WHERE email = '${email}'`
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]) && result[0].length > 0)
            return result[0][0]
        else
            return false

    } catch (error) {
        console.error('[DAO usuario] getSenhaByEmail:', error.message)
        return false
    }
}

// ─── Buscar usuário por CPF ────────────────────────────────────────────────────
const getUsuarioByUsuarioCPF = async function (cpf) {
    try {
        let sql = `SELECT id_usuario FROM tb_usuario WHERE cpf = '${cpf}'`
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]) && result[0].length > 0)
            return result[0][0]
        else
            return false

    } catch (error) {
        console.error('[DAO usuario] getUsuarioByUsuarioCPF:', error.message)
        return false
    }
}

// ─── Inserir usuário ───────────────────────────────────────────────────────────
const setInsertUsers = async function (usuario) {
    try {
        let sql = `
            INSERT INTO tb_usuario (
                nome,
                email,
                senha,
                cpf,
                data_nasc,
                nacionalidade_id,
                genero_id,
                telefone
            ) VALUES (
                '${usuario.nome}',
                '${usuario.email}',
                '${usuario.senha}',
                '${usuario.cpf}',
                '${usuario.data_nasc}',
                ${usuario.nacionalidade_id},
                ${usuario.genero_id},
                ${usuario.telefone ? `'${usuario.telefone}'` : null}
            )
        `
        let result = await knexDatabase.raw(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.error('[DAO usuario] setInsertUsers:', error.message)
        return false
    }
}

// ─── Atualizar usuário ─────────────────────────────────────────────────────────
const setUpdateUsers = async function (usuario) {
    try {
        let sql = `
            UPDATE tb_usuario SET
                nome             = '${usuario.nome}',
                email            = '${usuario.email}',
                telefone         = '${usuario.telefone}',
                cpf              = '${usuario.cpf}',
                data_nasc        = '${usuario.data_nasc}',
                nacionalidade_id = ${usuario.nacionalidade_id},
                genero_id        = ${usuario.genero_id}
            WHERE id_usuario = ${usuario.id_usuario}
        `
        let result = await knexDatabase.raw(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.error('[DAO usuario] setUpdateUsers:', error.message)
        return false
    }
}

// ─── Atualizar foto do usuário ─────────────────────────────────────────────────
const setUpdateFotoUsuario = async function (id_usuario, url_foto) {
    try {
        let sql = `UPDATE tb_usuario SET foto = '${url_foto}' WHERE id_usuario = ${id_usuario}`
        let result = await knexDatabase.raw(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.error('[DAO usuario] setUpdateFotoUsuario:', error.message)
        return false
    }
}

// ─── Excluir usuário ───────────────────────────────────────────────────────────
const setDeleteUsers = async function (id) {
    try {
        let sql = `DELETE FROM tb_usuario WHERE id_usuario = ${id}`
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result))
            return result
        else
            return false

    } catch (error) {
        console.error('[DAO usuario] setDeleteUsers:', error.message)
        return false
    }
}

module.exports = {
    getSelectAllUsers,
    getSelectByIdUsers,
    getSelectByIdUsersOrganizer,
    getSelectLastID,
    getUsuarioByUsuarioEmail,
    getSenhaByEmail,
    getUsuarioByUsuarioCPF,
    setInsertUsers,
    setUpdateUsers,
    setUpdateFotoUsuario,
    setDeleteUsers
}