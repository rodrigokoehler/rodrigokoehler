# Preenche REF v5.0

Versão melhorada do utilitário **Preenche REF** — automação de preenchimento do
Registro Eletrônico de Frequência (REF) via navegador (Chrome/Firefox).

O programa original (`Preenche_REF_v4.2.exe`) é um script AutoHotkey v1
compilado. O código-fonte foi extraído do próprio executável (fica embutido
como recurso `>AUTOHOTKEY SCRIPT<`) e está preservado em
[`original/Preenche_REF_v4.2_extraido.ahk`](original/Preenche_REF_v4.2_extraido.ahk)
para referência.

## O problema da v4.2

A v4.2 pula finais de semana e feriados, porém os **feriados móveis
(Carnaval, Sexta-feira Santa e Corpus Christi) estavam em uma lista fixa que
só cobria os anos de 2020 a 2025**. A partir de 2026 o programa passaria por
cima desses dias — por exemplo, o Carnaval de 16 e 17/02/2026 seria
preenchido como dia útil.

## Melhorias da v5.0

| # | Melhoria |
|---|----------|
| 1 | **Feriados móveis calculados para qualquer ano** (algoritmo de Meeus/Butcher para a Páscoa → Carnaval seg/ter, Sexta-feira Santa e Corpus Christi). Sem data de validade. |
| 2 | **Variação aleatória opcional dos horários** (padrão: até ±8 min, configurável de 1 a 30). Cada bloco do dia (manhã, tarde, desporto) é deslocado inteiro por um sorteio próprio, então **o total de horas do dia não muda** e nunca há sobreposição entre blocos. Deixa os registros naturais em vez de idênticos todos os dias. |
| 3 | **Progresso durante a execução**: o balão mostra qual dia está sendo preenchido (`Preenchendo 05/03/2026 (dia 3 de 22)`) ou pulado (fim de semana/feriado). |
| 4 | Correções de texto (horáro → horário, corresponte → corresponde, estra → estar). |
| 5 | Código interno consolidado (24 blocos repetidos de espera viraram uma função `Espera1()`), facilitando manutenção futura. |

A mecânica de preenchimento (sequências de Tab/Espaço no navegador) foi
**mantida idêntica** à v4.2, que já é comprovada em uso — a v5.0 muda apenas o
que decide *quais dias* e *quais horários*, não *como* digitar.

![GUI da v5.0](docs/gui_v5.png)

## Validação realizada

Sem acesso ao sistema real, a validação foi feita com o **runtime AutoHotkey
1.1.33.10 verdadeiro** (o mesmo embutido no executável), sob Wine:

- **Parse completo** do script v5.0 sem nenhum erro de sintaxe;
- A função nova de feriados, executada de 2020 a 2027, reproduziu **exatamente
  os 24 valores da lista fixa original (2020–2025)** e gerou 16–17/02/2026
  (Carnaval), 03/04/2026 (Sexta Santa) e 04/06/2026 (Corpus Christi) — os dias
  de Carnaval conferem com a marcação "(PF)" exibida pelo próprio REF;
- O sorteio de horários rodou 400 vezes sem violar nenhuma invariante
  (total de horas preservado, sem sobreposição, limites 00:00–23:59);
- A interface gráfica foi aberta sob Wine e verificada visualmente.

**Ainda assim, no primeiro uso real, teste com um intervalo de um único dia e
confira o resultado na tela antes de enviar para homologação.**

## Como obter o executável

O `.exe` não fica no repositório. Três caminhos:

1. **Injeção no executável original** (não precisa instalar AutoHotkey):

   ```
   pip install pefile
   python tools/injeta_script.py Preenche_REF_v4.2.exe src/Preenche_REF_v5.0.ahk Preenche_REF_v5.0.exe
   ```

   O script novo é gravado por cima do recurso interno do exe antigo, sem
   alterar nenhum outro byte (o processo foi validado com ida-e-volta
   byte-a-byte). O tamanho do script deve caber no espaço original
   (45.199 bytes; a v5.0 usa 43.250).

2. **Rodar o `.ahk` direto**: instale o [AutoHotkey v1.1](https://www.autohotkey.com)
   (existe versão portátil, sem admin) e dê dois cliques em
   `src/Preenche_REF_v5.0.ahk`.

3. **Compilar do zero**: com o AutoHotkey instalado, use o Ahk2Exe
   (`Convert .ahk to .exe`) apontando para `src/Preenche_REF_v5.0.ahk`.

## Ferramentas (`tools/`)

| Script | Função |
|--------|--------|
| `extrai_script.py` | Extrai o `.ahk` embutido de qualquer exe AutoHotkey v1 compilado. |
| `injeta_script.py` | Regrava o recurso de script de um exe AutoHotkey com outro `.ahk` (mesmo tamanho, preenchido com quebras de linha; recalcula o checksum do PE). |
| `gera_v5.py` | Gera `src/Preenche_REF_v5.0.ahk` a partir do fonte extraído da v4.2, aplicando cada alteração por substituição textual verificada — serve de changelog executável. |

## Limitações conhecidas (herdadas do método)

A automação é "cega": envia teclas e confia que o foco do navegador está no
lugar certo, com esperas fixas entre ações. Durante a execução não se pode
usar mouse nem teclado, e dias já preenchidos não são detectados.

### Ideia para uma v6 (mudança de método)

Um *userscript* (Tampermonkey) ou script de console rodando **dentro da
própria página** do REF poderia: ler os dias marcados "(PF)"/feriado direto
da tabela (sem lista de feriados nenhuma), pular dias que já têm registro,
preencher via DOM sem esperas fixas (segundos em vez de minutos) e sem
bloquear o computador. Para construir isso é necessário o HTML real da
página: abrir a tela do REF com o "Detalhamento dos Registros" expandido e
salvar via `Ctrl+S` (Página completa), depois anexar o arquivo na conversa.
