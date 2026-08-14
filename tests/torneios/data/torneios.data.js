const torneioValido = {
    nome: 'Copa ArenaCup 2026',
    modalidade: 'Futebol',
    dataInicio: '2026-08-20',
    dataFim: '2026-08-30',
    maxEquipes: 16,
    local: 'Ginásio Municipal'
};

const torneioSemModalidade = {
    ...torneioValido,
    nome: 'Torneio Sem Modalidade',
    modalidade: ''
};

const torneioDataFinalAnterior = {
    ...torneioValido,
    nome: 'Torneio Data Final Anterior',
    dataInicio: '2026-08-30',
    dataFim: '2026-08-20'
};

const torneioDatasIguais = {
    ...torneioValido,
    nome: 'Torneio Data Igual',
    dataInicio: '2026-08-20',
    dataFim: '2026-08-20'
};

const torneioMaxEquipesZero = {
    ...torneioValido,
    nome: 'Torneio Zero Equipes',
    maxEquipes: 0
};

const torneioMaxEquipesUm = {
    ...torneioValido,
    nome: 'Torneio Uma Equipe',
    maxEquipes: 1
};

const torneioMaxEquipesNegativo = {
    ...torneioValido,
    nome: 'Torneio Equipes Negativo',
    maxEquipes: -1
};

const torneioParaEdicao = {
    ...torneioValido,
    nome: 'Torneio Para Editar',
    modalidade: 'Vôlei',
    local: 'Quadra Municipal'
};

const torneioIniciado = {
    ...torneioValido,
    nome: 'Torneio Já Iniciado',
    dataInicio: '2026-08-01',
    dataFim: '2026-08-30'
};

const torneioParaEncerrar = {
    ...torneioValido,
    nome: 'Torneio Para Encerrar'
};

const torneioJaEncerrado = {
    ...torneioValido,
    nome: 'Torneio Já Encerrado'
};

module.exports = {
    torneioValido,
    torneioSemModalidade,
    torneioDataFinalAnterior,
    torneioDatasIguais,
    torneioMaxEquipesZero,
    torneioMaxEquipesUm,
    torneioMaxEquipesNegativo,
    torneioParaEdicao,
    torneioIniciado,
    torneioParaEncerrar,
    torneioJaEncerrado
};