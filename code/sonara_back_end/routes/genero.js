const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerGenero = require('../controller/genero/genero')

//configurção do cors 
const router = express.Router()
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})




// retornar todos os generos
router.get('/', cors(), async function (request, response) {
    /*  #swagger.tags = ['Genero']
        #swagger.summary = 'Listar gêneros'
        #swagger.responses[200] = { description: 'Lista retornada' } */
    let genero = await controllerGenero.listarGeneros()

    response.status(genero.status_code)
    response.json(genero)
})
module.exports = router


// pegar genero por id
router.get('/:id', cors(), async function (request, response) {

    /*  #swagger.tags = ['Genero']
    #swagger.summary = 'Buscar gênero por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Gênero encontrado' }
    #swagger.responses[404] = { description: 'Não encontrado' } */
    let idGenero = request.params.id

    let genero = await controllerGenero.buscarGeneroId(idGenero)
    response.status(genero.status_code)
    response.json(genero)


})


//inserir genero
router.post('/', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Genero']
    #swagger.summary = 'Cadastrar gênero'
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Genero' } }
    #swagger.responses[201] = { description: 'Gênero criado' }
    #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let genero = await controllerGenero.inserirGenero(dadosBody, contentType)

    response.status(genero.status_code)
    response.json(genero)
})


router.put('/:id', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Genero']
        #swagger.summary = 'Atualizar gênero'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Genero' } }
        #swagger.responses[200] = { description: 'Gênero atualizado' } */

    let dadosBody = request.body

    let idGenero = request.params.id

    let contentType = request.headers['content-type']

    let genero = await controllerGenero.atualizarGenero(dadosBody, idGenero, contentType)
    response.status(genero.status_code)
    response.json(genero)
})

router.delete('/:id', cors(), async function (request, response) {

    /*  #swagger.tags = ['Genero']
    #swagger.summary = 'Excluir gênero'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Gênero excluído' } */
    let idGenero = request.params.id
    console.log(idGenero)
    let genero = await controllerGenero.excluirGenero(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})
