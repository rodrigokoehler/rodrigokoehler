/* ============================================================================
 *  Preenche REF v6 — Inspetor da janela de lançamento manual
 * ----------------------------------------------------------------------------
 *  Em vez de BAIXAR um arquivo (que o Chrome bloqueia em página HTTP), este
 *  script LISTA os campos da janelinha numa caixa de texto na própria tela,
 *  já selecionada, para você copiar (Ctrl+C) e colar aqui no chat.
 *
 *  COMO USAR:
 *    1. Clique num dia VAZIO para abrir a janelinha "Detalhamento dos Registros";
 *    2. Marque "Registro Manual de Frequência" (aparecem os campos de hora);
 *    3. F12 → Console, cole este arquivo, Enter;
 *    4. Uma caixa aparece no topo da tela com o texto JÁ SELECIONADO —
 *       tecle Ctrl+C e cole aqui na conversa.
 *
 *  Não altera nem envia nada. Só lê a estrutura da tela.
 * ==========================================================================*/

(function () {
  "use strict";

  function achaModal() {
    var m = document.getElementById("modalIncluirRegistro")
         || document.getElementById("modalIncluirRegistroContainer");
    if (m) return m;
    var hs = document.querySelectorAll("[id*='Header'], .rich-mpnl-header");
    for (var i = 0; i < hs.length; i++) {
      if (/Detalhamento dos Registros/i.test(hs[i].innerText || "")) {
        return hs[i].closest("div[id*='modal']") || hs[i].parentElement;
      }
    }
    return null;
  }

  // texto do cabeçalho da coluna onde o campo está (ex.: "Entrada/Início")
  function cabecalhoColuna(el) {
    var td = el.closest("td");
    if (!td || !td.parentElement) return "";
    var idx = Array.prototype.indexOf.call(td.parentElement.children, td);
    var table = el.closest("table");
    if (!table) return "";
    var head = table.querySelector("thead tr") || table.querySelector("tr");
    if (!head || !head.children[idx]) return "";
    return (head.children[idx].innerText || "").trim().replace(/\s+/g, " ").slice(0, 25);
  }

  // rótulo/seção mais próximo acima do campo (ex.: "Horário")
  function secaoPerto(el) {
    var no = el;
    for (var i = 0; i < 8 && no; i++) {
      no = no.parentElement;
      if (!no) break;
      var t = (no.innerText || "").trim().replace(/\s+/g, " ");
      if (/Hor[aá]rio|Ocorr|Observa|Registro Manual/i.test(t) && t.length < 60) return t.slice(0, 40);
    }
    return "";
  }

  var modal = achaModal();
  if (!modal) {
    alert("Não achei a janelinha 'Detalhamento dos Registros'. Abra um dia e marque 'Registro Manual de Frequência' antes de rodar.");
    return;
  }

  var linhas = [];
  var visiveis = 0;
  modal.querySelectorAll("input, select, textarea").forEach(function (el, i) {
    var r = el.getBoundingClientRect();
    var vis = (r.width > 0 && r.height > 0);
    if (vis && (el.tagName === "INPUT" && el.type === "text" || el.tagName === "SELECT" || el.tagName === "TEXTAREA")) visiveis++;
    linhas.push(
      i + "| " + el.tagName.toLowerCase() +
      " type=" + (el.type || "-") +
      " vis=" + (vis ? "S" : "n") +
      " maxlen=" + (el.getAttribute("maxlength") || "-") +
      " col='" + cabecalhoColuna(el) + "'" +
      " secao='" + secaoPerto(el) + "'" +
      " name=" + (el.name || "-") +
      " id=" + (el.id || "-") +
      " cls=" + (el.className || "-").slice(0, 30)
    );
  });

  // também: os radios (Ocorrência/Manual), o botão Salvar e o +/- de navegação
  var extras = [];
  modal.querySelectorAll("input[type=radio], input[type=button], input[type=submit], a[onclick], img[onclick]").forEach(function (el) {
    var txt = (el.value || el.title || el.alt || (el.innerText || "")).trim().slice(0, 20);
    var oc = (el.getAttribute("onclick") || "").replace(/\s+/g, " ").slice(0, 60);
    extras.push("  " + el.tagName.toLowerCase() + " type=" + (el.type || "-") +
      " val/txt='" + txt + "' name=" + (el.name || "-") + " id=" + (el.id || "-") +
      (oc ? " onclick~" + oc : ""));
  });

  var texto =
    "=== MODAL id=" + (modal.id || "?") + " | campos visíveis(text/select/textarea)=" + visiveis + " ===\n" +
    "CAMPOS:\n" + linhas.join("\n") +
    "\n\nBOTOES/RADIOS/ACOES:\n" + extras.join("\n") +
    "\n=== fim ===";

  var box = document.getElementById("inspetorRefBox");
  if (box) box.remove();
  var wrap = document.createElement("div");
  wrap.id = "inspetorRefBox";
  wrap.style.cssText = "position:fixed;top:8px;left:8px;z-index:999999;background:#fff;" +
    "border:2px solid #b00;border-radius:6px;padding:8px;font:12px Arial";
  wrap.innerHTML = "<div style='margin-bottom:4px'><b>Copie tudo abaixo (Ctrl+C) e cole no chat.</b> " +
    "<button id='inspFecha'>Fechar</button></div>";
  var ta = document.createElement("textarea");
  ta.value = texto;
  ta.style.cssText = "width:640px;height:320px;font:11px monospace;white-space:pre";
  wrap.appendChild(ta);
  document.body.appendChild(wrap);
  ta.focus(); ta.select();
  document.getElementById("inspFecha").onclick = function () { wrap.remove(); };
  console.log(texto);

  if (visiveis < 2) {
    console.log(">>> Poucos campos visíveis. Confirme que a janelinha está ABERTA e em 'Registro Manual de Frequência'.");
  }
})();
