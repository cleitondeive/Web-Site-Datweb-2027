/** Dependency-free local preview for Datweb. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf'
};

function createServer({ root = __dirname } = {}) {
  const publicRoot = path.resolve(root);
  return http.createServer((req, res) => {
    const error = (code, message) => {
      res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(message);
    };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('Allow', 'GET, HEAD');
      return error(405, 'Método não permitido.');
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      return error(400, 'Endereço inválido.');
    }
    if (pathname === '/') pathname = '/index.html';
    if (pathname.includes('\0') || pathname.split('/').some(part => part.startsWith('.') || part.startsWith('backup-'))) {
      return error(404, 'Página não encontrada.');
    }
    const file = path.resolve(publicRoot, '.' + pathname);
    const relative = path.relative(publicRoot, file);
    if (relative.startsWith('..') || path.isAbsolute(relative)) return error(404, 'Página não encontrada.');
    fs.stat(file, (err, stat) => {
      if (err || !stat.isFile()) return error(404, 'Página não encontrada.');
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Content-Length': stat.size,
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      });
      if (req.method === 'HEAD') return res.end();
      const stream = fs.createReadStream(file);
      stream.on('error', () => res.destroy());
      stream.pipe(res);
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '127.0.0.1';
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    console.error('PORT deve ser um número de 0 a 65535.');
    process.exitCode = 1;
  } else {
    const server = createServer();
    server.on('error', error => {
      console.error(error.code === 'EADDRINUSE'
        ? `A porta ${port} está ocupada. Use PORT=3001 npm run dev.`
        : `Não foi possível iniciar: ${error.message}`);
      process.exitCode = 1;
    });
    console.log('Iniciando o Datweb...');
    server.listen(port, host, () => console.log(`Datweb local: http://${host}:${server.address().port}`));
  }
}
module.exports = { createServer };
