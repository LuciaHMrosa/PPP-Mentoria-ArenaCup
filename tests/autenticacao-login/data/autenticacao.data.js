const usuarioValido = {
    nome: 'Maria Silva',
    email: `maria.teste.${Date.now()}@example.com`,
    senha: 'Senha123',
    perfil: 'participant'
};

const usuarioSemEmail = {
    nome: 'Maria Silva',
    email: '',
    senha: 'Senha123',
    perfil: 'participant'
};

const usuarioEmailExistente = {
    nome: 'João Silva',
    email: 'maria.teste@example.com',
    senha: 'Senha123',
    perfil: 'participant'
};

const senhaAbaixoMinimo = {
    nome: 'Maria Silva',
    email: `senha5.${Date.now()}@example.com`,
    senha: '12345',
    perfil: 'participant'
};

const senhaMinimoPermitido = {
    nome: 'Maria Silva',
    email: `senha6.${Date.now()}@example.com`,
    senha: '123456',
    perfil: 'participant'
};

const loginValido = {
    email: 'maria.teste@example.com',
    senha: 'Senha123'
};

const loginSenhaInvalida = {
    email: 'maria.teste@example.com',
    senha: 'SenhaErrada'
};

const loginEmailInexistente = {
    email: `inexistente.${Date.now()}@example.com`,
    senha: 'Senha123'
};

const loginSemEmail = {
    email: '',
    senha: 'Senha123'
};

const loginSemSenha = {
    email: 'maria.teste@example.com',
    senha: ''
};
const organizadorValido = {
    nome: 'Organizador Teste',
    email: 'organizador.teste@example.com',
    senha: 'Senha123',
    perfil: 'organizer'
};
const participanteValido = {
    nome: 'Participante Teste',
    email: 'participante@arenacup.com',
    senha: '123456'
};

module.exports = {
    usuarioValido,
    usuarioSemEmail,
    usuarioEmailExistente,
    senhaAbaixoMinimo,
    senhaMinimoPermitido,
    loginValido,
    loginSenhaInvalida,
    loginEmailInexistente,
    loginSemEmail,
    loginSemSenha,
    organizadorValido,
    participanteValido
};