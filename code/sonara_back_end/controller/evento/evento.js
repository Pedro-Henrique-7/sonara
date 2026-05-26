/******************************************************************************
 * Objetivo: Controller de evento
 * Data: 26/05/2026
 * Autor: Davi de Alemida Santos
 * Versão: 2.1
 *****************************************************************************/

const eventoDAO = require('../../model/DAO/evento.js')
const enderecoEventoDAO = require('../../model/DAO/endereco_evento.js')
const eventoOrganizadorDAO = require('../../model/DAO/evento_organizador.js')
const usuarioDAO = require('../../model/DAO/usuario.js')
const fotoDAO = require('../../model/DAO/foto.js')

const DEFAULT_MESSAGES = require('../modulo/conf_message.js')

const parseJSON = (valor, padrao = []) => {
    if (!valor) return padrao
    if (typeof valor === 'object') return valor

    try {
        return JSON.parse(valor)
    } catch {
        return padrao
    }
}

const formatarEvento = function (row) {
    return {
        id_evento: row.id_evento,
        nome: row.evento_nome || row.nome,
        descricao: row.evento_descricao || row.descricao,
        local: row.local,
        data: row.data,
        hora_inicio: row.hora_inicio,
        hora_fim: row.hora_fim,

        endereco: parseJSON(row.endereco, {}),

        fotos: parseJSON(row.fotos),

        organizador: {
            id_organizador: row.id_organizador || null,
            id_usuario: row.organizador_usuario_id || null,
            nome: row.organizador_nome || null,
            email: row.organizador_email || null,
            telefone: row.organizador_telefone || null,
            foto: row.organizador_foto || null
        },

        status: parseJSON(row.status_evento, {}),

        avaliacao: {
            media: Number(row.media_avaliacao_evento || 0),
            total: Number(row.total_avaliacoes_evento || 0)
        },

        artistas: parseJSON(row.evento_artistas)
    }
}

const listarEvento = async function () {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        const resultEvento = await eventoDAO.getSelectAllEvent()

        if (!resultEvento || resultEvento.length === 0) {
            return MESSAGES.ERROR_NOT_FOUND
        }

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
        MESSAGES.HEADER.response.eventos = resultEvento.map(formatarEvento)

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento] listarEvento:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}
const buscarEventoId = async function (id) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(id) || id === '' || id === null || Number(id) <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const resultEvento = await eventoDAO.getSelectByIdEvent(Number(id))

        if (!resultEvento || resultEvento.length === 0) {
            return MESSAGES.ERROR_NOT_FOUND
        }

        const eventoFormatado = await formatarEvento(resultEvento[0])

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
        MESSAGES.HEADER.response.evento = eventoFormatado

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento] buscarEventoId:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const inserirEvento = async function (evento, contentType) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!String(contentType).toUpperCase().includes('APPLICATION/JSON')) {
            return MESSAGES.ERROR_CONTENT_TYPE
        }

        const validarEvento = validarDadosEvento(evento)
        if (validarEvento) return validarEvento

        const idEvento = await eventoDAO.setInsertEvent(evento)

        if (!idEvento) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        const enderecoEvento = {
            cep: evento.cep,
            cidade: evento.cidade,
            estado: evento.estado,
            logradouro: evento.logradouro,
            numero: evento.numero,
            complemento: evento.complemento || '',
            bairro: evento.bairro,
            evento_id: idEvento
        }

        const resultEndereco = await enderecoEventoDAO.setInsertAddressEvent(enderecoEvento)

        if (!resultEndereco) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        const resultOrganizador = await usuarioDAO.getSelectByIdUsersOrganizer(evento.organizador_id)

        if (!resultOrganizador || resultOrganizador.length === 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Organizador não encontrado]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const eventoOrganizador = {
            evento_id: idEvento,
            organizador_id: resultOrganizador[0].id_organizador
        }

        const resultEventoOrg = await eventoOrganizadorDAO.setInsertOrganizerEvent(eventoOrganizador)

        if (!resultEventoOrg) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        const resultFinal = await eventoDAO.getSelectByIdEvent(idEvento)

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.HEADER.response.evento = resultFinal && resultFinal.length > 0
            ? await formatarEvento(resultFinal[0])
            : {
                id_evento: idEvento,
                nome: evento.nome,
                descricao: evento.descricao,
                local: evento.local,
                data: evento.data,
                hora_inicio: evento.hora_inicio,
                hora_fim: evento.hora_fim,
                endereco: enderecoEvento,
                organizador: eventoOrganizador,
                fotos: [],
                artistas: []
            }

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento] inserirEvento:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarEvento = async function (evento, id, contentType) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!String(contentType).toUpperCase().includes('APPLICATION/JSON')) {
            return MESSAGES.ERROR_CONTENT_TYPE
        }

        const validarID = await buscarEventoId(id)

        if (validarID.status_code !== 200) {
            return validarID
        }

        evento.id_evento = Number(id)

        const resultEvento = await eventoDAO.setUpdateEvent(evento)

        if (!resultEvento) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        const enderecoEvento = {
            cep: evento.cep,
            cidade: evento.cidade,
            estado: evento.estado,
            logradouro: evento.logradouro,
            numero: evento.numero,
            complemento: evento.complemento || '',
            bairro: evento.bairro,
            evento_id: evento.id_evento
        }

        await enderecoEventoDAO.setUpdateAddressEvent(enderecoEvento)

        if (evento.organizador_id) {
            const resultOrganizador = await usuarioDAO.getSelectByIdUsersOrganizer(evento.organizador_id)

            if (!resultOrganizador || resultOrganizador.length === 0) {
                MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Organizador não encontrado]'
                return MESSAGES.ERROR_REQUIRED_FIELDS
            }

            const eventoOrganizador = {
                evento_id: evento.id_evento,
                organizador_id: resultOrganizador[0].id_organizador
            }

            await eventoOrganizadorDAO.setUpdateOrganizerEvent(eventoOrganizador)
        }

        const resultFinal = await eventoDAO.getSelectByIdEvent(evento.id_evento)

        if (!resultFinal || resultFinal.length === 0) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
        MESSAGES.HEADER.message = MESSAGES.SUCCESS_UPDATED_ITEM.message
        MESSAGES.HEADER.response.evento = await formatarEvento(resultFinal[0])

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento] atualizarEvento:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirEvento = async function (id) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(id) || id === '' || id === null || Number(id) <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const validarID = await buscarEventoId(id)

        if (validarID.status_code !== 200) {
            return MESSAGES.ERROR_NOT_FOUND
        }

        const resultEvento = await eventoDAO.setDeleteEvent(Number(id))

        if (!resultEvento) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
        MESSAGES.HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message
        delete MESSAGES.HEADER.response

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento] excluirEvento:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDadosEvento = function (evento) {

    const gerarErro = (campo) => ({
        ...DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS,
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    })

    if (!evento.nome || evento.nome.length > 150)
        return gerarErro('nome')

    if (!evento.descricao || evento.descricao.length > 500)
        return gerarErro('descricao')

    if (!evento.local || evento.local.length > 255)
        return gerarErro('local')

    if (!evento.data || evento.data.length > 20)
        return gerarErro('data')

    if (!evento.hora_inicio || evento.hora_inicio.length > 20)
        return gerarErro('hora_inicio')

    if (!evento.hora_fim || evento.hora_fim.length > 20)
        return gerarErro('hora_fim')

    if (!evento.cep || evento.cep.length > 11)
        return gerarErro('cep')

    if (!evento.cidade || evento.cidade.length > 100)
        return gerarErro('cidade')

    if (!evento.estado || evento.estado.length > 2)
        return gerarErro('estado')

    if (!evento.logradouro || evento.logradouro.length > 255)
        return gerarErro('logradouro')

    if (!evento.numero || String(evento.numero).length > 20)
        return gerarErro('numero')

    if (!evento.bairro || evento.bairro.length > 45)
        return gerarErro('bairro')

    if (!evento.organizador_id || isNaN(evento.organizador_id))
        return gerarErro('organizador_id')

    return false
}

module.exports = {
    listarEvento,
    buscarEventoId,
    inserirEvento,
    atualizarEvento,
    excluirEvento
}