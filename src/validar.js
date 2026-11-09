export function validar(url) {
  if (typeof url !== 'string' || !url.trim()) {
    return { ok: false, erro: 'URL é obrigatória e deve ser uma string não vazia' };
  }

  if (url.length > 2048) {
    return { ok: false, erro: 'URL excede o limite máximo de 2048 caracteres' };
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { ok: false, erro: 'Apenas os protocolos http e https são permitidos' };
    }
  } catch (err) {
    return { ok: false, erro: 'URL inválida' };
  }

  return { ok: true };
}
