const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerNacionalidade = require('../controller/nacionalidade/nacionalidade')

//configurção do cors 
const router = express.Router()
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})




// retornar todos os Nacionalidades
router.get('/', cors(), async function (request, response) {
    /*  #swagger.tags = ['Nacionalidade']
        #swagger.summary = 'Listar nacionalidades'
        #swagger.responses[200] = { description: 'Lista retornada' } */
    let nacionalidade = await controllerNacionalidade.listarnacioNalidades()

    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})
module.exports = router


// pegar Nacionalidade por id
router.get('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Nacionalidade']
    #swagger.summary = 'Buscar nacionalidade por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Encontrada' }
    #swagger.responses[404] = { description: 'Não encontrada' } */

    let idNacionalidade = request.params.id

    let nacionalidade = await controllerNacionalidade.buscarnacioNalidadeId(idNacionalidade)
    response.status(nacionalidade.status_code)
    response.json(nacionalidade)


})


//inserir Nacionalidade
router.post('/', cors(), bodyParserJson, async function (request, response) {
    /*  #swagger.tags = ['Nacionalidade']
        #swagger.summary = 'Cadastrar nacionalidade'
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Nacionalidade' } }
        #swagger.responses[201] = { description: 'Nacionalidade criada' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */

    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let nacionalidade = await controllerNacionalidade.inserirNacionalidade(dadosBody, contentType)

    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})


router.put('/:id', cors(), bodyParserJson, async function (request, response) {
    /*  #swagger.tags = ['Nacionalidade']
    #swagger.summary = 'Atualizar nacionalidade'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Nacionalidade' } }
    #swagger.responses[200] = { description: 'Atualizada' } */

    let dadosBody = request.body

    let idNacionalidade = request.params.id

    let contentType = request.headers['content-type']

    let nacionalidade = await controllerNacionalidade.atualizarNacionalidade(dadosBody, idNacionalidade, contentType)
    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})

router.delete('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Nacionalidade']
        #swagger.summary = 'Excluir nacionalidade'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        #swagger.responses[200] = { description: 'Excluída' } */

    let idNacionalidade = request.params.id

    let nacionalidade = await controllerNacionalidade.excluirnacionalidade(idNacionalidade)
    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})
