const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()

const controllerEventoArtista = require('../controller/evento_artista/evento_artista')

const router = express.Router()

// configuração do cors
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    )
    response.header(
        'Access-Control-Allow-Headers',
        'Content-Type'
    )

    next()
})

// retornar todos os vínculos artista/evento
router.get('/', cors(), async function (request, response) {
    const eventoArtista = await controllerEventoArtista.listarEventoArtista()

    response.status(eventoArtista.status_code)
    response.json(eventoArtista)
})

// candidatar artista para evento
router.post('/candidatar', cors(), bodyParserJson, async function (request, response) {
    const dadosBody = request.body
    const contentType = request.headers['content-type']

    const resultado = await controllerEventoArtista.candidatarArtista(
        dadosBody,
        contentType
    )

    response.status(resultado.status_code)
    response.json(resultado)
})

// aprovar artista no evento
router.put('/aprovar/:id', cors(), async function (request, response) {
    const idEventoArtista = request.params.id

    const resultado = await controllerEventoArtista.aprovarArtistaEvento(
        idEventoArtista
    )

    response.status(resultado.status_code)
    response.json(resultado)
})

// reprovar artista no evento
router.put('/reprovar/:id', cors(), async function (request, response) {
    const idEventoArtista = request.params.id

    const resultado = await controllerEventoArtista.reprovarArtistaEvento(
        idEventoArtista
    )

    response.status(resultado.status_code)
    response.json(resultado)
})

// enviar contra proposta para o artista
router.put('/contraProposta/:id', cors(), bodyParserJson, async function (request, response) {
    const idEventoArtista = request.params.id
    const dadosBody = request.body
    const contentType = request.headers['content-type']

    const resultado = await controllerEventoArtista.enviarContraProposta(
        idEventoArtista,
        dadosBody,
        contentType
    )

    response.status(resultado.status_code)
    response.json(resultado)
})

// artista aceita contra proposta
router.put('/aceitarContraProposta/:id', cors(), async function (request, response) {
    const idEventoArtista = request.params.id

    const resultado = await controllerEventoArtista.aceitarContraProposta(
        idEventoArtista
    )

    response.status(resultado.status_code)
    response.json(resultado)
})

// artista recusa contra proposta
router.put('/recusarContraProposta/:id', cors(), async function (request, response) {
    const idEventoArtista = request.params.id

    const resultado = await controllerEventoArtista.recusarContraProposta(
        idEventoArtista
    )

    response.status(resultado.status_code)
    response.json(resultado)
})

// pegar EventoArtista por ID
router.get('/:id', cors(), async function (request, response) {
    const idEventoArtista = request.params.id

    const eventoArtista = await controllerEventoArtista.buscarEventoArtistaId(
        idEventoArtista
    )

    response.status(eventoArtista.status_code)
    response.json(eventoArtista)
})

// inserir EventoArtista manualmente
router.post('/', cors(), bodyParserJson, async function (request, response) {
    const dadosBody = request.body
    const contentType = request.headers['content-type']

    const eventoArtista = await controllerEventoArtista.inserirEventoArtista(
        dadosBody,
        contentType
    )

    response.status(eventoArtista.status_code)
    response.json(eventoArtista)
})

// atualizar EventoArtista manualmente
router.put('/:id', cors(), bodyParserJson, async function (request, response) {
    const dadosBody = request.body
    const idEventoArtista = request.params.id
    const contentType = request.headers['content-type']

    const eventoArtista = await controllerEventoArtista.atualizarEventoArtista(
        dadosBody,
        idEventoArtista,
        contentType
    )

    response.status(eventoArtista.status_code)
    response.json(eventoArtista)
})

// deletar EventoArtista
router.delete('/:id', cors(), async function (request, response) {
    const idEventoArtista = request.params.id

    const eventoArtista = await controllerEventoArtista.excluirEventoArtista(
        idEventoArtista
    )

    response.status(eventoArtista.status_code)
    response.json(eventoArtista)
})

module.exports = router