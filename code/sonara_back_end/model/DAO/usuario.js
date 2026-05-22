/******************************************************************************
 * Objetivo: DAO de usuário — foto agora é atributo direto de tb_usuario
 * Data: 19/05/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.2
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
        return false
    }
}

const getSelectByIdUsersOrganizer = async function (id) {
    try {
        let sql = `select * from tb_organizador where id_organizador = ${id}`
   
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
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
        console.log(error)
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
        console.log(error)
        return false
    }
}

const setUpdateUsers = async function (usuario) {
    try {

        const sql = `
            UPDATE tb_usuario SET
                nome = ?,
                email = ?,
                senha = ?,
                telefone = ?,
                cpf = ?,
                data_nasc = ?,
                nacionalidade_id = ?,
                genero_id = ?
            WHERE id_usuario = ?
        `

        const params = [
            usuario.nome,
            usuario.email,
            usuario.senha,
            usuario.telefone,
            usuario.cpf,
            usuario.data_nasc,
            usuario.nacionalidade_id,
            usuario.genero_id,
            usuario.id_usuario
        ]

        const [result] = await knexDatabase.raw(sql, params)

        return result.affectedRows > 0

    } catch (error) {
        console.log(error)
        return false
    }
}

// Atualiza apenas o campo foto da tb_usuario
const setUpdateFotoUsuario = async function (id_usuario, url_foto) {
    try {
        let sql = `update tb_usuario set foto = '${url_foto}' where id_usuario = ${id_usuario}`
        let result = await knexDatabase.raw(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
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