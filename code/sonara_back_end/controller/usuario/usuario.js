/******************************************************************************
 * Objetivo: Controller de usuário — alinhado com vw_usuario_completo
 * Data: 26/05/2026
 * Autor: Davi de Alemida Santos
 * Versão: 3.1
 *****************************************************************************/

const usuarioDAO              = require('../../model/DAO/usuario.js')
const crypto                  = require('../modulo/crypto-password.js')
const enderecoDAO             = require('../../model/DAO/endereco.js')
const artistaDAO              = require('../../model/DAO/artista.js')
const organizadorDAO          = require('../../model/DAO/organizador.js')
const artistaGeneroMusicalDAO = require('../../model/DAO/artista_genero_musical.js')
const { uploadImagemAzure }   = require('../modulo/azure_upload.js')

const DEFAULT_MESSAGES = require('../modulo/conf_message.js')

// ─── Formata uma linha da vw_usuario_completo em objeto estruturado ────────────
const formatarUsuario = function (row) {

    const parsearJSON = (valor) => {
        if (!valor) return []
        if (typeof valor === 'object') return valor

        try {
            return JSON.parse(valor)
        } catch {
            return []
        }
    }

    const usuario = {
        id_usuario: row.id_usuario,
        nome: row.nome,
        email: row.email,
        cpf: row.cpf,
        data_nasc: row.data_nasc,
        telefone: row.telefone,
        foto: row.foto,
        criado: row.criado,
        ultima_atualizacao: row.ultima_atualizacao,
        tipo_usuario: row.tipo_usuario,

        genero: {
            id_genero: row.genero_id,
            nome: row.genero_nome
        },

        nacionalidade: {
            id_nacionalidade: row.nacionalidade_id,
            nome: row.nacionalidade_nome
        },

        endereco: {
            id_endereco: row.id_endereco,
            cep: row.cep,
            cidade: row.cidade,
            estado: row.estado,
            logradouro: row.logradouro,
            numero: row.numero,
            complemento: row.complemento,
            bairro: row.bairro,
            latitude: row.latitude,
            longitude: row.longitude
        },

        redes_sociais: parsearJSON(row.redes_sociais)
    }

    if (row.tipo_usuario === 'Artista') {
        usuario.artista = {
            id_artista: row.id_artista,
            nome_artistico: row.nome_artistico,
            descricao: row.descricao_artista,
            generos_musicais: parsearJSON(row.generos_musicais),
            media_avaliacao: row.media_avaliacao_artista,
            total_avaliacoes: row.total_avaliacoes_artista,
            eventos: parsearJSON(row.eventos_artista)
        }
    }

    if (row.tipo_usuario === 'Organizador') {
        usuario.organizador = {
            id_organizador: row.id_organizador,
            eventos: parsearJSON(row.eventos_organizador)
        }
    }

    return usuario
}

// ─── Listar todos os usuários ──────────────────────────────────────────────────
const listarUsuarios = async function () {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        let resultUsuarios = await usuarioDAO.getSelectAllUsers()

        if (resultUsuarios) {
            if (resultUsuarios.length > 0) {
                MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.HEADER.response.usuarios = resultUsuarios.map(formatarUsuario)

                return MESSAGES.HEADER
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }
        } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.error('[Controller usuario] listarUsuarios:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Buscar usuário por ID ─────────────────────────────────────────────────────
const buscarUsuarioId = async function (id) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let resultUsuario = await usuarioDAO.getSelectByIdUsers(Number(id))

            if (resultUsuario) {
                if (resultUsuario.length > 0) {
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.usuario = formatarUsuario(resultUsuario[0])

                    return MESSAGES.HEADER
                } else {
                    return MESSAGES.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }

        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        console.error('[Controller usuario] buscarUsuarioId:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Buscar organizador pelo usuario_id ───────────────────────────────────────
const buscarOrganizadorUsuarioId = async function (id) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let resultOrganizador = await usuarioDAO.getSelectByIdUsersOrganizer(Number(id))

            if (resultOrganizador) {
                if (resultOrganizador.length > 0) {
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.usuario = resultOrganizador[0]

                    return MESSAGES.HEADER
                } else {
                    return MESSAGES.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }

        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        console.error('[Controller usuario] buscarOrganizadorUsuarioId:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Buscar usuário por e-mail ─────────────────────────────────────────────────
const buscarUsuarioEmail = async function (email) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (email != '' && email != null && email != undefined) {

            let resultUsuario = await usuarioDAO.getUsuarioByUsuarioEmail(email)

            if (resultUsuario) {
                MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.HEADER.response.usuario = formatarUsuario(resultUsuario)

                return MESSAGES.HEADER
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }

        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [E-mail incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        console.error('[Controller usuario] buscarUsuarioEmail:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Login ─────────────────────────────────────────────────────────────────────
const loginUsuario = async function (usuario) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!usuario.email || !usuario.senha) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [E-mail e senha são obrigatórios]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(usuario.email)) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Formato de e-mail inválido]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        let credenciais = await usuarioDAO.getSenhaByEmail(usuario.email)

        if (!credenciais) {
            return MESSAGES.ERROR_LOGIN
        }

        let senhaVerificada = false

        try {
            senhaVerificada = await crypto.verifyPassword(usuario.senha, credenciais.senha)
        } catch (cryptoErr) {
            console.error('[Controller usuario] loginUsuario — erro ao verificar senha:', cryptoErr.message)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        if (!senhaVerificada) {
            return MESSAGES.ERROR_LOGIN
        }

        let resultUsuario = await usuarioDAO.getUsuarioLoginById(credenciais.id_usuario)

        if (!resultUsuario) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
        MESSAGES.HEADER.response.usuario = resultUsuario

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller usuario] loginUsuario:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Inserir usuário ───────────────────────────────────────────────────────────
const inserirUsuario = async function (usuario, arquivo) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    let trx = null

    try {

        if (!usuario.tipo_usuario) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [tipo_usuario obrigatório: artista, organizador ou user]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        let validar = await validarDadosUsuario(usuario)
        if (validar) return validar

        trx = await usuarioDAO.knexDatabase.transaction()

        const usuarioCriptografado = {
            nome: usuario.nome,
            email: usuario.email,
            senha: await crypto.hashPassword(usuario.senha),
            cpf: usuario.cpf,
            data_nasc: usuario.data_nasc,
            nacionalidade_id: usuario.nacionalidade_id,
            genero_id: usuario.genero_id,
            telefone: usuario.telefone
        }

        const idUsuario = await usuarioDAO.setInsertUsers(usuarioCriptografado, trx)

        if (!idUsuario) {
            await trx.rollback()
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        if (arquivo) {
            try {
                const urlFoto = await uploadImagemAzure(
                    arquivo.buffer,
                    arquivo.originalname,
                    arquivo.mimetype
                )

                if (urlFoto) {
                    await usuarioDAO.setUpdateFotoUsuario(idUsuario, urlFoto, trx)
                }

            } catch (fotoErr) {
                console.warn('[Controller usuario] Erro no upload da foto:', fotoErr.message)
            }
        }

        const tipoUsuario = usuario.tipo_usuario.toLowerCase().trim()

        if (tipoUsuario === 'artista') {

            if (!usuario.generos_musicais || !Array.isArray(usuario.generos_musicais) || usuario.generos_musicais.length === 0) {
                await trx.rollback()
                MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Artistas devem informar pelo menos um gênero musical]'
                return MESSAGES.ERROR_REQUIRED_FIELDS
            }

            if (!usuario.nome_artistico || usuario.nome_artistico.trim() === '') {
                await trx.rollback()
                MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [nome_artistico obrigatório para artistas]'
                return MESSAGES.ERROR_REQUIRED_FIELDS
            }

            const resultArtista = await artistaDAO.setInsertArtist({
                nome_artistico: usuario.nome_artistico,
                usuario_id: idUsuario,
                descricao: usuario.descricao || ''
            }, trx)

            if (!resultArtista) {
                await trx.rollback()
                return console.log(resultArtista)
            }

            const artistaBanco = await artistaDAO.getSelectByIdArtistUser(idUsuario, trx)

            if (!artistaBanco || !artistaBanco.id_artista) {
                await trx.rollback()
                return console.log(artistaBanco)
            }

            for (const generoId of usuario.generos_musicais) {
                const resultGenero = await artistaGeneroMusicalDAO.setInsertArtistGendersSong({
                    genero_musical_id: generoId,
                    artista_id: artistaBanco.id_artista
                }, trx)

                if (!resultGenero) {
                    await trx.rollback()
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                }
            }

        } else if (tipoUsuario === 'organizador') {

            const resultOrganizador = await organizadorDAO.setInsertOrganizer({
                usuario_id: idUsuario
            }, trx)

            if (!resultOrganizador) {
                await trx.rollback()
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }

        } else if (tipoUsuario !== 'user') {

            await trx.rollback()
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ` [tipo_usuario inválido: "${usuario.tipo_usuario}". Use: artista, organizador ou user]`
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const resultEndereco = await enderecoDAO.setInsertAddress({
            cep: usuario.cep,
            cidade: usuario.cidade,
            estado: usuario.estado,
            logradouro: usuario.logradouro,
            numero: usuario.numero,
            complemento: usuario.complemento || '',
            bairro: usuario.bairro,
            latitude: usuario.latitude || null,
            longitude: usuario.longitude || null,
            usuario_id: idUsuario
        }, trx)

        if (!resultEndereco) {
            await trx.rollback()
            return console.log(resultEndereco)
        }

        await trx.commit()

        const resultFinal = await usuarioDAO.getSelectByIdUsers(idUsuario)

        if (!resultFinal || resultFinal.length === 0) {
            console.log(resultFinal)
        }

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.HEADER.response.usuario = formatarUsuario(resultFinal[0])

        return MESSAGES.HEADER

    } catch (error) {

        if (trx) await trx.rollback()

        console.error('[Controller usuario] inserirUsuario:', error.message, error.stack)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}
// ─── Atualizar usuário ─────────────────────────────────────────────────────────
const atualizarUsuario = async function (usuario, id, arquivo) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarUsuarioId(Number(id))

            if (validarID.status_code == 200) {

                usuario.id_usuario = Number(id)

                if (arquivo) {
                    try {
                        let urlFoto = await uploadImagemAzure(
                            arquivo.buffer,
                            arquivo.originalname,
                            arquivo.mimetype
                        )

                        if (urlFoto) {
                            await usuarioDAO.setUpdateFotoUsuario(usuario.id_usuario, urlFoto)
                        }

                    } catch (fotoErr) {
                        console.warn('[Controller usuario] Erro no upload da foto:', fotoErr.message)
                    }
                }

                let dadosUsuario = {
                    id_usuario: usuario.id_usuario,
                    nome: usuario.nome,
                    email: usuario.email,
                    telefone: usuario.telefone,
                    cpf: usuario.cpf,
                    data_nasc: usuario.data_nasc,
                    nacionalidade_id: usuario.nacionalidade_id,
                    genero_id: usuario.genero_id
                }

                let resultUsuario = await usuarioDAO.setUpdateUsers(dadosUsuario)

                if (!resultUsuario) {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                }

                let tipoUsuario = usuario.tipo_usuario?.toLowerCase()

                if (tipoUsuario === 'artista') {

                    if (!usuario.generos_musicais || !Array.isArray(usuario.generos_musicais) || usuario.generos_musicais.length === 0) {
                        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Artistas devem informar pelo menos um gênero musical]'
                        return MESSAGES.ERROR_REQUIRED_FIELDS
                    }

                    let artistaBanco = await artistaDAO.getSelectByIdArtistUser(usuario.id_usuario)

                    if (!artistaBanco || !artistaBanco.id_artista) {
                        await artistaDAO.setInsertArtist({
                            nome_artistico: usuario.nome_artistico,
                            usuario_id: usuario.id_usuario,
                            descricao: usuario.descricao || ''
                        })

                        artistaBanco = await artistaDAO.getSelectByIdArtistUser(usuario.id_usuario)

                    } else {
                        await artistaDAO.setUpdateArtist({
                            nome_artistico: usuario.nome_artistico,
                            descricao: usuario.descricao || '',
                            usuario_id: usuario.id_usuario,
                            id_artista: artistaBanco.id_artista
                        })
                    }

                    if (artistaBanco && artistaBanco.id_artista) {
                        await artistaGeneroMusicalDAO.setDeleteArtistGendersSong(artistaBanco.id_artista)

                        for (let generoId of usuario.generos_musicais) {
                            await artistaGeneroMusicalDAO.setInsertArtistGendersSong({
                                genero_musical_id: generoId,
                                artista_id: artistaBanco.id_artista
                            })
                        }
                    }

                } else if (tipoUsuario === 'organizador') {

                    let organizadorBanco = await organizadorDAO.getSelectByIdOrganizerUser(usuario.id_usuario)

                    if (!organizadorBanco || !organizadorBanco.id_organizador) {
                        await organizadorDAO.setInsertOrganizer({
                            usuario_id: usuario.id_usuario
                        })
                    }
                }

                await enderecoDAO.setUpdateAddress({
                    cep: usuario.cep,
                    cidade: usuario.cidade,
                    estado: usuario.estado,
                    logradouro: usuario.logradouro,
                    numero: usuario.numero,
                    complemento: usuario.complemento || '',
                    bairro: usuario.bairro,
                    usuario_id: usuario.id_usuario
                })

                let resultFinal = await usuarioDAO.getSelectByIdUsers(usuario.id_usuario)

                if (!resultFinal || resultFinal.length === 0) {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                }

                MESSAGES.HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
                MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                MESSAGES.HEADER.message = MESSAGES.SUCCESS_UPDATED_ITEM.message
                MESSAGES.HEADER.response.usuario = formatarUsuario(resultFinal[0])

                return MESSAGES.HEADER

            } else {
                return validarID
            }

        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        console.error('[Controller usuario] atualizarUsuario:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Excluir usuário ───────────────────────────────────────────────────────────
const excluirUsuario = async function (id) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarUsuarioId(id)

            if (validarID.status_code == 200) {

                let resultUsuario = await usuarioDAO.setDeleteUsers(Number(id))

                if (resultUsuario) {
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                    MESSAGES.HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message
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
        console.error('[Controller usuario] excluirUsuario:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Atualizar foto do usuário ─────────────────────────────────────────────────
const atualizarFotoUsuario = async function (id, fileBuffer, originalName, mimeType) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarUsuarioId(id)

            if (validarID.status_code == 200) {

                let urlFoto = await uploadImagemAzure(fileBuffer, originalName, mimeType)

                if (!urlFoto) {
                    return MESSAGES.ERROR_UPLOAD_AZURE
                }

                let resultFoto = await usuarioDAO.setUpdateFotoUsuario(Number(id), urlFoto)

                if (resultFoto) {
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                    MESSAGES.HEADER.message = MESSAGES.SUCCESS_UPDATED_ITEM.message
                    MESSAGES.HEADER.response = {
                        id_usuario: Number(id),
                        foto: urlFoto
                    }

                    return MESSAGES.HEADER
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                }

            } else {
                return validarID
            }

        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        console.error('[Controller usuario] atualizarFotoUsuario:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Validação dos dados de cadastro ──────────────────────────────────────────
const validarDadosUsuario = async function (usuario) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    const gerarErro = (detalhe) => {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ` [${detalhe}]`
        return MESSAGES.ERROR_REQUIRED_FIELDS
    }

    if (!usuario.nome || usuario.nome.trim() === '' || usuario.nome.length > 150)
        return gerarErro('nome inválido — máximo 150 caracteres')

    if (!usuario.email || usuario.email.length > 150)
        return gerarErro('e-mail inválido — máximo 150 caracteres')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(usuario.email))
        return gerarErro('formato de e-mail inválido')

    if (!usuario.senha || usuario.senha.length > 100)
        return gerarErro('senha inválida — máximo 100 caracteres')

    const senhaRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/

    if (!senhaRegex.test(usuario.senha))
        return gerarErro('senha deve ter mínimo 8 caracteres, uma maiúscula, um número e um especial (!@#$%^&*)')

    if (!usuario.cpf || usuario.cpf.length > 20)
        return gerarErro('CPF obrigatório — máximo 20 caracteres')

    if (!usuario.data_nasc)
        return gerarErro('data_nasc obrigatória')

    if (!usuario.nacionalidade_id || isNaN(usuario.nacionalidade_id))
        return gerarErro('nacionalidade_id inválido')

    if (!usuario.genero_id || isNaN(usuario.genero_id))
        return gerarErro('genero_id inválido')

    if (!usuario.telefone || usuario.telefone.length > 45)
        return gerarErro('telefone obrigatório — máximo 45 caracteres')

    if (!usuario.cep || !usuario.cidade || !usuario.estado || !usuario.logradouro || !usuario.numero || !usuario.bairro)
        return gerarErro('campos de endereço obrigatórios: cep, cidade, estado, logradouro, numero, bairro')

    const emailExistente = await usuarioDAO.getUsuarioByUsuarioEmail(usuario.email)

    if (emailExistente)
        return gerarErro('e-mail já cadastrado')

    const cpfExistente = await usuarioDAO.getUsuarioByUsuarioCPF(usuario.cpf)

    if (cpfExistente)
        return gerarErro('CPF já cadastrado')

    return false
}

module.exports = {
    listarUsuarios,
    buscarUsuarioId,
    buscarUsuarioEmail,
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario,
    loginUsuario,
    buscarOrganizadorUsuarioId,
    atualizarFotoUsuario
}