const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerArtista = require('../controller/artista/artistas')

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
    /*  #swagger.tags = ['Artista']
    #swagger.summary = 'Listar todos os artistas'
    #swagger.responses[200] = { description: 'Lista retornada com sucesso' }
    #swagger.responses[404] = { description: 'Nenhum artista encontrado' } */

    let artista = await controllerArtista.listarArtista()

    response.status(artista.status_code)
    response.json(artista)
})
module.exports = router


// pegar Artista por id
router.get('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Artista']
    #swagger.summary = 'Buscar artista por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do artista' }
    #swagger.responses[200] = { description: 'Artista encontrado' }
    #swagger.responses[400] = { description: 'ID inválido' }
    #swagger.responses[404] = { description: 'Artista não encontrado' } */
    let idArtista = request.params.id

    let artista = await controllerArtista.buscarArtistaId(idArtista)
    response.status(artista.status_code)
    response.json(artista)


})


//inserir Artista
router.post('/', cors(), bodyParserJson, async function (request, response) {
    /*  #swagger.tags = ['Artista']
        #swagger.summary = 'Cadastrar artista'
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Artista' } }
        #swagger.responses[201] = { description: 'Artista criado com sucesso' }
        #swagger.responses[400] = { description: 'Campos inválidos' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */

    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let artista = await controllerArtista.inserirArtista(dadosBody, contentType)

    response.status(artista.status_code)
    response.json(artista)
})


router.put('/:id', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Artista']
    #swagger.summary = 'Atualizar artista'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do artista' }
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Artista' } }
    #swagger.responses[200] = { description: 'Artista atualizado' }
    #swagger.responses[404] = { description: 'Artista não encontrado' } */
    let dadosBody = request.body

    let idArtista = request.params.id

    let contentType = request.headers['content-type']

    let artista = await controllerArtista.atualizarArtista(dadosBody, idArtista, contentType)
    response.status(artista.status_code)
    response.json(artista)
})

router.delete('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Artista']
    #swagger.summary = 'Excluir artista'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do artista' }
    #swagger.responses[200] = { description: 'Artista excluído' }
    #swagger.responses[404] = { description: 'Artista não encontrado' } */
    let idArtista = request.params.id

    let artista = await controllerArtista.excluirArtista(idArtista)
    response.status(artista.status_code)
    response.json(artista)
})
