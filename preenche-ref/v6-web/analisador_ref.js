/* ============================================================================
 *  Preenche REF v6 — Parte 1: Analisador (somente leitura)
 * ----------------------------------------------------------------------------
 *  Roda DENTRO da página do REF (Registro Eletrônico de Frequência) e:
 *    • descobre o mês/ano em exibição;
 *    • calcula feriados (fixos + móveis: Carnaval, Sexta Santa, Corpus Christi)
 *      para AQUELE ano, sem nenhuma lista fixa — vale para qualquer ano;
 *    • olha cada dia e classifica em:
 *        VERDE   = já tem horário lançado
 *        CINZA   = não precisa (fim de semana ou feriado)
 *        AMARELO = dia útil ainda VAZIO (é o que falta preencher)
 *    • pinta cada linha e mostra um resumo flutuante no canto.
 *
 *  Não altera nada no sistema, não envia nada — só lê e colore. É seguro.
 *
 *  COMO USAR (jeito mais simples, sem instalar nada):
 *    1. Abra a tela do REF no mês desejado (Chrome ou Firefox);
 *    2. Tecle F12 para abrir as Ferramentas do Desenvolvedor;
 *    3. Clique na aba "Console";
 *    4. Cole TODO este arquivo e tecle Enter.
 *  Para repetir em outro mês, navegue e cole de novo.
 * ==========================================================================*/

(function () {
  "use strict";

  // -------- 1. Feriados calculados (nenhuma lista com prazo de validade) -----

  // Domingo de Páscoa pelo algoritmo de Meeus/Butcher. Recebe o ano,
  // devolve um objeto Date. Toda a aritmética é de números inteiros.
  function domingoDePascoa(ano) {
    var a = ano % 19;
    var b = Math.floor(ano / 100);
    var c = ano % 100;
    var d = Math.floor(b / 4);
    var e = b % 4;
    var f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4);
    var k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var mes = Math.floor((h + l - 7 * m + 114) / 31); // 3 = março, 4 = abril
    var dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(ano, mes - 1, dia); // no JS, mês começa em 0
  }

  // Devolve um "conjunto" com os feriados do ano no formato "dd/mm".
  function feriadosDoAno(ano) {
    var fixos = ["01/01", "21/04", "01/05", "07/09", "12/10", "02/11", "15/11", "25/12"];
    var conjunto = {};
    fixos.forEach(function (d) { conjunto[d] = true; });

    var pascoa = domingoDePascoa(ano);
    // Carnaval (seg/ter) = 48/47 dias antes; Sexta Santa = 2 antes; Corpus = 60 depois
    [-48, -47, -2, 60].forEach(function (desloca) {
      var d = new Date(pascoa.getTime());
      d.setDate(d.getDate() + desloca);
      var dd = ("0" + d.getDate()).slice(-2);
      var mm = ("0" + (d.getMonth() + 1)).slice(-2);
      conjunto[dd + "/" + mm] = true;
    });
    return conjunto;
  }

  // -------- 2. Descobrir o mês/ano que a tela está mostrando ------------------

  // O rótulo "REGISTROS DE FREQUÊNCIA: 03/2026" traz o mês e o ano.
  function descobreMesAno() {
    var texto = document.body.innerText;
    var m = texto.match(/REGISTROS DE FREQU[EÊ]NCIA:\s*(\d{2})\/(\d{4})/i);
    if (!m) return null;
    return { mes: parseInt(m[1], 10), ano: parseInt(m[2], 10) };
  }

  // -------- 3. Encontrar as linhas de cada dia --------------------------------

  // Cada dia é uma linha cuja primeira célula começa com "N -DiaDaSemana".
  // Procuramos por esse padrão em vez de usar IDs (que o sistema gera
  // automaticamente e mudam a cada sessão).
  function achaLinhasDeDia() {
    var linhas = [];
    var trs = document.querySelectorAll("tr");
    for (var i = 0; i < trs.length; i++) {
      var celulas = trs[i].querySelectorAll("td");
      if (celulas.length < 10) continue; // linha de dia tem ~14 colunas
      var primeira = (celulas[0].innerText || "").trim();
      var m = primeira.match(/^(\d{1,2})\s*-\s*(.+)$/);
      if (!m) continue;
      linhas.push({
        tr: trs[i],
        celulas: celulas,
        dia: parseInt(m[1], 10),
        nomeDiaSemana: m[2].trim()
      });
    }
    return linhas;
  }

  // Um dia está "preenchido" se alguma das 8 colunas de Entrada/Saída
  // (as células 1 a 8, logo após o nome do dia) tiver um horário HH:MM.
  // As duas últimas colunas são totais e devem ser ignoradas.
  function temHorario(celulas) {
    for (var c = 1; c <= 8 && c < celulas.length; c++) {
      if (/\d{1,2}:\d{2}/.test((celulas[c].innerText || ""))) return true;
    }
    return false;
  }

  // -------- 4. Classificar e pintar -------------------------------------------

  var CORES = {
    feito: "#c8e6c9",   // verde
    pular: "#eeeeee",   // cinza
    falta: "#fff3b0"    // amarelo
  };

  function main() {
    var ma = descobreMesAno();
    if (!ma) {
      alert("Não achei o mês/ano na tela. Abra a aba de Registros de Frequência primeiro.");
      return;
    }
    var feriados = feriadosDoAno(ma.ano);
    var linhas = achaLinhasDeDia();
    var contagem = { feito: 0, pular: 0, falta: 0 };
    var listaFalta = [];

    linhas.forEach(function (L) {
      var ddmm = ("0" + L.dia).slice(-2) + "/" + ("0" + ma.mes).slice(-2);
      var nome = L.nomeDiaSemana.toLowerCase();
      var fimDeSemana = nome.indexOf("bado") >= 0 || nome.indexOf("domingo") >= 0;
      var ehFeriado = !!feriados[ddmm];

      var estado;
      if (temHorario(L.celulas)) estado = "feito";
      else if (fimDeSemana || ehFeriado) estado = "pular";
      else estado = "falta";

      contagem[estado]++;
      if (estado === "falta") listaFalta.push(L.dia);

      // Pinta a linha E cada célula. O site tem cor própria nas células
      // (classe CSS), então usamos setProperty com "important" para a nossa
      // marcação sempre vencer. É só cor de fundo — nada do conteúdo muda.
      L.tr.style.setProperty("background-color", CORES[estado], "important");
      for (var c = 0; c < L.celulas.length; c++) {
        L.celulas[c].style.setProperty("background-color", CORES[estado], "important");
      }
      // marca o motivo do cinza, para o usuário entender
      if (estado === "pular" && ehFeriado && !fimDeSemana) {
        L.celulas[0].title = "Feriado";
        L.celulas[0].style.fontStyle = "italic";
      }
    });

    mostraResumo(ma, contagem, listaFalta, feriados);
  }

  // -------- 5. Painel de resumo no canto da tela ------------------------------

  function mostraResumo(ma, contagem, listaFalta, feriados) {
    var antigo = document.getElementById("painelPreencheRef");
    if (antigo) antigo.remove();

    var nomesFeriados = Object.keys(feriados)
      .filter(function (d) { return d.slice(3) === ("0" + ma.mes).slice(-2); })
      .sort();

    var div = document.createElement("div");
    div.id = "painelPreencheRef";
    div.style.cssText =
      "position:fixed;top:12px;right:12px;z-index:99999;background:#fff;" +
      "border:2px solid #333;border-radius:8px;padding:12px 14px;" +
      "font:13px/1.5 Arial,sans-serif;color:#000;box-shadow:0 2px 10px rgba(0,0,0,.3);" +
      "max-width:270px";
    div.innerHTML =
      "<b>Preenche REF — análise " + ("0" + ma.mes).slice(-2) + "/" + ma.ano + "</b>" +
      "<hr style='margin:6px 0'>" +
      linha(CORES.falta, "A preencher (dia útil vazio): <b>" + contagem.falta + "</b>") +
      linha(CORES.feito, "Já preenchidos: " + contagem.feito) +
      linha(CORES.pular, "Pulados (fim de semana/feriado): " + contagem.pular) +
      (listaFalta.length
        ? "<div style='margin-top:8px'>Dias a preencher: <b>" + listaFalta.join(", ") + "</b></div>"
        : "<div style='margin-top:8px;color:#2e7d32'><b>Nada a preencher neste mês.</b></div>") +
      (nomesFeriados.length
        ? "<div style='margin-top:8px;color:#555'>Feriados detectados: " + nomesFeriados.join(", ") + "</div>"
        : "") +
      "<div style='margin-top:8px;font-size:11px;color:#888'>Somente leitura — nada foi enviado.</div>" +
      "<button id='fechaPainelRef' style='margin-top:8px'>Fechar</button>";
    document.body.appendChild(div);
    document.getElementById("fechaPainelRef").onclick = function () { div.remove(); };
  }

  function linha(cor, texto) {
    return "<div style='margin:2px 0'><span style='display:inline-block;width:12px;" +
      "height:12px;background:" + cor + ";border:1px solid #999;margin-right:6px;" +
      "vertical-align:middle'></span>" + texto + "</div>";
  }

  main();
})();
