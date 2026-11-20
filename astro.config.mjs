import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

const domain = readFileSync(new URL('./public/CNAME', import.meta.url), 'utf8').trim();

export default defineConfig({
  site: `https://${domain}`,
  base: '/',
  output: 'static',
});
