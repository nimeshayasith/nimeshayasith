// Amplify serves /404.html for unknown paths. Copying the SPA shell there is a
// safety net: a deep link like /projects/securestay still boots the app even if
// the SPA rewrite rule hasn't been configured on the Amplify app.
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(process.cwd(), 'dist');
const index = resolve(dist, 'index.html');
if (!existsSync(index)) {
  console.error('postbuild: dist/index.html not found, did vite build run?');
  process.exit(1);
}
copyFileSync(index, resolve(dist, '404.html'));
console.log('postbuild: dist/404.html created (SPA fallback)');
