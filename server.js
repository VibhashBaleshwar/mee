const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.env.PORT || 4173);
const root = process.cwd();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function send(res, status, content, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(content);
}

function safeResolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = decoded === '/' ? '/index.html' : decoded;
  const resolved = path.resolve(root, `.${normalized}`);
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

const server = http.createServer((req, res) => {
  const target = safeResolve(req.url || '/');
  if (!target) {
    send(res, 400, 'Bad request');
    return;
  }

  fs.stat(target, (error, stats) => {
    if (error || !stats.isFile()) {
      send(
        res,
        404,
        'Preview not found. Open / (root) to view the LeaveFlow app.',
        'text/plain; charset=utf-8'
      );
      return;
    }

    const ext = path.extname(target).toLowerCase();
    const type = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(target, (readErr, data) => {
      if (readErr) {
        send(res, 500, 'Internal server error');
        return;
      }
      send(res, 200, data, type);
    });
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`LeaveFlow preview running at http://0.0.0.0:${port}`);
});
