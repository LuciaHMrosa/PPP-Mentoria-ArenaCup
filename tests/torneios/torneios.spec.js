const { test, expect } = require('@playwright/test');

const {
    AutenticacaoLoginPage
} = require('../autenticacao-login/pages/autenticacao-login.page');

const {
    TorneiosPage
} = require('./pages/torneios.page');

const {
    organizadorValido,
    participanteValido
} = require('../autenticacao-login/data/autenticacao.data');

const {
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
} = require('./data/torneios.data');


test.describe('Torneios - Criar Torneio', () => {

    test('CTN-TOUR-001 - Criar torneio com todos os dados válidos', async ({ page }) => {

        const autenticacao = new AutenticacaoLoginPage(page);
        const torneios = new TorneiosPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            organizadorValido.email,
            organizadorValido.senha
        );

        await autenticacao.realizarLogin();

        await torneios.acessarCriacao();

        await torneios.preencherTorneio(
            torneioValido.nome,
            torneioValido.modalidade,
            torneioValido.dataInicio,
            torneioValido.dataFim,
            torneioValido.maxEquipes,
            torneioValido.local
        );

        await torneios.criarTorneio();

        await expect(page).toHaveURL(/\/dashboard/);

        await expect(
            page.getByText('Torneio criado com sucesso!')
        ).toBeVisible();

        await expect(
            page.getByRole('heading', {
                name: torneioValido.nome,
                exact: true
            }).last()
        ).toBeVisible();
    });


    test('CTN-TOUR-003 - Criar torneio sem selecionar modalidade', async ({ page }) => {

        const autenticacao = new AutenticacaoLoginPage(page);
        const torneios = new TorneiosPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            organizadorValido.email,
            organizadorValido.senha
        );

        await autenticacao.realizarLogin();

        await torneios.acessarCriacao();

        await torneios.preencherTorneio(
            torneioSemModalidade.nome,
            null,
            torneioSemModalidade.dataInicio,
            torneioSemModalidade.dataFim,
            torneioSemModalidade.maxEquipes,
            torneioSemModalidade.local
        );

        await torneios.criarTorneio();

        await expect(page).toHaveURL(/\/tournaments\/new/);

        await expect(
            torneios.tournamentModality
        ).toBeVisible();
    });


    test('CTN-TOUR-025 - Data final anterior à data inicial', async ({ page }) => {

        const autenticacao = new AutenticacaoLoginPage(page);
        const torneios = new TorneiosPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            organizadorValido.email,
            organizadorValido.senha
        );

        await autenticacao.realizarLogin();

        await torneios.acessarCriacao();

        await torneios.preencherTorneio(
            torneioDataFinalAnterior.nome,
            torneioDataFinalAnterior.modalidade,
            torneioDataFinalAnterior.dataInicio,
            torneioDataFinalAnterior.dataFim,
            torneioDataFinalAnterior.maxEquipes,
            torneioDataFinalAnterior.local
        );

        await torneios.criarTorneio();

        await expect(page).toHaveURL(/\/tournaments\/new/);
    });


    test('CTN-TOUR-026 - Data final igual à data inicial', async ({ page }) => {

        const autenticacao = new AutenticacaoLoginPage(page);
        const torneios = new TorneiosPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            organizadorValido.email,
            organizadorValido.senha
        );

        await autenticacao.realizarLogin();

        await torneios.acessarCriacao();

        await torneios.preencherTorneio(
            torneioDatasIguais.nome,
            torneioDatasIguais.modalidade,
            torneioDatasIguais.dataInicio,
            torneioDatasIguais.dataFim,
            torneioDatasIguais.maxEquipes,
            torneioDatasIguais.local
        );

        await torneios.criarTorneio();

        await expect(page).toHaveURL(/\/dashboard/);

        await expect(
            page.getByText('Torneio criado com sucesso!')
        ).toBeVisible();
    });


    test('CTN-TOUR-029 - Número máximo de equipes igual a 0', async ({ page }) => {

        const autenticacao = new AutenticacaoLoginPage(page);
        const torneios = new TorneiosPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            organizadorValido.email,
            organizadorValido.senha
        );

        await autenticacao.realizarLogin();

        await torneios.acessarCriacao();

        await torneios.preencherTorneio(
            torneioMaxEquipesZero.nome,
            torneioMaxEquipesZero.modalidade,
            torneioMaxEquipesZero.dataInicio,
            torneioMaxEquipesZero.dataFim,
            torneioMaxEquipesZero.maxEquipes,
            torneioMaxEquipesZero.local
        );

        await expect(torneios.maxTeams).toHaveValue('0');

        const valido = await torneios.maxTeams.evaluate(
            element => element.checkValidity()
        );

        expect(valido).toBe(false);
    });


    test('CTN-TOUR-030 - Número máximo de equipes igual a 1', async ({ page }) => {

        const autenticacao = new AutenticacaoLoginPage(page);
        const torneios = new TorneiosPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            organizadorValido.email,
            organizadorValido.senha
        );

        await autenticacao.realizarLogin();

        await torneios.acessarCriacao();

        await torneios.preencherTorneio(
            torneioMaxEquipesUm.nome,
            torneioMaxEquipesUm.modalidade,
            torneioMaxEquipesUm.dataInicio,
            torneioMaxEquipesUm.dataFim,
            torneioMaxEquipesUm.maxEquipes,
            torneioMaxEquipesUm.local
        );

        await expect(torneios.maxTeams).toHaveValue('1');

        const valido = await torneios.maxTeams.evaluate(
            element => element.checkValidity()
        );

        expect(valido).toBe(true);

        await torneios.criarTorneio();

        await expect(page).toHaveURL(/\/dashboard/);

        await expect(
            page.getByText('Torneio criado com sucesso!')
        ).toBeVisible();
    });


    test('CTN-TOUR-033 - Número negativo de equipes', async ({ page }) => {

        const autenticacao = new AutenticacaoLoginPage(page);
        const torneios = new TorneiosPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            organizadorValido.email,
            organizadorValido.senha
        );

        await autenticacao.realizarLogin();

        await torneios.acessarCriacao();

        await torneios.preencherTorneio(
            torneioMaxEquipesNegativo.nome,
            torneioMaxEquipesNegativo.modalidade,
            torneioMaxEquipesNegativo.dataInicio,
            torneioMaxEquipesNegativo.dataFim,
            torneioMaxEquipesNegativo.maxEquipes,
            torneioMaxEquipesNegativo.local
        );

        const valido = await torneios.maxTeams.evaluate(
            element => element.checkValidity()
        );

        expect(valido).toBe(false);
    });

});


test.describe('Torneios - Permissões', () => {

    test('CTN-TOUR-046 - Organizador acessa criação de torneio', async ({ page }) => {

        const autenticacao = new AutenticacaoLoginPage(page);
        const torneios = new TorneiosPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            organizadorValido.email,
            organizadorValido.senha
        );

        await autenticacao.realizarLogin();

        await torneios.acessarCriacao();

        await expect(page).toHaveURL(/\/tournaments\/new/);

        await expect(
            page.getByRole('heading', {
                name: 'Criar torneio'
            })
        ).toBeVisible();

        await expect(
            torneios.tournamentName
        ).toBeVisible();

        await expect(
            torneios.tournamentSubmit
        ).toBeVisible();
    });


    test('CTN-TOUR-047 - Participante tenta acessar criação de torneio', async ({ page }) => {

        const autenticacao = new AutenticacaoLoginPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            participanteValido.email,
            participanteValido.senha
        );

        await autenticacao.realizarLogin();

        await page.goto('/tournaments/new');

        await expect(page).not.toHaveURL(/\/tournaments\/new/);
    });

});


test.describe('Torneios - Editar', () => {
    test(
        'CTN-TOUR-049 - Editar torneio antes do início',
        async ({ page }) => {

            const autenticacao = new AutenticacaoLoginPage(page);
            const torneios = new TorneiosPage(page);

            await autenticacao.acessarLogin();

            await autenticacao.preencherLogin(
                organizadorValido.email,
                organizadorValido.senha
            );

            await autenticacao.realizarLogin();

            await torneios.acessarCriacao();

            // Criação do torneio que será editado
            await torneios.preencherTorneio(
                torneioParaEdicao.nome,
                torneioParaEdicao.modalidade,
                torneioParaEdicao.dataInicio,
                torneioParaEdicao.dataFim,
                torneioParaEdicao.maxEquipes,
                torneioParaEdicao.local
            );

            await torneios.criarTorneio();

            await expect(page).toHaveURL(/\/dashboard/);

            // Acessa o torneio criado
            await torneios.acessarTorneio(
                torneioParaEdicao.nome
            );

            await expect(
                page.getByRole('heading', {
                    name: torneioParaEdicao.nome,
                    exact: true
                })
            ).toBeVisible();

            // Acessa a edição
            await torneios.acessarEdicao();

            await expect(page).toHaveURL(
                /\/tournaments\/\d+\/edit/
            );

            // Dados que serão utilizados na edição
            const torneioEditado = {
                nome: 'Torneio Editado ArenaCup',
                modalidade: 'Futebol',
                dataInicio: '2026-08-21',
                dataFim: '2026-08-31',
                maxEquipes: 20,
                local: 'Estádio Municipal'
            };

            await torneios.preencherEdicao(
                torneioEditado.nome,
                torneioEditado.modalidade,
                torneioEditado.dataInicio,
                torneioEditado.dataFim,
                torneioEditado.maxEquipes,
                torneioEditado.local
            );

            await torneios.salvarEdicao();

            // Após salvar, permanece nos detalhes do torneio
            await expect(page).toHaveURL(
                /\/tournaments\/\d+/
            );

            // Valida a alteração
            await expect(
                page.getByRole('heading', {
                    name: torneioEditado.nome,
                    exact: true
                })
            ).toBeVisible();
        }
    );

    test(
        'CTN-TOUR-056 - Tentar editar torneio após o início',
        async ({ page }) => {

            const autenticacao = new AutenticacaoLoginPage(page);
            const torneios = new TorneiosPage(page);

            await autenticacao.acessarLogin();

            await autenticacao.preencherLogin(
                organizadorValido.email,
                organizadorValido.senha
            );

            await autenticacao.realizarLogin();

            await torneios.acessarCriacao();

            await torneios.preencherTorneio(
                torneioIniciado.nome,
                torneioIniciado.modalidade,
                torneioIniciado.dataInicio,
                torneioIniciado.dataFim,
                torneioIniciado.maxEquipes,
                torneioIniciado.local
            );

            await torneios.criarTorneio();

            await expect(page).toHaveURL(/\/dashboard/);

            await torneios.acessarTorneio(
                torneioIniciado.nome
            );

            // O botão Editar está disponível para o torneio já iniciado.
            await expect(
                page.getByRole('link', {
                    name: 'Editar'
                })
            ).toBeVisible();
        }
    );

});


test.describe('Torneios - Encerrar', () => {

    test('CTN-TOUR-057 - Organizador encerra torneio existente', async ({ page }) => {

        const autenticacao = new AutenticacaoLoginPage(page);
        const torneios = new TorneiosPage(page);

        await autenticacao.acessarLogin();

        await autenticacao.preencherLogin(
            organizadorValido.email,
            organizadorValido.senha
        );

        await autenticacao.realizarLogin();

        await torneios.acessarCriacao();

        await torneios.preencherTorneio(
            torneioParaEncerrar.nome,
            torneioParaEncerrar.modalidade,
            torneioParaEncerrar.dataInicio,
            torneioParaEncerrar.dataFim,
            torneioParaEncerrar.maxEquipes,
            torneioParaEncerrar.local
        );

        await torneios.criarTorneio();

        await expect(page).toHaveURL(/\/dashboard/);

        await torneios.acessarTorneio(
            torneioParaEncerrar.nome
        );

        await expect(
            page.getByRole('button', {
                name: 'Encerrar'
            })
        ).toBeVisible();

        await torneios.encerrarTorneio();

        await expect(
            page.getByText('Encerrado', { exact: true })
        ).toBeVisible();
    });

    test(
        'CTN-TOUR-059 - Tentar encerrar torneio já encerrado',
        async ({ page }) => {

            const autenticacao = new AutenticacaoLoginPage(page);
            const torneios = new TorneiosPage(page);

            await autenticacao.acessarLogin();

            await autenticacao.preencherLogin(
                organizadorValido.email,
                organizadorValido.senha
            );

            await autenticacao.realizarLogin();

            await torneios.acessarCriacao();

            await torneios.preencherTorneio(
                'Torneio Já Encerrado',
                'Futebol',
                '2026-09-20',
                '2026-09-30',
                16,
                'Ginásio Municipal'
            );

            await torneios.criarTorneio();

            await expect(page).toHaveURL(/\/dashboard/);

            await torneios.acessarTorneio(
                'Torneio Já Encerrado'
            );

            // Primeiro encerramento
            await expect(
                page.getByRole('button', {
                    name: 'Encerrar'
                })
            ).toBeVisible();

            await torneios.encerrarTorneio();

            await expect(
                page.getByText('Encerrado', {
                    exact: true
                })
            ).toBeVisible();

            // BUG-TOUR-059
            // O teste tenta encerrar novamente um torneio que já está encerrado.
            await page.reload();

            await expect(
                page.getByRole('button', {
                    name: 'Encerrar'
                })
            ).toBeVisible();

            await torneios.encerrarTorneio();

            // Se chegar até aqui, o bug foi reproduzido:
            // a aplicação permitiu o segundo encerramento.
            await expect(
                page.getByText('Torneio encerrado com sucesso!')
            ).toBeVisible();
        }
    );

});