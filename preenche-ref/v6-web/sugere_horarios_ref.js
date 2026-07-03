/* ============================================================================
 *  Preenche REF v6 — Parte 2a: Sugestor de horários (somente leitura)
 * ----------------------------------------------------------------------------
 *  Roda DENTRO da página do REF. Para cada dia útil ainda VAZIO, calcula os
 *  horários a lançar seguindo as mesmas regras da versão 5.2 do programa:
 *
 *    • entrada do expediente nunca antes de um mínimo (padrão 10:00);
 *    • total de horas do dia sorteado numa faixa (padrão 09:01 a 09:11),
 *      nunca em hora exata (ex.: 09:00) e nunca igual ao total do dia anterior;
 *    • pequena variação aleatória na posição dos horários;
 *    • se houver prática desportiva, a 1 hora dela conta dentro do total.
 *
 *  NÃO preenche nem envia nada — apenas MOSTRA, numa tabela, o que digitar em
 *  cada dia. Você lança manualmente (por enquanto). É 100% seguro.
 *
 *  COMO USAR: abra o REF no mês desejado, tecle F12 → aba Console, cole este
 *  arquivo inteiro e tecle Enter. Ajuste as opções no bloco CONFIG abaixo.
 * ==========================================================================*/

(function () {
  "use strict";

  /* ----------------------------- CONFIG ------------------------------------
   * Mude aqui se quiser. Horários no formato "HHMM" (quatro dígitos).
   */
  var CONFIG = {
    comDesporto:   true,       // inclui 1h de prática desportiva no dia?
    entradaManha:  "1000",     // base da entrada do expediente
    saidaAlmoco:   "1300",     // base da saída para o almoço
    voltaAlmoco:   "1400",     // base da volta do almoço
    // a saída do expediente é CALCULADA para fechar o total; o valor abaixo
    // é só um ponto de partida para a variação:
    saidaExped:    "1800",
    desportoIni:   "2000",     // início da prática desportiva
    desportoFim:   "2100",     // fim da prática desportiva (1 hora)
    minEntrada:    "1000",     // entrada nunca antes disto
    totalMin:      "0901",     // menor total do dia (HHMM)
    totalMax:      "0911",     // maior total do dia (HHMM)
    variacaoMin:   8           // variação máxima, em minutos, na posição
  };

  // -------- utilidades de tempo (minutos desde a meia-noite) -----------------
  function hmParaMin(hm) { return parseInt(hm.slice(0, 2), 10) * 60 + parseInt(hm.slice(2), 10); }
  function minParaHm(m)  { var h = Math.floor(m / 60), mm = m % 60;
                           return ("0" + h).slice(-2) + ":" + ("0" + mm).slice(-2); }
  function sorteio(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); } // inteiro em [a,b]

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

  // -------- leitura da tela (igual ao analisador) ----------------------------
  function descobreMesAno() {
    var m = document.body.innerText.match(/REGISTROS DE FREQU[EÊ]NCIA:\s*(\d{2})\/(\d{4})/i);
    return m ? { mes: +m[1], ano: +m[2] } : null;
  }
  function achaLinhasDeDia() {
    var linhas = [];
    document.querySelectorAll("tr").forEach(function (tr) {
      var c = tr.querySelectorAll("td");
      if (c.length < 10) return;
      var m = (c[0].innerText || "").trim().match(/^(\d{1,2})\s*-\s*(.+)$/);
      if (m) linhas.push({ dia: +m[1], nome: m[2].trim().toLowerCase(), celulas: c });
    });
    return linhas;
  }
  function temHorario(c) {
    for (var i = 1; i <= 8 && i < c.length; i++)
      if (/\d{1,2}:\d{2}/.test(c[i].innerText || "")) return true;
    return false;
  }

  // -------- o cálculo de um dia (porte das regras da v5.2) -------------------
  // Devolve {manha:[e,s], tarde:[e,s], desporto:[e,s]|null, totalMin} ou null.
  function calculaDia(minEnt, totMin, totMax, ultimoTotal) {
    var jit = CONFIG.variacaoMin;
    var baseE1 = hmParaMin(CONFIG.entradaManha), baseS1 = hmParaMin(CONFIG.saidaAlmoco);
    var baseE2 = hmParaMin(CONFIG.voltaAlmoco);
    var duracaoManha = baseS1 - baseE1;         // ex.: 3h
    var almoco = baseE2 - baseS1;               // ex.: 1h de intervalo
    var despDur = CONFIG.comDesporto ? 60 : 0;  // desporto sempre 1h

    // tenta várias vezes até achar uma combinação que respeite todas as regras
    for (var tentativa = 0; tentativa < 200; tentativa++) {
      // 1) sorteia deslocamentos de posição (jitter) para manhã e desporto
      var dManha = sorteio(-jit, jit);
      var e1 = baseE1 + dManha;
      if (e1 < minEnt) continue;                 // entrada nunca antes do mínimo
      var s1 = e1 + duracaoManha;                // manhã mantém a duração-base
      var e2 = s1 + almoco;                       // volta do almoço após o intervalo

      // 2) sorteia o total do dia dentro da faixa, sem hora exata nem repetição
      var total = sorteio(totMin, totMax);
      if (total % 60 === 0 || total === ultimoTotal) continue;

      // 3) a saída do expediente fecha o total (descontando manhã e desporto)
      var expedienteTarde = total - despDur - duracaoManha;
      var s2 = e2 + expedienteTarde;
      if (s2 <= e2) continue;

      var desp = null;
      if (CONFIG.comDesporto) {
        var dDesp = sorteio(-jit, jit);
        var de = hmParaMin(CONFIG.desportoIni) + dDesp;
        var ds = de + 60;
        // desporto não pode colidir com o expediente nem passar da meia-noite
        if (de <= s2 || ds > 1439) continue;
        desp = [de, ds];
      } else {
        if (s2 > 1439) continue;
      }

      return {
        manha: [e1, s1], tarde: [e2, s2], desporto: desp, totalMin: total
      };
    }
    return null; // não conseguiu (faixa muito estreita para as bases dadas)
  }

  // -------- monta a tabela de sugestões --------------------------------------
  function main() {
    var ma = descobreMesAno();
    if (!ma) { alert("Abra a aba de Registros de Frequência primeiro."); return; }
    var feriados = feriadosDoAno(ma.ano);
    var minEnt = hmParaMin(CONFIG.minEntrada);
    var totMin = hmParaMin(CONFIG.totalMin), totMax = hmParaMin(CONFIG.totalMax);
    if (totMin >= totMax) { alert("total mínimo deve ser menor que o máximo"); return; }

    var ultimoTotal = -1;
    var linhasSaida = [];
    achaLinhasDeDia().forEach(function (L) {
      var ddmm = ("0" + L.dia).slice(-2) + "/" + ("0" + ma.mes).slice(-2);
      var fds = L.nome.indexOf("bado") >= 0 || L.nome.indexOf("domingo") >= 0;
      if (fds || feriados[ddmm] || temHorario(L.celulas)) return; // pula: não precisa
      var d = calculaDia(minEnt, totMin, totMax, ultimoTotal);
      if (!d) { linhasSaida.push({ dia: L.dia, erro: true }); return; }
      ultimoTotal = d.totalMin;
      linhasSaida.push({ dia: L.dia, d: d });
    });

    mostraTabela(ma, linhasSaida);
  }

  function par(v) { return minParaHm(v[0]) + "–" + minParaHm(v[1]); }

  function mostraTabela(ma, linhas) {
    var antigo = document.getElementById("sugestorRef");
    if (antigo) antigo.remove();

    var corpo = linhas.map(function (r) {
      if (r.erro)
        return "<tr><td>" + r.dia + "</td><td colspan='4' style='color:#c00'>" +
               "não foi possível (ajuste a faixa/bases no CONFIG)</td></tr>";
      var d = r.d;
      var h = Math.floor(d.totalMin / 60), m = d.totalMin % 60;
      return "<tr>" +
        "<td style='text-align:center'><b>" + r.dia + "</b></td>" +
        "<td>" + par(d.manha) + "</td>" +
        "<td>" + par(d.tarde) + "</td>" +
        "<td>" + (d.desporto ? par(d.desporto) : "—") + "</td>" +
        "<td style='text-align:center'>" + h + "h" + ("0" + m).slice(-2) + "</td>" +
        "</tr>";
    }).join("");

    var div = document.createElement("div");
    div.id = "sugestorRef";
    div.style.cssText =
      "position:fixed;top:12px;right:12px;z-index:99999;background:#fff;color:#000;" +
      "border:2px solid #333;border-radius:8px;padding:12px 14px;font:12px/1.45 Arial;" +
      "box-shadow:0 2px 12px rgba(0,0,0,.35);max-height:90vh;overflow:auto";
    div.innerHTML =
      "<b>Preenche REF — sugestão de horários " +
        ("0" + ma.mes).slice(-2) + "/" + ma.ano + "</b>" +
      "<div style='font-size:11px;color:#666;margin:2px 0 8px'>" +
        (CONFIG.comDesporto ? "com" : "sem") + " prática desportiva · " +
        "entrada ≥ " + CONFIG.minEntrada.slice(0,2) + ":" + CONFIG.minEntrada.slice(2) +
        " · total " + CONFIG.totalMin.slice(0,2) + ":" + CONFIG.totalMin.slice(2) +
        "–" + CONFIG.totalMax.slice(0,2) + ":" + CONFIG.totalMax.slice(2) + "</div>" +
      (linhas.length ?
        "<table style='border-collapse:collapse' border='1' cellpadding='5'>" +
          "<thead><tr style='background:#f0f0f0'>" +
            "<th>Dia</th><th>Manhã</th><th>Tarde</th><th>Desporto</th><th>Total</th>" +
          "</tr></thead><tbody>" + corpo + "</tbody></table>"
        : "<div style='color:#2e7d32'><b>Nenhum dia útil vazio neste mês.</b></div>") +
      "<div style='margin-top:8px;font-size:11px;color:#888'>" +
        "Somente sugestão — nada foi enviado. Cada linha é um dia; " +
        "Manhã e Tarde são dois registros; Desporto é um terceiro.</div>" +
      "<div style='margin-top:6px'>" +
        "<button id='sugRecalc'>Sortear de novo</button> " +
        "<button id='sugFecha'>Fechar</button></div>";
    document.body.appendChild(div);
    document.getElementById("sugFecha").onclick = function () { div.remove(); };
    document.getElementById("sugRecalc").onclick = function () { main(); };
  }

  main();
})();
