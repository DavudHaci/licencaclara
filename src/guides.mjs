export function guidePages(site) {
  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char]));
  const email = esc(site.email?.trim() || "o email ainda não está preenchido em data/site.json");
  const legal = esc(site.legalName?.trim() || "entidade ainda não identificada");
  const nif = esc(site.nif?.trim() || "por preencher");
  const address = esc(site.address?.trim() || "por preencher");
  const hosting = esc(site.hostingNote?.trim() || "o prestador de alojamento ainda não está identificado");
  const name = esc(site.name);

  const pages = [
    {
      path: "/como-funciona-a-licenca/",
      title: "Como funciona uma licença de jogo online em Portugal",
      description: "Como ler a lista do SRIJ: licenças de apostas, de jogos de fortuna ou azar e de bingo, averbamentos e suspensões.",
      body: `
        <p class="kicker">Guia</p>
        <h1>Como funciona uma licença de jogo online em Portugal</h1>
        <p class="lede">Em Portugal, o jogo e as apostas online só podem ser explorados por entidades licenciadas pelo Serviço de Regulação e Inspeção de Jogos (SRIJ). Este guia explica como ler essa lista. Não explica como contornar o registo.</p>
        <div class="prose">
          <p>O regime separa atividades que, vistas de fora, parecem o mesmo site. Apostas desportivas à cota, jogos de fortuna ou azar e bingo têm licenças próprias, com número próprio. Uma marca pode ter uma, duas ou, no caso da YOBINGO na lista consultada, licença de jogos e licença de bingo. Ter marca conhecida ou domínio .pt não substitui a linha correspondente no registo.</p>
          <h2>O que a lista mostra</h2>
          <p>Para cada entidade, a página pública indica a marca, a entidade exploradora, os tipos de jogo que pode explorar e os números de licença, com averbamentos. Um averbamento é uma alteração posterior: prorrogação, mudança de sede, aditamento de uma modalidade ou, nalguns casos, a nota de que a exploração está suspensa a pedido da própria entidade.</p>
          <p>Por isso duas fichas com o mesmo tipo de produto não são iguais. A licença de jogos de máquinas da LeBull, da GoldenPark ou da Retabet, na lista de 3 de agosto de 2026, não enumera roleta nem blackjack. A licença da Pokerstars não inclui apostas desportivas. Comparar “casinos” sem ler o âmbito é a forma mais comum de misturar produtos que a licença não cobre.</p>
          <h2>Suspensão não é o mesmo que ausência</h2>
          <p>Quando o SRIJ escreve que a exploração está temporariamente suspensa a pedido da entidade, a licença ainda aparece no registo, mas aquela atividade não deve ser tratada como uma oferta aberta. Na cópia que usamos, isso acontece nas apostas da Nossa Aposta e da Luckia, e nas duas licenças da Moosh. A ficha da Moosh não tem ligação de saída. Nas outras, a ligação não é um convite para a modalidade suspensa.</p>
          <h2>Como confirmar antes de se registar</h2>
          <ol>
            <li>Abra a <a href="https://www.srij.turismodeportugal.pt/pt/jogos-e-apostas-online/entidades-licenciadas">lista de entidades licenciadas</a>.</li>
            <li>Procure a marca e a entidade exploradora, não apenas um anúncio.</li>
            <li>Veja se a modalidade que pretende está escrita nessa ficha.</li>
            <li>Leia as notas de suspensão e a data de atualização no fundo da página oficial.</li>
            <li>Confirme que o domínio para onde vai sair é o da entidade, e não uma página intermédia de outra marca.</li>
          </ol>
          <p>Este site reproduz a lista com data de atualização de 3 de agosto de 2026 e foi revisto em 30 de outubro de 2026. Se as duas datas divergirem do que o SRIJ mostra hoje, prevalece o registo oficial. Correções: <a href="/contacto/">contacto</a>.</p>
        </div>`,
    },
    {
      path: "/jogo-responsavel/",
      title: "Jogo responsável",
      description: "Aviso de idade, sinais de risco e contactos oficiais de apoio em Portugal, incluindo a Linha 1414 do ICAD.",
      body: `
        <p class="kicker">18+</p>
        <h1>Jogo responsável</h1>
        <p class="lede">O jogo a dinheiro é uma despesa, não uma forma de rendimento. Está reservado a maiores de 18 anos e pode criar dependência.</p>
        <div class="prose">
          <div class="callout">
            <p><strong>Linha 1414.</strong> Serviço do Instituto para os Comportamentos Aditivos e as Dependências (ICAD), anónimo, gratuito e confidencial. Dias úteis, das 10h às 18h. Telefone <a href="tel:1414">1414</a>. Email <a href="mailto:1414@icad.min-saude.pt">1414@icad.min-saude.pt</a>.</p>
            <p>A linha não trata de autoexclusão, reclamações a operadores nem transações de jogo. Para autoexclusão use o <a href="https://www.srij.turismodeportugal.pt/pt/sos-jogadores/autoexclusao-e-proibicao">procedimento do SRIJ</a>.</p>
          </div>
          <h2>Limites que dependem de si</h2>
          <ul>
            <li>Decida um valor que pode perder e pare quando o atingir.</li>
            <li>Não tente recuperar perdas com novas apostas.</li>
            <li>Não jogue para resolver dívidas, nem peça dinheiro emprestado para jogar.</li>
            <li>Não jogue sob o efeito de álcool ou quando precisa desse tempo para trabalhar ou dormir.</li>
            <li>Se esconde o jogo a outras pessoas, trate isso como um sinal, não como um pormenor.</li>
          </ul>
          <h2>O que este site não faz</h2>
          <p>Não abrimos contas, não guardamos saldos e não aceitamos pedidos de autoexclusão. Um email para o editor não bloqueia o acesso aos operadores. O bloqueio em todos os sites licenciados em Portugal faz-se na plataforma do SRIJ, descrita na página de <a href="/autoexclusao/">autoexclusão</a>.</p>
          <p>Mais informação oficial: <a href="https://www.srij.turismodeportugal.pt/pt/sos-jogadores/servicos-de-apoio-ao-jogador">serviços de apoio ao jogador</a> e <a href="https://www.icad.pt/">ICAD</a>.</p>
        </div>`,
    },
    {
      path: "/autoexclusao/",
      title: "Autoexclusão do jogo online",
      description: "Como funciona a autoexclusão no SRIJ e porque é que este site não a pode tratar.",
      body: `
        <p class="kicker">SRIJ</p>
        <h1>Autoexclusão</h1>
        <p class="lede">A autoexclusão impede o jogo. Não se pede neste website.</p>
        <div class="prose">
          <p>Segundo o SRIJ, pode pedir autoexclusão no website da entidade onde joga ou na plataforma do regulador. No primeiro caso, o efeito fica limitado a esse website. No segundo, vale para todos os sites de jogos e apostas online licenciados em Portugal.</p>
          <p>O período mínimo indicado pelo SRIJ é de três meses. Também pode ser por tempo indeterminado. A comunicação do fim, ou da antecipação, só produz efeito um mês depois. Durante uma exclusão por tempo determinado, o jogador pode levantar o saldo; numa exclusão por tempo indeterminado, o saldo disponível é transferido para a conta de pagamento do jogador. Estas regras estão descritas na página oficial e podem ser atualizadas: confirme-as lá.</p>
          <p>Dúvidas sobre o procedimento: <a href="mailto:exclusao.online@turismodeportugal.pt">exclusao.online@turismodeportugal.pt</a>. Página oficial: <a href="https://www.srij.turismodeportugal.pt/pt/sos-jogadores/autoexclusao-e-proibicao">Autoexclusão e proibição</a>.</p>
          <p>Se precisa de falar com alguém sobre dependência, use a Linha 1414. Essa linha não substitui o pedido de autoexclusão.</p>
        </div>`,
    },
    {
      path: "/jogo-ilegal/",
      title: "Jogo online ilegal em Portugal",
      description: "Porque é que este site só aponta a entidades da lista do SRIJ e como reconhecer uma oferta fora do regime.",
      body: `
        <p class="kicker">Registo</p>
        <h1>O que fica fora da lista</h1>
        <p class="lede">Uma marca que não está na lista pública do SRIJ não é uma opção que este site compare, mesmo que aceite jogadores em Portugal ou mostre um domínio parecido.</p>
        <div class="prose">
          <p>O SRIJ é quem licencia a exploração. Sites sem essa licença operam fora do regime português: as regras de identificação, de conta de jogador, de jogo responsável e de reclamação que a lei impõe às entidades licenciadas não se aplicam da mesma forma. Publicidade a esses sites também não cabe num destino que queira cumprir a política de jogo do Google para Portugal.</p>
          <p>Sinais úteis, sem substituir o registo: a marca não aparece na lista; a licença citada é de outro país e apresenta-se como se valesse em Portugal; o domínio não coincide com o da entidade; pedem pagamento por fora da conta de jogador. A confirmação faz-se na <a href="https://www.srij.turismodeportugal.pt/pt/jogos-e-apostas-online/entidades-licenciadas">página de entidades licenciadas</a> e na nota <a href="https://www.srij.turismodeportugal.pt/pt/jogo-seguro/onde-pode-jogar">onde pode jogar</a>.</p>
          <p>Não publicamos fichas, códigos nem ligações para operadores ausentes do registo. Se uma licença for revogada, a ficha deve sair das ligações de saída na revisão seguinte. A Betway, por exemplo, não entra nesta cópia: fontes públicas dão as licenças 021 e 022 como revogadas em janeiro de 2026, e a marca não está na lista que reproduzimos.</p>
        </div>`,
    },
    {
      path: "/metodologia/",
      title: "Metodologia",
      description: "Critérios de inclusão, ordem por número de licença e o que este guia não avalia.",
      body: `
        <p class="kicker">Como a lista é feita</p>
        <h1>Metodologia</h1>
        <p class="lede">A inclusão depende da lista pública do SRIJ. A ordem é o número de licença. Nenhuma das duas coisas está à venda.</p>
        <div class="prose">
          <h2>Inclusão</h2>
          <p>Entra uma marca que conste da página de entidades licenciadas consultada, com a data de atualização de 3 de agosto de 2026. Cada ficha usa a entidade exploradora, os números de licença e as modalidades descritas nessa página. Não acrescentamos produtos que a lista não menciona.</p>
          <h2>Ordem</h2>
          <p>As tabelas ordenam pelo menor número de licença da entidade. A licença n.º 001 aparece antes da n.º 002. Isto não é uma classificação de qualidade, de cotas, de catálogo ou de probabilidade de ganho. Não há estrelas, notas nem selo de “melhor”.</p>
          <h2>O que não avaliamos</h2>
          <p>Não abrimos contas de jogador para escrever estas páginas. Não publicamos bónus, requisitos de apostas, prazos de levantamento, catálogos de jogos nem probabilidades. Esses dados mudam e não fazem parte do registo que usamos como fonte. Publicá-los sem verificação seria publicidade disfarçada de facto.</p>
          <h2>Ligações</h2>
          <p>Quando existe botão de saída, o destino tem de ser o domínio oficial da marca licenciada. Se mais tarde for acrescentado um URL de afiliado, o domínio tem de ser o mesmo: a construção do site recusa hosts diferentes. Uma comissão, se existir, não muda a ordem. Atividades totalmente suspensas e o website indicado como “brevemente disponível” não recebem botão.</p>
          <h2>Atualização</h2>
          <p>Reveja o registo oficial antes de usar uma ficha para se registar ou antes de anunciar uma página. Pedidos de correção: ${email}.</p>
        </div>`,
    },
    {
      path: "/divulgacao-de-afiliados/",
      title: "Divulgação de afiliados",
      description: "Como são identificadas as ligações comerciais para operadores licenciados em Portugal.",
      body: `
        <p class="kicker">Transparência</p>
        <h1>Divulgação de afiliados</h1>
        <p class="lede">${name} é um site informativo sobre entidades licenciadas. Pode receber uma comissão se o leitor se registar através de uma ligação comercial. Isso não tem de mudar o custo para o leitor e não muda a ordem da lista.</p>
        <div class="prose">
          <p>Enquanto o campo de afiliado de uma ficha estiver vazio, o botão aponta para o website oficial e o texto junto dele diz isso. Quando o editor gravar um URL de afiliado no mesmo domínio, o texto passa a identificar a ligação como comercial. Não usamos redirecionamentos para domínios que não sejam o da entidade licenciada.</p>
          <p>A comissão é paga pela entidade ou pela rede de afiliação, não é uma taxa cobrada ao leitor neste site. Não vendemos posição na tabela. Não aceitamos pagamento para ocultar uma suspensão que esteja escrita no SRIJ.</p>
          <p>Este site não é um operador, não partilha uma licença com as marcas que descreve e não oferece jogo. As ligações de saída, quando existem, vão apenas para entidades da lista portuguesa.</p>
        </div>`,
    },
    {
      path: "/sobre/",
      title: "Sobre",
      description: "Quem publica o Licença Clara e qual é o limite deste projeto.",
      body: `
        <p class="kicker">Editor</p>
        <h1>Sobre</h1>
        <p class="lede">${name} organiza, em português de Portugal, a lista pública de entidades de jogo online licenciadas pelo SRIJ.</p>
        <div class="prose">
          <p>O responsável pela publicação e pelo tratamento de dados é ${legal}, NIF ${nif}, com morada ${address}. Esses dados têm de estar completos antes de o site ser indexado ou anunciado. Não inventamos uma redação, anos de experiência nem testes de jogo que não tenham acontecido.</p>
          <p>Não somos o SRIJ, não falamos em nome de nenhuma entidade exploradora e não prestamos aconselhamento jurídico. A página oficial do regulador é a fonte. A <a href="/metodologia/">metodologia</a> diz o que entra, o que fica de fora e porque é que a ordem segue o número da licença.</p>
          <p>Contacto editorial: <a href="/contacto/">página de contacto</a>.</p>
        </div>`,
    },
    {
      path: "/contacto/",
      title: "Contacto",
      description: "Contacto do editor para correções factuais. Não tratamos contas de jogador nem autoexclusão.",
      body: `
        <p class="kicker">Editor</p>
        <h1>Contacto</h1>
        <p class="lede">Para correções sobre uma ficha, escreva para ${email}.</p>
        <div class="prose">
          <p>Diga a página, a frase e a fonte. Se a fonte for o SRIJ, indique a data em que viu a lista oficial.</p>
          <p>Não envie números de conta de jogador, documentos de identificação, dados de pagamento nem palavras-passe. Não conseguimos, e não devemos, aceder à sua conta num operador. Reclamações de jogo e levantamentos tratam-se com a entidade exploradora. Autoexclusão: <a href="/autoexclusao/">página própria</a>, que aponta para o SRIJ. Dependência: Linha 1414.</p>
        </div>`,
    },
    {
      path: "/politica-de-privacidade/",
      title: "Política de privacidade",
      description: "Quem é o responsável pelo tratamento, que dados existem neste site e durante quanto tempo.",
      body: `
        <p class="kicker">Dados</p>
        <h1>Política de privacidade</h1>
        <p class="lede">Responsável pelo tratamento: ${legal}. NIF ${nif}. Morada: ${address}. Email: ${email}.</p>
        <div class="prose">
          <h2>O que este site trata</h2>
          <p>Se nos escrever, tratamos o endereço de email e o conteúdo da mensagem para responder e, se for uma correção, para atualizar uma página. Base: diligências pré-contratuais ou interesse legítimo em corrigir informação pública, conforme o motivo do contacto. Conservação: o tempo necessário para responder e, no máximo, 12 meses, salvo obrigação legal diferente.</p>
          <p>A confirmação de idade fica no seu navegador, na chave local <span class="mono">lc-age</span>. Não é enviada ao editor. Serve para não repetir a pergunta antes de uma ligação de saída.</p>
          <p>O alojamento (${hosting}) pode registar endereço IP, data e página pedida em diários técnicos, pelo prazo do prestador. Não instalamos, de origem, etiquetas de publicidade nem análise de audiência. Se mais tarde forem acrescentadas, esta política tem de passar a dizer quais, para quê, e o site tem de recolher consentimento quando a lei o exigir.</p>
          <h2>O que não fazemos</h2>
          <p>Não pedimos documentos de identidade, não criamos contas de jogador e não vendemos dados. Não há decisões automatizadas sobre si.</p>
          <h2>Os seus direitos</h2>
          <p>Pode pedir acesso, retificação, apagamento, limitação ou oposição, e apresentar reclamação à Comissão Nacional de Proteção de Dados (<a href="https://www.cnpd.pt/">CNPD</a>). Os pedidos sobre dados de uma conta de jogo fazem-se à entidade exploradora, que é um responsável diferente.</p>
        </div>`,
    },
    {
      path: "/termos-e-condicoes/",
      title: "Termos e condições",
      description: "Condições de uso deste site informativo. Não regulam contas de jogo nos operadores.",
      body: `
        <p class="kicker">Condições</p>
        <h1>Termos e condições</h1>
        <p class="lede">Estes termos aplicam-se ao uso de ${name}. Não são o contrato de jogo de nenhuma entidade licenciada.</p>
        <div class="prose">
          <p>O site é informativo e destina-se a maiores de 18 anos. Não oferecemos apostas nem jogos de fortuna ou azar. Ao sair para um operador, passa a estar no site dessa entidade, sujeito aos termos dela.</p>
          <p>A informação reproduz a lista pública do SRIJ com a data indicada em cada página. Pode ficar desatualizada. Confirme a licença, o domínio e o estado da exploração no registo oficial antes de se registar. Não garantimos disponibilidade dos sites de terceiros, bónus, pagamentos ou resultados. O jogo pode causar perda de dinheiro e dependência.</p>
          <p>As ligações de saída são apenas para entidades licenciadas e autorizadas em Portugal. A <a href="/divulgacao-de-afiliados/">divulgação de afiliados</a> explica as ligações comerciais.</p>
          <p>Os textos deste site estão protegidos. Pode citar um excerto com ligação à página. Não pode copiar o site para o apresentar como seu, nem usá-lo para promover operadores fora da lista.</p>
          <p>Editor: ${legal}, NIF ${nif}, ${address}. Lei portuguesa. Os tribunais da comarca da sede do editor são os competentes, sem prejuízo de normas imperativas de proteção do consumidor.</p>
        </div>`,
    },
  ];

  const faqs = [
    ["Este site aceita apostas?", "Não. Não há registo de jogador, saldo nem jogos. As fichas descrevem entidades licenciadas e, quando a exploração está aberta, podem ligar ao site delas."],
    ["A ordem é a dos melhores casinos?", "Não. A ordem é o número de licença do SRIJ, do menor para o maior. Não há notas nem estrelas."],
    ["Porque não vejo bónus?", "Porque não os verificamos contra o registo público. Um valor de boas-vindas muda e, se estiver errado, é publicidade enganosa."],
    ["Como sei se um operador é legal em Portugal?", "Procure a marca na lista de entidades licenciadas do SRIJ e confirme a modalidade e o domínio. A nossa cópia indica a data da lista que usámos."],
    ["A Nossa Aposta e a Luckia estão suspensas?", "Na lista de 3 de agosto de 2026, a suspensão a pedido da entidade incide sobre a licença de apostas desportivas. A licença de jogos de fortuna ou azar dessas marcas não traz a mesma nota. A Moosh tem as duas licenças suspensas."],
    ["Posso pedir autoexclusão aqui?", "Não. O pedido faz-se no operador ou na plataforma do SRIJ. Aqui só explicamos a diferença e apontamos a página oficial."],
    ["Têm de ter licença de afiliado?", "O editor não explora jogo. Para anunciar no Google em Portugal é precisa a certificação de conteúdo que promove jogo, e as ligações de saída têm de ir só a entidades licenciadas no país. A certificação não é uma licença do SRIJ."],
    ["Posso usar o site se tiver menos de 18 anos?", "Não. O tema é jogo a dinheiro. Se precisar de ajuda por causa do jogo de outra pessoa, a Linha 1414 também atende familiares."],
  ];

  pages.push({
    path: "/perguntas-frequentes/",
    title: "Perguntas frequentes",
    description: "Respostas curtas sobre a lista do SRIJ, a ordem das fichas, bónus, autoexclusão e idade.",
    body: `
      <p class="kicker">FAQ</p>
      <h1>Perguntas frequentes</h1>
      <div class="faq">
        ${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}
      </div>`,
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  });

  return pages;
}
