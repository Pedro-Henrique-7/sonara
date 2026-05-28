const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerEventoArtista = require('../controller/evento_artista/evento_artista')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})




// retornar todos os generos
router.get('/', cors(), async function (request, response){

  let EventoArtista  = await controllerEventoArtista.listarEventoArtista()
    
    response.status(EventoArtista.status_code)
    response.json(EventoArtista)
})
module.exports = router 


// pegar EventoArtista por id
router.get('/:id', cors(), async function (request, response){
    let IdEventoArtista = request.params.id

    let EventoArtista = await controllerEventoArtista.buscarEventoArtistaId(IdEventoArtista)
    response.status(EventoArtista.status_code)
    response.json(EventoArtista)  


})

//candidatar artista para evento   

router.post('/candidatar', cors(), bodyParserJson, async function (request, response) {
    const dadosBody   = request.body
    const contentType = request.headers['content-type']

    const resultado = await controllerEventoArtista.candidatarArtista(dadosBody, contentType)

    response.status(resultado.status_code)
    response.json(resultado)
})


//inserir EventoArtista
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let EventoArtista = await controllerEventoArtista.inserirEventoArtista(dadosBody, contentType)

    response.status(EventoArtista.status_code)
    response.json(EventoArtista)
})





router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let IdEventoArtista = request.params.id

    let contentType = request.headers['content-type']

    let EventoArtista = await controllerEventoArtista.atualizarEventoArtista(dadosBody, IdEventoArtista, contentType)
  response.status(EventoArtista.status_code)
    response.json(EventoArtista)
})

router.delete('/:id', cors(), async function(request, response) {
    let IdEventoArtista = request.params.id

    let EventoArtista = await controllerEventoArtista.excluirEventoArtista(IdEventoArtista)
    response.status(EventoArtista.status_code)
    response.json(EventoArtista)
})
  