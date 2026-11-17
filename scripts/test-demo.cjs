const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const path = require('node:path');
const ts = require('typescript');

// Execute the actual reducer without a native renderer or a second test runner.
const filename = path.resolve(__dirname, '../src/state/demo.tsx');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const exportsObject = {};
vm.runInNewContext(compiled, { exports: exportsObject, require: createRequire(filename) }, { filename });
const { demoReducer: reduce, partyMinutes } = exportsObject;
const fresh = () => reduce(undefined, { type: 'reset' });

test('recharge restores energy, grants XP, and records movement', () => {
  const state = reduce(fresh(), { type: 'recharge', energy: 90, xp: 5, minutes: 1 });
  assert.equal(state.energy, 100);
  assert.equal(state.xp, 125);
  assert.equal(state.minutes, 1);
  assert.equal(state.mood, 'Refreshed');
});
test('a quest grants rewards exactly once, including repeated catch taps', () => {
  const action = { type: 'quest', id: 'hunt', xp: 60 };
  const earned = reduce(fresh(), action);
  assert.equal(earned.eggs, 1);
  assert.equal(earned.xp, 180);
  assert.equal(reduce(earned, action), earned);
});
test('claiming requires an egg and cannot unlock a pet twice', () => {
  const initial = fresh();
  assert.equal(reduce(initial, { type: 'claim' }), initial);
  const earned = reduce(initial, { type: 'quest', id: 'library', xp: 50 });
  const claimed = reduce(earned, { type: 'claim' });
  assert.equal(claimed.eggs, 0);
  assert.equal(claimed.unlocked.join(','), 'panda,fox');
  assert.equal(reduce(claimed, { type: 'claim' }), claimed);
  assert.equal(reduce(initial, { type: 'select', id: 'fox' }), initial);
});
test('party evolution requires a hatched pet and a completed shared goal', () => {
  let state = fresh();
  assert.equal(reduce(state, { type: 'evolve' }), state);
  state = reduce(state, { type: 'party', name: 'Night Owls', logo: '🌙', members: ['Ben', 'Sam'] });
  assert.equal(partyMinutes(state), 31);
  state = reduce(state, { type: 'hatchParty' });
  assert.equal(reduce(state, { type: 'evolve' }), state);
  state = reduce(state, { type: 'move', minutes: 59 });
  assert.equal(partyMinutes(state), 90);
  const evolved = reduce(state, { type: 'evolve' });
  assert.equal(evolved.evolved, true);
  assert.equal(evolved.xp, 220);
  assert.equal(reduce(evolved, { type: 'evolve' }), evolved);
  assert.equal(reduce(evolved, { type: 'leave' }).party, null);
});
test('activity and quest rerolls remain independent and reset clears progress', () => {
  let state = reduce(fresh(), { type: 'reroll', kind: 'quest', date: '2026-11-12' });
  assert.equal(state.questReroll, '2026-11-12');
  assert.equal(state.rechargeReroll, null);
  state = reduce(state, { type: 'reroll', kind: 'recharge', date: '2026-11-12' });
  assert.equal(state.rechargeReroll, '2026-11-12');
  assert.equal(reduce(state, { type: 'reset' }).questReroll, null);
});

test('a new party starts from zero: leaving and re-creating cannot farm evolve XP', () => {
  let state = reduce(fresh(), { type: 'move', minutes: 90 });
  const startXp = state.xp;
  for (let i = 0; i < 3; i++) {
    state = reduce(state, { type: 'party', name: 'A', logo: '🌙', members: [] });
    assert.equal(partyMinutes(state), 0);
    state = reduce(state, { type: 'hatchParty' });
    assert.equal(reduce(state, { type: 'evolve' }), state);
    state = reduce(state, { type: 'leave' });
  }
  assert.equal(state.xp, startXp);
});
test('partyMinutes counts friends added at runtime', () => {
  let state = reduce(fresh(), { type: 'addFriend', friend: { name: 'Zed', emoji: '🐹', minutes: 50, activity: 'Walking' } });
  state = reduce(state, { type: 'party', name: 'P', logo: '🌙', members: ['Zed'] });
  assert.equal(partyMinutes(state), 50);
});
test('minutes earned inside a party count toward it, minutes from before do not', () => {
  let state = reduce(fresh(), { type: 'move', minutes: 40 });
  state = reduce(state, { type: 'party', name: 'P', logo: '🌙', members: [] });
  state = reduce(state, { type: 'move', minutes: 25 });
  assert.equal(partyMinutes(state), 25);
});
test('eggs beyond the collection can be traded for XP instead of getting stuck', () => {
  let state = fresh();
  for (const id of ['a', 'b', 'c', 'd']) state = reduce(state, { type: 'quest', id, xp: 50 });
  state = reduce(state, { type: 'claim' });
  state = reduce(state, { type: 'claim' });
  assert.equal(state.eggs, 2);
  const xp = state.xp;
  const traded = reduce(state, { type: 'trade' });
  assert.equal(traded.eggs, 0);
  assert.equal(traded.xp, xp + 50);
  assert.equal(reduce(traded, { type: 'trade' }), traded);
});
test('trade is refused while there is still a pet to hatch', () => {
  const state = reduce(fresh(), { type: 'quest', id: 'a', xp: 50 });
  assert.equal(reduce(state, { type: 'trade' }), state);
});
test('ending a hunt derives mood from energy instead of forcing Happy', () => {
  const hiding = reduce(fresh(), { type: 'mood', mood: 'Hiding' });
  assert.equal(reduce(hiding, { type: 'endHunt' }).mood, 'Sleepy');
  const rested = reduce(hiding, { type: 'recharge', energy: 60, xp: 0, minutes: 0 });
  const hiding2 = reduce(rested, { type: 'mood', mood: 'Hiding' });
  assert.equal(reduce(hiding2, { type: 'endHunt' }).mood, 'Happy');
  const happy = reduce(fresh(), { type: 'mood', mood: 'Happy' });
  assert.equal(reduce(happy, { type: 'endHunt' }), happy);
});
test('showing a happy pet leaves it with enough energy to match', () => {
  assert.ok(reduce(fresh(), { type: 'mood', mood: 'Happy' }).energy >= 50);
});
test('rename ignores blank names and trims others', () => {
  assert.equal(reduce(fresh(), { type: 'rename', username: '   ' }).username, 'User');
  assert.equal(reduce(fresh(), { type: 'rename', username: '  Kai ' }).username, 'Kai');
});
test('addFriend rejects case-insensitive duplicates; members/select/goal behave', () => {
  const dup = reduce(fresh(), { type: 'addFriend', friend: { name: 'ben', emoji: 'x', minutes: 0, activity: 'Walking' } });
  assert.equal(dup.friends.length, 3);
  assert.equal(reduce(fresh(), { type: 'members', members: ['Ben'] }).party, null);
  assert.equal(reduce(fresh(), { type: 'goal', minutes: 120, activity: 'Stretching' }).goal, 120);
});

test('showing the hiding pet re-arms a completed hunt so "Find" is never a dead end', () => {
  let state = reduce(fresh(), { type: 'quest', id: 'hunt', xp: 60 });
  state = reduce(state, { type: 'quest', id: 'library', xp: 50 });
  assert.ok(state.completed.includes('hunt'));
  const hiding = reduce(state, { type: 'mood', mood: 'Hiding' });
  assert.equal(hiding.mood, 'Hiding');
  assert.ok(!hiding.completed.includes('hunt'), 'hunt can be played again');
  assert.ok(hiding.completed.includes('library'), 'other quests are untouched');
  assert.equal(hiding.xp, state.xp, 're-arming grants nothing');
  // and the rewards are still granted only once per play
  const again = reduce(hiding, { type: 'quest', id: 'hunt', xp: 60 });
  assert.equal(again.xp, state.xp + 60);
  assert.equal(reduce(again, { type: 'quest', id: 'hunt', xp: 60 }), again);
});
