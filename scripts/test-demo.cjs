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
