const store = { users: [], teams: [], tournaments: [], registrations: [], matches: [], counters: { user: 1, team: 1, tournament: 1, registration: 1, match: 1 }, nextId(type) { return this.counters[type]++; } };
module.exports = store;
