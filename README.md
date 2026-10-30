# Licença Clara

Site informativo, em português de Portugal, sobre as entidades de jogo online da lista pública do SRIJ. Não é um operador. A ordem das fichas segue o número da licença.

O `dist/` sai com `noindex` enquanto `data/site.json` não estiver completo. Isso é de propósito: a política da Google para destinos que promovem jogo exige aviso de idade, recursos de dependência, termos, privacidade com o responsável pelo tratamento, e ligações de saída só para entidades licenciadas em Portugal.

## Antes de indexar ou anunciar

1. Preencha em `data/site.json`: `legalName`, `nif`, `address`, `email`, `hostingNote`, `publicUrl` (https, domínio próprio, não um subdomínio gratuito).
2. Confirme a [lista do SRIJ](https://www.srij.turismodeportugal.pt/pt/jogos-e-apostas-online/entidades-licenciadas). A cópia deste site usa a atualização de 3 de agosto de 2026.
3. Se tiver um link de afiliado, grave-o em `affiliateUrl` **no mesmo domínio** de `officialUrl`. O build falha se o host for outro. Não ponha link em fichas suspensas (Moosh) nem na Vincino enquanto o SRIJ disser que o site está “brevemente disponível”.
4. Corra `npm run build`.
5. Só então mude `readyToIndex` para `true` e volte a construir.
6. Publique a pasta `dist/` na raiz do domínio.
7. Para Google Ads em Portugal, peça a certificação de **conteúdo que promove jogo online** (agregador/afiliado), separada de casino social. Sem essa certificação, não ative anúncios. Uma conta não mistura as duas certificações. O anúncio deve apontar para estas páginas, segmentar Portugal e maiores de 18 anos.

Não use cloaking, páginas-porta, bónus inventados, testemunhos falsos nem operadores fora da lista.

## Comandos

```bash
npm run build
npm run preview
```

O preview abre em `http://localhost:4173`.
