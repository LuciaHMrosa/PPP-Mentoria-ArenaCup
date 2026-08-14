class TorneiosPage {
    constructor(page) {
        this.page = page;

        // Dashboard
        this.createTournamentButton =
            page.getByTestId('create-tournament');

        // Formulário de torneio
        this.tournamentName =
            page.getByTestId('tournament-name');

        this.tournamentModality =
            page.getByTestId('tournament-modality');

        this.startDate =
            page.locator('input[name="startDate"]');

        this.endDate =
            page.locator('input[name="endDate"]');

        this.maxTeams =
            page.locator('input[name="maxTeams"]');

        this.location =
            page.locator('input[name="location"]');

        this.tournamentSubmit =
            page.getByTestId('tournament-submit');

        // Detalhes do torneio
        this.editButton =
            page.getByRole('link', { name: 'Editar' });

        this.closeButton =
            page.getByRole('button', { name: 'Encerrar' });
    }

    async acessarDashboard() {
        await this.page.goto('/dashboard');
    }

    async acessarCriacao() {
        await this.page.goto('/tournaments/new');
    }

    async preencherTorneio(
        nome,
        modalidade,
        dataInicio,
        dataFim,
        maxEquipes,
        local
    ) {
        await this.tournamentName.fill(nome);

        if (modalidade !== null && modalidade !== undefined) {
            await this.tournamentModality.selectOption({
                label: modalidade
            });
        }

        await this.startDate.fill(dataInicio);
        await this.endDate.fill(dataFim);
        await this.maxTeams.fill(String(maxEquipes));
        await this.location.fill(local);
    }

    async criarTorneio() {
        await this.tournamentSubmit.click();
    }

    async acessarTorneio(nome) {
        const card = this.page
            .locator('.card')
            .filter({
                has: this.page.getByRole('heading', {
                    name: nome,
                    exact: true
                })
            })
            .last();

        await card.waitFor({ state: 'visible' });

        const link = card.getByRole('link', {
            name: `Abrir ${nome}`
        });

        const href = await link.getAttribute('href');

        if (!href) {
            throw new Error(
                `Não foi encontrado href para o torneio "${nome}".`
            );
        }

        await this.page.goto(href);
    }

    async acessarEdicao() {
        await this.editButton.click();
    }

    async preencherEdicao(
        nome,
        modalidade,
        dataInicio,
        dataFim,
        maxEquipes,
        local
    ) {
        await this.preencherTorneio(
            nome,
            modalidade,
            dataInicio,
            dataFim,
            maxEquipes,
            local
        );
    }

    async salvarEdicao() {
        await this.tournamentSubmit.click();
    }

    async encerrarTorneio() {
        await this.closeButton.click();
    }
}

module.exports = {
    TorneiosPage
};