/**
 * Gemini API Proxy — runs on Windows host, forwards Docker container requests
 * to the Gemini API since Docker's DNS/routing is broken.
 *
 * Uses ONLY Node.js built-ins (http, https) — no npm install needed.
 *
 * Usage:  node gemini_proxy.js
 * Listens: http://0.0.0.0:11435
 * Docker containers reach it via: http://host.docker.internal:11435
 */

const http = require('http');
const https = require('https');
const url = require('url');

const PROXY_PORT = 11435;
const TARGET_BASE = 'https://generativelanguage.googleapis.com/v1beta/openai';

const server = http.createServer((req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  const targetUrl = TARGET_BASE + req.url;
  const parsed = url.parse(targetUrl);

  console.log(`[proxy] ${req.method} ${req.url} → ${targetUrl}`);

  // Collect request body
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks);

    const options = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.path,
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers['authorization'] || '',
        'Content-Length': body.length,
      },
    };

    const proxyReq = https.request(options, (proxyRes) => {
      const respChunks = [];
      proxyRes.on('data', c => respChunks.push(c));
      proxyRes.on('end', () => {
        const respBody = Buffer.concat(respChunks);
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': proxyRes.headers['content-type'] || 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(respBody);
      });
    });

    proxyReq.on('error', (err) => {
      console.error('[proxy] upstream error:', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });

    proxyReq.end(body);
  });
});

server.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log('');
  console.log('✅ Gemini Proxy running!');
  console.log(`   Listening on  : http://0.0.0.0:${PROXY_PORT}`);
  console.log(`   Forwarding to : ${TARGET_BASE}`);
  console.log('');
  console.log('   Docker containers use:');
  console.log(`   AI_BASE_URL=http://host.docker.internal:${PROXY_PORT}/v1`);
  console.log('');
  console.log('   Press Ctrl+C to stop.');
  console.log('');
});
