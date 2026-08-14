class AutenticacaoLoginPage {
    constructor(page) {
        this.page = page;

        // Login
        this.loginEmail = page.getByTestId('login-email');
        this.loginPassword = page.getByTestId('login-password');
        this.loginSubmit = page.getByTestId('login-submit');

        // Cadastro
        this.registerName = page.locator('input[name="name"]');
        this.registerEmail = page.locator('input[name="email"]');
        this.registerPassword = page.locator('input[name="password"]');
        this.registerRole = page.locator('select[name="role"]');
        this.registerSubmit = page.getByRole('button', { name: 'Cadastrar' });
    }
    async acessarLogin() {
        await this.page.goto('/login');
    }

    async acessarCadastro() {
        await this.page.goto('/register');
    }

    async preencherCadastro(nome, email, senha, perfil) {
        await this.registerName.fill(nome);
        await this.registerEmail.fill(email);
        await this.registerPassword.fill(senha);
        await this.registerRole.selectOption({ value: perfil });
    }

    async cadastrar() {
        await this.registerSubmit.click();
    }

    async preencherLogin(email, senha) {
        await this.loginEmail.fill(email);
        await this.loginPassword.fill(senha);
    }

    async realizarLogin() {
        await this.loginSubmit.click();
    }
}

module.exports = { AutenticacaoLoginPage };