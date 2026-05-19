/******************************************************************************
 * Objetivo: Controller de usuário — cadastro com foto opcional via Azure
 * Data: 19/05/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.3
*****************************************************************************/

const usuarioDAO              = require('../../model/DAO/usuario.js')
const crypto                  = require('../modulo/crypto-password.js')
const enderecoDAO             = require('../../model/DAO/endereco.js')
const artistaDAO              = require('../../model/DAO/artista.js')
const organizadorDAO          = require('../../model/DAO/organizador.js')
const artistaGeneroMusicalDAO = require('../../model/DAO/artista_genero_musical.js')
const { uploadImagemAzure }   = require('../modulo/azure_upload.js')

const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarUsuarios = async function () {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        let resultUsuarios = await usuarioDAO.getSelectAllUsers()

        if (resultUsuarios && resultUsuarios.length > 0) {
            MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.usuarios = resultUsuarios
            return MESSAGES.HEADER
        } else {
            return MESSAGES.ERROR_NOT_FOUND
        }

    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarUsuarioId = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultusuarios = await usuarioDAO.getSelectByIdUsers(Number(id))

            if (resultusuarios) {
                if (resultusuarios.length > 0) {
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.usuarios = resultusuarios[0]
                    return MESSAGES.HEADER
                } else {
                    return MESSAGES.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message = 'Não foi possível processar a requisição [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarOrganizadorUsuarioId = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultusuarios = await usuarioDAO.getSelectByIdUsersOrganizer(Number(id))

            if (resultusuarios) {
                if (resultusuarios.length > 0) {
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.usuarios = resultusuarios[0]
                    return MESSAGES.HEADER
                } else {
                    return MESSAGES.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message = 'Não foi possível processar a requisição [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarUsuarioEmail = async function (email) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (email != '' && email != null && email != undefined) {
            let resultusuarios = await usuarioDAO.getUsuarioByUsuarioEmail(email)

            if (resultusuarios) {
                MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.HEADER.response.usuarios = resultusuarios
                return MESSAGES.HEADER
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message = 'Não foi possível processar a requisição [Email incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// arquivo é o objeto do multer (req.file) ou null se não enviado
const inserirUsuario = async function (usuario, arquivo) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!usuario.tipo_usuario) return MESSAGES.ERROR_INVALID_PARAMS

        let validar = await validarDadosUsuario(usuario)
        if (validar) return validar

        let criptografiaDeSenha = crypto.hashPassword(usuario.senha)

        let usuarioCriptografado = {
            nome:             usuario.nome,
            email:            usuario.email,
            senha:            criptografiaDeSenha,
            cpf:              usuario.cpf,
            data_nasc:        usuario.data_nasc,
            nacionalidade_id: usuario.nacionalidade_id,
            genero_id:        usuario.genero_id,
            telefone:         usuario.telefone,
        }

        let resultUsuario = await usuarioDAO.setInsertUsers(usuarioCriptografado)
        if (!resultUsuario) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        let lastIDUsuario = await usuarioDAO.getSelectLastID()
        if (!lastIDUsuario) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        // ===== FOTO (opcional no cadastro) =====
        if (arquivo) {
            let urlFoto = await uploadImagemAzure(arquivo.buffer, arquivo.originalname, arquivo.mimetype)

            if (urlFoto) {
                await usuarioDAO.setUpdateFotoUsuario(lastIDUsuario.id_usuario, urlFoto)
                usuarioCriptografado.foto = urlFoto
            }
            // se o upload falhar não abortamos o cadastro, só logamos
            else {
                console.log('Aviso: upload de foto falhou, usuário cadastrado sem foto.')
            }
        }

        // ===== TIPO DE USUÁRIO =====
        let tipoUsuario = usuario.tipo_usuario.toLowerCase()

        if (tipoUsuario == 'artista') {

            if (!usuario.generos_musicais || !Array.isArray(usuario.generos_musicais) || usuario.generos_musicais.length === 0) {
                return { status: false, status_code: 400, message: 'Artista deve ter pelo menos um gênero musical [Campo: generos_musicais]' }
            }

            let artista = {
                nome_artistico: usuario.nome_artistico,
                usuario_id:     lastIDUsuario.id_usuario,
                descricao:      usuario.descricao,
            }

            let resultArtista = await artistaDAO.setInsertArtist(artista)
            if (!resultArtista) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

            let lastIDArtista = await artistaDAO.getSelectLastID()
            if (!lastIDArtista) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

            for (let generoId of usuario.generos_musicais) {
                let resultGenero = await artistaGeneroMusicalDAO.setInsertArtistGendersSong({
                    genero_musical_id: generoId,
                    artista_id:        lastIDArtista.id_artista
                })
                if (!resultGenero) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }

        } else if (tipoUsuario == 'organizador') {

            let resultOrganizador = await organizadorDAO.setInsertOrganizer({ usuario_id: lastIDUsuario.id_usuario })
            if (!resultOrganizador) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        } else if (tipoUsuario == 'user') {
            // usuário comum, nada extra

        } else {
            return MESSAGES.ERROR_INVALID_PARAMS
        }

        // ===== ENDEREÇO =====
        let enderecoUsuario = {
            cep:         usuario.cep,
            cidade:      usuario.cidade,
            estado:      usuario.estado,
            logradouro:  usuario.logradouro,
            numero:      usuario.numero,
            complemento: usuario.complemento,
            bairro:      usuario.bairro,
            usuario_id:  lastIDUsuario.id_usuario
        }

        let resultEndereco = await enderecoDAO.setInsertAddress(enderecoUsuario)
        if (!resultEndereco) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        delete usuarioCriptografado.senha
        usuarioCriptografado.id_usuario = lastIDUsuario.id_usuario

        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.HEADER.response    = usuarioCriptografado

        return MESSAGES.HEADER

    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const loginUsuario = async function (usuario) {
    let MESSAGE = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        const user = await usuarioDAO.getUsuarioByUsuarioEmail(usuario.email)
        if (!user) return MESSAGE.ERROR_LOGIN

        const senhaVerificada = crypto.verifyPassword(usuario.senha, user.senha)

        if (senhaVerificada) {
            MESSAGE.HEADER.status           = MESSAGE.SUCCESS_REQUEST.status
            MESSAGE.HEADER.status_code      = MESSAGE.SUCCESS_REQUEST.status_code
            MESSAGE.HEADER.response.usuario = user
            return MESSAGE.HEADER
        } else {
            return MESSAGE.ERROR_LOGIN
        }

    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarUsuario = async function (usuario, id, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (String(contentType).toUpperCase() !== 'APPLICATION/JSON') {
            return MESSAGES.ERROR_CONTENT_TYPE
        }

        let validarID = await buscarUsuarioId(id)
        if (validarID.status_code !== 200) return validarID

        usuario.id_usuario = Number(id)

        let enderecoUsuario = {
            cep:         usuario.cep,
            cidade:      usuario.cidade,
            estado:      usuario.estado,
            logradouro:  usuario.logradouro,
            numero:      usuario.numero,
            complemento: usuario.complemento,
            bairro:      usuario.bairro,
            usuario_id:  usuario.id_usuario
        }

        await enderecoDAO.setUpdateAddress(enderecoUsuario)

        let tipoUsuario = usuario.tipo_usuario?.toLowerCase()

        if (tipoUsuario === 'artista') {
            let artistaBanco = await artistaDAO.getSelectByIdArtistUser(usuario.id_usuario)

            if (artistaBanco) {
                let artista = {
                    nome_artistico: usuario.nome_artistico,
                    descricao:      usuario.descricao,
                    usuario_id:     usuario.id_usuario,
                    id_artista:     artistaBanco.id_artista
                }

                await artistaDAO.setUpdateArtist(artista)

                if (usuario.generos_musicais && Array.isArray(usuario.generos_musicais)) {
                    await artistaGeneroMusicalDAO.deleteByArtistaId(artistaBanco.id_artista)

                    for (let generoId of usuario.generos_musicais) {
                        await artistaGeneroMusicalDAO.setInsertArtistGendersSong({
                            genero_musical_id: generoId,
                            artista_id:        artistaBanco.id_artista
                        })
                    }
                }
            }

        } else if (tipoUsuario === 'organizador') {
            let organizadorBanco = await organizadorDAO.getSelectByUsuarioId(usuario.id_usuario)
            if (!organizadorBanco) {
                await organizadorDAO.setInsertOrganizer({ usuario_id: usuario.id_usuario })
            }
        }

        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_UPDATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_UPDATED_ITEM.message
        MESSAGES.HEADER.response    = { usuario, endereco: enderecoUsuario }

        return MESSAGES.HEADER

    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirUsuario = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let validarID = await buscarUsuarioId(id)

            if (validarID.status_code == 200) {
                let resultusuarios = await usuarioDAO.setDeleteUsers(Number(id))

                if (resultusuarios) {
                    MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                    MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                    return MESSAGES.HEADER
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message = 'Não foi possível processar a requisição [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarFotoUsuario = async function (id, fileBuffer, originalName, mimeType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let validarID = await buscarUsuarioId(id)
            if (validarID.status_code !== 200) return validarID

            let urlFoto = await uploadImagemAzure(fileBuffer, originalName, mimeType)
            if (!urlFoto) return MESSAGES.ERROR_UPLOAD_AZURE

            let result = await usuarioDAO.setUpdateFotoUsuario(Number(id), urlFoto)

            if (result) {
                MESSAGES.HEADER.status      = MESSAGES.SUCCESS_UPDATED_ITEM.status
                MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                MESSAGES.HEADER.message     = MESSAGES.SUCCESS_UPDATED_ITEM.message
                MESSAGES.HEADER.response    = { id_usuario: Number(id), foto: urlFoto }
                return MESSAGES.HEADER
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }

        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message = 'Não foi possível processar a requisição [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDadosUsuario = async function (usuario) {
    const gerarErro = (campo, mensagem) => ({
        status: DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.status,
        status_code: DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.status_code,
        message: mensagem || `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    })

    if (!usuario.nome || usuario.nome.length > 100)                    return gerarErro('Nome')
    if (!usuario.email || usuario.email.length > 150)                   return gerarErro('Email')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(usuario.email))
        return gerarErro('Email', 'O campo Email está em formato inválido')

    if (!usuario.senha || usuario.senha.length > 100)                   return gerarErro('Senha')

    const senhaRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/
    if (!senhaRegex.test(usuario.senha))
        return gerarErro('Senha', 'A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial')

    if (!usuario.cpf || usuario.cpf.length > 14)                        return gerarErro('CPF')
    if (!usuario.data_nasc || usuario.data_nasc.length > 12)            return gerarErro('Data de Nascimento')
    if (!usuario.nacionalidade_id || isNaN(usuario.nacionalidade_id))   return gerarErro('Nacionalidade')
    if (!usuario.genero_id || isNaN(usuario.genero_id))                 return gerarErro('Gênero')
    if (!usuario.telefone || usuario.telefone.length > 20)              return gerarErro('Telefone')
    if (!usuario.cep || !usuario.cidade || !usuario.estado || !usuario.logradouro || !usuario.numero || !usuario.bairro)
        return gerarErro('Endereço')

    const emailExistente = await usuarioDAO.getUsuarioByUsuarioEmail(usuario.email)
    if (emailExistente) return gerarErro('Email', 'Este email já está cadastrado')

    const cpfExistente = await usuarioDAO.getUsuarioByUsuarioCPF(usuario.cpf)
    if (cpfExistente) return gerarErro('CPF', 'Este CPF já está cadastrado')

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