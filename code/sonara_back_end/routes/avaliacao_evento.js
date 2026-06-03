const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const ccontrollerAvaliacaoEvento = require('../controller/avaliacao_evento/avaliacao_evento')

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
    /*  #swagger.tags = ['Avaliacao Evento']
    #swagger.summary = 'Listar avaliações de eventos'
    #swagger.responses[200] = { description: 'Lista retornada' } */

    let AvaliacaoEvento = await ccontrollerAvaliacaoEvento.listarAvaliacaoEvento()

    response.status(AvaliacaoEvento.status_code)
    response.json(AvaliacaoEvento)
})
module.exports = router


// pegar Artista por id
router.get('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Avaliacao Evento']
    #swagger.summary = 'Buscar avaliação de evento por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Avaliação encontrada' }
    #swagger.responses[404] = { description: 'Não encontrada' } */
    let idAvaliacaoEvento = request.params.id

    let AvaliacaoEvento = await ccontrollerAvaliacaoEvento.buscarAvaliacaoEventoId(idAvaliacaoEvento)
    response.status(AvaliacaoEvento.status_code)
    response.json(AvaliacaoEvento)


})


//inserir Artista
router.post('/', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Avaliacao Evento']
        #swagger.summary = 'Criar avaliação de evento'
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AvaliacaoEvento' } }
        #swagger.responses[201] = { description: 'Avaliação criada' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let AvaliacaoEvento = await ccontrollerAvaliacaoEvento.inserirAvaliacaoEvento(dadosBody, contentType)

    response.status(AvaliacaoEvento.status_code)
    response.json(AvaliacaoEvento)
})


router.put('/:id', cors(), bodyParserJson, async function (request, response) {
    // PUT /:id
    /*  #swagger.tags = ['Avaliacao Evento']
        #swagger.summary = 'Atualizar avaliação de evento'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AvaliacaoEvento' } }
        #swagger.responses[200] = { description: 'Avaliação atualizada' } */
    let dadosBody = request.body

    let idAvaliacaoEvento = request.params.id

    let contentType = request.headers['content-type']

    let AvaliacaoEvento = await ccontrollerAvaliacaoEvento.atualizarAvaliacaoEvento(dadosBody, idAvaliacaoEvento, contentType)
    response.status(AvaliacaoEvento.status_code)
    response.json(AvaliacaoEvento)
})

router.delete('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Avaliacao Evento']
    #swagger.summary = 'Excluir avaliação de evento'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Avaliação excluída' } */

    let idAvaliacaoEvento = request.params.id

    let AvaliacaoEvento = await ccontrollerAvaliacaoEvento.excluirAvaliacaoEvento(idAvaliacaoEvento)
    response.status(AvaliacaoEvento.status_code)
    response.json(AvaliacaoEvento)
})
