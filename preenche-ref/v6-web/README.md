# Preenche REF v6 (versão web) — em construção

A ideia da v6 é **abandonar a digitação cega** (o método do .exe, que envia
teclas e reza para o foco estar no lugar) e passar a agir **de dentro da
própria página** do REF, que é onde a informação realmente está.

Vantagens do método novo:

- **Não precisa de lista de feriados** — o script lê o mês/ano da tela e
  calcula os feriados (inclusive Carnaval/Sexta Santa/Corpus, que mudam de
  data) para aquele ano;
- **Enxerga o que já foi preenchido** — não repassa por cima de dias que já
  têm horário;
- **Sem esperas de segundos** e sem travar o mouse/teclado.

## Parte 1 — Analisador (pronta) ✅

[`analisador_ref.js`](analisador_ref.js) roda dentro da página e **só lê**:
pinta cada dia de **verde** (já preenchido), **cinza** (fim de semana ou
feriado, não precisa) ou **amarelo** (dia útil ainda vazio), e mostra um
resumo no canto com a lista exata dos dias que faltam.

Já foi testado contra uma página real do REF (março/2026): identificou
corretamente 15 dias preenchidos, 8 dias úteis a preencher e 8 fins de semana,
e calculou os feriados móveis conferindo com o teste do programa em AutoHotkey.

![Analisador em ação](../docs/v6_analisador.png)

### Como usar (não precisa instalar nada)

1. Abra a tela do REF no mês desejado, no **Chrome** ou **Firefox**;
2. Tecle **F12** (abre as Ferramentas do Desenvolvedor);
3. Clique na aba **Console**;
4. Abra o arquivo `analisador_ref.js`, copie **todo** o conteúdo, cole no
   Console e tecle **Enter**.

A página é colorida e o resumo aparece no canto superior direito. Nada é
enviado — é seguro. Para analisar outro mês, navegue até ele e cole de novo.

> Dica: se aparecer um aviso pedindo para digitar `allow pasting` antes de
> colar, digite isso e tecle Enter — é uma proteção do navegador, normal.

## Parte 2a — Sugestor de horários (pronta) ✅

[`sugere_horarios_ref.js`](sugere_horarios_ref.js) roda dentro da página e,
para cada dia útil ainda vazio, **mostra numa tabela os horários a lançar**,
seguindo as mesmas regras da v5.2: entrada nunca antes de 10:00, total diário
entre 09:01 e 09:11 (nunca em hora exata nem repetindo o dia anterior),
pequena variação de posição e 1h de desporto contando no total. Não preenche
nem envia nada — você digita, por enquanto. As opções ficam no bloco `CONFIG`
no topo do arquivo. Há um botão **"Sortear de novo"** para gerar outra
combinação.

Testado: 10.000 dias simulados sem violar nenhuma regra, e rodado contra a
página real (março/2026), gerando os 8 dias vazios corretos.

![Sugestor em ação](../docs/v6_sugestor.png)

Uso: igual ao analisador (F12 → Console → colar → Enter).

## Parte 2b — Preenchimento automático (a fazer) ⏳

Falta a parte que **preenche e salva** os dias sozinha. Para construí-la com
segurança eu preciso ver o formulário de lançamento **no modo manual** — que
**não** está na página que você salvou, porque ele só é carregado quando você
marca "Registro Manual de Frequência" (aí o rádio dispara um `A4J.AJAX.Submit`
e o servidor devolve os campos de hora). Os nomes internos desses campos são
gerados na hora (ex.: `formInclusao:j_id652`) e mudam a cada sessão, então o
preenchedor terá que localizá-los pela estrutura.

Para isso, preciso de **uma captura no modo manual**:

1. Clique num dia **vazio** para abrir a janelinha "Detalhamento dos Registros";
2. Marque **"Registro Manual de Frequência"** (aí aparecem os campos
   Entrada/Início e Saída/Término);
3. Tecle **F12 → aba "Elementos"** (ou "Inspetor" no Firefox), clique com o
   botão direito no elemento mais externo da janelinha (o `div` do
   "Detalhamento dos Registros") e escolha
   **"Copiar → Copiar elemento externo (outerHTML)"**;
4. Cole num arquivo de texto (Bloco de Notas) e me mande.

Com esse pedaço eu escrevo e testo o preenchedor da mesma forma que testei o
analisador e o sugestor.

### Por que um userscript, e não continuar no .exe?

O .exe (AutoHotkey) funciona "por fora": ele finge ser um usuário digitando.
Isso é frágil — qualquer clique atrapalha, e ele não sabe o que está na tela.
Um *script de página* trabalha "por dentro": lê e escreve nos campos
diretamente, com certeza do que está fazendo. É o mesmo motivo pelo qual esta
Parte 1 já consegue dizer, com exatidão, quais dias faltam — algo que o .exe
nunca soube.
