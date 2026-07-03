/* ============================================================================
 *  Preenche REF v6 — Inspetor da janela de lançamento manual (v2)
 * ----------------------------------------------------------------------------
 *  Lista os campos do formulário de lançamento ("formInclusao") numa caixa de
 *  texto na tela, já selecionada, para você copiar (Ctrl+C) e colar no chat.
 *  Não baixa nada (contorna o bloqueio de HTTP) e varre a PÁGINA INTEIRA —
 *  o RichFaces guarda o conteúdo da janelinha fora do container do modal.
 *
 *  COMO USAR:
 *    1. Clique num dia VAZIO para abrir "Detalhamento dos Registros";
 *    2. Marque "Registro Manual de Frequência" (aparecem os campos de hora);
 *    3. F12 → Console, cole este arquivo, Enter;
 *    4. Copie (Ctrl+C) a caixa que aparece no canto superior esquerdo e cole
 *       aqui na conversa.
 * ==========================================================================*/

(function () {
  "use strict";

  function visivel(el) {
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  // cabeçalho da coluna onde o campo está (ex.: "Entrada/Início")
  function cabecalhoColuna(el) {
    var td = el.closest("td");
    if (!td || !td.parentElement) return "";
    var idx = Array.prototype.indexOf.call(td.parentElement.children, td);
    var table = el.closest("table");
    if (!table) return "";
    var rows = table.querySelectorAll("tr");
    for (var r = 0; r < rows.length; r++) {
      var cel = rows[r].children[idx];
      if (cel && /[A-Za-zÀ-ú]/.test(cel.innerText || "")) {
        var t = cel.innerText.trim().replace(/\s+/g, " ");
        if (t) return t.slice(0, 22);
      }
      if (rows[r] === td.parentElement) break;
    }
    return "";
  }

  // Coleta todos os campos cujo name pertence ao formInclusao OU que estejam
  // visíveis — onde quer que estejam no DOM.
  var todos = document.querySelectorAll("input, select, textarea");
  var linhas = [], visTexto = 0;
  Array.prototype.forEach.call(todos, function (el) {
    var nome = el.name || "";
    var doForm = nome.indexOf("formInclusao") >= 0;
    var vis = visivel(el);
    if (!doForm && !vis) return;                       // ignora o resto da página
    // reduz ruído: botões da página de fundo (não são do lançamento)
    if (!doForm && nome.indexOf("formConteudo") >= 0 &&
        /button|submit|image/.test(el.type || "")) return;
    if (vis && (el.tagName === "SELECT" || el.tagName === "TEXTAREA" ||
                (el.tagName === "INPUT" && el.type === "text"))) visTexto++;
    linhas.push(
      el.tagName.toLowerCase() +
      " type=" + (el.type || "-") +
      " vis=" + (vis ? "S" : "n") +
      " maxlen=" + (el.getAttribute("maxlength") || "-") +
      " col='" + cabecalhoColuna(el) + "'" +
      " val='" + (el.value || "").slice(0, 12) + "'" +
      " name=" + (nome || "-") +
      " id=" + (el.id || "-") +
      " cls=" + (el.className || "-").slice(0, 24)
    );
  });

  // radios e botão Salvar/Fechar do formInclusao (onde quer que estejam)
  var acoes = [];
  Array.prototype.forEach.call(
    document.querySelectorAll("input[type=radio], input[type=button], input[type=submit], a[onclick]"),
    function (el) {
      var nome = el.name || "";
      if (nome.indexOf("formInclusao") < 0 && !/salvar|manual|ocorrenc/i.test((el.value || "") + (el.id || ""))) return;
      var oc = (el.getAttribute("onclick") || "").replace(/\s+/g, " ").slice(0, 55);
      acoes.push("  " + el.tagName.toLowerCase() + " type=" + (el.type || "-") +
        " val='" + (el.value || el.title || "").slice(0, 18) + "'" +
        " name=" + (nome || "-") + " id=" + (el.id || "-") +
        (oc ? " onclick~" + oc : ""));
    });

  var texto =
    "=== formInclusao | campos visiveis(text/select/textarea)=" + visTexto + " ===\n" +
    "CAMPOS:\n" + (linhas.length ? linhas.join("\n") : "(nenhum)") +
    "\n\nACOES:\n" + (acoes.length ? acoes.join("\n") : "(nenhuma)") +
    "\n=== fim ===";

  var old = document.getElementById("inspetorRefBox");
  if (old) old.remove();
  var wrap = document.createElement("div");
  wrap.id = "inspetorRefBox";
  wrap.style.cssText = "position:fixed;top:8px;left:8px;z-index:2147483647;background:#fff;" +
    "border:2px solid #b00;border-radius:6px;padding:8px;font:12px Arial";
  wrap.innerHTML = "<div style='margin-bottom:4px'><b>Copie tudo (Ctrl+C) e cole no chat.</b> " +
    "<button id='inspFecha'>Fechar</button></div>";
  var ta = document.createElement("textarea");
  ta.value = texto;
  ta.style.cssText = "width:660px;height:340px;font:11px monospace;white-space:pre";
  wrap.appendChild(ta);
  document.body.appendChild(wrap);
  ta.focus(); ta.select();
  document.getElementById("inspFecha").onclick = function () { wrap.remove(); };
  console.log(texto);
  if (visTexto < 2) console.log(">>> Poucos campos de texto visíveis. Confirme a janelinha ABERTA em 'Registro Manual de Frequência'.");
})();
