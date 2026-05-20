/******************************************************************************
 * Objetivo: Controller de foto de evento com upload para Azure Blob Storage
 * Fluxo: Azure → tb_foto (salva URL) → tb_evento_foto (salva id_foto)
 * Data: 19/05/2026
 * Autor: Davi de Alemida Santos
 * Versão: 3.0
 *****************************************************************************/

const eventoFotoDAO         = require('../../model/DAO/evento_foto.js')
const fotoDAO               = require('../../model/DAO/foto.js')         // tb_foto
const DEFAULT_MESSAGES      = require('../modulo/conf_message.js')
const { uploadImagemAzure } = require('../modulo/azure_upload.js')


// ─── Listar todas as fotos ────────────────────────────────────────────────────
const listareventoFoto = async function () {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    try {
        let result = await eventoFotoDAO.getSelectAllPhotoEvent()

        if (result && result.length > 0) {
            MESSAGES.HEADER.status              = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code         = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.EventoFoto = result
            return MESSAGES.HEADER //200
        } else if (result && result.length === 0) {
            return MESSAGES.ERROR_NOT_FOUND //404
        } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

// ─── Buscar por ID ────────────────────────────────────────────────────────────
const buscareventoFotoId = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let result = await eventoFotoDAO.getSelectByIdPhotoEvent(Number(id))

            if (result && result.length > 0) {
                MESSAGES.HEADER.status              = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.HEADER.status_code         = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.HEADER.response.eventoFoto = result[0]
                return MESSAGES.HEADER //200
            } else if (result && result.length === 0) {
                return MESSAGES.ERROR_NOT_FOUND //404
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

// ─── Inserir foto ─────────────────────────────────────────────────────────────
// Fluxo: upload Azure → INSERT tb_foto → pega id_foto → INSERT tb_evento_foto
const inserireventoFoto = async function (eventoFoto, file) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    try {

        if (!file) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Campo: foto obrigatória]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }

        let validar = validarDadoseventoFoto(eventoFoto)
        if (validar) return validar //400

        // 1. Sobe a imagem para o Azure e recebe a URL pública
        const url_foto = await uploadImagemAzure(file.buffer, file.originalname, file.mimetype)
        if (!url_foto) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500

        // 2. Salva a URL na tb_foto
        const resultFoto = await fotoDAO.setInsertPicture({ foto: url_foto })
        if (!resultFoto) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500

        // 3. Pega o id_foto gerado
        const id_foto = await fotoDAO.getSelectLastID()
        if (!id_foto) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500

        // 4. Salva na tb_evento_foto com o id_foto correto
        const dadosEventoFoto = {
            foto_id:   id_foto,
            evento_id: Number(eventoFoto.evento_id),
            data_hora: new Date().toISOString().slice(0, 19).replace('T', ' ') // YYYY-MM-DD HH:MM:SS
        }

        const resultEventoFoto = await eventoFotoDAO.setInsertPhotoEvent(dadosEventoFoto)
        if (!resultEventoFoto) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500

        // 5. Pega o id gerado na tb_evento_foto
        const lastID = await eventoFotoDAO.getSelectLastID()
        if (!lastID) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500

        dadosEventoFoto.id_evento_foto = lastID
        dadosEventoFoto.url_foto       = url_foto // retorna a URL no response para o front usar

        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.HEADER.response    = dadosEventoFoto
        return MESSAGES.HEADER //201

    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

// ─── Atualizar foto ───────────────────────────────────────────────────────────
// Se vier novo arquivo: sobe Azure → atualiza tb_foto → tb_evento_foto já tem o foto_id
const atualizareventoFoto = async function (eventoFoto, id, file) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    try {
        let validarID = await buscareventoFotoId(id)
        if (validarID.status_code !== 200) return validarID

        let validar = validarDadoseventoFoto(eventoFoto)
        if (validar) return validar //400

        eventoFoto.id_evento_foto = Number(id)

        if (file) {
            // 1. Sobe nova imagem no Azure
            const url_foto = await uploadImagemAzure(file.buffer, file.originalname, file.mimetype)
            if (!url_foto) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500

            // 2. Pega o foto_id atual vinculado a esse evento_foto
            const fotoAtual = validarID.response.eventoFoto
            const foto_id   = fotoAtual.foto_id

            if (foto_id) {
                // 3. Atualiza a URL na tb_foto existente
                await fotoDAO.setUpdatePicture({ id_foto: foto_id, foto: url_foto })
            } else {
                // Se por algum motivo não tiver foto vinculada, cria uma nova
                await fotoDAO.setInsertPicture({ foto: url_foto })
                const novoIdFoto = await fotoDAO.getSelectLastID()
                eventoFoto.foto_id = novoIdFoto
            }
        }

        const result = await eventoFotoDAO.setUpdatePhotoEvent(eventoFoto)
        if (!result) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500

        MESSAGES.HEADER.status              = MESSAGES.SUCCESS_UPDATED_ITEM.status
        MESSAGES.HEADER.status_code         = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
        MESSAGES.HEADER.message             = MESSAGES.SUCCESS_UPDATED_ITEM.message
        MESSAGES.HEADER.response.eventoFoto = eventoFoto
        return MESSAGES.HEADER //200

    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

// ─── Excluir foto ─────────────────────────────────────────────────────────────
const excluireventoFoto = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let validarID = await buscareventoFotoId(id)

            if (validarID.status_code === 200) {
                let result = await eventoFotoDAO.setDeletePhotoEvent(Number(id))

                if (result) {
                    MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                    MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                    delete MESSAGES.HEADER.response
                    return MESSAGES.HEADER
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Validação ────────────────────────────────────────────────────────────────
const validarDadoseventoFoto = function (eventoFoto) {
    const gerarErro = (campo) => ({
        ...DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS,
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    })

    if (!eventoFoto.evento_id || isNaN(eventoFoto.evento_id) || Number(eventoFoto.evento_id) <= 0)
        return gerarErro('evento_id')

    return false
}


module.exports = {
    listareventoFoto,
    buscareventoFotoId,
    inserireventoFoto,
    atualizareventoFoto,
    excluireventoFoto
}