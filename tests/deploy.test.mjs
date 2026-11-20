import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

test('deploy usa Pages e mantém o CNAME no build', () => {
  const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
  assert.match(workflow, /actions\/deploy-pages/);
  assert.match(workflow, /actions\/upload-pages-artifact/);
  assert.match(workflow, /npm run build/);
  assert.ok(existsSync('dist/CNAME'));
  assert.match(readFileSync('dist/CNAME', 'utf8').trim(), /^\S+\.\S+$/);
});
