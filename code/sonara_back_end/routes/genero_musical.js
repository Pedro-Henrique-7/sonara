const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllergeneroMusical = require('../controller/genero_musical/genero_musical')

//configurção do cors 
const router = express.Router()
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})




// retornar todos os generoMusicals
router.get('/', cors(), async function (request, response) {
    /*  #swagger.tags = ['Genero Musical']
    #swagger.summary = 'Listar gêneros musicais'
    #swagger.responses[200] = { description: 'Lista retornada' } */

    let generoMusical = await controllergeneroMusical.listarGeneroMusical()

    response.status(generoMusical.status_code)
    response.json(generoMusical)
})
module.exports = router


// pegar generoMusical por id
router.get('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Genero Musical']
    #swagger.summary = 'Buscar gênero musical por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Gênero musical encontrado' }
    #swagger.responses[404] = { description: 'Não encontrado' } */
    let idGeneroMusical = request.params.id

    let generoMusical = await controllergeneroMusical.buscarGeneroMusicalId(idGeneroMusical)
    response.status(generoMusical.status_code)
    response.json(generoMusical)


})


//inserir generoMusical
router.post('/', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Genero Musical']
        #swagger.summary = 'Cadastrar gênero musical'
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/GeneroMusical' } }
        #swagger.responses[201] = { description: 'Gênero musical criado' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let generoMusical = await controllergeneroMusical.inserirGeneroMusical(dadosBody, contentType)

    response.status(generoMusical.status_code)
    response.json(generoMusical)
})


router.put('/:id', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Genero Musical']
        #swagger.summary = 'Atualizar gênero musical'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/GeneroMusical' } }
        #swagger.responses[200] = { description: 'Atualizado' } */


    let dadosBody = request.body

    let idGeneroMusical = request.params.id

    let contentType = request.headers['content-type']

    let generoMusical = await controllergeneroMusical.atualizarGeneroMusical(dadosBody, idGeneroMusical, contentType)
    response.status(generoMusical.status_code)
    response.json(generoMusical)
})

router.delete('/:id', cors(), async function (request, response) {

    /*  #swagger.tags = ['Genero Musical']
        #swagger.summary = 'Excluir gênero musical'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        #swagger.responses[200] = { description: 'Excluído' } */

    let idGeneroMusical = request.params.id

    let generoMusical = await controllergeneroMusical.excluirGeneroMusical(idGeneroMusical)
    response.status(generoMusical.status_code)
    response.json(generoMusical)
})
