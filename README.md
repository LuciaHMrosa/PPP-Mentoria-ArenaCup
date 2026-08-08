# ArenaCup

Aplicação web para gerenciamento de torneios de Futebol, Vôlei e Basquete, criada como base funcional para práticas futuras de testes e qualidade de software.

## Funcionalidades

- Cadastro, login, logout e sessão para Organizadores e Participantes.
- Organizadores criam, editam e encerram torneios; analisam inscrições; geram partidas de pontos corridos; e registram resultados.
- Participantes criam e administram suas próprias equipes e solicitam inscrições.
- Classificação automática: 3 pontos por vitória, 1 por empate e saldo como desempate.
- Interface responsiva em Bootstrap 5 e `data-testid` nas ações principais.

## Tecnologias

Node.js, JavaScript, Express, EJS, express-session, HTML, CSS e Bootstrap 5.

## Como executar

```bash
npm install
npm start
```

Acesse `http://localhost:3000`. Use a variável `PORT` para alterar a porta.

## Decisões e escopo

`data/store.js` mantém os dados em arrays em memória; por isso tudo é apagado ao reiniciar o servidor. `services/tournamentService.js` centraliza regras, geração de partidas e classificação. Não há banco de dados, API REST separada, pagamentos, upload, recuperação de senha, testes automatizados ou modalidades além das três definidas. As senhas são mantidas em texto simples somente para o escopo didático sem persistência e não são adequadas para produção.
