import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nextVersion, prepare } from './prepare-release.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const files = ['pkg/version/version.go', 'main.go', 'docs/docs.go', 'docs/swagger.yaml', 'docs/swagger.json', 'web/package.json'];
function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), 'release-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  for (const file of files) {
    mkdirSync(dirname(join(dir, file)), { recursive: true });
    copyFileSync(join(root, file), join(dir, file));
  }
  return dir;
}

test('all increment choices and initial release', () => {
  const expected = ['1.2.4', '1.3.0', '2.0.0', '1.2.4-beta.0', '1.3.0-beta.0', '2.0.0-beta.0', '1.2.4-beta.0'];
  ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'].forEach((increment, i) => {
    assert.equal(nextVersion(increment, 'beta', ['v1.2.3', 'unrelated']), `v${expected[i]}`);
  });
  assert.equal(nextVersion('prerelease'), 'v0.0.1-beta.0');
});

test('numeric ordering, prerelease continuation and channel changes', () => {
  const tags = ['v1.9.0', 'v1.10.0', 'v1.11.0-beta.9', 'v1.11.0-beta.10'];
  assert.equal(nextVersion('prerelease', 'beta', tags), 'v1.11.0-beta.11');
  assert.equal(nextVersion('prerelease', 'rc', tags), 'v1.11.0-rc.0');
  assert.equal(nextVersion('minor', 'beta', tags), 'v1.11.0');
  assert.equal(nextVersion('prerelease', 'beta', [...tags, 'v1.11.0']), 'v1.11.1-beta.0');
  assert.equal(nextVersion('preminor', 'beta', tags), 'v1.11.0-beta.11');
  assert.throws(() => nextVersion('invalid'));
  assert.throws(() => nextVersion('patch', 'invalid'));
});

for (const version of ['1.2.3', '1.2.3-rc.1']) {
  test(`synchronizes all version locations: ${version}`, t => {
    const dir = fixture(t);
    prepare(`v${version}`, dir);
    const read = file => readFileSync(join(dir, file), 'utf8');
    assert.ok(read(files[0]).includes(`const Version = "${version}"`));
    assert.equal(read('main.go').match(/^\/\/ @version\s+(\S+)$/m)[1], version);
    assert.equal(read('docs/docs.go').match(/Version:\s*"([^"]+)"/)[1], version);
    assert.ok(read('docs/swagger.yaml').includes(`  version: "${version}"`));
    assert.equal(JSON.parse(read('docs/swagger.json')).info.version, version);
    assert.equal(JSON.parse(read('web/package.json')).version, version);
  });
}

test('malformed source fails before modifying any version file', t => {
  const dir = fixture(t);
  writeFileSync(join(dir, 'docs/swagger.yaml'), 'info: {}\n');
  const before = files.map(file => readFileSync(join(dir, file), 'utf8'));
  assert.throws(() => prepare('v1.2.3', dir), /exactly one version/);
  assert.deepEqual(files.map(file => readFileSync(join(dir, file), 'utf8')), before);
});
