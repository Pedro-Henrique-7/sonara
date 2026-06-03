const swaggerUi = require('swagger-ui-express')
const path = require('path')

const swaggerFile = require(path.join(__dirname, 'swagger_output.json'))

module.exports = function setupSwagger(app) {

    // rota que serve o JSON puro
    app.get('/docs/swagger_output.json', (req, res) => {
        res.json(swaggerFile)
    })

    // interface visual apontando para a URL do JSON
    app.use('/docs', swaggerUi.serve)
    app.get('/docs', swaggerUi.setup(swaggerFile, {
        swaggerOptions: {
            url: '/docs/swagger_output.json',
            persistAuthorization: true,
            displayRequestDuration: true,
            filter: true,
            docExpansion: 'none',
            defaultModelsExpandDepth: 1,
            tryItOutEnabled: true
        },
        customCss: `
            .swagger-ui .topbar { background-color: #1a1a2e; }
            .swagger-ui .topbar .download-url-wrapper { display: none; }
            .swagger-ui .info .title { color: #e94560; }
        `,
        customSiteTitle: 'Sonara API - Documentação'
    }))

    console.log('📚 Documentação disponível em: http://localhost:8080/docs')
}