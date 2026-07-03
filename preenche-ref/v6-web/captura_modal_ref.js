/* ============================================================================
 *  Preenche REF v6 — Capturador da janela de lançamento (ajuda de captura)
 * ----------------------------------------------------------------------------
 *  Serve para me enviar o CÓDIGO (HTML) da janelinha "Detalhamento dos
 *  Registros" quando ela está no modo "Registro Manual de Frequência" — é o
 *  que falta para eu montar o preenchedor automático (Parte 2b).
 *
 *  COMO USAR:
 *    1. Na página do REF, clique num dia VAZIO para abrir a janelinha;
 *    2. Marque "Registro Manual de Frequência" (aparecem os campos de hora);
 *    3. Tecle F12 → aba Console, cole este arquivo inteiro e tecle Enter;
 *    4. Um arquivo "modal_ref_manual.html" será BAIXADO. Me anexe esse arquivo.
 *
 *  Ele NÃO altera nem envia nada ao sistema — só copia o trecho de tela para
 *  um arquivo local seu. Antes de baixar, ele apaga o campo de segurança
 *  "ViewState" (um código longo interno), que não preciso ver.
 * ==========================================================================*/

(function () {
  "use strict";

  // 1. Acha o elemento da janelinha. Procuramos o container do modalPanel do
  //    RichFaces cujo cabeçalho tem o texto "Detalhamento dos Registros".
  function achaModal() {
    // caminho preferido: pelo id conhecido do modalPanel
    var byId = document.getElementById("modalIncluirRegistro")
            || document.getElementById("modalIncluirRegistroContainer");
    if (byId) return byId;
    // alternativa: pelo cabeçalho com o texto certo, subindo até o container
    var cabecalhos = document.querySelectorAll("[id*='Header'], .rich-mpnl-header");
    for (var i = 0; i < cabecalhos.length; i++) {
      if (/Detalhamento dos Registros/i.test(cabecalhos[i].innerText || "")) {
        var no = cabecalhos[i];
        for (var sobe = 0; sobe < 6 && no.parentElement; sobe++) {
          no = no.parentElement;
          if (/modal/i.test(no.id || "")) return no;
        }
        return cabecalhos[i].closest("div");
      }
    }
    return null;
  }

  var modal = achaModal();
  if (!modal) {
    alert("Não achei a janelinha 'Detalhamento dos Registros'. " +
          "Abra um dia e marque 'Registro Manual de Frequência' antes de rodar.");
    return;
  }

  // 2. Clona o trecho e remove o valor do campo de segurança ViewState.
  var clone = modal.cloneNode(true);
  clone.querySelectorAll("input[name='javax.faces.ViewState'], input[id*='ViewState']")
       .forEach(function (el) { el.setAttribute("value", "REMOVIDO"); });

  var html = "<!-- Captura da janela de lançamento manual do REF -->\n" +
             clone.outerHTML;

  // 3. Dispara o download do arquivo (fica na pasta de Downloads do navegador).
  var blob = new Blob([html], { type: "text/html;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "modal_ref_manual.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("Preenche REF: arquivo 'modal_ref_manual.html' baixado (" +
              html.length + " caracteres). Anexe-o na conversa.");
})();
