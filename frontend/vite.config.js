import { defineConfig, createLogger } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';

// Same-origin /api and /yt in every environment. In production AWS Amplify rewrites
// /api/* to the Render backend and /yt/* to YouTube (see ../terraform); here Vite does the
// same for `npm run dev` and `npm run preview`, so there is no CORS to configure anywhere.
const BACKEND = process.env.BACKEND_ORIGIN || 'https://portfolio-6gcd.onrender.com';

// Vite prints a full stack for every failed proxy call; the handler below prints one short line instead.
const logger = createLogger();
const baseError = logger.error;
logger.error = (msg, options) => {
  if (String(msg).includes('http proxy error')) return;
  baseError(msg, options);
};

// When an upstream can't be reached (no internet, DNS down, Render asleep) the app just shows its
// bundled data, so replace Vite's per-request stack trace with one short line and a clean 502.
const lastWarn = {};
const quietErrors = (label, target) => (p) => {
  p.on('error', (err, _req, res) => {
    if (Date.now() - (lastWarn[label] || 0) > 30000) {
      lastWarn[label] = Date.now();
      console.warn(`\n[${label} proxy] cannot reach ${target} (${err.code || err.message}). Offline? The site keeps working with its bundled data.\n`);
    }
    if (res && !res.headersSent && typeof res.writeHead === 'function') {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'upstream unreachable', code: err.code || 'UNKNOWN' }));
    }
  });
};

const proxy = {
  '/api': { target: BACKEND, changeOrigin: true, secure: true, timeout: 60000, proxyTimeout: 60000, configure: quietErrors('api', BACKEND) },
  '/yt': {
    target: 'https://www.youtube.com',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/yt/, ''),
    configure: quietErrors('yt', 'https://www.youtube.com'),
  },
};

/** Build facts shown in the live status strip: real commit and time, never made up. */
const sh = (cmd) => { try { return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return ''; } };
const commit = (process.env.AWS_COMMIT_ID || sh('git rev-parse HEAD') || 'local').slice(0, 7);
const branch = process.env.AWS_BRANCH || sh('git rev-parse --abbrev-ref HEAD') || 'local';

export default defineConfig({
  customLogger: logger,
  plugins: [react()],
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __BUILD_COMMIT__: JSON.stringify(commit),
    __BUILD_BRANCH__: JSON.stringify(branch),
  },
  server: { proxy },
  preview: { proxy },
});
