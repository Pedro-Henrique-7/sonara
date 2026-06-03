/*********************************************************************************************
 * Objetivo: Arquivo responsável pelas requisições da API do projeto Sonara
 * Data: 27/11/2025
 * Autor: Davi de Almeida Santos
 * Versão: 1.0
 **********************************************************************************************/
const setupSwagger = require('./swagger/swagger')


require('dotenv').config()

const express = require('express')
const cors = require('cors')
const multer = require('multer')

// Configuração para o multer enviar arquivo de imagem
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    }
})

const PORT = process.env.PORT || 8080

const app = express()
setupSwagger(app)
// Middlewares globais
app.use(cors())
app.use(express.json())

// Configuração manual do CORS
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')

    response.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    )

    response.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if (request.method === 'OPTIONS') {
        return response.sendStatus(204)
    }

    next()
})

// Importação das rotas
const generoRoutes = require('./routes/genero')
const usuarioRoutes = require('./routes/usuario')
const enderecoRoutes = require('./routes/endereco')
const artistaRoutes = require('./routes/artista')
const organizador = require('./routes/organizador')
const generoMusical = require('./routes/genero_musical')
const nacionalidade = require('./routes/nacionalidade')
const status = require('./routes/status')
const RedesSociais = require('./routes/redes_sociais')
const tipoRedesSociais = require('./routes/tipo_redes_sociais')
const foto = require('./routes/foto')
const evento = require('./routes/evento')
const recuperacao = require('./routes/recuperacao_senha')
const avaliacaoArtista = require('./routes/avaliacao_artista')
const avaliacaoEvento = require('./routes/avaliacao_evento')
const eventoOrganizador = require('./routes/evento_organizador')
const eventoStatus = require('./routes/evento_status')
const artistaGeneroMusical = require('./routes/artista_genero_musical')
const eventoArtista = require('./routes/evento_artista')
const eventoArtistaStatus = require('./routes/evento_artista_status')
const enderecoEvento = require('./routes/endereco_evento')
const usuarioPerfil = require('./routes/VEWS/usuario_perfil')

// Views
const eventosDoOrganizador = require('./routes/VEWS/organizadorEvento')

// Configuração das rotas
app.use('/v1/sonara/genero', generoRoutes)
app.use('/v1/sonara/usuario', usuarioRoutes)
app.use('/v1/sonara/endereco', enderecoRoutes)
app.use('/v1/sonara/artista', artistaRoutes)
app.use('/v1/sonara/organizador', organizador)
app.use('/v1/sonara/generoMusical', generoMusical)
app.use('/v1/sonara/nacionalidade', nacionalidade)
app.use('/v1/sonara/status', status)
app.use('/v1/sonara/redesSociais', RedesSociais)
app.use('/v1/sonara/tipoRedesSociais', tipoRedesSociais)
app.use('/v1/sonara/foto', foto)
app.use('/v1/sonara/evento', evento)
app.use('/v1/sonara/recuperacao', recuperacao)
app.use('/v1/sonara/enderecoEvento', enderecoEvento)
app.use('/v1/sonara/avaliacaoArtista', avaliacaoArtista)
app.use('/v1/sonara/avaliacaoEvento', avaliacaoEvento)
app.use('/v1/sonara/eventoOrganizador', eventoOrganizador)
app.use('/v1/sonara/eventoStatus', eventoStatus)
app.use('/v1/sonara/artistaGeneroMusical', artistaGeneroMusical)

// Rota principal do fluxo artista/evento
app.use('/v1/sonara/eventoArtista', eventoArtista)

app.use('/v1/sonara/eventoArtistaStatus', eventoArtistaStatus)
app.use('/v1/sonara/usuarioPerfil', usuarioPerfil)
app.use('/v1/sonara/eventosDoOrganizador', eventosDoOrganizador)

app.listen(PORT, function () {
    console.log(`API aguardando requisições na porta ${PORT} ;)`)
})