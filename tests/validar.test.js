import { test } from 'node:test';
import assert from 'node:assert';
import { validar } from '../src/validar.js';

test('validar - URLs válidas http e https', () => {
  assert.deepStrictEqual(validar('http://example.com'), { ok: true });
  assert.deepStrictEqual(validar('https://example.com/caminho?param=1'), { ok: true });
});

test('validar - URL com protocolo não permitido (ftp://)', () => {
  const res = validar('ftp://servidor.com/arquivo');
  assert.strictEqual(res.ok, false);
  assert.strictEqual(res.erro, 'Apenas os protocolos http e https são permitidos');
});

test('validar - texto solto (URL malformatada)', () => {
  const res = validar('texto_solto_sem_protocolo');
  assert.strictEqual(res.ok, false);
  assert.strictEqual(res.erro, 'URL inválida');
});

test('validar - URL vazia ou ausente', () => {
  assert.strictEqual(validar('').ok, false);
  assert.strictEqual(validar('   ').ok, false);
  assert.strictEqual(validar(null).ok, false);
});

test('validar - URL com mais de 2048 caracteres (ex: 3000 caracteres)', () => {
  const urlLonga = 'https://example.com/' + 'a'.repeat(3000);
  const res = validar(urlLonga);
  assert.strictEqual(res.ok, false);
  assert.strictEqual(res.erro, 'URL excede o limite máximo de 2048 caracteres');
});
