import { test, beforeEach } from 'node:test';
import assert from 'node:assert';
import { criar, buscar, contarAcesso, obterStats, limparStore } from '../src/store.js';

beforeEach(() => {
  limparStore();
});

test('store - cria e busca um link gerando código de 6 caracteres [a-z0-9]', () => {
  const url = 'https://example.com';
  const codigo = criar(url);
  
  assert.strictEqual(typeof codigo, 'string');
  assert.strictEqual(codigo.length, 6);
  assert.match(codigo, /^[a-z0-9]{6}$/);

  const urlEncontrada = buscar(codigo);
  assert.strictEqual(urlEncontrada, url);
});

test('store - retorna null para código inexistente', () => {
  assert.strictEqual(buscar('000000'), null);
  assert.strictEqual(obterStats('000000'), null);
  assert.strictEqual(contarAcesso('000000'), null);
});

test('store - incrementa e retorna estatísticas de acessos corretamente', () => {
  const url = 'https://example.com/teste';
  const codigo = criar(url);

  let stats = obterStats(codigo);
  assert.deepStrictEqual(stats, { url, acessos: 0 });

  contarAcesso(codigo);
  contarAcesso(codigo);

  stats = obterStats(codigo);
  assert.deepStrictEqual(stats, { url, acessos: 2 });
});
