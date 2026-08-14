# 🏆 ArenaCup

Sistema Web para gerenciamento de torneios esportivos, desenvolvido como projeto da **Mentoria em Testes e Qualidade de Software**.

O ArenaCup foi desenvolvido com escopo controlado para servir como base prática para aplicação de conceitos de **Engenharia de Software, Qualidade de Software e Engenharia de Testes**, contemplando desde a especificação dos requisitos até a execução de testes manuais e automação de cenários selecionados.

## ⚽ Modalidades

O sistema contempla três modalidades esportivas:

- Futebol
- Vôlei
- Basquete

---

## ✨ Funcionalidades

### 🔐 Autenticação e usuários

- Cadastro de usuários;
- Login e logout;
- Controle de sessão;
- Perfis de **Organizador** e **Participante**;
- Controle de acesso conforme o perfil.

### 🏆 Torneios

- Criação de torneios;
- Edição de torneios;
- Encerramento de torneios;
- Definição de modalidade;
- Definição do período do torneio;
- Definição do número máximo de equipes;
- Gerenciamento das inscrições;
- Geração de partidas;
- Registro de resultados.

### 👥 Equipes

- Criação de equipes;
- Gerenciamento das equipes pelo participante;
- Definição de capitão;
- Gerenciamento dos jogadores;
- Solicitação de inscrição em torneios.

### 📊 Classificação

A classificação dos torneios é calculada automaticamente considerando:

- **3 pontos** por vitória;
- **1 ponto** por empate;
- **0 pontos** por derrota;
- Saldo como critério de desempate.

---

## 🧪 Qualidade e Testes

O projeto foi utilizado como base para a aplicação prática de técnicas e processos de **Qualidade de Software**.

Foram desenvolvidos artefatos de teste baseados na **ISO/IEC/IEEE 29119-3**, incluindo:

- Política de Testes;
- Estratégia de Testes;
- Plano de Testes;
- Especificação de Requisitos;
- Cenários de Teste;
- Casos de Teste;
- Matriz de Rastreabilidade;
- Relatórios de execução;
- Métricas de testes;
- Relatório Final de Testes.

Os testes foram executados inicialmente de forma manual e, posteriormente, foram selecionados cenários para **automação Web com Playwright**.

---

## 🛠️ Tecnologias

### Aplicação

- **Node.js** — ambiente de execução;
- **Express** — servidor e gerenciamento das rotas;
- **JavaScript** — lógica da aplicação;
- **EJS** — renderização das páginas;
- **HTML** — estrutura das páginas;
- **CSS** — estilos personalizados;
- **Bootstrap 5** — componentes e responsividade;
- **express-session** — gerenciamento de sessões.

### Testes

- **Playwright** — automação de testes Web.

### Ferramentas

- **Git**
- **GitHub**
- **GitHub Issues**
- **GitHub Wiki**
- **Visual Studio Code**

---

## 🚀 Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/LuciaHMrosa/PPP-Mentoria-ArenaCup.git
```

### 2. Acessar o projeto

```bash
cd PPP-Mentoria-ArenaCup
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Iniciar a aplicação

```bash
npm start
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

Para utilizar outra porta, defina a variável de ambiente `PORT`.

---

## 🤖 Automação com Playwright

O projeto possui testes automatizados utilizando **Playwright**, organizados por funcionalidade dentro da pasta `tests`.

```text
tests/
│
├── autenticacao-login/
│   ├── data/
│   ├── page/
│   └── *.spec.js
│
└── torneio/
    ├── data/
    ├── page/
    └── *.spec.js
```

A estrutura separa os dados utilizados nos testes, os objetos relacionados às páginas e as especificações dos cenários automatizados.

---

## 🗂️ Estrutura principal

```text
ArenaCup/
│
├── app.js
├── package.json
├── README.md
│
├── data/
│   └── store.js
│
├── middleware/
│   └── auth.js
│
├── services/
│   └── tournamentService.js
│
├── views/
│   └── *.ejs
│
├── public/
│   └── css/
│       └── style.css
│
└── tests/
    ├── autenticacao-login/
    │   ├── data/
    │   ├── page/
    │   └── *.spec.js
    │
    └── torneio/
        ├── data/
        ├── page/
        └── *.spec.js
```

---

## 💾 Armazenamento

O ArenaCup utiliza armazenamento **em memória**, por meio de estruturas de dados JavaScript.

Não há banco de dados persistente no MVP.

Consequentemente, os dados são perdidos quando o servidor é reiniciado.

Essa decisão foi tomada para manter o escopo do projeto controlado e concentrar o desenvolvimento nas práticas de **Qualidade de Software e Engenharia de Testes**.

---

## 📌 Escopo e limitações

O ArenaCup possui escopo controlado para fins didáticos e de estudo.

O projeto **não contempla**:

- Banco de dados persistente;
- API REST separada;
- Pagamentos;
- Upload de arquivos;
- Recuperação de senha;
- Outras modalidades além de Futebol, Vôlei e Basquete.

As senhas são armazenadas em texto simples exclusivamente para o escopo didático do projeto e **não representam uma implementação adequada para utilização em produção**.

---

## 📚 Documentação

A documentação completa do projeto e dos testes está disponível na **GitHub Wiki**, incluindo os requisitos, planejamento, estratégia, cenários, casos de teste, rastreabilidade, métricas e relatórios.

---

## 👩‍💻 Autora

**Lúcia Helena de Melo Rosa**

Projeto desenvolvido no contexto da **Mentoria em Testes e Qualidade de Software**.

[🔗 GitHub](https://github.com/LuciaHMrosa)
:::
