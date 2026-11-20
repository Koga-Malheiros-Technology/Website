import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');

test('upload e deploy do Pages ficam em jobs separados', () => {
  const buildStart = workflow.indexOf('  build:');
  const deployStart = workflow.indexOf('  deploy:');
  assert.ok(buildStart >= 0, 'job build ausente');
  assert.ok(deployStart >= 0, 'job deploy ausente');

  const build = workflow.slice(buildStart, deployStart);
  assert.match(build, /uses:\s*actions\/upload-pages-artifact@v3/);
  assert.doesNotMatch(build, /uses:\s*actions\/deploy-pages/);

  const deploy = workflow.slice(deployStart);
  assert.match(deploy, /^\s+needs:\s*build\s*$/m);
  assert.match(deploy, /uses:\s*actions\/deploy-pages@v4/);
});

test('deploy mantém o environment github-pages', () => {
  const deployStart = workflow.indexOf('  deploy:');
  if (deployStart < 0) assert.fail('job deploy ausente');
  assert.match(workflow.slice(deployStart), /name:\s*github-pages/);
});
