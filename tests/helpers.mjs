import { readFileSync } from 'node:fs';
export function readHtml() {
  return readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
}
