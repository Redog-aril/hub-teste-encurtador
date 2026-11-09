# hub-teste-encurtador

## Como Rodar

Certifique-se de ter o Node.js (versão 18 ou superior) instalado.

```bash
# Iniciar o servidor
npm start
```

O servidor estará rodando em `http://localhost:3000`.

## Como Testar

Execute os testes unitários utilizando o runner nativo do Node.js:

```bash
npm test
```

## Exemplos de Uso (curl)

### 1. Criar um link encurtado (POST /links)
```bash
curl -X POST http://localhost:3000/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com"}'
```
*Resposta de sucesso (201):* `{"codigo":"a1b2c3"}`

### 2. Redirecionar para a URL original (GET /:codigo)
```bash
curl -i http://localhost:3000/a1b2c3
```
*Resposta de sucesso (302):* Redireciona via header `Location: https://google.com` e contabiliza 1 acesso.

### 3. Consultar estatísticas de um link (GET /links/:codigo/stats)
```bash
curl http://localhost:3000/links/a1b2c3/stats
```
*Resposta de sucesso (200):* `{"url":"https://google.com","acessos":1}`