const express = require('express');
const session = require('express-session');
const path = require('path');
const { requireAuth, requireRole } = require('./middleware/auth');
const store = require('./data/store');
const tournamentService = require('./services/tournamentService');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SESSION_SECRET || 'arenacup-dev-secret', resave: false, saveUninitialized: false }));
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  res.locals.today = new Date().toISOString().slice(0, 10);
  res.locals.status = tournamentService.status;
  next();
});
const flash = (req, type, text) => { req.session.flash = { type, text }; };

app.get('/', (req, res) => res.render('home', { title: 'ArenaCup', tournaments: store.tournaments }));
app.get('/login', (req, res) => res.render('auth/login', { title: 'Entrar' }));
app.post('/login', (req, res) => {
  const user = store.users.find((u) => u.email === String(req.body.email || '').trim().toLowerCase() && u.password === req.body.password);
  if (!user) { flash(req, 'danger', 'E-mail ou senha inválidos.'); return res.redirect('/login'); }
  req.session.user = { id: user.id, name: user.name, role: user.role };
  res.redirect('/dashboard');
});
app.get('/register', (req, res) => res.render('auth/register', { title: 'Cadastrar' }));
app.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name?.trim() || !email?.trim() || !password || !role) { flash(req, 'danger', 'Preencha todos os campos obrigatórios.'); return res.redirect('/register'); }
  if (!['organizer', 'participant'].includes(role)) { flash(req, 'danger', 'Perfil inválido.'); return res.redirect('/register'); }
  if (password.length < 6) { flash(req, 'danger', 'A senha deve possuir ao menos 6 caracteres.'); return res.redirect('/register'); }
  if (store.users.some((u) => u.email === email.trim().toLowerCase())) { flash(req, 'danger', 'Este e-mail já está cadastrado.'); return res.redirect('/register'); }
  store.users.push({ id: store.nextId('user'), name: name.trim(), email: email.trim().toLowerCase(), password, role });
  flash(req, 'success', 'Cadastro realizado! Faça login para continuar.'); res.redirect('/login');
});
app.post('/logout', requireAuth, (req, res) => req.session.destroy(() => res.redirect('/')));

app.get('/dashboard', requireAuth, (req, res) => {
  const user = req.session.user;
  if (user.role === 'organizer') {
    const owned = store.tournaments.filter((t) => t.organizerId === user.id);
    const ids = owned.map((t) => t.id);
    return res.render('dashboard/organizer', { title: 'Painel do Organizador', tournaments: owned, pending: store.registrations.filter((r) => ids.includes(r.tournamentId) && r.status === 'pending'), matches: store.matches.filter((m) => ids.includes(m.tournamentId)) });
  }
  const teams = store.teams.filter((t) => t.ownerId === user.id);
  const teamIds = teams.map((t) => t.id);
  return res.render('dashboard/participant', { title: 'Meu painel', teams, registrations: store.registrations.filter((r) => teamIds.includes(r.teamId)), tournaments: store.tournaments.filter((t) => tournamentService.status(t) === 'Planejado') });
});

app.get('/tournaments', (req, res) => res.render('tournaments/list', { title: 'Torneios', tournaments: store.tournaments }));
app.get('/tournaments/new', requireRole('organizer'), (req, res) => res.render('tournaments/form', { title: 'Criar torneio', tournament: null }));
app.post('/tournaments', requireRole('organizer'), (req, res) => {
  const result = tournamentService.validateTournament(req.body);
  if (result.error) { flash(req, 'danger', result.error); return res.redirect('/tournaments/new'); }
  store.tournaments.push({ id: store.nextId('tournament'), organizerId: req.session.user.id, ...result.data, closed: false });
  flash(req, 'success', 'Torneio criado com sucesso!'); res.redirect('/dashboard');
});
app.get('/tournaments/:id/edit', requireRole('organizer'), (req, res) => {
  const tournament = store.tournaments.find((t) => t.id === Number(req.params.id) && t.organizerId === req.session.user.id);
  if (!tournament) return res.status(404).render('error', { title: 'Não encontrado', message: 'Torneio não encontrado.' });
  if (tournamentService.status(tournament) !== 'Planejado') { flash(req, 'warning', 'Torneios iniciados não podem ser alterados.'); return res.redirect(`/tournaments/${tournament.id}`); }
  res.render('tournaments/form', { title: 'Editar torneio', tournament });
});
app.post('/tournaments/:id/edit', requireRole('organizer'), (req, res) => {
  const tournament = store.tournaments.find((t) => t.id === Number(req.params.id) && t.organizerId === req.session.user.id);
  const result = tournament && tournamentService.validateTournament(req.body);
  if (!tournament) return res.status(404).render('error', { title: 'Não encontrado', message: 'Torneio não encontrado.' });
  if (tournamentService.status(tournament) !== 'Planejado' || result.error) { flash(req, 'danger', result.error || 'Torneio iniciado não pode ser alterado.'); return res.redirect(`/tournaments/${tournament.id}/edit`); }
  Object.assign(tournament, result.data); flash(req, 'success', 'Torneio atualizado.'); res.redirect(`/tournaments/${tournament.id}`);
});
app.post('/tournaments/:id/close', requireRole('organizer'), (req, res) => {
  const t = store.tournaments.find((x) => x.id === Number(req.params.id) && x.organizerId === req.session.user.id);
  if (!t) return res.status(404).render('error', { title: 'Não encontrado', message: 'Torneio não encontrado.' });
  t.closed = true; flash(req, 'success', 'Torneio encerrado.'); res.redirect(`/tournaments/${t.id}`);
});
app.get('/tournaments/:id', (req, res) => {
  const tournament = store.tournaments.find((t) => t.id === Number(req.params.id));
  if (!tournament) return res.status(404).render('error', { title: 'Não encontrado', message: 'Torneio não encontrado.' });
  const registrations = store.registrations.filter((r) => r.tournamentId === tournament.id).map((r) => ({ ...r, team: store.teams.find((t) => t.id === r.teamId) }));
  const matches = store.matches.filter((m) => m.tournamentId === tournament.id).map((m) => ({ ...m, teamA: store.teams.find((t) => t.id === m.teamAId), teamB: store.teams.find((t) => t.id === m.teamBId) }));
  const ownTeams = req.session.user?.role === 'participant' ? store.teams.filter((t) => t.ownerId === req.session.user.id) : [];
  res.render('tournaments/detail', { title: tournament.name, tournament, registrations, matches, ownTeams, standings: tournamentService.standings(tournament.id, store) });
});

app.get('/teams', requireRole('participant'), (req, res) => res.render('teams/list', { title: 'Minhas equipes', teams: store.teams.filter((t) => t.ownerId === req.session.user.id) }));
app.get('/teams/new', requireRole('participant'), (req, res) => res.render('teams/form', { title: 'Criar equipe', team: null }));
app.post('/teams', requireRole('participant'), (req, res) => {
  const { name, captain, players } = req.body; const count = Number(players);
  if (!name?.trim() || !captain?.trim() || !Number.isInteger(count) || count < 1) { flash(req, 'danger', 'Informe nome, capitão e uma quantidade válida de jogadores.'); return res.redirect('/teams/new'); }
  if (store.teams.some((t) => t.name.toLowerCase() === name.trim().toLowerCase())) { flash(req, 'danger', 'Já existe uma equipe com este nome.'); return res.redirect('/teams/new'); }
  store.teams.push({ id: store.nextId('team'), ownerId: req.session.user.id, name: name.trim(), captain: captain.trim(), players: count }); flash(req, 'success', 'Equipe criada com sucesso!'); res.redirect('/teams');
});
app.get('/teams/:id/edit', requireRole('participant'), (req, res) => { const team = store.teams.find((t) => t.id === Number(req.params.id) && t.ownerId === req.session.user.id); if (!team) return res.status(404).render('error', { title: 'Não encontrado', message: 'Equipe não encontrada.' }); res.render('teams/form', { title: 'Editar equipe', team }); });
app.post('/teams/:id/edit', requireRole('participant'), (req, res) => { const team = store.teams.find((t) => t.id === Number(req.params.id) && t.ownerId === req.session.user.id); const count = Number(req.body.players); if (!team) return res.status(404).render('error', { title: 'Não encontrado', message: 'Equipe não encontrada.' }); if (!req.body.name?.trim() || !req.body.captain?.trim() || !Number.isInteger(count) || count < 1 || store.teams.some((t) => t.id !== team.id && t.name.toLowerCase() === req.body.name.trim().toLowerCase())) { flash(req, 'danger', 'Dados inválidos ou nome de equipe duplicado.'); return res.redirect(`/teams/${team.id}/edit`); } Object.assign(team, { name: req.body.name.trim(), captain: req.body.captain.trim(), players: count }); flash(req, 'success', 'Equipe atualizada.'); res.redirect('/teams'); });
app.post('/teams/:id/delete', requireRole('participant'), (req, res) => { const idx = store.teams.findIndex((t) => t.id === Number(req.params.id) && t.ownerId === req.session.user.id); if (idx < 0) return res.status(404).render('error', { title: 'Não encontrado', message: 'Equipe não encontrada.' }); if (store.registrations.some((r) => r.teamId === store.teams[idx].id)) { flash(req, 'warning', 'Não é possível excluir uma equipe com inscrições.'); } else { store.teams.splice(idx, 1); flash(req, 'success', 'Equipe excluída.'); } res.redirect('/teams'); });

app.post('/tournaments/:id/register', requireRole('participant'), (req, res) => { const tournament = store.tournaments.find((t) => t.id === Number(req.params.id)); const team = store.teams.find((t) => t.id === Number(req.body.teamId) && t.ownerId === req.session.user.id); const result = tournamentService.canRegister(tournament, team, store); if (result) { flash(req, 'danger', result); return res.redirect(`/tournaments/${req.params.id}`); } store.registrations.push({ id: store.nextId('registration'), tournamentId: tournament.id, teamId: team.id, status: 'pending' }); flash(req, 'success', 'Inscrição solicitada e aguardando aprovação.'); res.redirect(`/tournaments/${tournament.id}`); });
app.post('/registrations/:id/:action', requireRole('organizer'), (req, res) => { const r = store.registrations.find((x) => x.id === Number(req.params.id)); const tournament = r && store.tournaments.find((t) => t.id === r.tournamentId && t.organizerId === req.session.user.id); if (!r || !tournament || !['approve','reject'].includes(req.params.action)) return res.status(403).render('error', { title: 'Sem permissão', message: 'Operação não permitida.' }); if (r.status !== 'pending') { flash(req, 'warning', 'Esta inscrição já foi analisada.'); } else if (req.params.action === 'approve' && store.registrations.filter((x) => x.tournamentId === tournament.id && x.status === 'approved').length >= tournament.maxTeams) { flash(req, 'danger', 'O torneio já atingiu o limite de equipes.'); } else { r.status = req.params.action === 'approve' ? 'approved' : 'rejected'; flash(req, 'success', `Inscrição ${r.status === 'approved' ? 'aprovada' : 'recusada'}.`); } res.redirect(`/tournaments/${tournament.id}`); });
app.post('/tournaments/:id/matches', requireRole('organizer'), (req, res) => { const t = store.tournaments.find((x) => x.id === Number(req.params.id) && x.organizerId === req.session.user.id); if (!t) return res.status(404).render('error', { title: 'Não encontrado', message: 'Torneio não encontrado.' }); const result = tournamentService.generateMatches(t, store); flash(req, result.error ? 'danger' : 'success', result.error || `${result.count} partidas geradas.`); res.redirect(`/tournaments/${t.id}`); });
app.post('/matches/:id/result', requireRole('organizer'), (req, res) => { const m = store.matches.find((x) => x.id === Number(req.params.id)); const t = m && store.tournaments.find((x) => x.id === m.tournamentId && x.organizerId === req.session.user.id); const a = Number(req.body.scoreA), b = Number(req.body.scoreB); if (!m || !t) return res.status(403).render('error', { title: 'Sem permissão', message: 'Operação não permitida.' }); if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) { flash(req, 'danger', 'Informe placares numéricos e não negativos.'); } else { m.scoreA = a; m.scoreB = b; flash(req, 'success', 'Resultado registrado e classificação atualizada.'); } res.redirect(`/tournaments/${t.id}`); });
app.use((req, res) => res.status(404).render('error', { title: 'Página não encontrada', message: 'A página solicitada não existe.' }));
app.listen(process.env.PORT || 3000, () => console.log(`ArenaCup em http://localhost:${process.env.PORT || 3000}`));
