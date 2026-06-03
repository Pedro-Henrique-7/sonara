const express = require('express')
const cors = require('cors')
const multer = require('multer')
const upload = multer()

const bodyParserJson = express.json()


const controllerFoto = require('../controller/foto/foto')

//configurção do cors 
const router = express.Router()
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})




// retornar todos os Fotos
router.get('/', cors(), async function (request, response) {
    /*  #swagger.tags = ['Foto']
    #swagger.summary = 'Listar todas as fotos'
    #swagger.responses[200] = { description: 'Lista retornada' } */
    let Foto = await controllerFoto.listarFotos()

    response.status(Foto.status_code)
    response.json(Foto)
})
module.exports = router


// pegar Foto por id
router.get('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Foto']
    #swagger.summary = 'Buscar foto por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Foto encontrada' }
    #swagger.responses[404] = { description: 'Foto não encontrada' } */

    let idFoto = request.params.id

    let Foto = await controllerFoto.buscarFotoId(idFoto)
    response.status(Foto.status_code)
    response.json(Foto)


})


//inserir Foto
router.post('/', cors(), upload.single('foto'), async function (request, response) {

    /*  #swagger.tags = ['Foto']
    #swagger.summary = 'Upload de foto para evento'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['foto'] = { in: 'formData', type: 'file', required: true, description: 'Imagem (JPG, PNG ou JPEG, máx 5MB)' }
    #swagger.parameters['evento_id'] = { in: 'formData', type: 'integer', required: true, description: 'ID do evento' }
    #swagger.responses[201] = { description: 'Foto enviada com sucesso' }
    #swagger.responses[400] = { description: 'Arquivo ou evento_id ausente/inválido' }
    #swagger.responses[502] = { description: 'Erro ao enviar para o Azure' } */

    let Foto = request.body
    let file = request.file

    let result = await controllerFoto.inserirFoto(Foto, file)

    response.status(result.status_code)
    response.json(result)
})


router.put('/:id', cors(), upload.single('foto'), async function (request, response) {

    /*  #swagger.tags = ['Foto']
        #swagger.summary = 'Atualizar foto de evento'
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        #swagger.parameters['foto'] = { in: 'formData', type: 'file', required: true, description: 'Nova imagem' }
        #swagger.parameters['evento_id'] = { in: 'formData', type: 'integer', required: true }
        #swagger.responses[200] = { description: 'Foto atualizada' }
        #swagger.responses[404] = { description: 'Foto não encontrada' } */

    let Foto = request.body
    let file = request.file
    let idFoto = request.params.id

    let result = await controllerFoto.atualizarFoto(Foto, file, idFoto)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', cors(), async function (request, response) {

    /*  #swagger.tags = ['Foto']
    #swagger.summary = 'Excluir foto'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Foto excluída' }
    #swagger.responses[404] = { description: 'Foto não encontrada' } */

    let idFoto = request.params.id

    let Foto = await controllerFoto.excluirFoto(idFoto)
    response.status(Foto.status_code)
    response.json(Foto)
})
