/******************************************************************************
 * DAO de usuário — seguro e compatível com transaction
 *****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)

const db = (trx) => trx || knexDatabase

const getSelectAllUsers = async function () {
    try {
        return await knexDatabase('vw_usuario_completo')
    } catch (error) {
        console.error('[DAO usuario] getSelectAllUsers:', error.message)
        return false
    }
}

const getSelectByIdUsers = async function (id) {
    try {
        return await knexDatabase('vw_usuario_completo')
            .where({ id_usuario: id })
    } catch (error) {
        console.error('[DAO usuario] getSelectByIdUsers:', error.message)
        return false
    }
}

const getSelectByIdUsersOrganizer = async function (usuario_id) {
    try {
        return await knexDatabase('tb_organizador')
            .where({ usuario_id })
    } catch (error) {
        console.error('[DAO usuario] getSelectByIdUsersOrganizer:', error.message)
        return false
    }
}

const getUsuarioByUsuarioEmail = async function (email) {
    try {
        const emailValue = typeof email === 'object' && email !== null ? email.email : email

        const result = await knexDatabase('vw_usuario_completo')
            .where({ email: emailValue })
            .first()

        return result || false
    } catch (error) {
        console.error('[DAO usuario] getUsuarioByUsuarioEmail:', error.message)
        return false
    }
}

const getSenhaByEmail = async function (email) {
    try {
        const result = await knexDatabase('tb_usuario')
            .select('id_usuario', 'senha')
            .where({ email })
            .first()

        return result || false
    } catch (error) {
        console.error('[DAO usuario] getSenhaByEmail:', error.message)
        return false
    }
}

const getUsuarioByUsuarioCPF = async function (cpf) {
    try {
        const result = await knexDatabase('tb_usuario')
            .select('id_usuario')
            .where({ cpf })
            .first()

        return result || false
    } catch (error) {
        console.error('[DAO usuario] getUsuarioByUsuarioCPF:', error.message)
        return false
    }
}

const setInsertUsers = async function (usuario, trx = null) {
    try {
        const result = await db(trx)('tb_usuario').insert({
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha,
            cpf: usuario.cpf,
            data_nasc: usuario.data_nasc,
            nacionalidade_id: usuario.nacionalidade_id,
            genero_id: usuario.genero_id,
            telefone: usuario.telefone || null
        })

        return result[0]
    } catch (error) {
        console.error('[DAO usuario] setInsertUsers:', error.message)
        return false
    }
}

const setUpdateUsers = async function (usuario, trx = null) {
    try {
        const dados = {}

        if (usuario.nome !== undefined) dados.nome = usuario.nome
        if (usuario.email !== undefined) dados.email = usuario.email
        if (usuario.telefone !== undefined) dados.telefone = usuario.telefone || null
        if (usuario.cpf !== undefined) dados.cpf = usuario.cpf
        if (usuario.data_nasc !== undefined) dados.data_nasc = usuario.data_nasc
        if (usuario.nacionalidade_id !== undefined) dados.nacionalidade_id = usuario.nacionalidade_id
        if (usuario.genero_id !== undefined) dados.genero_id = usuario.genero_id

        if (Object.keys(dados).length === 0) return true

        const result = await db(trx)('tb_usuario')
            .where({ id_usuario: usuario.id_usuario })
            .update(dados)

        return result > 0
    } catch (error) {
        console.error('[DAO usuario] setUpdateUsers:', error.message)
        return false
    }
}

const setUpdateFotoUsuario = async function (id_usuario, url_foto, trx = null) {
    try {
        const result = await db(trx)('tb_usuario')
            .where({ id_usuario })
            .update({ foto: url_foto })

        return result > 0
    } catch (error) {
        console.error('[DAO usuario] setUpdateFotoUsuario:', error.message)
        return false
    }
}

const setDeleteUsers = async function (id, trx = null) {
    try {
        const result = await db(trx)('tb_usuario')
            .where({ id_usuario: id })
            .del()

        return result > 0
    } catch (error) {
        console.error('[DAO usuario] setDeleteUsers:', error.message)
        return false
    }
}

module.exports = {
    knexDatabase,
    getSelectAllUsers,
    getSelectByIdUsers,
    getSelectByIdUsersOrganizer,
    getUsuarioByUsuarioEmail,
    getSenhaByEmail,
    getUsuarioByUsuarioCPF,
    setInsertUsers,
    setUpdateUsers,
    setUpdateFotoUsuario,
    setDeleteUsers
}