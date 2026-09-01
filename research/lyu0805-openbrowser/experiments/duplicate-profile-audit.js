'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

function resolveBrowserapp() {
  const configured = process.env.OPENBROWSER_BROWSERAPP;
  const candidate = configured
    ? path.resolve(configured)
    : path.resolve(__dirname, '../../../sources/lyu0805-openbrowser/Browserapp');
  if (!fs.existsSync(path.join(candidate, 'engine.js'))) {
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
  if (!target.startsWith(tempRoot) || !path.basename(target).startsWith('openbrowser-duplicate-audit-')) {
    throw new Error(`Refusing to remove unexpected directory: ${target}`);
  }
  fs.rmSync(target, { recursive: true, force: true });
}

async function main() {
  const browserapp = resolveBrowserapp();
  const { BrowserEngine } = require(path.join(browserapp, 'engine.js'));
  const { LocalApiServer } = require(path.join(browserapp, 'automation', 'local-api-server.js'));
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'openbrowser-duplicate-audit-'));

  try {
    const app = {
      getPath(name) {
        if (name !== 'userData') throw new Error(`Unexpected app path request: ${name}`);
        return tempDirectory;
      },
    };
    const engine = new BrowserEngine(app, {
      profileDataRoot: path.join(tempDirectory, 'profiles'),
      preferIndependentKernel: false,
    });
    const source = engine.sanitizeProfile({
      id: 'source',
      number: 1,
      name: 'Sensitive source',
      networkMode: 'proxy',
      proxy: 'http://alice:proxy-secret@127.0.0.1:18080',
      cookies: JSON.stringify([
        { name: 'session', value: 'cookie-secret', domain: 'example.test', path: '/' },
      ]),
      exitIp: '203.0.113.10',
      exitCountryCode: 'US',
      exitTimezone: 'America/New_York',
      exitLatitude: 40.7,
      exitLongitude: -74.0,
      exitCheckedAt: '2026-08-31T00:00:00.000Z',
      platform: {
        type: 'other',
        startUrl: 'https://example.test/',
        username: 'alice',
        password: 'account-secret',
        totpSecret: 'TOTP-SECRET',
      },
      privacy: {
        fingerprint: { auditMarker: 'fingerprint-identity', cores: 4, memory: 8 },
        batterySnapshot: { charging: false, level: 0.5 },
        mediaLabels: { audioinput: 'Audit microphone' },
      },
    });
    engine.profiles.set(source.id, source);

    const api = new LocalApiServer({ engine, apiKey: 'audit-only' });
    const response = await api.route('POST', '/api/v2/browser-profile/duplicate', {
      source_profile_id: source.id,
      name: 'Duplicate',
    });
    if (response?.code !== 0 || !response?.data?.profile) {
      throw new Error(`Duplicate route failed: ${JSON.stringify(response)}`);
    }
    const duplicate = response.data.profile;

    const copiedSensitiveFields = [
      ['cookies', duplicate.cookies === source.cookies],
      ['authenticated proxy URL', duplicate.proxy === source.proxy],
      ['platform.username', duplicate.platform?.username === source.platform?.username],
      ['platform.password', duplicate.platform?.password === source.platform?.password],
      ['platform.totpSecret', duplicate.platform?.totpSecret === source.platform?.totpSecret],
      ['exitIp', duplicate.exitIp === source.exitIp],
      ['exitCountryCode', duplicate.exitCountryCode === source.exitCountryCode],
      ['exitTimezone', duplicate.exitTimezone === source.exitTimezone],
      ['exitLatitude', duplicate.exitLatitude === source.exitLatitude],
      ['exitLongitude', duplicate.exitLongitude === source.exitLongitude],
    ].filter(([, copied]) => copied).map(([field]) => field);

    const resetIdentityFields = {
      fingerprintAuditMarkerRemoved: duplicate.privacy?.fingerprint?.auditMarker === undefined,
      batterySnapshotCleared: duplicate.privacy?.batterySnapshot === null,
      mediaLabelsCleared: duplicate.privacy?.mediaLabels === null,
      exitCheckedAtCleared: duplicate.exitCheckedAt === '',
    };
    const expectedCopiedFields = [
      'cookies',
      'authenticated proxy URL',
      'platform.username',
      'platform.password',
      'platform.totpSecret',
      'exitIp',
      'exitCountryCode',
      'exitTimezone',
      'exitLatitude',
      'exitLongitude',
    ];
    const reproduced = expectedCopiedFields.every((field) => copiedSensitiveFields.includes(field))
      && Object.values(resetIdentityFields).every(Boolean);

    console.log(JSON.stringify({
      experiment: 'OpenBrowser duplicate Profile sensitive-state boundary',
      upstreamBehaviorReproduced: reproduced,
      copiedSensitiveFields,
      resetIdentityFields,
      note: 'Field names only are printed; fixture secret values are intentionally omitted.',
    }, null, 2));

    if (!reproduced) {
      throw new Error('Observed behavior changed. Re-audit the upstream duplicate contract and update the study.');
    }
  } finally {
    removeOwnedTemp(tempDirectory);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
