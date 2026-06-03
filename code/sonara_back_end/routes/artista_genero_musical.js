const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerArtistaGeneroMusical = require('../controller/artista_genero_musical/artista_genero_musical')

//configurção do cors 
const router = express.Router()
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})
// ENDPOINTS DA TABELA ArtistaGeneroMusical


// retornar todos os ArtistaGeneroMusicals
router.get('/', cors(), async function (request, response) {
    /*  #swagger.tags = ['Artista Genero Musical']
        #swagger.summary = 'Listar relações artista-gênero musical'
        #swagger.responses[200] = { description: 'Lista retornada' } */
    let ArtistaGeneroMusical = await controllerArtistaGeneroMusical.listarArtistaGeneroMusical()

    response.status(ArtistaGeneroMusical.status_code)
    response.json(ArtistaGeneroMusical)
})
module.exports = router


// pegar ArtistaGeneroMusical por id
router.get('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Artista Genero Musical']
        #swagger.summary = 'Buscar relação artista-gênero por ID'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        #swagger.responses[200] = { description: 'Relação encontrada' }
        #swagger.responses[404] = { description: 'Não encontrada' } */

    let idArtistaGeneroMusical = request.params.id

    let ArtistaGeneroMusical = await controllerArtistaGeneroMusical.buscarArtistaGeneroMusicalId(idArtistaGeneroMusical)
    response.status(ArtistaGeneroMusical.status_code)
    response.json(ArtistaGeneroMusical)


})


//inserir ArtistaGeneroMusical
router.post('/', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Artista Genero Musical']
        #swagger.summary = 'Vincular artista a gênero musical'
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ArtistaGeneroMusical' } }
        #swagger.responses[201] = { description: 'Vínculo criado' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let ArtistaGeneroMusical = await controllerArtistaGeneroMusical.inserirArtistaGeneroMusical(dadosBody, contentType)

    response.status(ArtistaGeneroMusical.status_code)
    response.json(ArtistaGeneroMusical)
})


router.put('/:id', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Artista Genero Musical']
        #swagger.summary = 'Atualizar vínculo artista-gênero musical'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ArtistaGeneroMusical' } }
        #swagger.responses[200] = { description: 'Atualizado' } */

    let dadosBody = request.body

    let idArtistaGeneroMusical = request.params.id

    let contentType = request.headers['content-type']

    let ArtistaGeneroMusical = await controllerArtistaGeneroMusical.atualizarArtistaGeneroMusical(dadosBody, idArtistaGeneroMusical, contentType)
    response.status(ArtistaGeneroMusical.status_code)
    response.json(ArtistaGeneroMusical)
})

router.delete('/:id', cors(), async function (request, response) {

    /*  #swagger.tags = ['Artista Genero Musical']
        #swagger.summary = 'Excluir vínculo artista-gênero musical'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        #swagger.responses[200] = { description: 'Excluído' } */

    let idArtistaGeneroMusical = request.params.id

    let ArtistaGeneroMusical = await controllerArtistaGeneroMusical.excluirArtistaGeneroMusical(idArtistaGeneroMusical)
    response.status(ArtistaGeneroMusical.status_code)
    response.json(ArtistaGeneroMusical)
})
