import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { guidePages } from "./guides.mjs";
import { layout, siteIsIndexable } from "./layout.mjs";
import {
  byLicense,
  canLink,
  hostOf,
  licenseCell,
  licenseNo,
  outboundUrl,
  tagsFor,
} from "./operators.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const site = JSON.parse(readFileSync(join(root, "data/site.json"), "utf8"));
const operators = JSON.parse(readFileSync(join(root, "data/operators.json"), "utf8"));

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function assertOperators(list) {
  const slugs = new Set();
  for (const op of list) {
    if (!op.slug || slugs.has(op.slug)) throw new Error(`Slug inválido: ${op.slug}`);
    slugs.add(op.slug);
    for (const key of ["brand", "entity", "summary", "sportsStatus", "gamesStatus"]) {
      if (!op[key]) throw new Error(`${op.slug} sem ${key}`);
    }
    if (!Array.isArray(op.modalities)) throw new Error(`${op.slug} sem modalidades`);
    const official = String(op.officialUrl || "");
    const affiliate = String(op.affiliateUrl || "");
    if (official && !hostOf(official).endsWith(".pt")) {
      throw new Error(`${op.slug}: o domínio oficial tem de ser .pt`);
    }
    if (affiliate) {
      if (!official) throw new Error(`${op.slug}: afiliado sem URL oficial`);
      if (hostOf(affiliate) !== hostOf(official)) {
        throw new Error(`${op.slug}: o afiliado tem de abrir o mesmo domínio da licença`);
      }
      if (!canLink(op)) throw new Error(`${op.slug}: não promova uma atividade suspensa ou ainda indisponível`);
    }
  }
}

function schemaScript(data) {
  if (!data) return "";
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

function crumbs(items) {
  const html = `<p class="crumbs">${items
    .map((item, index) =>
      index === items.length - 1
        ? `<span>${esc(item.label)}</span>`
        : `<a href="${item.href}">${esc(item.label)}</a>`,
    )
    .join(" / ")}</p>`;
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(site.publicUrl && item.href
        ? { item: `${site.publicUrl.replace(/\/$/, "")}${item.href}` }
        : {}),
    })),
  };
  return { html, schema: data };
}

function rows(list) {
  return list
    .map((op) => {
      const tags = tagsFor(op).join(" ");
      return `<tr data-tags="${esc(tags)}">
        <th scope="row"><a href="/operadores/${esc(op.slug)}/">${esc(op.brand)}</a></th>
        <td>${esc(op.entity)}</td>
        <td>${licenseCell(op.sportsLicense, op.sportsStatus)}</td>
        <td>${licenseCell(op.gamesLicense, op.gamesStatus)}</td>
        <td>${op.bingoLicense ? licenseCell(op.bingoLicense, "ativa") : "—"}</td>
        <td><a href="/operadores/${esc(op.slug)}/">Abrir ficha</a></td>
      </tr>`;
    })
    .join("");
}

function table(list, caption, id) {
  return `<div class="table-wrap">
    <table id="${id}">
      <caption>${caption}</caption>
      <thead>
        <tr>
          <th>Marca</th>
          <th>Entidade exploradora</th>
          <th>Apostas à cota</th>
          <th>Fortuna ou azar</th>
          <th>Bingo</th>
          <th>Ficha</th>
        </tr>
      </thead>
      <tbody>${rows(list)}</tbody>
    </table>
    <p class="filter-empty" hidden>Nenhuma ficha com este filtro.</p>
  </div>`;
}

function filters(buttons, tableId) {
  const items = buttons
    .map(
      ([value, label], index) =>
        `<button type="button" data-filter="${value}" aria-pressed="${index === 0 ? "true" : "false"}">${label}</button>`,
    )
    .join("");
  return `<div class="filters" data-filter-group="#${tableId}">${items}</div>`;
}

function outbound(op) {
  if (!canLink(op)) {
    return `<div class="callout"><p>Sem ligação de saída. A lista do SRIJ não mostra esta exploração como aberta, ou indica o website como brevemente disponível.</p></div>`;
  }
  const url = outboundUrl(op);
  const commercial = Boolean(op.affiliateUrl);
  const rel = commercial ? "sponsored noopener noreferrer" : "noopener noreferrer";
  const note = commercial
    ? "Ligação comercial. Se se registar por ela, o editor pode receber uma comissão, sem custo adicional para si. A posição na lista não depende dessa comissão."
    : "Ligação para o website oficial desta marca. Confirme no SRIJ que o domínio corresponde à entidade. Nesta ficha ainda não há parâmetro de afiliado.";
  const partial = [op.sportsStatus, op.gamesStatus].includes("suspensa")
    ? `<p>Há uma modalidade com exploração suspensa. A ligação não é um convite para essa modalidade.</p>`
    : "";
  return `${partial}
    <p class="disclosure">${note}</p>
    <p class="actions"><a class="button" data-outbound href="${esc(url)}" rel="${rel}" target="_blank">Abrir o website da entidade</a></p>`;
}

function operatorBody(op, sorted) {
  const trail = crumbs([
    { href: "/", label: "Início" },
    { href: "/operadores/", label: "Operadores" },
    { href: `/operadores/${op.slug}/`, label: op.brand },
  ]);
  const related = sorted
    .filter((item) => item.slug !== op.slug)
    .filter((item) => tagsFor(item).some((tag) => tagsFor(op).includes(tag) && tag !== "suspensa"))
    .slice(0, 3);
  const relatedHtml = related.length
    ? `<h2>Outras fichas</h2><ul>${related
        .map((item) => `<li><a href="/operadores/${esc(item.slug)}/">${esc(item.brand)}</a> — licença ${esc(licenseNo(item.gamesLicense || item.sportsLicense || item.bingoLicense))}</li>`)
        .join("")}</ul>`
    : "";
  const modalities = op.modalities.map((item) => `<li>${esc(item)}</li>`).join("");
  const closed = ![op.sportsStatus, op.gamesStatus, op.bingoStatus || "nenhuma"].includes("ativa");
  return {
    body: `${trail.html}
      <p class="kicker">Ficha · lista pública do SRIJ</p>
      <h1>${esc(op.brand)}</h1>
      <p class="lede">${esc(op.summary)}</p>
      <dl class="facts">
        <dt>Entidade exploradora</dt><dd>${esc(op.entity)}</dd>
        <dt>Apostas desportivas à cota</dt><dd>${licenseCell(op.sportsLicense, op.sportsStatus)}</dd>
        <dt>Jogos de fortuna ou azar</dt><dd>${licenseCell(op.gamesLicense, op.gamesStatus)}</dd>
        <dt>Bingo</dt><dd>${op.bingoLicense ? licenseCell(op.bingoLicense, "ativa") : "—"}</dd>
      </dl>
      <h2>Modalidades descritas na lista</h2>
      ${closed ? "<p>O texto seguinte descreve o teor da licença. Não descreve uma oferta aberta.</p>" : ""}
      <ul>${modalities}</ul>
      <h2>O que esta ficha não afirma</h2>
      <p>Não há nota, estrela, bónus nem prazo de pagamento. Não testámos uma conta de jogador. A posição no site segue o número de licença.</p>
      ${outbound(op)}
      <p>Fonte: <a href="https://www.srij.turismodeportugal.pt/pt/jogos-e-apostas-online/entidades-licenciadas">entidades licenciadas</a>, atualização indicada em 3 de agosto de 2026. Leia também <a href="/como-funciona-a-licenca/">como funciona uma licença</a>.</p>
      ${relatedHtml}`,
    schema: schemaScript(trail.schema),
  };
}

function listPage({ path, title, description, kicker, lede, prose, list, filterButtons }) {
  const id = "tabela";
  return {
    path,
    title,
    description,
    body: `
      <p class="kicker">${kicker}</p>
      <h1>${title}</h1>
      <p class="lede">${lede}</p>
      <div class="prose">${prose}</div>
      ${filterButtons ? filters(filterButtons, id) : ""}
      ${table(list, "Ordem pelo número de licença do SRIJ. Não é uma classificação.", id)}
      <p class="muted">Antes de se registar, confirme a linha correspondente na lista oficial. Ligações de saída, quando existem, estão na ficha de cada marca.</p>`,
  };
}

assertOperators(operators);
const sorted = [...operators].sort(byLicense);

const pages = [];

pages.push({
  path: "/",
  title: "Operadores de jogo online licenciados em Portugal",
  description: "Guia da lista pública do SRIJ: casinos, apostas à cota, póquer e bingo. Sem notas, sem bónus e só com entidades licenciadas.",
  body: `
    <section class="hero">
      <div>
        <p class="kicker">Lista pública · 3 de agosto de 2026</p>
        <h1>Operadores de jogo online com licença em Portugal</h1>
        <p class="lede">Um guia para ler o registo do SRIJ. Não aceitamos apostas, não abrimos contas e não ordenamos marcas por comissão.</p>
      </div>
      <aside class="stamp">
        <strong>Não somos operador</strong>
        <p>19 entidades da lista consultada. Ligações de saída só quando a exploração correspondente está indicada como aberta, e só para o domínio dessa entidade.</p>
      </aside>
    </section>
    <div class="grid-2">
      <a class="path" href="/casinos/"><span>Jogos de fortuna ou azar</span><strong>Casinos</strong><span class="note">Ver licenças, modalidades e suspensões.</span></a>
      <a class="path" href="/apostas/"><span>Apostas desportivas à cota</span><strong>Apostas</strong><span class="note">Quem tem licença e quem está suspenso.</span></a>
    </div>
    <div class="grid-3" style="margin-top:1rem">
      <a class="card" href="/poker/"><h3>Póquer</h3><p class="muted">As licenças que nomeiam torneio, Hold'em ou Omaha.</p></a>
      <a class="card" href="/bingo/"><h3>Bingo</h3><p class="muted">Na lista consultada há uma licença de bingo.</p></a>
      <a class="card" href="/como-funciona-a-licenca/"><h3>Como ler a licença</h3><p class="muted">Número, averbamento e o que uma suspensão quer dizer.</p></a>
    </div>
    <h2>Como usar esta lista</h2>
    <div class="grid-3">
      <article class="card"><h3>1. Achar a entidade</h3><p class="muted">A marca e a sociedade exploradora têm de bater certo com o SRIJ.</p></article>
      <article class="card"><h3>2. Ler a modalidade</h3><p class="muted">Apostas, máquinas, roleta ou póquer só contam se estiverem escritos na licença.</p></article>
      <article class="card"><h3>3. Ver o estado</h3><p class="muted">Suspensa ou “brevemente” não recebe o mesmo botão de uma licença em exploração.</p></article>
    </div>
    <h2>As 19 fichas</h2>
    <p>A ordem começa na licença n.º 001. Não é um ranking.</p>
    ${table(sorted, "Entidades na lista pública do SRIJ usada por este site.", "todas")}
    <h2>O que fica de fora de propósito</h2>
    <div class="prose">
      <p>Não publicamos bónus, códigos, cotas nem testemunhos. Não há contas de demonstração nossas. Não apontamos a marcas ausentes do registo. A <a href="/metodologia/">metodologia</a> explica a regra, e a <a href="/divulgacao-de-afiliados/">divulgação de afiliados</a> explica o que acontece se uma ligação passar a ser comercial.</p>
      <p>Se o jogo deixar de ser um gasto que controla, pare e use a <a href="/jogo-responsavel/">Linha 1414</a>. Para bloquear o acesso a todos os operadores licenciados, o caminho é a <a href="/autoexclusao/">autoexclusão no SRIJ</a>, não um email para este site.</p>
    </div>`,
});

pages.push(
  listPage({
    path: "/casinos/",
    title: "Casinos online na lista do SRIJ",
    description: "Entidades com licença de jogos de fortuna ou azar em Portugal, ordenadas pelo número de licença.",
    kicker: "Jogos de fortuna ou azar",
    lede: "Nesta página, casino quer dizer a licença de jogos de fortuna ou azar. Não quer dizer que todas as marcas tenham as mesmas modalidades.",
    prose: `<p>Há licenças só de jogos de máquinas e outras que acrescentam roleta, blackjack, bacará, banca francesa ou saque ou crash. O filtro usa as palavras da lista pública, não um catálogo comercial. A Pokerstars e a 888 entram aqui e não entram nas apostas desportivas. A Moosh permanece visível, com a exploração suspensa e sem ligação de saída.</p>`,
    list: sorted.filter((op) => op.gamesLicense),
    filterButtons: [
      ["todos", "Todas"],
      ["maquinas", "Máquinas"],
      ["roleta", "Roleta"],
      ["blackjack", "Blackjack"],
      ["crash", "Crash"],
      ["bacara", "Bacará"],
      ["poker", "Póquer"],
      ["bingo", "Bingo"],
      ["suspensa", "Com suspensão"],
    ],
  }),
);

pages.push(
  listPage({
    path: "/apostas/",
    title: "Apostas desportivas à cota licenciadas",
    description: "Quem tem licença de apostas desportivas à cota em Portugal e quais explorações estão suspensas.",
    kicker: "Apostas à cota",
    lede: "A licença de apostas é distinta da licença de casino. Uma marca pode ter as duas, só uma, ou uma delas suspensa.",
    prose: `<p>Na lista de 3 de agosto de 2026, as apostas da Nossa Aposta (licença n.º 012) e da Luckia (licença n.º 014) estão suspensas a pedido da entidade. A Moosh (licença n.º 019) também, em conjunto com a licença de jogos. As fichas de casino dessas marcas, quando não trazem a mesma nota, continuam descritas à parte.</p>`,
    list: sorted.filter((op) => op.sportsLicense),
    filterButtons: [
      ["todos", "Todas"],
      ["suspensa", "Com suspensão"],
    ],
  }),
);

pages.push(
  listPage({
    path: "/poker/",
    title: "Póquer nas licenças do SRIJ",
    description: "Entidades cuja licença nomeia póquer em torneio, Hold'em, Omaha ou póquer sem descarte.",
    kicker: "Póquer",
    lede: "Só entram marcas em que a lista pública escreve póquer. Ter casino ou apostas não chega.",
    prose: `<p>Na cópia que usamos, isso acontece na ESCOnline, na Pokerstars e na 888. Várias dessas linhas referem liquidez partilhada. O efeito prático está no averbamento de cada licença; não o traduzimos para uma promessa sobre quem está na mesa. Não há, nestas fichas, licença de apostas da Pokerstars nem da 888.</p>`,
    list: sorted.filter((op) => tagsFor(op).includes("poker")),
  }),
);

pages.push(
  listPage({
    path: "/bingo/",
    title: "Bingo online licenciado em Portugal",
    description: "A licença de bingo identificada na lista pública do SRIJ.",
    kicker: "Bingo",
    lede: "Na lista consultada há uma licença de bingo: a n.º 032, da YOBINGO, explorada pela BINGOSOFT P.L.C.",
    prose: `<p>A mesma entidade tem a licença n.º 031 para jogos de máquinas e roleta francesa. Não lhe é atribuída, nessa ficha, licença de apostas desportivas à cota. Se o SRIJ passar a licenciar mais do que uma entidade para bingo, esta página tem de passar a dizê-lo. Até lá, não completamos a grelha com marcas sem essa linha.</p>`,
    list: sorted.filter((op) => op.bingoLicense),
  }),
);

pages.push(
  listPage({
    path: "/operadores/",
    title: "Todas as fichas de operadores",
    description: "Índice das entidades de jogo online na lista pública do SRIJ reproduzida neste site.",
    kicker: "Índice",
    lede: "Cada ficha tem a entidade, os números de licença e as modalidades escritas na lista. A ordem é numérica.",
    prose: `<p>Abra a ficha para ver se existe ligação de saída. Não há ligação quando a exploração está suspensa nas atividades da entidade ou quando o SRIJ indica que o website estará brevemente disponível, como na Vincino à data desta cópia.</p>`,
    list: sorted,
  }),
);

for (const op of sorted) {
  const view = operatorBody(op, sorted);
  pages.push({
    path: `/operadores/${op.slug}/`,
    title: `${op.brand}: licença SRIJ e modalidades`,
    description: `${op.brand}, ${op.entity}. Ficha factual a partir da lista pública do SRIJ, sem bónus nem nota.`,
    body: view.body,
    schema: view.schema,
  });
}

for (const guide of guidePages(site)) {
  pages.push({
    path: guide.path,
    title: guide.title,
    description: guide.description,
    body: `${crumbs([{ href: "/", label: "Início" }, { href: guide.path, label: guide.title }]).html}${guide.body}`,
    schema: schemaScript(
      guide.schema ||
        crumbs([
          { href: "/", label: "Início" },
          { href: guide.path, label: guide.title },
        ]).schema,
    ),
  });
}

pages.push({
  path: "/404.html",
  title: "Página não encontrada",
  description: "Esta página não existe.",
  robots: "noindex,nofollow",
  body: `<h1>Página não encontrada</h1><p>Volte ao <a href="/">início</a> ou à <a href="/operadores/">lista de fichas</a>.</p>`,
});

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, "assets"), { recursive: true });
cpSync(join(root, "src/styles.css"), join(dist, "assets/styles.css"));
cpSync(join(root, "src/site.js"), join(dist, "assets/site.js"));
cpSync(join(root, "public/favicon.svg"), join(dist, "favicon.svg"));

const written = [];
for (const page of pages) {
  const file = page.path === "/404.html" ? join(dist, "404.html") : page.path === "/" ? join(dist, "index.html") : join(dist, page.path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  const html = layout({
    site,
    title: page.title,
    description: page.description,
    path: page.path === "/404.html" ? "/404.html" : page.path,
    body: page.body,
    schema: page.schema || "",
    robots: page.robots,
  });
  writeFileSync(file, html);
  written.push(html);
}

const indexable = siteIsIndexable(site);
const origin = indexable ? site.publicUrl.replace(/\/$/, "") : "";
const urls = pages
  .filter((page) => page.path !== "/404.html")
  .map((page) => `${origin}${page.path === "/" ? "/" : page.path}`);

writeFileSync(
  join(dist, "robots.txt"),
  indexable ? `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n` : "User-agent: *\nDisallow: /\n",
);

writeFileSync(
  join(dist, "sitemap.xml"),
  indexable
    ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
        .map((url) => `  <url><loc>${url}</loc></url>`)
        .join("\n")}\n</urlset>\n`
    : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n`,
);

const blob = written.join("\n");
const required = [
  "exclusivamente a entidades de jogo licenciadas e autorizadas em Portugal",
  "Linha 1414",
  "18+",
  "não oferece jogos nem apostas",
];
for (const phrase of required) {
  if (!blob.includes(phrase)) throw new Error(`Falta a frase obrigatória: ${phrase}`);
}
for (const phrase of ["AggregateRating", "melhor casino", "100%", "bónus de boas-vindas"]) {
  if (blob.toLowerCase().includes(phrase.toLowerCase())) throw new Error(`Frase proibida encontrada: ${phrase}`);
}
if (!blob.includes('rel="noopener noreferrer"') && !blob.includes('rel="sponsored noopener noreferrer"')) {
  throw new Error("Sem ligações de saída com rel correto");
}

console.log(`${pages.length} páginas em dist/`);
console.log(indexable ? "Indexação: ligada" : "Indexação: desligada até preencher data/site.json");
