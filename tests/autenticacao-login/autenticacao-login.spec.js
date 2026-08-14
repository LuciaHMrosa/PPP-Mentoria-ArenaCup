const { test, expect } = require('@playwright/test');

const { AutenticacaoLoginPage } = require('./pages/autenticacao-login.page');

const {
    usuarioValido,
    usuarioSemEmail,
    usuarioEmailExistente,
    senhaAbaixoMinimo,
    senhaMinimoPermitido,
    loginValido,
    loginSenhaInvalida,
    loginEmailInexistente,
    loginSemEmail,
    loginSemSenha
} = require('./data/autenticacao.data');

test.describe('Autenticação - Cadastro', () => {

    test('CTN-AUTH-001 - Cadastrar usuário com dados válidos', async ({ page }) => {
        const autenticacao = new AutenticacaoLoginPage(page);

        await autenticacao.acessarCadastro();

        await autenticacao.preencherCadastro(
            usuarioValido.nome,
            usuarioValido.email,
            usuarioValido.senha,
            usuarioValido.perfil
        );

        await autenticacao.cadastrar();

        await expect(page).toHaveURL(/\/login/);

        await expect(
            page.getByText('Cadastro realizado! Faça login para continuar.')
        ).toBeVisible();

        await expect(
            page.getByText('BEM-VINDO DE VOLTA')
        ).toBeVisible();
    });

    test('CTN-AUTH-003 - Cadastrar usuário sem e-mail', async ({ page }) => {
        const autenticacao = new AutenticacaoLoginPage(page);

        await autenticacao.acessarCadastro();

        await autenticacao.preencherCadastro(
            usuarioSemEmail.nome,
            usuarioSemEmail.email,
            usuarioSemEmail.senha,
            usuarioSemEmail.perfil
        );

        await autenticacao.cadastrar();

        await expect(page).toHaveURL(/\/register/);

        await expect(
            autenticacao.registerEmail
        ).toBeFocused();
    });
    test('CTN-AUTH-026 - Cadastrar usuário com e-mail já existente', async ({ page }) => {
        const autenticacao = new AutenticacaoLoginPage(page);

        await autenticacao.acessarCadastro();

        await autenticacao.preencherCadastro(
            usuarioEmailExistente.nome,
            usuarioEmailExistente.email,
            usuarioEmailExistente.senha,
            usuarioEmailExistente.perfil
        );

        await autenticacao.cadastrar();

        await expect(page).toHaveURL(/\/register/);

        await expect(
            page.getByText('Este e-mail já está cadastrado.')
        ).toBeVisible();
    });
    test('CTN-AUTH-027 - Cadastrar usuário com senha abaixo do mínimo', async ({ page }) => {
        const autenticacao = new AutenticacaoLoginPage(page);

        await autenticacao.acessarCadastro();

        await autenticacao.preencherCadastro(
            senhaAbaixoMinimo.nome,
            senhaAbaixoMinimo.email,
            senhaAbaixoMinimo.senha,
            senhaAbaixoMinimo.perfil
        );

        await autenticacao.cadastrar();

        await expect(page).toHaveURL(/\/register/);

        await expect(
            autenticacao.registerPassword
        ).toBeFocused();
    });
    test('CTN-AUTH-028 - Cadastrar usuário com senha exatamente com 6 caracteres', async ({ page }) => {
        const autenticacao = new AutenticacaoLoginPage(page);

        await autenticacao.acessarCadastro();

        await autenticacao.preencherCadastro(
            senhaMinimoPermitido.nome,
            senhaMinimoPermitido.email,
            senhaMinimoPermitido.senha,
            senhaMinimoPermitido.perfil
        );

        await autenticacao.cadastrar();

        await expect(page).toHaveURL(/\/login/);

        await expect(
            page.getByText('Cadastro realizado! Faça login para continuar.')
        ).toBeVisible();

        await expect(
            page.getByText('BEM-VINDO DE VOLTA')
        ).toBeVisible();
    });
    test('CTN-AUTH-036 - Realizar login com credenciais válidas', async ({ page }) => {
        const autenticacao = new AutenticacaoLoginPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            loginValido.email,
            loginValido.senha
        );

        await autenticacao.realizarLogin();

        await expect(page).toHaveURL(/\/dashboard/);

        await expect(
            page.getByText('MEU PAINEL', { exact: true })
        ).toBeVisible();
    });
    test('CTN-AUTH-040 - Realizar login com senha inválida', async ({ page }) => {
        const autenticacao = new AutenticacaoLoginPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            loginSenhaInvalida.email,
            loginSenhaInvalida.senha
        );

        await autenticacao.realizarLogin();

        await expect(page).toHaveURL(/\/login/);

        await expect(
            page.getByText('E-mail ou senha inválidos.')
        ).toBeVisible();
    });
    test('CTN-AUTH-041 - Realizar login com e-mail inexistente', async ({ page }) => {
        const autenticacao = new AutenticacaoLoginPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            loginEmailInexistente.email,
            loginEmailInexistente.senha
        );

        await autenticacao.realizarLogin();

        await expect(page).toHaveURL(/\/login/);

        await expect(
            page.getByText('E-mail ou senha inválidos.')
        ).toBeVisible();
    });
    test('CTN-AUTH-037 - Realizar login sem informar o e-mail', async ({ page }) => {
        const autenticacao = new AutenticacaoLoginPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            loginSemEmail.email,
            loginSemEmail.senha
        );

        await autenticacao.realizarLogin();

        await expect(page).toHaveURL(/\/login/);

        await expect(
            autenticacao.loginEmail
        ).toBeFocused();
    });
    test('CTN-AUTH-038 - Realizar login sem informar a senha', async ({ page }) => {
        const autenticacao = new AutenticacaoLoginPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            loginSemSenha.email,
            loginSemSenha.senha
        );

        await autenticacao.realizarLogin();

        await expect(page).toHaveURL(/\/login/);

        await expect(
            autenticacao.loginPassword
        ).toBeFocused();
    });

});