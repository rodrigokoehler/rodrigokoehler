/* ============================================================================
 *  Preenche REF v6 — Parte 2b (passo 1): preenche o PAR aberto (seguro)
 * ----------------------------------------------------------------------------
 *  Quando a janelinha está aberta em "Registro Manual de Frequência", este
 *  script mostra um paininho com os horários do DIA aberto (manhã, tarde e
 *  desporto) e, ao clicar num deles, PREENCHE os dois campos de hora
 *  (Entrada/Início e Saída/Término) para você.
 *
 *  Ele NÃO clica em Salvar — você confere e salva. Assim, se algo sair
 *  errado, você vê antes de gravar. É o primeiro passo, proposital: depois
 *  que você confirmar que preenche certo, evoluímos para automático.
 *
 *  Fluxo por dia (com almoço + desporto, como abril):
 *    1) preenche a MANHÃ  -> você clica Salvar
 *    2) preenche a TARDE  -> você clica Salvar
 *    3) o DESPORTO é "Ocorrência" (prática desportiva), não registro manual;
 *       por ora, faça-o à mão — trataremos dele no próximo passo.
 *
 *  COMO USAR: abra um dia, marque "Registro Manual de Frequência", F12 →
 *  Console, cole este arquivo, Enter. Clique no botão do turno; confira; Salvar.
 * ==========================================================================*/

(function () {
  "use strict";

  // ------- config (igual ao sugestor de abril) -------
  var CONFIG = {
    entradaManha: "1000", saidaAlmoco: "1300", voltaAlmoco: "1400",
    desportoIni: "2000", desportoFim: "2100",
    minEntrada: "1000", totalMin: "0901", totalMax: "0911", variacaoMin: 8
  };
  function hm(s) { return parseInt(s.slice(0, 2), 10) * 60 + parseInt(s.slice(2), 10); }
  function mp(m) { return ("0" + Math.floor(m / 60)).slice(-2) + ":" + ("0" + (m % 60)).slice(-2); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

  // ------- acha os 2 campos de hora visíveis do modo manual -------
  function camposHora() {
    return Array.prototype.slice.call(document.querySelectorAll("input.mascaraHora"))
      .filter(function (el) { var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  }

  // ------- descobre o dia aberto na janelinha (ex.: "01-Quarta-feira") -------
  function diaAberto() {
    var txt = document.body.innerText;
    var m = txt.match(/(\d{2})\s*-\s*(Segunda|Ter[çc]a|Quarta|Quinta|Sexta|S[áa]bado|Domingo)[-\wçãáéê]*/i);
    return m ? { num: parseInt(m[1], 10), nome: m[2] } : null;
  }

  // ------- calcula manhã/tarde/desporto de um dia -------
  function calculaDia() {
    var jit = CONFIG.variacaoMin, minEnt = hm(CONFIG.minEntrada);
    var totMin = hm(CONFIG.totalMin), totMax = hm(CONFIG.totalMax);
    var e1b = hm(CONFIG.entradaManha), durManha = hm(CONFIG.saidaAlmoco) - e1b;
    var almoco = hm(CONFIG.voltaAlmoco) - hm(CONFIG.saidaAlmoco);
    var despDur = hm(CONFIG.desportoFim) - hm(CONFIG.desportoIni);
    for (var t = 0; t < 200; t++) {
      var e1 = e1b + rnd(0, jit); if (e1 < minEnt) continue;
      var s1 = e1 + durManha, e2 = s1 + almoco;
      var tot = rnd(totMin, totMax); if (tot % 60 === 0) continue;
      var s2 = e2 + (tot - despDur - durManha);
      if (s2 <= e2 || s2 >= hm(CONFIG.desportoIni)) continue;
      return {
        manha: [e1, s1], tarde: [e2, s2],
        desporto: [hm(CONFIG.desportoIni), hm(CONFIG.desportoFim)], total: tot
      };
    }
    return null;
  }

  // ------- escreve um horário no campo, acionando a máscara -------
  function setHora(el, hhmm) {
    if (window.jQuery) {
      window.jQuery(el).val(hhmm).trigger("input").trigger("keyup").trigger("change").trigger("blur");
    } else {
      el.value = hhmm;
      ["input", "keyup", "change", "blur"].forEach(function (ev) {
        el.dispatchEvent(new Event(ev, { bubbles: true }));
      });
    }
  }

  function preenchePar(par) {
    var c = camposHora();
    if (c.length < 2) {
      alert("Não achei os dois campos de hora. A janelinha está aberta em 'Registro Manual de Frequência'?");
      return;
    }
    setHora(c[0], mp(par[0]));   // Entrada/Início
    setHora(c[1], mp(par[1]));   // Saída/Término
  }

  // ------- painel -------
  function botao(rot, par, cor) {
    return "<button data-e='" + par[0] + "' data-s='" + par[1] + "' style='display:block;width:100%;margin:3px 0;" +
      "padding:6px;background:" + cor + ";border:1px solid #999;border-radius:4px;cursor:pointer;text-align:left'>" +
      "<b>" + rot + "</b>: " + mp(par[0]) + " – " + mp(par[1]) + "</button>";
  }

  function render() {
    var d = calculaDia();
    var dia = diaAberto();
    var old = document.getElementById("preenchePar");
    if (old) old.remove();
    var div = document.createElement("div");
    div.id = "preenchePar";
    div.style.cssText = "position:fixed;top:8px;left:8px;z-index:2147483647;background:#fff;color:#000;" +
      "border:2px solid #2c6;border-radius:8px;padding:10px 12px;font:13px Arial;box-shadow:0 2px 10px rgba(0,0,0,.3)";
    div.innerHTML =
      "<div style='margin-bottom:6px'><b>Preenche REF — dia " +
        (dia ? dia.num : "?") + "</b>  <span style='font-size:11px;color:#666'>total " +
        (d ? Math.floor(d.total / 60) + "h" + ("0" + d.total % 60).slice(-2) : "?") + "</span></div>" +
      (d ? botao("Manhã", d.manha, "#e8f5e9") + botao("Tarde", d.tarde, "#e8f5e9") +
           botao("Desporto (via Ocorrência)", d.desporto, "#fff3e0") : "<div>erro no cálculo</div>") +
      "<div style='font-size:11px;color:#777;margin-top:6px'>Clique num turno → confere os campos → clique <b>Salvar</b> na janelinha.<br>" +
      "Desporto é 'Ocorrência': por ora lance à mão. Nada é salvo por este script.</div>" +
      "<div style='margin-top:6px'><button id='ppOutro'>Outro sorteio</button> <button id='ppFecha'>Fechar</button></div>";
    document.body.appendChild(div);

    Array.prototype.forEach.call(div.querySelectorAll("button[data-e]"), function (b) {
      b.onclick = function () { preenchePar([parseInt(b.getAttribute("data-e"), 10), parseInt(b.getAttribute("data-s"), 10)]); };
    });
    document.getElementById("ppFecha").onclick = function () { div.remove(); };
    document.getElementById("ppOutro").onclick = function () { render(); };
  }

  render();
})();
