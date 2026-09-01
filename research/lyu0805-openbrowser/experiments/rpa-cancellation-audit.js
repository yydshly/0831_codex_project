'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

function resolveBrowserapp() {
  const configured = process.env.OPENBROWSER_BROWSERAPP;
  const candidate = configured
    ? path.resolve(configured)
    : path.resolve(__dirname, '../../../sources/lyu0805-openbrowser/Browserapp');
  if (!fs.existsSync(path.join(candidate, 'automation', 'rpa-engine.js'))) {
    throw new Error(
      `OpenBrowser Browserapp source not found at ${candidate}. ` +
      'Set OPENBROWSER_BROWSERAPP to the upstream Browserapp directory.',
    );
  }
  return candidate;
}

function removeOwnedTemp(tempDirectory) {
  const tempRoot = path.resolve(os.tmpdir()) + path.sep;
  const target = path.resolve(tempDirectory);
  if (!target.startsWith(tempRoot) || !path.basename(target).startsWith('openbrowser-rpa-cancel-audit-')) {
    throw new Error(`Refusing to remove unexpected directory: ${target}`);
  }
  fs.rmSync(target, { recursive: true, force: true });
}

async function main() {
  const browserapp = resolveBrowserapp();
  const { RpaStore } = require(path.join(browserapp, 'automation', 'rpa-store.js'));
  const { RpaEngine } = require(path.join(browserapp, 'automation', 'rpa-engine.js'));
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'openbrowser-rpa-cancel-audit-'));

  try {
    const store = new RpaStore(path.join(tempDirectory, 'rpa-store.json'));
    const task = await store.createTask({
      id: 'cancel-during-final-step',
      profile_id: 'profile-a',
      process_name: 'Cancellation audit',
      steps: [{ type: 'wait', ms: 250 }],
    });
    const browserEngineStub = {
      running: new Map([['profile-a', { port: 9222 }]]),
    };
    const runner = new RpaEngine({
      engine: browserEngineStub,
      store,
      rpaLogPath: path.join(tempDirectory, 'rpa-diagnostic.log'),
    });

    let stopResult;
    const stopTimer = setTimeout(() => {
      runner.stop(task.id).then((result) => { stopResult = result; });
    }, 40);
    const runResult = await runner.runTask(task.id);
    clearTimeout(stopTimer);
    await new Promise((resolve) => setImmediate(resolve));

    const persisted = store.getTask(task.id);
    const reproduced = stopResult?.success === true
      && runResult?.success === true
      && persisted?.status === 'success';

    console.log(JSON.stringify({
      experiment: 'OpenBrowser cooperative cancellation during final long step',
      cancellationRequested: stopResult?.success === true,
      returnedSuccess: runResult?.success === true,
      persistedStatus: persisted?.status || null,
      upstreamBehaviorReproduced: reproduced,
      interpretation: reproduced
        ? 'Cancellation was requested during the final wait, but the task still reached success.'
        : 'Behavior changed; inspect cancellation and terminal-state handling.',
    }, null, 2));

    if (!reproduced) {
      throw new Error('Observed behavior changed. Re-audit RPA cancellation semantics and update the study.');
    }
  } finally {
    removeOwnedTemp(tempDirectory);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
