/******************************************************************************
 * Objetivo: Controller de usuário — tratativas de erro melhoradas
 * Data: 19/05/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.4
*****************************************************************************/

const usuarioDAO              = require('../../model/DAO/usuario.js')
const crypto                  = require('../modulo/crypto-password.js')
const enderecoDAO             = require('../../model/DAO/endereco.js')
const artistaDAO              = require('../../model/DAO/artista.js')
const organizadorDAO          = require('../../model/DAO/organizador.js')
const artistaGeneroMusicalDAO = require('../../model/DAO/artista_genero_musical.js')
const { uploadImagemAzure }   = require('../modulo/azure_upload.js')

const DEFAULT_MESSAGES = require('../modulo/conf_message.js')

// ─── Utilitário interno ────────────────────────────────────────────────────────
const gerarErroValidacao = (campo, mensagem) => ({
    status: false,
    status_code: 400,
    message: mensagem || `Campo obrigatório ausente ou inválido [${campo}]`
})

// ─── Listar ────────────────────────────────────────────────────────────────────
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
        console.error('[Controller usuario] listarUsuarios:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Buscar por ID ─────────────────────────────────────────────────────────────
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
            return gerarErroValidacao('id', 'O ID informado é inválido.')
        }
    } catch (error) {
        console.error('[Controller usuario] buscarUsuarioId:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Buscar organizador por usuario_id ────────────────────────────────────────
const buscarOrganizadorUsuarioId = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            // CORRIGIDO: passa o usuario_id para o DAO
            let resultusuarios = await usuarioDAO.getSelectByIdUsersOrganizer(Number(id))

            if (resultusuarios && resultusuarios.length > 0) {
                MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.HEADER.response.usuarios = resultusuarios[0]
                return MESSAGES.HEADER
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }
        } else {
            return gerarErroValidacao('id', 'O ID informado é inválido.')
        }
    } catch (error) {
        console.error('[Controller usuario] buscarOrganizadorUsuarioId:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Buscar por e-mail ─────────────────────────────────────────────────────────
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
            return gerarErroValidacao('email', 'O e-mail informado é inválido.')
        }
    } catch (error) {
        console.error('[Controller usuario] buscarUsuarioEmail:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Inserir ───────────────────────────────────────────────────────────────────
const inserirUsuario = async function (usuario, arquivo) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!usuario.tipo_usuario) {
            return gerarErroValidacao('tipo_usuario', 'O campo tipo_usuario é obrigatório. Use: artista, organizador ou user.')
        }

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
        if (!resultUsuario) {
            return { status: false, status_code: 500, message: 'Erro ao salvar o usuário no banco de dados. Tente novamente.' }
        }

        let lastIDUsuario = await usuarioDAO.getSelectLastID()
        if (!lastIDUsuario) {
            return { status: false, status_code: 500, message: 'Usuário criado mas não foi possível recuperar o ID. Contate o suporte.' }
        }

        // ===== FOTO (opcional no cadastro) =====
        if (arquivo) {
            try {
                let urlFoto = await uploadImagemAzure(arquivo.buffer, arquivo.originalname, arquivo.mimetype)
                if (urlFoto) {
                    await usuarioDAO.setUpdateFotoUsuario(lastIDUsuario.id_usuario, urlFoto)
                    usuarioCriptografado.foto = urlFoto
                } else {
                    console.warn('[Controller usuario] Upload de foto falhou — usuário cadastrado sem foto.')
                }
            } catch (fotoErr) {
                console.warn('[Controller usuario] Erro no upload da foto:', fotoErr.message)
                // Não aborta o cadastro por falha na foto
            }
        }

        // ===== TIPO DE USUÁRIO =====
        let tipoUsuario = usuario.tipo_usuario.toLowerCase().trim()

        if (tipoUsuario === 'artista') {

            if (!usuario.generos_musicais || !Array.isArray(usuario.generos_musicais) || usuario.generos_musicais.length === 0) {
                return gerarErroValidacao('generos_musicais', 'Artistas devem informar pelo menos um gênero musical.')
            }

            if (!usuario.nome_artistico || usuario.nome_artistico.trim() === '') {
                return gerarErroValidacao('nome_artistico', 'O nome artístico é obrigatório para artistas.')
            }

            let artista = {
                nome_artistico: usuario.nome_artistico,
                usuario_id:     lastIDUsuario.id_usuario,
                descricao:      usuario.descricao || '',
            }

            let resultArtista = await artistaDAO.setInsertArtist(artista)
            if (!resultArtista) {
                return { status: false, status_code: 500, message: 'Usuário criado, mas houve um erro ao cadastrar o perfil de artista.' }
            }

            let lastIDArtista = await artistaDAO.getSelectLastID()
            if (!lastIDArtista) {
                return { status: false, status_code: 500, message: 'Erro ao recuperar o ID do artista cadastrado.' }
            }

            for (let generoId of usuario.generos_musicais) {
                let resultGenero = await artistaGeneroMusicalDAO.setInsertArtistGendersSong({
                    genero_musical_id: generoId,
                    artista_id:        lastIDArtista.id_artista
                })
                if (!resultGenero) {
                    return { status: false, status_code: 500, message: `Erro ao vincular o gênero musical ID ${generoId} ao artista.` }
                }
            }

        } else if (tipoUsuario === 'organizador') {

            let resultOrganizador = await organizadorDAO.setInsertOrganizer({ usuario_id: lastIDUsuario.id_usuario })
            if (!resultOrganizador) {
                return { status: false, status_code: 500, message: 'Usuário criado, mas houve um erro ao cadastrar o perfil de organizador.' }
            }

        } else if (tipoUsuario === 'user') {
            // usuário comum — nenhuma ação extra

        } else {
            return gerarErroValidacao('tipo_usuario', `Tipo de usuário inválido: "${usuario.tipo_usuario}". Use: artista, organizador ou user.`)
        }

        // ===== ENDEREÇO =====
        let enderecoUsuario = {
            cep:         usuario.cep,
            cidade:      usuario.cidade,
            estado:      usuario.estado,
            logradouro:  usuario.logradouro,
            numero:      usuario.numero,
            complemento: usuario.complemento || '',
            bairro:      usuario.bairro,
            usuario_id:  lastIDUsuario.id_usuario
        }

        let resultEndereco = await enderecoDAO.setInsertAddress(enderecoUsuario)
        if (!resultEndereco) {
            return { status: false, status_code: 500, message: 'Usuário criado, mas houve um erro ao salvar o endereço.' }
        }

        delete usuarioCriptografado.senha
        usuarioCriptografado.id_usuario = lastIDUsuario.id_usuario

        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.HEADER.response    = usuarioCriptografado

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller usuario] inserirUsuario:', error.message, error.stack)
        return { status: false, status_code: 500, message: 'Erro interno ao processar o cadastro. Tente novamente ou contate o suporte.' }
    }
}

// ─── Login ─────────────────────────────────────────────────────────────────────
const loginUsuario = async function (usuario) {
    let MESSAGE = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!usuario.email || !usuario.senha) {
            return gerarErroValidacao('email/senha', 'E-mail e senha são obrigatórios.')
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(usuario.email)) {
            return gerarErroValidacao('email', 'Formato de e-mail inválido.')
        }

        const user = await usuarioDAO.getUsuarioByUsuarioEmail(usuario.email)

        // Mensagem propositalmente genérica para não revelar se o e-mail existe
        if (!user) {
            return { status: false, status_code: 401, message: 'E-mail ou senha incorretos.' }
        }

        let senhaVerificada = false
        try {
            senhaVerificada = crypto.verifyPassword(usuario.senha, user.senha)
        } catch (cryptoErr) {
            console.error('[Controller usuario] loginUsuario — erro ao verificar senha:', cryptoErr.message)
            return { status: false, status_code: 500, message: 'Erro interno ao verificar credenciais. Tente novamente.' }
        }

        if (senhaVerificada) {
            MESSAGE.HEADER.status           = MESSAGE.SUCCESS_REQUEST.status
            MESSAGE.HEADER.status_code      = MESSAGE.SUCCESS_REQUEST.status_code
            MESSAGE.HEADER.response.usuario = user
            return MESSAGE.HEADER
        } else {
            return { status: false, status_code: 401, message: 'E-mail ou senha incorretos.' }
        }

    } catch (error) {
        console.error('[Controller usuario] loginUsuario:', error.message)
        return { status: false, status_code: 500, message: 'Erro interno ao processar o login. Tente novamente.' }
    }
}

// ─── Atualizar ─────────────────────────────────────────────────────────────────
const atualizarUsuario = async function (usuario, id, arquivo) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        usuario.id_usuario = Number(id)

        let validarID = await buscarUsuarioId(usuario.id_usuario)
        if (validarID.status_code !== 200) return validarID

        if (arquivo) {
            try {
                let urlFoto = await uploadImagemAzure(arquivo.buffer, arquivo.originalname, arquivo.mimetype)
                if (urlFoto) {
                    await usuarioDAO.setUpdateFotoUsuario(usuario.id_usuario, urlFoto)
                    usuario.foto = urlFoto
                }
            } catch (fotoErr) {
                console.warn('[Controller usuario] Erro no upload da foto (atualização):', fotoErr.message)
            }
        }

        let dadosUsuario = { id_usuario: usuario.id_usuario }

        if (usuario.nome)             dadosUsuario.nome = usuario.nome
        if (usuario.email)            dadosUsuario.email = usuario.email
        if (usuario.senha)            dadosUsuario.senha = usuario.senha
        if (usuario.cpf)              dadosUsuario.cpf = usuario.cpf
        if (usuario.data_nasc)        dadosUsuario.data_nasc = usuario.data_nasc
        if (usuario.nacionalidade_id) dadosUsuario.nacionalidade_id = usuario.nacionalidade_id
        if (usuario.genero_id)        dadosUsuario.genero_id = usuario.genero_id
        if (usuario.telefone)         dadosUsuario.telefone = usuario.telefone

        let resultUsuario = await usuarioDAO.setUpdateUsers(dadosUsuario)
        if (!resultUsuario) {
            return { status: false, status_code: 500, message: 'Erro ao atualizar os dados do usuário.' }
        }

        let tipoUsuario = usuario.tipo_usuario?.toLowerCase()

        if (tipoUsuario === 'artista') {

            if (!usuario.generos_musicais || !Array.isArray(usuario.generos_musicais) || usuario.generos_musicais.length === 0) {
                return gerarErroValidacao('generos_musicais', 'Artistas devem informar pelo menos um gênero musical.')
            }

            let artistaBanco = await artistaDAO.getSelectByIdArtistUser(usuario.id_usuario)

            if (!artistaBanco || !artistaBanco.id_artista) {
                let artista = {
                    nome_artistico: usuario.nome_artistico,
                    usuario_id: usuario.id_usuario,
                    descricao: usuario.descricao || '',
                }
                await artistaDAO.setInsertArtist(artista)
                artistaBanco = await artistaDAO.getSelectByIdArtistUser(usuario.id_usuario)
            } else {
                let artista = {
                    nome_artistico: usuario.nome_artistico,
                    descricao: usuario.descricao || '',
                    usuario_id: usuario.id_usuario,
                    id_artista: artistaBanco.id_artista
                }
                await artistaDAO.setUpdateArtist(artista)
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
            let organizadorBanco = await organizadorDAO.getSelectByUsuarioId(usuario.id_usuario)
            if (!organizadorBanco) {
                await organizadorDAO.setInsertOrganizer({ usuario_id: usuario.id_usuario })
            }
        }

        let enderecoUsuario = {
            cep:        usuario.cep,
            cidade:     usuario.cidade,
            estado:     usuario.estado,
            logradouro: usuario.logradouro,
            numero:     usuario.numero,
            complemento: usuario.complemento || '',
            bairro:     usuario.bairro,
            id_usuario: usuario.id_usuario
        }

        await enderecoDAO.setUpdateAddress(enderecoUsuario)

        delete usuario.senha

        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_UPDATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_UPDATED_ITEM.message
        MESSAGES.HEADER.response    = usuario

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller usuario] atualizarUsuario:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Excluir ───────────────────────────────────────────────────────────────────
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
                    return { status: false, status_code: 500, message: 'Erro ao excluir o usuário.' }
                }
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }
        } else {
            return gerarErroValidacao('id', 'O ID informado é inválido.')
        }
    } catch (error) {
        console.error('[Controller usuario] excluirUsuario:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Atualizar foto ────────────────────────────────────────────────────────────
const atualizarFotoUsuario = async function (id, fileBuffer, originalName, mimeType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let validarID = await buscarUsuarioId(id)
            if (validarID.status_code !== 200) return validarID

            let urlFoto = await uploadImagemAzure(fileBuffer, originalName, mimeType)
            if (!urlFoto) {
                return { status: false, status_code: 502, message: 'Falha ao enviar a imagem para o servidor de armazenamento.' }
            }

            let result = await usuarioDAO.setUpdateFotoUsuario(Number(id), urlFoto)

            if (result) {
                MESSAGES.HEADER.status      = MESSAGES.SUCCESS_UPDATED_ITEM.status
                MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                MESSAGES.HEADER.message     = MESSAGES.SUCCESS_UPDATED_ITEM.message
                MESSAGES.HEADER.response    = { id_usuario: Number(id), foto: urlFoto }
                return MESSAGES.HEADER
            } else {
                return { status: false, status_code: 500, message: 'Imagem enviada, mas houve erro ao atualizar no banco de dados.' }
            }

        } else {
            return gerarErroValidacao('id', 'O ID informado é inválido.')
        }
    } catch (error) {
        console.error('[Controller usuario] atualizarFotoUsuario:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// ─── Validação dos dados de cadastro ──────────────────────────────────────────
const validarDadosUsuario = async function (usuario) {

    if (!usuario.nome || usuario.nome.trim() === '' || usuario.nome.length > 100)
        return gerarErroValidacao('nome', 'O nome é obrigatório e deve ter até 100 caracteres.')

    if (!usuario.email || usuario.email.length > 150)
        return gerarErroValidacao('email', 'O e-mail é obrigatório e deve ter até 150 caracteres.')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(usuario.email))
        return gerarErroValidacao('email', 'O formato do e-mail é inválido.')

    if (!usuario.senha || usuario.senha.length > 100)
        return gerarErroValidacao('senha', 'A senha é obrigatória e deve ter até 100 caracteres.')

    const senhaRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/
    if (!senhaRegex.test(usuario.senha))
        return gerarErroValidacao('senha', 'A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial (!@#$%^&*).')

    if (!usuario.cpf || usuario.cpf.length > 14)
        return gerarErroValidacao('cpf', 'O CPF é obrigatório.')

    if (!usuario.data_nasc || usuario.data_nasc.length > 12)
        return gerarErroValidacao('data_nasc', 'A data de nascimento é obrigatória.')

    if (!usuario.nacionalidade_id || isNaN(usuario.nacionalidade_id))
        return gerarErroValidacao('nacionalidade_id', 'Selecione uma nacionalidade válida.')

    if (!usuario.genero_id || isNaN(usuario.genero_id))
        return gerarErroValidacao('genero_id', 'Selecione um gênero válido.')

    if (!usuario.telefone || usuario.telefone.length > 20)
        return gerarErroValidacao('telefone', 'O telefone é obrigatório.')

    if (!usuario.cep || !usuario.cidade || !usuario.estado || !usuario.logradouro || !usuario.numero || !usuario.bairro)
        return gerarErroValidacao('endereco', 'Todos os campos de endereço são obrigatórios (CEP, cidade, estado, logradouro, número, bairro).')

    // Verifica duplicidade de e-mail
    const emailExistente = await usuarioDAO.getUsuarioByUsuarioEmail(usuario.email)
    if (emailExistente)
        return gerarErroValidacao('email', 'Este e-mail já está cadastrado. Faça login ou use outro e-mail.')

    // Verifica duplicidade de CPF
    const cpfExistente = await usuarioDAO.getUsuarioByUsuarioCPF(usuario.cpf)
    if (cpfExistente)
        return gerarErroValidacao('cpf', 'Este CPF já está cadastrado.')

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