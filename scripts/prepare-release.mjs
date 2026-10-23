#!/usr/bin/env node
// Release tags are the source of truth; no frontend dependency installation is needed.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const pattern = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(alpha|beta|rc)\.(0|[1-9]\d*))?$/;
const increments = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];
const preids = ['alpha', 'beta', 'rc'];
const parse = tag => {
  const match = pattern.exec(tag);
  return match && { core: match.slice(1, 4).map(Number), preid: match[4], number: Number(match[5]) };
};
const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

export function nextVersion(increment, preid = 'beta', tags = []) {
  if (!increments.includes(increment)) throw new Error('Unsupported version increment');
  if (!preids.includes(preid)) throw new Error('Unsupported prerelease identifier');
  const versions = tags.map(parse).filter(Boolean);
  const stable = versions.filter(v => !v.preid).map(v => v.core).sort(compare).at(-1) ?? [0, 0, 0];
  let core = [...stable];
  if (increment === 'prerelease') {
    core = versions.filter(v => v.preid && compare(v.core, stable) > 0)
      .map(v => v.core).sort(compare).at(-1) ?? [stable[0], stable[1], stable[2] + 1];
  } else if (increment.endsWith('major')) core = [stable[0] + 1, 0, 0];
  else if (increment.endsWith('minor')) core = [stable[0], stable[1] + 1, 0];
  else core[2]++;
  let version = core.join('.');
  if (increment.startsWith('pre')) {
    const numbers = versions.filter(v => v.preid === preid && compare(v.core, core) === 0).map(v => v.number);
    version += `-${preid}.${Math.max(-1, ...numbers) + 1}`;
  }
  const tag = `v${version}`;
  if (tags.includes(tag) || tags.includes(version)) throw new Error(`Tag ${tag} already exists`);
  return tag;
}

export function prepare(tag, root = '.') {
  if (!parse(tag)) throw new Error('Invalid release tag');
  const version = tag.replace(/^v/, '');
  const changes = new Map();
  const replacements = [
    ['pkg/version/version.go', /^const Version = "[^"]+"$/gm, `const Version = "${version}"`],
    ['main.go', /^(\/\/ @version\s+)\S+$/gm, `$1${version}`],
    ['docs/docs.go', /^(\s*Version:\s*)"[^"]+",$/gm, `$1"${version}",`],
    ['docs/swagger.yaml', /^(  version: )[^\n]+$/gm, `$1"${version}"`],
  ];
  for (const [file, regex, replacement] of replacements) {
    const content = readFileSync(resolve(root, file), 'utf8');
    if ([...content.matchAll(regex)].length !== 1) throw new Error(`Expected exactly one version field in ${file}`);
    changes.set(file, content.replace(regex, replacement));
  }
  for (const [file, indent] of [['web/package.json', 2], ['docs/swagger.json', 4]]) {
    const data = JSON.parse(readFileSync(resolve(root, file), 'utf8'));
    const target = file.startsWith('docs/') ? data.info : data;
    if (typeof target?.version !== 'string') throw new Error(`Missing version in ${file}`);
    target.version = version;
    changes.set(file, JSON.stringify(data, null, indent) + '\n');
  }
  // Validate every file before writing any changes.
  for (const [file, content] of changes) writeFileSync(resolve(root, file), content);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const { values } = parseArgs({ options: {
      increment: { type: 'string' }, preid: { type: 'string', default: 'beta' },
      'validate-only': { type: 'boolean', default: false },
    } });
    const tags = execFileSync('git', ['tag', '--list'], { encoding: 'utf8' }).trim().split('\n');
    const tag = nextVersion(values.increment, values.preid, tags);
    if (!values['validate-only']) prepare(tag);
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `tag=${tag}\n`);
    console.log(tag);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
