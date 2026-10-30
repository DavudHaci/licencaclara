function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

export const NAV = [
  ["/casinos/", "Casinos"],
  ["/apostas/", "Apostas"],
  ["/poker/", "Póquer"],
  ["/bingo/", "Bingo"],
  ["/como-funciona-a-licenca/", "Licenças"],
  ["/jogo-responsavel/", "Jogo responsável"],
];

const FOOT = [
  ["/operadores/", "Todas as fichas"],
  ["/metodologia/", "Metodologia"],
  ["/divulgacao-de-afiliados/", "Divulgação de afiliados"],
  ["/sobre/", "Sobre"],
  ["/contacto/", "Contacto"],
  ["/perguntas-frequentes/", "Perguntas frequentes"],
  ["/jogo-responsavel/", "Jogo responsável"],
  ["/autoexclusao/", "Autoexclusão"],
  ["/jogo-ilegal/", "Jogo ilegal"],
  ["/politica-de-privacidade/", "Privacidade"],
  ["/termos-e-condicoes/", "Termos e condições"],
];

function ready(site) {
  const filled = ["legalName", "nif", "address", "email"].every((key) => String(site[key] || "").trim());
  const url = String(site.publicUrl || "");
  let urlOk = false;
  try {
    const parsed = new URL(url);
    urlOk = parsed.protocol === "https:" && !parsed.hostname.includes("example");
  } catch {
    urlOk = false;
  }
  return Boolean(site.readyToIndex) && filled && urlOk;
}

export function siteIsIndexable(site) {
  return ready(site);
}

export function layout({ site, title, description, path, body, schema = "", robots }) {
  const indexable = ready(site);
  const forceNoindex = Boolean(robots && robots.includes("noindex"));
  const canonical = indexable && !forceNoindex ? `<link rel="canonical" href="${esc(site.publicUrl.replace(/\/$/, ""))}${path === "/" ? "/" : path}">` : "";
  const robotsMeta = robots || (indexable ? "index,follow" : "noindex,nofollow");
  const home = path === "/";
  const nav = NAV.map(([href, label]) => {
    const current = href === path ? ' aria-current="page"' : "";
    return `<a href="${href}"${current}>${label}</a>`;
  }).join("");
  const foot = FOOT.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("");
  const controller = esc(site.legalName?.trim() || "responsável ainda não identificado");
  const draft = indexable
    ? ""
    : `<div class="draft"><strong>Rascunho.</strong> Preencha a razão social, o NIF, a morada, o email e o domínio HTTPS em data/site.json. Só depois passe readyToIndex a true. Não ative anúncios Google sem certificação para conteúdo que promove jogo em Portugal.</div>`;

  return `<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} · ${esc(site.name)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${robotsMeta}">
  <meta name="geo.region" content="PT">
  ${canonical}
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_PT">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,560;9..144,620&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/styles.css">
  ${schema}
</head>
<body>
  <a class="skip" href="#conteudo">Saltar para o conteúdo</a>
  ${draft}
  <div class="agebar">
    <p><span class="age-badge">18+</span> Jogo proibido a menores. Pode causar dependência. Apoio: <a href="tel:1414">Linha 1414</a>, dias úteis, 10h–18h, ou <a href="mailto:1414@icad.min-saude.pt">1414@icad.min-saude.pt</a>.</p>
    <p class="agebar-links"><a href="/jogo-responsavel/">Jogo responsável</a> · <a href="/termos-e-condicoes/">Termos</a> · <a href="/politica-de-privacidade/">Privacidade</a></p>
  </div>
  <header class="site-header">
    <div class="wrap brand-row">
      <a class="brand" href="/">
        <small>Portugal · operadores licenciados</small>
        <strong>${esc(site.name)}</strong>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    </div>
    <div class="wrap">
      <nav id="site-nav" aria-label="Secções">${nav}</nav>
    </div>
  </header>
  <main id="conteudo" class="wrap">
    ${body}
  </main>
  <footer class="site-footer">
    <div class="wrap">
      <div class="compliance">
        <p>Todas as ligações de saída deste website dirigem-se exclusivamente a entidades de jogo licenciadas e autorizadas em Portugal pelo SRIJ. ${esc(site.name)} não oferece jogos nem apostas, não abre contas de jogador e não é titular de licença de jogo.</p>
        <p>Aviso de idade: reservado a pessoas com 18 anos ou mais. O jogo pode criar dependência. Linha 1414 do ICAD, dias úteis, das 10h às 18h. Responsável pelo tratamento dos dados: ${controller}.</p>
      </div>
      <div class="foot-grid">
        <div>
          <strong>${esc(site.name)}</strong>
          <p>Informação a partir da lista pública de entidades licenciadas do SRIJ. A lista oficial prevalece sobre esta cópia.</p>
          <p><a href="https://www.srij.turismodeportugal.pt/pt/jogos-e-apostas-online/entidades-licenciadas">Registo do SRIJ</a></p>
        </div>
        <ul>${foot}</ul>
        <div>
          <p><a href="https://www.srij.turismodeportugal.pt/pt/sos-jogadores/servicos-de-apoio-ao-jogador">Apoio ao jogador no SRIJ</a></p>
          <p><a href="https://www.srij.turismodeportugal.pt/pt/sos-jogadores/autoexclusao-e-proibicao">Autoexclusão no SRIJ</a></p>
          <p><a href="https://www.icad.pt/">ICAD</a></p>
        </div>
      </div>
      <p class="legal-mini">Fonte da lista: SRIJ, data de atualização indicada na página oficial em 3 de agosto de 2026. Revisão editorial desta cópia: 30 de outubro de 2026. ${home ? "" : ""}</p>
    </div>
  </footer>
  <dialog id="age-dialog" aria-labelledby="age-title">
    <div class="dialog-body">
      <p class="kicker">Saída do site</p>
      <h2 id="age-title">Confirme a idade</h2>
      <p>Vai abrir o website de uma entidade exploradora de jogo. Em Portugal o jogo a dinheiro é reservado a maiores de 18 anos e pode causar dependência.</p>
    </div>
    <div class="dialog-actions">
      <button id="age-decline" type="button" value="cancel">Voltar</button>
      <button id="age-accept" class="primary" type="button" value="ok">Tenho 18 anos ou mais</button>
    </div>
  </dialog>
  <script src="/assets/site.js"></script>
  <script>
    document.getElementById("age-decline")?.addEventListener("click", () => document.getElementById("age-dialog")?.close());
    document.getElementById("age-accept")?.addEventListener("click", () => document.getElementById("age-dialog")?.close());
  </script>
</body>
</html>`;
}
