/******************************************************************************
 * Objetivo: DAO de usuário — corrigido getSelectByIdUsersOrganizer e logs
 * Data: 19/05/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.3
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);

const getSelectAllUsers = async function () {
    try {
        let sql = `select * from tb_usuario`
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

const getSelectByIdUsers = async function (id) {
    try {
        let sql = `select * from tb_usuario where id_usuario = ${id}`
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

// CORRIGIDO: buscava por id_organizador mas a intenção é buscar o organizador
// pelo id_usuario, pois recebe o usuario_id do usuário logado.
const getSelectByIdUsersOrganizer = async function (usuario_id) {
    try {
        let sql = `select * from tb_organizador where usuario_id = ${usuario_id}`
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

// Aceita string ou objeto { email }
const getUsuarioByUsuarioEmail = async function (email) {
    try {
        const emailValue = (typeof email === 'object' && email !== null) ? email.email : email

        let sql = `select * from vw_usuario_com_senha where email = '${emailValue}'`
        const result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]) && result[0].length > 0)
            return result[0][0]
        else
            return false
    } catch (error) {
        console.error('[DAO usuario] getUsuarioByUsuarioEmail:', error.message)
        return false
    }
}

const getUsuarioByUsuarioCPF = async function (cpf) {
    try {
        let sql = `select * from tb_usuario where cpf = '${cpf}'`
        const result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]) && result[0].length > 0)
            return result[0][0]
        else
            return false
    } catch (error) {
        console.error('[DAO usuario] getUsuarioByUsuarioCPF:', error.message)
        return false
    }
}

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
        );`

        let result = await knexDatabase.raw(sql)
        return !!result
    } catch (error) {
        console.error('[DAO usuario] setInsertUsers:', error.message)
        return false
    }
}

const setUpdateUsers = async function (usuario) {
    try {
        const sql = `
            UPDATE tb_usuario SET
                nome = '${usuario.nome}',
                email = '${usuario.email}',
                senha = '${usuario.senha}',
                telefone = '${usuario.telefone}',
                cpf = '${usuario.cpf}',
                data_nasc = '${usuario.data_nasc}',
                nacionalidade_id = ${usuario.nacionalidade_id},
                genero_id = ${usuario.genero_id}
            WHERE id_usuario = ${usuario.id_usuario}
        `
        const [result] = await knexDatabase.raw(sql)
        return result.affectedRows > 0
    } catch (error) {
        console.error('[DAO usuario] setUpdateUsers:', error.message)
        return false
    }
}

const setUpdateFotoUsuario = async function (id_usuario, url_foto) {
    try {
        let sql = `update tb_usuario set foto = '${url_foto}' where id_usuario = ${id_usuario}`
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

const setDeleteUsers = async function (id) {
    try {
        let sql = `delete from tb_usuario where id_usuario = ${id}`
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
    setInsertUsers,
    setUpdateUsers,
    setUpdateFotoUsuario,
    getSelectLastID,
    setDeleteUsers,
    getSelectByIdUsersOrganizer,
    getUsuarioByUsuarioEmail,
    getUsuarioByUsuarioCPF
}