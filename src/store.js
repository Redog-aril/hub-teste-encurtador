import { randomBytes } from 'node:crypto';

const store = new Map();

function gerarCodigo() {
  const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let codigo = '';
  while (codigo.length < 6) {
    const byte = randomBytes(1)[0];
    const index = byte % caracteres.length;
    codigo += caracteres[index];
  }
  return codigo;
}

export function criar(urlOriginal) {
  let codigo = gerarCodigo();
  while (store.has(codigo)) {
    codigo = gerarCodigo();
  }

  const registro = {
    urlOriginal,
    acessos: 0
  };

  store.set(codigo, registro);
  return codigo;
}

export function buscar(codigo) {
  const registro = store.get(codigo);
  if (!registro) return null;
  return registro.urlOriginal;
}

export function contarAcesso(codigo) {
  const registro = store.get(codigo);
  if (!registro) return null;
  registro.acessos += 1;
  return registro.acessos;
}

export function obterStats(codigo) {
  const registro = store.get(codigo);
  if (!registro) return null;
  return {
    url: registro.urlOriginal,
    acessos: registro.acessos
  };
}

export function limparStore() {
  store.clear();
}
