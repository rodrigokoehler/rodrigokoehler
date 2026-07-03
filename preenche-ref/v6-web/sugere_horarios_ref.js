/* ============================================================================
 *  Preenche REF v6 — Parte 2a: Sugestor de horários (somente leitura)
 * ----------------------------------------------------------------------------
 *  Roda DENTRO da página do REF. Para cada dia útil que ainda PRECISA de
 *  lançamento, calcula os horários a digitar seguindo as regras da v5.2:
 *
 *    • entrada nunca antes de um mínimo (padrão 10:00);
 *    • total do dia sorteado numa faixa (padrão 09:01 a 09:11), nunca em hora
 *      exata (ex.: 09:00) e nunca igual ao total do dia anterior;
 *    • pequena variação aleatória de posição.
 *
 *  ENTENDE O QUE JÁ EXISTE em cada dia:
 *    • dia VAZIO            -> sugere ENTRADA + SAÍDA;
 *    • dia com SÓ a SAÍDA   -> sugere SÓ a ENTRADA (mantém a saída que já está);
 *    • dia com SÓ a ENTRADA -> sugere SÓ a SAÍDA;
 *    • dia já COMPLETO      -> pula;
 *    • dia ESTRANHO (marcações duplas, ou horário que não fecha ≥10h e >9h,
 *      como plantão/sobreaviso) -> NÃO chuta: marca "conferir".
 *
 *  Opcional: com almoço e/ou com desporto (ver CONFIG). No modo padrão
 *  (sem os dois) cada dia é um único par entrada/saída.
 *
 *  NÃO preenche nem envia nada — apenas MOSTRA o que digitar. 100% seguro.
 *  COMO USAR: abra o REF no mês desejado, F12 → Console, cole tudo, Enter.
 * ==========================================================================*/

(function () {
  "use strict";

  /* ----------------------------- CONFIG ------------------------------------
   * Horários no formato "HHMM" (quatro dígitos). Ajuste à vontade.
   */
  var CONFIG = {
    comAlmoco:    true,     // true = com intervalo de almoço
    comDesporto:  true,     // true = com prática desportiva
    entradaManha: "1000",   // base da entrada
    saidaAlmoco:  "1300",   // saída para o almoço (usado se comAlmoco)
    voltaAlmoco:  "1400",   // volta do almoço (usado se comAlmoco)
    desportoIni:  "2000",   // início do desporto (usado se comDesporto)
    desportoFim:  "2100",   // fim do desporto — fixo (8h às 9h da noite)
    minEntrada:   "1000",   // entrada nunca antes disto
    totalMin:     "0901",   // menor total do dia, incluindo o desporto (HHMM)
    totalMax:     "0911",   // maior total do dia (HHMM)
    variacaoMin:  8,        // variação máx., em minutos, na posição (não no desporto)
    pularPontoFacultativo: true  // pular dias marcados "(PF)" na tela?
  };

  // -------- utilidades de tempo (minutos desde a meia-noite) -----------------
  function hmParaMin(hm) { return parseInt(hm.slice(0, 2), 10) * 60 + parseInt(hm.slice(2), 10); }
  function hhmmParaMin(s) { var m = s.match(/(\d{1,2}):(\d{2})/); return m ? (+m[1]) * 60 + (+m[2]) : null; }
  function minParaHm(m)  { return ("0" + Math.floor(m / 60)).slice(-2) + ":" + ("0" + (m % 60)).slice(-2); }
  function sorteio(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

  // -------- feriados calculados (Páscoa de Meeus/Butcher) --------------------
  function domingoDePascoa(ano) {
    var a = ano % 19, b = Math.floor(ano / 100), c = ano % 100;
    var d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var mes = Math.floor((h + l - 7 * m + 114) / 31);
    var dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(ano, mes - 1, dia);
  }
  function feriadosDoAno(ano) {
    var conj = {};
    ["01/01", "21/04", "01/05", "07/09", "12/10", "02/11", "15/11", "25/12"]
      .forEach(function (d) { conj[d] = true; });
    var pascoa = domingoDePascoa(ano);
    [-48, -47, -2, 60].forEach(function (dz) {
      var d = new Date(pascoa.getTime()); d.setDate(d.getDate() + dz);
      conj[("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2)] = true;
    });
    return conj;
  }

  // -------- leitura da tela ---------------------------------------------------
  function descobreMesAno() {
    var m = document.body.innerText.match(/REGISTROS DE FREQU[EÊ]NCIA:\s*(\d{2})\/(\d{4})/i);
    return m ? { mes: +m[1], ano: +m[2] } : null;
  }
  // Lê cada dia: nº, dia da semana e as 8 colunas Entrada/Saída (4 pares).
  function achaLinhasDeDia() {
    var linhas = [];
    document.querySelectorAll("tr").forEach(function (tr) {
      var c = tr.querySelectorAll("td");
      if (c.length < 10) return;
      var m = (c[0].innerText || "").trim().match(/^(\d{1,2})\s*-\s*(.+)$/);
      if (!m) return;
      var entradas = [], saidas = [], temVD = false;
      for (var k = 1; k <= 8 && k < c.length; k++) {
        var t = (c[k].innerText || "").trim();
        if (/VD/i.test(t)) temVD = true;
        var min = hhmmParaMin(t);
        if (min === null) continue;
        if (k % 2 === 1) entradas.push(min); else saidas.push(min); // ímpar=Entrada, par=Saída
      }
      linhas.push({ dia: +m[1], nome: m[2].trim().toLowerCase(), entradas: entradas, saidas: saidas, temVD: temVD });
    });
    return linhas;
  }

  // -------- escolhe um total válido (faixa, não exato, não repetido) ---------
  // restr: função opcional que recebe o total e diz se serve (ex.: cabe ≥10h)
  function escolheTotal(totMin, totMax, ultimo, restr) {
    for (var t = 0; t < 300; t++) {
      var tot = sorteio(totMin, totMax);
      if (tot % 60 === 0 || tot === ultimo) continue;
      if (restr && !restr(tot)) continue;
      return tot;
    }
    return null;
  }

  // -------- monta as sugestões ------------------------------------------------
  function main() {
    var ma = descobreMesAno();
    if (!ma) { alert("Abra a aba de Registros de Frequência primeiro."); return; }
    var feriados = feriadosDoAno(ma.ano);
    var minEnt = hmParaMin(CONFIG.minEntrada);
    var totMin = hmParaMin(CONFIG.totalMin), totMax = hmParaMin(CONFIG.totalMax);
    if (totMin >= totMax) { alert("total mínimo deve ser menor que o máximo"); return; }
    var jit = CONFIG.variacaoMin;
    var baseE = hmParaMin(CONFIG.entradaManha);

    var ultimoTotal = -1;
    var sugestoes = [], conferir = [];

    achaLinhasDeDia().forEach(function (L) {
      var ddmm = ("0" + L.dia).slice(-2) + "/" + ("0" + ma.mes).slice(-2);
      var fds = L.nome.indexOf("bado") >= 0 || L.nome.indexOf("domingo") >= 0;
      // a própria tela marca "(F)" = feriado e "(PF)" = ponto facultativo
      var marcaPF = /\(pf\)/.test(L.nome);
      var marcaF = /\(f\)/.test(L.nome);
      if (fds || feriados[ddmm] || marcaF) return;          // pula fim de semana/feriado
      if (marcaPF && CONFIG.pularPontoFacultativo) return;  // pula ponto facultativo
      var nE = L.entradas.length, nS = L.saidas.length;

      // já completo (tem entrada e saída) -> nada a fazer
      if (nE >= 1 && nS >= 1) return;
      // marcações duplas -> não é seguro chutar
      if (nE > 1 || nS > 1) { conferir.push({ dia: L.dia, motivo: "marcações múltiplas" }); return; }

      // modo com almoço/desporto: só tratamos dias totalmente vazios aqui;
      // dias parciais viram "conferir" (a completação só é simples no par único)
      var parUnico = !CONFIG.comAlmoco && !CONFIG.comDesporto;

      if (nE === 0 && nS === 0) {
        // DIA VAZIO -> entrada + saída
        if (parUnico) {
          var e = baseE + sorteio(0, jit);               // entrada 10:00..10:jit
          var tot = escolheTotal(totMin, totMax, ultimoTotal, null);
          if (tot === null) { conferir.push({ dia: L.dia, motivo: "sem total válido" }); return; }
          var s = e + tot;
          if (s > 1439) { conferir.push({ dia: L.dia, motivo: "saída passa da meia-noite" }); return; }
          ultimoTotal = tot;
          sugestoes.push({ dia: L.dia, entrada: e, saida: s, total: tot, add: "entrada+saída" });
        } else {
          var r = calculaComBlocos(minEnt, totMin, totMax, ultimoTotal);
          if (!r) { conferir.push({ dia: L.dia, motivo: "não fechou com almoço/desporto" }); return; }
          ultimoTotal = r.total;
          sugestoes.push({ dia: L.dia, blocos: r, add: "expediente" });
        }
        return;
      }

      if (!parUnico) { conferir.push({ dia: L.dia, motivo: "dia parcial (modo com almoço)" }); return; }

      if (nS === 1 && nE === 0) {
        // SÓ SAÍDA -> completar a entrada, mantendo a saída existente
        var saida = L.saidas[0];
        var tot2 = escolheTotal(totMin, totMax, ultimoTotal, function (t) { return saida - t >= minEnt; });
        if (tot2 === null) {
          conferir.push({ dia: L.dia, motivo: "saída " + minParaHm(saida) + " cedo demais p/ ≥" + CONFIG.minEntrada.slice(0,2) + "h e >9h" });
          return;
        }
        var ent = saida - tot2;
        ultimoTotal = tot2;
        sugestoes.push({ dia: L.dia, entrada: ent, saida: saida, total: tot2, add: "entrada", saidaFixa: true });
        return;
      }

      if (nE === 1 && nS === 0) {
        // SÓ ENTRADA -> completar a saída
        var entrada = L.entradas[0];
        var tot3 = escolheTotal(totMin, totMax, ultimoTotal, function (t) { return entrada + t <= 1439; });
        if (tot3 === null) { conferir.push({ dia: L.dia, motivo: "entrada tarde demais p/ fechar >9h" }); return; }
        var sai = entrada + tot3;
        ultimoTotal = tot3;
        sugestoes.push({ dia: L.dia, entrada: entrada, saida: sai, total: tot3, add: "saída", entradaFixa: true });
        return;
      }
    });

    mostraTabela(ma, sugestoes, conferir);
  }

  // cálculo do dia com blocos (almoço/desporto), quando ligados no CONFIG
  function calculaComBlocos(minEnt, totMin, totMax, ultimo) {
    var jit = CONFIG.variacaoMin;
    var e1b = hmParaMin(CONFIG.entradaManha), s1b = hmParaMin(CONFIG.saidaAlmoco), e2b = hmParaMin(CONFIG.voltaAlmoco);
    var durManha = s1b - e1b, almoco = e2b - s1b;
    var despDur = CONFIG.comDesporto ? (hmParaMin(CONFIG.desportoFim) - hmParaMin(CONFIG.desportoIni)) : 0;
    for (var t = 0; t < 200; t++) {
      var e1 = e1b + sorteio(-jit, jit);
      if (e1 < minEnt) continue;
      var s1 = e1 + durManha, e2 = s1 + almoco;
      var tot = sorteio(totMin, totMax);
      if (tot % 60 === 0 || tot === ultimo) continue;
      var s2 = e2 + (tot - despDur - durManha);
      if (s2 <= e2) continue;
      var desp = null;
      if (CONFIG.comDesporto) {
        // desporto é FIXO (ex.: 20:00–21:00), não varia
        var de = hmParaMin(CONFIG.desportoIni), ds = hmParaMin(CONFIG.desportoFim);
        if (s2 >= de) continue;             // expediente não pode invadir o desporto
        desp = [de, ds];
      } else if (s2 > 1439) continue;
      return { manha: [e1, s1], tarde: [e2, s2], desporto: desp, total: tot };
    }
    return null;
  }

  // -------- tabela de saída ---------------------------------------------------
  function fmtTot(t) { return Math.floor(t / 60) + "h" + ("0" + (t % 60)).slice(-2); }

  function mostraTabela(ma, sug, conf) {
    var antigo = document.getElementById("sugestorRef");
    if (antigo) antigo.remove();
    var parUnico = !CONFIG.comAlmoco && !CONFIG.comDesporto;

    var linhas = sug.map(function (r) {
      var cols;
      if (r.blocos) {
        var b = r.blocos;
        cols = "<td>" + minParaHm(b.manha[0]) + "–" + minParaHm(b.manha[1]) + "</td>" +
               "<td>" + minParaHm(b.tarde[0]) + "–" + minParaHm(b.tarde[1]) + "</td>" +
               "<td>" + (b.desporto ? minParaHm(b.desporto[0]) + "–" + minParaHm(b.desporto[1]) : "—") + "</td>";
      } else {
        // par único: destaca o que JÁ existe (fixo) e o que você deve digitar
        var ent = (r.entradaFixa ? "<span style='color:#888'>" + minParaHm(r.entrada) + " (já)</span>"
                                 : "<b>" + minParaHm(r.entrada) + "</b>");
        var sai = (r.saidaFixa ? "<span style='color:#888'>" + minParaHm(r.saida) + " (já)</span>"
                               : "<b>" + minParaHm(r.saida) + "</b>");
        cols = "<td>" + ent + "</td><td>" + sai + "</td>";
      }
      return "<tr><td style='text-align:center'><b>" + r.dia + "</b></td>" + cols +
             "<td style='text-align:center'>" + fmtTot(r.total || (r.blocos && r.blocos.total)) + "</td>" +
             "<td style='font-size:11px;color:#555'>" + r.add + "</td></tr>";
    }).join("");

    var cabTempo = parUnico
      ? "<th>Entrada</th><th>Saída</th>"
      : "<th>Manhã</th><th>Tarde</th><th>Desporto</th>";

    var blocoConf = conf.length
      ? "<div style='margin-top:10px'><b style='color:#b26a00'>Conferir à mão (" + conf.length + "):</b>" +
        "<table style='border-collapse:collapse;margin-top:4px' border='1' cellpadding='4'>" +
        conf.map(function (c) {
          return "<tr><td style='text-align:center'><b>" + c.dia + "</b></td>" +
                 "<td style='font-size:11px'>" + c.motivo + "</td></tr>";
        }).join("") + "</table></div>"
      : "";

    var div = document.createElement("div");
    div.id = "sugestorRef";
    div.style.cssText =
      "position:fixed;top:12px;right:12px;z-index:99999;background:#fff;color:#000;" +
      "border:2px solid #333;border-radius:8px;padding:12px 14px;font:12px/1.45 Arial;" +
      "box-shadow:0 2px 12px rgba(0,0,0,.35);max-height:92vh;overflow:auto;min-width:300px";
    div.innerHTML =
      "<b>Preenche REF — sugestão " + ("0" + ma.mes).slice(-2) + "/" + ma.ano + "</b>" +
      "<div style='font-size:11px;color:#666;margin:2px 0 8px'>" +
        (parUnico ? "sem almoço / sem desporto (um par por dia)" :
          ((CONFIG.comAlmoco ? "com almoço" : "sem almoço") + " · " + (CONFIG.comDesporto ? "com desporto" : "sem desporto"))) +
        " · entrada ≥ " + CONFIG.minEntrada.slice(0,2) + ":" + CONFIG.minEntrada.slice(2) +
        " · total " + CONFIG.totalMin.slice(0,2) + ":" + CONFIG.totalMin.slice(2) +
        "–" + CONFIG.totalMax.slice(0,2) + ":" + CONFIG.totalMax.slice(2) + "</div>" +
      (sug.length ?
        "<table style='border-collapse:collapse' border='1' cellpadding='5'>" +
          "<thead><tr style='background:#f0f0f0'><th>Dia</th>" + cabTempo +
          "<th>Total</th><th>Digitar</th></tr></thead><tbody>" + linhas + "</tbody></table>"
        : "<div style='color:#2e7d32'><b>Nada a preencher neste mês.</b></div>") +
      "<div style='font-size:11px;color:#888;margin-top:6px'>" +
        "Cinza <i>(já)</i> = valor que já está lançado; <b>negrito</b> = o que você digita." +
        " Somente sugestão — nada foi enviado.</div>" +
      blocoConf +
      "<div style='margin-top:8px'><button id='sugRecalc'>Sortear de novo</button> " +
        "<button id='sugFecha'>Fechar</button></div>";
    document.body.appendChild(div);
    document.getElementById("sugFecha").onclick = function () { div.remove(); };
    document.getElementById("sugRecalc").onclick = function () { main(); };
  }

  main();
})();
