export function tagsFor(op) {
  const text = op.modalities.join(" ").toLowerCase();
  const tags = [];
  if (op.sportsStatus === "ativa") tags.push("apostas");
  if (op.gamesStatus === "ativa") tags.push("casino");
  if (text.includes("póquer") || text.includes("poquer")) tags.push("poker");
  if (text.includes("bingo")) tags.push("bingo");
  if (text.includes("roleta")) tags.push("roleta");
  if (text.includes("blackjack")) tags.push("blackjack");
  if (text.includes("máquinas") || text.includes("maquinas")) tags.push("maquinas");
  if (text.includes("crash") || text.includes("saque")) tags.push("crash");
  if (text.includes("bacará") || text.includes("bacara")) tags.push("bacara");
  if ([op.sportsStatus, op.gamesStatus].includes("suspensa")) tags.push("suspensa");
  return tags;
}

export function licenseKey(op) {
  const nums = [op.sportsLicense, op.gamesLicense, op.bingoLicense]
    .filter(Boolean)
    .map(Number);
  return Math.min(...nums);
}

export function byLicense(a, b) {
  return licenseKey(a) - licenseKey(b);
}

export function outboundUrl(op) {
  return String(op.affiliateUrl || op.officialUrl || "").trim();
}

export function canLink(op) {
  if (!outboundUrl(op)) return false;
  return [op.sportsStatus, op.gamesStatus, op.bingoStatus || "nenhuma"].includes("ativa");
}

export function hostOf(url) {
  return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
}

export function licenseNo(value) {
  return value ? `n.º ${value}` : "—";
}

export function pill(status) {
  if (status === "ativa") return '<span class="pill ok">na lista</span>';
  if (status === "suspensa") return '<span class="pill stop">suspensa</span>';
  if (status === "brevemente") return '<span class="pill warn">brevemente</span>';
  return "—";
}

export function licenseCell(number, status) {
  if (!number) return "—";
  return `<span class="mono">${licenseNo(number)}</span> ${pill(status)}`;
}
