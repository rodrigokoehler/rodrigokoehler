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

## Parte 2 — Preenchedor automático (a fazer) ⏳

Falta a parte que **preenche** os dias amarelos sozinha. Para construí-la com
segurança eu preciso ver o formulário de lançamento — que **não** está na
página que você salvou, porque ele só é carregado quando você **clica em um
dia** (o sistema busca no servidor naquele momento).

O sistema é um JSF/RichFaces com identificadores de campo gerados
automaticamente (ex.: `formInclusao:j_id652`), que mudam a cada sessão — por
isso o preenchedor terá que localizar os campos pela estrutura, não por um
número fixo. Para isso, preciso de **duas capturas**:

1. Abra um dia **vazio** clicando nele (abre a janelinha "Detalhamento dos
   Registros");
2. Com a janelinha aberta, tecle **F12 → aba "Elementos"** (ou "Inspetor" no
   Firefox), clique com o botão direito no elemento mais externo da
   janelinha e escolha **"Copiar → Copiar elemento externo (outerHTML)"**;
   cole num arquivo de texto e me mande;
3. Faça o mesmo com um dia que **já tenha horário** lançado, para eu ver como
   um registro preenchido aparece.

Com esses dois pedaços eu consigo escrever e testar o preenchedor da mesma
forma que testei o analisador.

### Por que um userscript, e não continuar no .exe?

O .exe (AutoHotkey) funciona "por fora": ele finge ser um usuário digitando.
Isso é frágil — qualquer clique atrapalha, e ele não sabe o que está na tela.
Um *script de página* trabalha "por dentro": lê e escreve nos campos
diretamente, com certeza do que está fazendo. É o mesmo motivo pelo qual esta
Parte 1 já consegue dizer, com exatidão, quais dias faltam — algo que o .exe
nunca soube.
