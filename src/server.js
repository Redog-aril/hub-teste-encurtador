import { createServer } from 'node:http';
import { criar, buscar, contarAcesso, obterStats } from './store.js';
import { validar } from './validar.js';

const PORT = process.env.PORT || 3000;

export const server = createServer((req, res) => {
  const { method, url } = req;
  const parsedUrl = new URL(url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  if (method === 'POST' && pathname === '/links') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const validacao = validar(payload.url);

        if (!validacao.ok) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ erro: validacao.erro }));
        }

        const codigo = criar(payload.url);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ codigo }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ erro: 'Payload JSON inválido' }));
      }
    });
    return;
  }

  const statsMatch = pathname.match(/^\/links\/([a-z0-9]{6})\/stats$/);
  if (method === 'GET' && statsMatch) {
    const codigo = statsMatch[1];
    const stats = obterStats(codigo);

    if (!stats) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Link não encontrado' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(stats));
  }

  const redirectMatch = pathname.match(/^\/([a-z0-9]{6})$/);
  if (method === 'GET' && redirectMatch) {
    const codigo = redirectMatch[1];
    const urlOriginal = buscar(codigo);

    if (!urlOriginal) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Link não encontrado' }));
    }

    contarAcesso(codigo);
    res.writeHead(302, { Location: urlOriginal });
    return res.end();
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}
