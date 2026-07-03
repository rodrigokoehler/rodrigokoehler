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

  // ------- (desporto) acha o <select> de Ocorrência (tem "Prática desportiva") -------
  function selectOcorrencia() {
    var sels = document.querySelectorAll("select");
    for (var i = 0; i < sels.length; i++) {
      var r = sels[i].getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      for (var o = 0; o < sels[i].options.length; o++) {
        if (/pr[aá]tica\s+desportiva/i.test(sels[i].options[o].text)) return sels[i];
      }
    }
    return null;
  }

  // espera (polling) até a condição virar verdadeira, então chama cb
  function espera(cond, cb, tentativas) {
    tentativas = tentativas == null ? 20 : tentativas;
    var r = cond();
    if (r) return cb(r);
    if (tentativas <= 0) return cb(null);
    setTimeout(function () { espera(cond, cb, tentativas - 1); }, 150);
  }

  // preenche um par nos campos de hora VISÍVEIS (manhã/tarde no modo manual)
  function preenchePar(par) {
    var c = camposHora();
    if (c.length < 2) {
      alert("Não achei os dois campos de hora. A janelinha está aberta em 'Registro Manual de Frequência'?");
      return;
    }
    setHora(c[0], mp(par[0]));
    setHora(c[1], mp(par[1]));
  }

  // desporto: seleciona "Prática desportiva" na Ocorrência e preenche os horários
  function preencheDesporto(par) {
    var sel = selectOcorrencia();
    if (!sel) {
      alert("Para o desporto, marque primeiro a bolinha 'Ocorrência' na janelinha (aí aparece a lista com 'Prática desportiva').");
      return;
    }
    var opt = null;
    for (var o = 0; o < sel.options.length; o++) {
      if (/pr[aá]tica\s+desportiva/i.test(sel.options[o].text)) { opt = sel.options[o]; break; }
    }
    if (!opt) { alert("Não achei 'Prática desportiva' na lista."); return; }
    if (window.jQuery) window.jQuery(sel).val(opt.value).trigger("change");
    else { sel.value = opt.value; sel.dispatchEvent(new Event("change", { bubbles: true })); }
    // após escolher, os campos de hora podem (re)aparecer via AJAX — espera e preenche
    espera(function () { var c = camposHora(); return c.length >= 2 ? c : null; }, function (c) {
      if (!c) { alert("Os campos de hora do desporto não apareceram. Selecione 'Prática desportiva' e tente de novo."); return; }
      setHora(c[0], mp(par[0]));
      setHora(c[1], mp(par[1]));
    });
  }

  // ------- painel -------
  function botao(rot, par, cor, tipo) {
    return "<button data-e='" + par[0] + "' data-s='" + par[1] + "'" +
      (tipo ? " data-tipo='" + tipo + "'" : "") + " style='display:block;width:100%;margin:3px 0;" +
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
           botao("Desporto (Prática desportiva)", d.desporto, "#fff3e0", "desporto") : "<div>erro no cálculo</div>") +
      "<div style='font-size:11px;color:#777;margin-top:6px'>Clique num turno → confere os campos → clique <b>Salvar</b> na janelinha.<br>" +
      "Desporto é 'Ocorrência': por ora lance à mão. Nada é salvo por este script.</div>" +
      "<div style='margin-top:6px'><button id='ppOutro'>Outro sorteio</button> <button id='ppFecha'>Fechar</button></div>";
    document.body.appendChild(div);

    Array.prototype.forEach.call(div.querySelectorAll("button[data-e]"), function (b) {
      b.onclick = function () {
        var par = [parseInt(b.getAttribute("data-e"), 10), parseInt(b.getAttribute("data-s"), 10)];
        if (b.getAttribute("data-tipo") === "desporto") preencheDesporto(par);
        else preenchePar(par);
      };
    });
    document.getElementById("ppFecha").onclick = function () { div.remove(); };
    document.getElementById("ppOutro").onclick = function () { render(); };
  }

  render();
})();
