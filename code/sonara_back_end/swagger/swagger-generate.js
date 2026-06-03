const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        title: 'Sonara API',
        description: `
API do projeto **Sonara** — plataforma de conexão entre artistas e organizadores de eventos.

## Autenticação
Algumas rotas exigem **Bearer Token** (JWT). Faça login em \`POST /v1/sonara/usuario/login\` e use o token retornado no header:
\`Authorization: Bearer <token>\`

## Fluxo principal
1. Cadastre um usuário (artista ou organizador)
2. Faça login para obter o token
3. Crie eventos (organizador) ou candidate-se a eventos (artista)
4. Gerencie candidaturas, contra-propostas e convites
        `,
        version: '1.0.10',
        contact: { name: 'Davi de Almeida Santos' }
    },
    host: 'localhost:8080',
    basePath: '/',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Insira: Bearer <token>'
        }
    },
    tags: [
        { name: 'Usuário',                description: 'Cadastro, login, perfil e foto de usuários' },
        { name: 'Artista',                description: 'Gerenciamento de artistas' },
        { name: 'Organizador',            description: 'Gerenciamento de organizadores' },
        { name: 'Evento',                 description: 'Criação e gerenciamento de eventos' },
        { name: 'Evento x Artista',       description: 'Candidaturas, aprovações, convites e negociação de cachê' },
        { name: 'Evento x Organizador',   description: 'Vínculo entre eventos e organizadores' },
        { name: 'Evento Status',          description: 'Histórico de status dos eventos' },
        { name: 'Evento Artista Status',  description: 'Histórico de status do artista no evento' },
        { name: 'Avaliacao Artista',      description: 'Avaliações de artistas por usuários' },
        { name: 'Avaliacao Evento',       description: 'Avaliações de eventos por usuários' },
        { name: 'Foto',                   description: 'Upload e gerenciamento de fotos de eventos' },
        { name: 'Endereco',               description: 'Endereços de usuários' },
        { name: 'Endereco Evento',        description: 'Endereços de eventos' },
        { name: 'Genero',                 description: 'Gêneros (masculino/feminino/etc)' },
        { name: 'Genero Musical',         description: 'Estilos musicais cadastrados' },
        { name: 'Artista Genero Musical', description: 'Relação entre artistas e gêneros musicais' },
        { name: 'Nacionalidade',          description: 'Nacionalidades disponíveis' },
        { name: 'Status',                 description: 'Status disponíveis no sistema' },
        { name: 'Redes Sociais',          description: 'Links de redes sociais dos usuários' },
        { name: 'Tipo Redes Sociais',     description: 'Tipos de redes sociais (Instagram, TikTok...)' },
        { name: 'Recuperacao Senha',      description: 'Tokens de recuperação de senha' },
        { name: 'Views',                  description: 'Endpoints de views consolidadas' }
    ],
    definitions: {
        UsuarioCadastro: {
            $tipo_usuario: 'artista',
            $nome: 'João Silva',
            $email: 'joao@email.com',
            $senha: 'Senha@123',
            $cpf: '123.456.789-00',
            $data_nasc: '1995-06-15',
            $nacionalidade_id: 1,
            $genero_id: 1,
            $telefone: '(11) 99999-9999',
            $cep: '01310-100',
            $cidade: 'São Paulo',
            $estado: 'SP',
            $logradouro: 'Av. Paulista',
            $numero: '1000',
            bairro: 'Bela Vista',
            complemento: 'Apto 10',
            nome_artistico: 'DJ João',
            descricao: 'DJ de música eletrônica',
            generos_musicais: [1, 2]
        },
        UsuarioLogin: {
            $email: 'joao@email.com',
            $senha: 'Senha@123'
        },
        EventoCadastro: {
            $nome: 'Festival Sonara 2026',
            $descricao: 'Festival de música ao ar livre',
            $local: 'Parque Ibirapuera',
            $data: '2026-08-15',
            $hora_inicio: '18:00',
            $hora_fim: '23:00',
            $organizador_id: 1,
            $cep: '04094-050',
            $cidade: 'São Paulo',
            $estado: 'SP',
            $logradouro: 'Av. Pedro Álvares Cabral',
            $numero: 'S/N',
            $bairro: 'Vila Mariana',
            complemento: 'Portão 3'
        },
        AvaliacaoArtista: {
            $numero_estrelas: 5,
            $usuario_id: 1,
            $artista_id: 1,
            $data_avaliacao: '2026-06-01 20:00:00'
        },
        AvaliacaoEvento: {
            $numero_estrelas: 4,
            $usuario_id: 1,
            $evento_id: 1,
            $data_avaliacao: '2026-06-01 22:00:00'
        },
        Genero:           { $nome: 'Masculino' },
        GeneroMusical:    { $nome: 'Rock' },
        Nacionalidade:    { $nome: 'Brasileira' },
        Status:           { $nome: 'Ativo' },
        RedesSociais: {
            $link: 'https://instagram.com/joaosilva',
            $tipo_id: 1,
            $usuario_id: 1
        },
        TipoRedesSociais: { $nome: 'Instagram' },
        RecuperacaoSenha: {
            $usuario_id: 1,
            $codigo: 'ABC123',
            $expira_em: '2026-06-01 23:59:59',
            $usado: 0,
            $tentativas: 0,
            $criado_em: '2026-06-01 20:00:00'
        },
        ArtistaGeneroMusical: {
            $genero_musical_id: 1,
            $artista_id: 1
        },
        Endereco: {
            $cep: '01310-100',
            $cidade: 'São Paulo',
            $estado: 'SP',
            $logradouro: 'Av. Paulista',
            $numero: '1000',
            bairro: 'Bela Vista',
            complemento: 'Apto 10'
        },
        Artista: {
            $nome_artistico: 'DJ João',
            $usuario_id: 1,
            $descricao: 'DJ com 5 anos de experiência'
        },
        Organizador: {
            $usuario_id: 1
        },
        EventoArtista: {
            $artista_id: 1,
            $evento_id: 1,
            $cache_esperado: 1500,
            $cache_ofertado: 1200,
            $cache_final: 1300,
            contra_proposta: 1100,
            sobre_artista: 'Artista experiente',
            motivo_inscricao: 'Quero participar'
        },
        EventoOrganizador: {
            $evento_id: 1,
            $organizador_id: 1
        },
        EventoStatus: {
            $evento_id: 1,
            $status_id: 1,
            $data_hora: '2026-06-01 18:00:00'
        },
        EventoArtistaStatus: {
            $evento_artista_id: 1,
            $status_id: 1,
            $data_hora: '2026-06-01 18:00:00'
        },
        EnderecoEvento: {
            $cep: '04094-050',
            $cidade: 'São Paulo',
            $estado: 'SP',
            $logradouro: 'Av. Pedro Álvares Cabral',
            $numero: 'S/N',
            $complemento: 'Portão 3',
            $bairro: 'Vila Mariana',
            $evento_id: 1
        },
        Foto: {
            $evento_id: 1
        }
    }
}

const outputFile = './swagger_output.json'


const endpointsFiles = ['../app.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('✅ swagger_output.json gerado com sucesso!')
})