const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const requestPath = req.url === '/' ? '/collage-slideshow.html' : req.url;
  const urlPath = requestPath.split('?')[0].split('#')[0];

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(urlPath);
  } catch (e) {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }

  const filePath = path.resolve(ROOT_DIR, '.' + decodedPath);
  const relativePath = path.relative(ROOT_DIR, filePath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please close the other process or try a different port (e.g., PORT=3001 npm run serve).`);
    process.exit(1);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Slideshow available at http://localhost:${PORT}`);
});