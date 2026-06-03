const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerAvaliacaoArtista = require('../controller/avaliacao_artista/avaliacao_artista')

//configurção do cors 
const router = express.Router()
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// ENDPOINTS DA TABELA Artista


// retornar todos os Artistas
router.get('/', cors(), async function (request, response) {
    /*  #swagger.tags = ['Avaliacao Artista']
    #swagger.summary = 'Listar avaliações de artistas'
    #swagger.responses[200] = { description: 'Lista retornada' } */
    let avaliacaoArtista = await controllerAvaliacaoArtista.listarAvaliacaoArtista()

    response.status(avaliacaoArtista.status_code)
    response.json(avaliacaoArtista)
})
module.exports = router


// pegar Artista por id
router.get('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Avaliacao Artista']
    #swagger.summary = 'Buscar avaliação de artista por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Encontrado' }
    #swagger.responses[404] = { description: 'Não encontrado' } */
    let idAvaliacaoArtista = request.params.id

    let avaliacaoArtista = await controllerAvaliacaoArtista.buscarAvaliacaoArtistaId(idAvaliacaoArtista)
    response.status(avaliacaoArtista.status_code)
    response.json(avaliacaoArtista)


})


//inserir Artista
router.post('/', cors(), bodyParserJson, async function (request, response) {
    /*  #swagger.tags = ['Avaliacao Artista']
    #swagger.summary = 'Criar avaliação de artista'
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AvaliacaoArtista' } }
    #swagger.responses[201] = { description: 'Avaliação criada' }
    #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */

    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let avaliacaoArtista = await controllerAvaliacaoArtista.inserirAvaliacaoArtista(dadosBody, contentType)

    response.status(avaliacaoArtista.status_code)
    response.json(avaliacaoArtista)
})


router.put('/:id', cors(), bodyParserJson, async function (request, response) {
    /*  #swagger.tags = ['Avaliacao Artista']
        #swagger.summary = 'Atualizar avaliação de artista'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AvaliacaoArtista' } }
        #swagger.responses[200] = { description: 'Avaliação atualizada' } */

    let dadosBody = request.body

    let idAvaliacaoArtista = request.params.id

    let contentType = request.headers['content-type']

    let avaliacaoArtista = await controllerAvaliacaoArtista.atualizarAvaliacaoArtista(dadosBody, idAvaliacaoArtista, contentType)
    response.status(avaliacaoArtista.status_code)
    response.json(avaliacaoArtista)
})

router.delete('/:id', cors(), async function (request, response) {

    /*  #swagger.tags = ['Avaliacao Artista']
        #swagger.summary = 'Excluir avaliação de artista'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        #swagger.responses[200] = { description: 'Avaliação excluída' } */


    let idAvaliacaoArtista = request.params.id

    let avaliacaoArtista = await controllerAvaliacaoArtista.excluirAvaliacaoArtista(idAvaliacaoArtista)
    response.status(avaliacaoArtista.status_code)
    response.json(avaliacaoArtista)
})
