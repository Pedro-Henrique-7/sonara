const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()

const controllerEventoArtista = require('../controller/evento_artista/evento_artista')

const router = express.Router()

router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})


// listar inscrições por evento (para o organizador ver inscritos)
router.get('/listar_por_evento/:idEvento', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Listar inscrições por evento'
        #swagger.description = 'Retorna todos os artistas inscritos em um evento específico. Usado pelo organizador.'
        #swagger.parameters['idEvento'] = {
            in: 'path',
            required: true,
            type: 'integer',
            description: 'ID do evento'
        }
        #swagger.responses[200] = { description: 'Lista de inscrições retornada com sucesso' }
        #swagger.responses[404] = { description: 'Nenhuma inscrição encontrada para este evento' }
    */
    const idEvento = request.params.idEvento
    const resultado = await controllerEventoArtista.buscarInscricoesPorEvento(idEvento)
    response.status(resultado.status_code)
    response.json(resultado)
})


// listar minhas candidaturas (para o artista ver suas candidaturas)
router.get('/minhas_candidaturas/:artistaId', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Listar candidaturas do artista'
        #swagger.description = 'Retorna todas as candidaturas de um artista. Usado pelo próprio artista.'
        #swagger.parameters['artistaId'] = {
            in: 'path',
            required: true,
            type: 'integer',
            description: 'ID do artista'
        }
        #swagger.responses[200] = { description: 'Lista de candidaturas retornada com sucesso' }
        #swagger.responses[404] = { description: 'Nenhuma candidatura encontrada' }
    */
    const artistaId = request.params.artistaId
    const resultado = await controllerEventoArtista.buscarMinhasCandidaturas(artistaId)
    response.status(resultado.status_code)
    response.json(resultado)
})


// artista aceita convite do organizador
router.put('/aceitarConvite/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Artista aceita convite do organizador'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'integer',
            description: 'ID do vínculo evento-artista'
        }
        #swagger.responses[200] = { description: 'Convite aceito com sucesso' }
        #swagger.responses[404] = { description: 'Vínculo não encontrado' }
    */
    const idEventoArtista = request.params.id
    const resultado = await controllerEventoArtista.aceitarConvite(idEventoArtista)
    response.status(resultado.status_code)
    response.json(resultado)
})


// artista recusa convite do organizador
router.put('/recusarConvite/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Artista recusa convite do organizador'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'integer',
            description: 'ID do vínculo evento-artista'
        }
        #swagger.responses[200] = { description: 'Convite recusado com sucesso' }
        #swagger.responses[404] = { description: 'Vínculo não encontrado' }
    */
    const idEventoArtista = request.params.id
    const resultado = await controllerEventoArtista.recusarConvite(idEventoArtista)
    response.status(resultado.status_code)
    response.json(resultado)
})


// retornar todos os vínculos artista/evento
router.get('/', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Listar todos os vínculos evento-artista'
        #swagger.responses[200] = { description: 'Lista retornada com sucesso' }
        #swagger.responses[404] = { description: 'Nenhum vínculo encontrado' }
    */
    const eventoArtista = await controllerEventoArtista.listarEventoArtista()
    response.status(eventoArtista.status_code)
    response.json(eventoArtista)
})


// candidatar artista para evento
router.post('/candidatar', cors(), bodyParserJson, async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Artista se candidata a um evento'
        #swagger.description = 'O artista se inscreve em um evento informando o cachê esperado, motivação e descrição.'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/Candidatura' }
        }
        #swagger.responses[201] = { description: 'Candidatura realizada com sucesso' }
        #swagger.responses[400] = { description: 'Campos obrigatórios ausentes ou inválidos' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' }
    */
    const dadosBody = request.body
    const contentType = request.headers['content-type']
    const resultado = await controllerEventoArtista.candidatarArtista(dadosBody, contentType)
    response.status(resultado.status_code)
    response.json(resultado)
})


// aprovar artista no evento
router.put('/aprovar/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Organizador aprova artista no evento'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'integer',
            description: 'ID do vínculo evento-artista'
        }
        #swagger.responses[200] = { description: 'Artista aprovado com sucesso' }
        #swagger.responses[404] = { description: 'Vínculo não encontrado' }
    */
    const idEventoArtista = request.params.id
    const resultado = await controllerEventoArtista.aprovarArtistaEvento(idEventoArtista)
    response.status(resultado.status_code)
    response.json(resultado)
})


// reprovar artista no evento
router.put('/reprovar/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Organizador reprova artista no evento'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'integer',
            description: 'ID do vínculo evento-artista'
        }
        #swagger.responses[200] = { description: 'Artista reprovado com sucesso' }
        #swagger.responses[404] = { description: 'Vínculo não encontrado' }
    */
    const idEventoArtista = request.params.id
    const resultado = await controllerEventoArtista.reprovarArtistaEvento(idEventoArtista)
    response.status(resultado.status_code)
    response.json(resultado)
})


// enviar contra proposta para o artista
router.put('/contraProposta/:id', cors(), bodyParserJson, async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Organizador envia contra proposta de cachê ao artista'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'integer',
            description: 'ID do vínculo evento-artista'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/ContraProposta' }
        }
        #swagger.responses[200] = { description: 'Contra proposta enviada com sucesso' }
        #swagger.responses[400] = { description: 'Dados inválidos' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' }
    */
    const idEventoArtista = request.params.id
    const dadosBody = request.body
    const contentType = request.headers['content-type']
    const resultado = await controllerEventoArtista.enviarContraProposta(idEventoArtista, dadosBody, contentType)
    response.status(resultado.status_code)
    response.json(resultado)
})


// artista aceita contra proposta
router.put('/aceitarContraProposta/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Artista aceita contra proposta do organizador'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'integer',
            description: 'ID do vínculo evento-artista'
        }
        #swagger.responses[200] = { description: 'Contra proposta aceita com sucesso' }
        #swagger.responses[404] = { description: 'Vínculo não encontrado' }
    */
    const idEventoArtista = request.params.id
    const resultado = await controllerEventoArtista.aceitarContraProposta(idEventoArtista)
    response.status(resultado.status_code)
    response.json(resultado)
})


// artista recusa contra proposta
router.put('/recusarContraProposta/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Artista recusa contra proposta do organizador'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'integer',
            description: 'ID do vínculo evento-artista'
        }
        #swagger.responses[200] = { description: 'Contra proposta recusada com sucesso' }
        #swagger.responses[404] = { description: 'Vínculo não encontrado' }
    */
    const idEventoArtista = request.params.id
    const resultado = await controllerEventoArtista.recusarContraProposta(idEventoArtista)
    response.status(resultado.status_code)
    response.json(resultado)
})


// pegar EventoArtista por ID
router.get('/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Buscar vínculo evento-artista por ID'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'integer',
            description: 'ID do vínculo evento-artista'
        }
        #swagger.responses[200] = { description: 'Vínculo encontrado' }
        #swagger.responses[400] = { description: 'ID inválido' }
        #swagger.responses[404] = { description: 'Não encontrado' }
    */
    const idEventoArtista = request.params.id
    const eventoArtista = await controllerEventoArtista.buscarEventoArtistaId(idEventoArtista)
    response.status(eventoArtista.status_code)
    response.json(eventoArtista)
})


// inserir EventoArtista manualmente
router.post('/', cors(), bodyParserJson, async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Criar vínculo evento-artista manualmente'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/EventoArtista' }
        }
        #swagger.responses[201] = { description: 'Vínculo criado com sucesso' }
        #swagger.responses[400] = { description: 'Campos inválidos' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' }
    */
    const dadosBody = request.body
    const contentType = request.headers['content-type']
    const eventoArtista = await controllerEventoArtista.inserirEventoArtista(dadosBody, contentType)
    response.status(eventoArtista.status_code)
    response.json(eventoArtista)
})


// atualizar EventoArtista manualmente
router.put('/:id', cors(), bodyParserJson, async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Atualizar vínculo evento-artista'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'integer',
            description: 'ID do vínculo evento-artista'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/EventoArtista' }
        }
        #swagger.responses[200] = { description: 'Vínculo atualizado com sucesso' }
        #swagger.responses[400] = { description: 'Dados inválidos' }
        #swagger.responses[404] = { description: 'Vínculo não encontrado' }
    */
    const dadosBody = request.body
    const idEventoArtista = request.params.id
    const contentType = request.headers['content-type']
    const eventoArtista = await controllerEventoArtista.atualizarEventoArtista(dadosBody, idEventoArtista, contentType)
    response.status(eventoArtista.status_code)
    response.json(eventoArtista)
})


// deletar EventoArtista
router.delete('/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Evento x Artista']
        #swagger.summary = 'Excluir vínculo evento-artista'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'integer',
            description: 'ID do vínculo evento-artista'
        }
        #swagger.responses[200] = { description: 'Vínculo excluído com sucesso' }
        #swagger.responses[404] = { description: 'Vínculo não encontrado' }
    */
    const idEventoArtista = request.params.id
    const eventoArtista = await controllerEventoArtista.excluirEventoArtista(idEventoArtista)
    response.status(eventoArtista.status_code)
    response.json(eventoArtista)
})

module.exports = router