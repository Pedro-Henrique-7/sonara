/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const eventoArtistaDAO = require('../../model/DAO/evento_artista.js')
const eventoArtistaStatusDAO = require('../../model/DAO/evento_artista_status.js')

const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const STATUS = {
    PENDENTE: 1,
    APROVADO: 2,
    REPROVADO: 3,
    CONTRA_PROPOSTA: 4,
    CONTRA_PROPOSTA_ACEITA: 5,
    CONTRA_PROPOSTA_RECUSADA: 6,
    FINALIZADO: 7,
    CANCELADO: 8,
    CONVITE_PENDENTE: 9,
    CONVITE_ACEITO: 10,
    CONVITE_RECUSADO: 11
}

const buscarMinhasCandidaturas = async function (artista_id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(artista_id) || artista_id == '' || artista_id == null || artista_id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [artista_id]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const resultInscricoes = await eventoArtistaDAO.getSelectByArtistaId(Number(artista_id))

        if (!resultInscricoes) {
            MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.Inscricoes = []
            return MESSAGES.HEADER
        }

        const STATUS_MAP = {
            1: 'Pendente',
            2: 'Aprovado',
            3: 'Reprovado',
            4: 'Contra proposta',
            5: 'Contra proposta aceita',
            6: 'Contra proposta recusada',
            7: 'Finalizado',
            8: 'Cancelado',
            9: 'Convite pendente',
            10: 'Convite aceito',
            11: 'Convite recusado'
        }

        const inscricoesComStatus = resultInscricoes.map(inscricao => ({
            ...inscricao,
            status_nome: STATUS_MAP[Number(inscricao.status_atual)] || 'Desconhecido'
        }))

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
        MESSAGES.HEADER.response.Inscricoes = inscricoesComStatus

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento_artista] buscarInscricoesPorEvento:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarEventoArtista = async function () {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        let resultEventoArtista = await eventoArtistaDAO.getSelectAllArtistEvent()

        if (resultEventoArtista) {
            if (resultEventoArtista.length > 0) {
                MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.HEADER.response.EventoArtista = resultEventoArtista

                return MESSAGES.HEADER
                return MESSAGES.ERROR_NOT_FOUND //404
            }
        } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Retorna um EventoArtista fultrando pelo ID
const buscarEventoArtistaId = async function (id) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultEventoArtista = await eventoArtistaDAO.getSelectByIdArtistEvent(Number(id))

            if (resultEventoArtista) {
                if (resultEventoArtista.length > 0) {
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.EventoArtista = resultEventoArtista[0]

                    return MESSAGES.HEADER //200
                } else {
                    return MESSAGES.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um EventoArtista 
const inserirEventoArtista = async function (eventoArtista , contentType) {

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if (String(contentType).toUpperCase().includes('APPLICATION/JSON')) {

            //Chama a função de validar todos os dados do EventoArtista
            let validar = await validarDadosEventoArtista(eventoArtista)

            if (!validar) {

                //Processamento
                //Chama a função para inserir um novo EventoArtista no BD
                let resultEventoArtista = await eventoArtistaDAO.setInsertArtistEvent(eventoArtista)

                if (resultEventoArtista) {
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await eventoArtistaDAO.getSelectLastID()

                    if (lastID) {
                        //Adiciona o ID no JSON com os dados do EventoArtista
                        eventoArtista.id_evento_artista = lastID
                        MESSAGES.HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response = eventoArtista

                        return MESSAGES.HEADER //201
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                    }

                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return validar //400
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const candidatarArtista = async function (candidatura, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!String(contentType).toUpperCase().includes('APPLICATION/JSON')) {
            return MESSAGES.ERROR_CONTENT_TYPE
        }

        if (!candidatura.artista_id || isNaN(candidatura.artista_id) || candidatura.artista_id <= 0) {
            return {
                ...MESSAGES.ERROR_REQUIRED_FIELDS,
                message: MESSAGES.ERROR_REQUIRED_FIELDS.message + ' [artista_id]'
            }
        }

        if (!candidatura.evento_id || isNaN(candidatura.evento_id) || candidatura.evento_id <= 0) {
            return {
                ...MESSAGES.ERROR_REQUIRED_FIELDS,
                message: MESSAGES.ERROR_REQUIRED_FIELDS.message + ' [evento_id]'
            }
        }

        if (!candidatura.cache_esperado || isNaN(candidatura.cache_esperado) || Number(candidatura.cache_esperado) < 0) {
            return {
                ...MESSAGES.ERROR_REQUIRED_FIELDS,
                message: MESSAGES.ERROR_REQUIRED_FIELDS.message + ' [cache_esperado]'
            }
        }

        if (!candidatura.sobre_artista || candidatura.sobre_artista.length > 500) {
            return {
                ...MESSAGES.ERROR_REQUIRED_FIELDS,
                message: MESSAGES.ERROR_REQUIRED_FIELDS.message + ' [sobre_artista]'
            }
        }

        if (!candidatura.motivo_inscricao || candidatura.motivo_inscricao.length > 500) {
            return {
                ...MESSAGES.ERROR_REQUIRED_FIELDS,
                message: MESSAGES.ERROR_REQUIRED_FIELDS.message + ' [motivo_inscricao]'
            }
        }

        const eventoArtista = {
            artista_id: Number(candidatura.artista_id),
            evento_id: Number(candidatura.evento_id),
            cache_esperado: Number(candidatura.cache_esperado),
            cache_ofertado: null,
            cache_final: null,
            contra_proposta: null,
            sobre_artista: candidatura.sobre_artista,
            motivo_inscricao: candidatura.motivo_inscricao
        }

        const idGerado = await eventoArtistaDAO.setInsertArtistEvent(eventoArtista)

        if (idGerado?.erro && idGerado.tipo === 'DUPLICADO') {
            return {
                ...MESSAGES.ERROR_REQUIRED_FIELDS,
                status_code: 409,
                message: idGerado.message
            }
        }

        if (!idGerado) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        const agora = new Date().toISOString().slice(0, 19).replace('T', ' ')

        const resultStatus = await eventoArtistaStatusDAO.setInsertArtistEventStatus({
            evento_artista_id: idGerado,
            status_id: STATUS.PENDENTE,
            data_hora: agora
        })

        if (!resultStatus) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        eventoArtista.id_evento_artista = idGerado
        eventoArtista.status = 'Pendente'

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.HEADER.message = 'Candidatura enviada com sucesso!'
        MESSAGES.HEADER.response = eventoArtista

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento_artista] candidatarArtista:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const aprovarArtistaEvento = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(id) || id == '' || id == null || id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_evento_artista]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const resultBusca = await eventoArtistaDAO.getSelectByIdArtistEvent(Number(id))

        if (!resultBusca || resultBusca.length === 0) {
            return MESSAGES.ERROR_NOT_FOUND
        }

        const inscricao = resultBusca[0]

        const cacheFinal =
            inscricao.cache_ofertado && Number(inscricao.cache_ofertado) > 0
                ? Number(inscricao.cache_ofertado)
                : Number(inscricao.cache_esperado)

        const resultUpdate = await eventoArtistaDAO.setUpdateArtistEvent({
            id_evento_artista: Number(id),
            cache_final: cacheFinal
        })

        if (!resultUpdate) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        const agora = new Date().toISOString().slice(0, 19).replace('T', ' ')

        const resultStatus = await eventoArtistaStatusDAO.setInsertArtistEventStatus({
            evento_artista_id: Number(id),
            status_id: STATUS.APROVADO,
            data_hora: agora
        })

        if (!resultStatus) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
        MESSAGES.HEADER.message = 'Artista aprovado com sucesso!'
        MESSAGES.HEADER.response = {
            id_evento_artista: Number(id),
            cache_final: cacheFinal,
            status: 'Aprovado'
        }

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento_artista] aprovarArtistaEvento:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const reprovarArtistaEvento = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(id) || id == '' || id == null || id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_evento_artista]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const resultBusca = await eventoArtistaDAO.getSelectByIdArtistEvent(Number(id))

        if (!resultBusca || resultBusca.length === 0) {
            return MESSAGES.ERROR_NOT_FOUND
        }

        const agora = new Date().toISOString().slice(0, 19).replace('T', ' ')

        const resultStatus = await eventoArtistaStatusDAO.setInsertArtistEventStatus({
            evento_artista_id: Number(id),
            status_id: STATUS.REPROVADO,
            data_hora: agora
        })

        if (!resultStatus) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
        MESSAGES.HEADER.message = 'Artista reprovado com sucesso!'
        MESSAGES.HEADER.response = {
            id_evento_artista: Number(id),
            status: 'Reprovado'
        }

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento_artista] reprovarArtistaEvento:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const enviarContraProposta = async function (id, dados, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!String(contentType).toUpperCase().includes('APPLICATION/JSON')) {
            return MESSAGES.ERROR_CONTENT_TYPE
        }

        if (isNaN(id) || id == '' || id == null || id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_evento_artista]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        if (!dados.cache_ofertado || isNaN(dados.cache_ofertado) || Number(dados.cache_ofertado) <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [cache_ofertado]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const resultBusca = await eventoArtistaDAO.getSelectByIdArtistEvent(Number(id))

        if (!resultBusca || resultBusca.length === 0) {
            return MESSAGES.ERROR_NOT_FOUND
        }

        const valorContraProposta = Number(dados.cache_ofertado)

        const resultUpdate = await eventoArtistaDAO.setUpdateArtistEvent({
            id_evento_artista: Number(id),
            cache_ofertado: valorContraProposta,
            contra_proposta: valorContraProposta
        })

        if (!resultUpdate) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        const agora = new Date().toISOString().slice(0, 19).replace('T', ' ')

        const resultStatus = await eventoArtistaStatusDAO.setInsertArtistEventStatus({
            evento_artista_id: Number(id),
            status_id: STATUS.CONTRA_PROPOSTA,
            data_hora: agora
        })

        if (!resultStatus) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
        MESSAGES.HEADER.message = 'Contra proposta enviada com sucesso!'
        MESSAGES.HEADER.response = {
            id_evento_artista: Number(id),
            cache_ofertado: valorContraProposta,
            contra_proposta: valorContraProposta,
            status: 'Contra proposta'
        }

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento_artista] enviarContraProposta:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const aceitarContraProposta = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(id) || id == '' || id == null || id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_evento_artista]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const resultBusca = await eventoArtistaDAO.getSelectByIdArtistEvent(Number(id))

        if (!resultBusca || resultBusca.length === 0) {
            return MESSAGES.ERROR_NOT_FOUND
        }

        const inscricao = resultBusca[0]

        if (!inscricao.cache_ofertado || Number(inscricao.cache_ofertado) <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Não existe contra proposta para aceitar]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const cacheFinal = Number(inscricao.cache_ofertado)

        const resultUpdate = await eventoArtistaDAO.setUpdateArtistEvent({
            id_evento_artista: Number(id),
            cache_final: cacheFinal
        })

        if (!resultUpdate) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        const agora = new Date().toISOString().slice(0, 19).replace('T', ' ')

        const resultStatusAceita = await eventoArtistaStatusDAO.setInsertArtistEventStatus({
            evento_artista_id: Number(id),
            status_id: STATUS.CONTRA_PROPOSTA_ACEITA,
            data_hora: agora
        })

        if (!resultStatusAceita) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        const resultStatusAprovado = await eventoArtistaStatusDAO.setInsertArtistEventStatus({
            evento_artista_id: Number(id),
            status_id: STATUS.APROVADO,
            data_hora: agora
        })

        if (!resultStatusAprovado) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
        MESSAGES.HEADER.message = 'Contra proposta aceita com sucesso!'
        MESSAGES.HEADER.response = {
            id_evento_artista: Number(id),
            cache_final: cacheFinal,
            status: 'Aprovado'
        }

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento_artista] aceitarContraProposta:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const recusarContraProposta = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(id) || id == '' || id == null || id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_evento_artista]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const resultBusca = await eventoArtistaDAO.getSelectByIdArtistEvent(Number(id))

        if (!resultBusca || resultBusca.length === 0) {
            return MESSAGES.ERROR_NOT_FOUND
        }

        const agora = new Date().toISOString().slice(0, 19).replace('T', ' ')

        const resultStatus = await eventoArtistaStatusDAO.setInsertArtistEventStatus({
            evento_artista_id: Number(id),
            status_id: STATUS.CONTRA_PROPOSTA_RECUSADA,
            data_hora: agora
        })

        if (!resultStatus) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
        MESSAGES.HEADER.message = 'Contra proposta recusada com sucesso!'
        MESSAGES.HEADER.response = {
            id_evento_artista: Number(id),
            status: 'Contra proposta recusada'
        }

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento_artista] recusarContraProposta:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const aceitarConvite = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(id) || id == '' || id == null || id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_evento_artista]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const resultBusca = await eventoArtistaDAO.getSelectByIdArtistEvent(Number(id))

        if (!resultBusca || resultBusca.length === 0) {
            return MESSAGES.ERROR_NOT_FOUND
        }

        const inscricao = resultBusca[0]
        const cacheFinal = Number(inscricao.cache_esperado)

        const resultUpdate = await eventoArtistaDAO.setUpdateArtistEvent({
            id_evento_artista: Number(id),
            cache_final: cacheFinal
        })

        if (!resultUpdate) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        const agora = new Date().toISOString().slice(0, 19).replace('T', ' ')

        const resultStatus = await eventoArtistaStatusDAO.setInsertArtistEventStatus({
            evento_artista_id: Number(id),
            status_id: STATUS.CONVITE_ACEITO,
            data_hora: agora
        })

        if (!resultStatus) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
        MESSAGES.HEADER.message = 'Convite aceito com sucesso!'
        MESSAGES.HEADER.response = { id_evento_artista: Number(id), cache_final: cacheFinal, status: 'Convite aceito' }

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento_artista] aceitarConvite:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const recusarConvite = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(id) || id == '' || id == null || id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_evento_artista]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const resultBusca = await eventoArtistaDAO.getSelectByIdArtistEvent(Number(id))

        if (!resultBusca || resultBusca.length === 0) {
            return MESSAGES.ERROR_NOT_FOUND
        }

        const agora = new Date().toISOString().slice(0, 19).replace('T', ' ')

        const resultStatus = await eventoArtistaStatusDAO.setInsertArtistEventStatus({
            evento_artista_id: Number(id),
            status_id: STATUS.CONVITE_RECUSADO,
            data_hora: agora
        })

        if (!resultStatus) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
        MESSAGES.HEADER.message = 'Convite recusado.'
        MESSAGES.HEADER.response = { id_evento_artista: Number(id), status: 'Convite recusado' }

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento_artista] recusarConvite:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Atualiza um EventoArtista buscando pelo ID
const atualizarEventoArtista = async function (eventoArtista, id, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if (String(contentType).toUpperCase().includes('APPLICATION/JSON')) {

            //Chama a função de validar todos os dados do EventoArtista
            let validar = await validarDadosEventoArtista(eventoArtista)

            if (!validar) {

                //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                let validarID = await buscarEventoArtistaId(id)

                if (validarID.status_code == 200) {

                    //Adiciona o ID do EventoArtista no JSON de dados para ser encaminhado ao DAO
                    eventoArtista.id_evento_artista = Number(id)

                    //Chama a função para inserir um novo EventoArtista no BD
                    let resultEventoArtista = await eventoArtistaDAO.setUpdateArtistEvent(eventoArtista)

                    if (resultEventoArtista) {
                        MESSAGES.HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGES.HEADER.message = MESSAGES.SUCCESS_UPDATED_ITEM.message
                        MESSAGES.HEADER.response.EventoArtista = EventoArtista

                        return MESSAGES.HEADER //200
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID //A função buscargeneroID poderá retornar (400 ou 404 ou 500)
                }
            } else {
                return validar //400 referente a validação dos dados
            }

        } else {
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

const buscarInscricoesPorEvento = async function (evento_id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(evento_id) || evento_id == '' || evento_id == null || evento_id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [evento_id]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

        const resultInscricoes = await eventoArtistaDAO.getSelectByEventoId(Number(evento_id))

        if (!resultInscricoes) {
            MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.Inscricoes = []
            return MESSAGES.HEADER
        }

        const STATUS_MAP = {
            1: 'Pendente',
            2: 'Aprovado',
            3: 'Reprovado',
            4: 'Contra proposta',
            5: 'Contra proposta aceita',
            6: 'Contra proposta recusada',
            7: 'Finalizado',
            8: 'Cancelado',
            9: 'Convite pendente',
            10: 'Convite aceito',
            11: 'Convite recusado'
        }

        const inscricoesComStatus = resultInscricoes.map(inscricao => ({
            ...inscricao,
            status_nome: STATUS_MAP[Number(inscricao.status_atual)] || 'Desconhecido'
        }))

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
        MESSAGES.HEADER.response.Inscricoes = inscricoesComStatus

        return MESSAGES.HEADER

    } catch (error) {
        console.error('[Controller evento_artista] buscarInscricoesPorEvento:', error.message)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}



const excluirEventoArtista = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {


        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarEventoArtistaId(id)

            if (validarID.status_code == 200) {

                let resultEventoArtista = await EventoArtistaDAO.setDeleteArtistEvent(Number(id))

                if (resultEventoArtista) {

                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                    MESSAGES.HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message
                    MESSAGES.HEADER.response.EventoArtista = resultEventoArtista
                    delete MESSAGES.HEADER.response
                    return MESSAGES.HEADER

                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += '[ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDadosEventoArtista = function (EventoArtista) {

    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES,
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    // Validações rápidas

    if (EventoArtista.artista_id == '' || EventoArtista.artista_id == null || EventoArtista.artista_id <= 0 || isNaN(EventoArtista.artista_id))
        return gerarErro('ID_Artista');

    if (EventoArtista.evento_id == '' || EventoArtista.evento_id == null || EventoArtista.evento_id <= 0 || isNaN(EventoArtista.evento_id))
        return gerarErro('ID_Evento');

    if (EventoArtista.cache_esperado == '' || EventoArtista.cache_esperado == null || isNaN(EventoArtista.cache_esperado))
        return gerarErro('cache_esperado');

    if (EventoArtista.cache_ofertado == '' || EventoArtista.cache_ofertado == null || isNaN(EventoArtista.cache_ofertado))
        return gerarErro('cache_ofertado');

    if (EventoArtista.cache_final == '' || EventoArtista.cache_final == null || isNaN(EventoArtista.cache_final))
        return gerarErro('cache_final');

    if (EventoArtista.contra_proposta != null && isNaN(EventoArtista.contra_proposta))
        return gerarErro('contra_proposta');

    if (EventoArtista.sobre_artista != null && EventoArtista.sobre_artista.length > 500)
        return gerarErro('sobre_artista');

    if (EventoArtista.motivo_inscricao != null && EventoArtista.motivo_inscricao.length > 500)
        return gerarErro('motivo_inscricao');


    return false


}

module.exports = {
    listarEventoArtista,
    buscarEventoArtistaId,
    inserirEventoArtista,
    atualizarEventoArtista,
    candidatarArtista,
    excluirEventoArtista,
    aprovarArtistaEvento,
    reprovarArtistaEvento,
    enviarContraProposta,
    aceitarContraProposta,
    recusarContraProposta,
    buscarInscricoesPorEvento,
    buscarMinhasCandidaturas,
    aceitarConvite,
    recusarConvite
}