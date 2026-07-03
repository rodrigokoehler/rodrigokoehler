#!/usr/bin/env python3
"""Gera o Preenche_REF_v5.0.ahk a partir do fonte extraido da v4.2.

Cada alteracao e aplicada por substituicao textual com contagem verificada,
para garantir que nenhum anchor mudou de lugar sem ser notado.

Uso: gera_v5.py <original.ahk> <saida.ahk>
"""
import re
import sys

TT_OLD = ("toltip := round(espera / 1000) - 1\n"
          "ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% "
          "segundos restantes para próxima ação...\n"
          "SetTimer, RemoveToolTip, 1000\n"
          "sleep, %espera%")

TT_LABEL_OLD = ("ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% "
                "segundos restantes para próxima ação...\n"
                "return")

TT_LABEL_NEW = ("ToolTip, %progresso%`n`nNão use o mouse nem o teclado`n%toltip% "
                "segundos para a próxima ação...\n"
                "return")

MYARRAY3_OLD = ('myArray3 := ["25/02/2020", "16/02/2021", "01/03/2022", "21/02/2023", '
                '"13/02/2024", "04/03/2025", "24/02/2020", "15/02/2021", "28/02/2022", '
                '"20/02/2023", "12/02/2024", "03/03/2025", "10/04/2020", "02/04/2021", '
                '"15/04/2022", "07/04/2023", "29/03/2024", "18/04/2025", "11/06/2020", '
                '"03/06/2021", "16/06/2022", "08/06/2023", "30/05/2024", "19/06/2025"]')

MYARRAY3_NEW = 'myArray3 := FeriadosMoveis(substr(Data, 7, 4), substr(DataFim, 7, 4))'

WEEKEND_OLD = ("if Diasemana(corrente) = 7 or else Diasemana(corrente) = 1 or else "
               "hasValue(myArray2, substr(corrente,1,5)) or else hasValue(myArray3, corrente)\n{\n")

WEEKEND_NEW = WEEKEND_OLD + ('progresso := "Pulando " . corrente . " (fim de semana ou '
                             'feriado - dia " . (i+1) . " de " . diferenca . ")"\n')

PROG_LINE = ('progresso := "Preenchendo " . corrente . " (dia " . (i+1) . " de " '
             '. diferenca . ")"')

DIRECT_SO_OLD = ("escolhido := DesportoE . DesportoS\n"
                 "global time1:=A_Now\n"
                 "while(i < diferenca)\n{\n")
DIRECT_SO_NEW = ("baseEscolhido := DesportoE . DesportoS\n"
                 "global time1:=A_Now\n"
                 "while(i < diferenca)\n{\n"
                 "escolhido := PreparaDia(baseEscolhido, jit)\n" + PROG_LINE + "\n")

DIRECT_FULL_OLD = ("escolhido := Entrada . Saida1 . Entrada2 . Saida2 . DesportoE . DesportoS\n"
                   "global time1:=A_Now\n"
                   "while(i < diferenca)\n{\n")
DIRECT_FULL_NEW = ("baseEscolhido := Entrada . Saida1 . Entrada2 . Saida2 . DesportoE . DesportoS\n"
                   "global time1:=A_Now\n"
                   "while(i < diferenca)\n{\n"
                   "escolhido := PreparaDia(baseEscolhido, jit, Completo)\n" + PROG_LINE + "\n")

RAND_SO_OLD = "else\n{\nescolhido := EntradaC3 . SaidaC3\n}\n"
RAND_SO_NEW = RAND_SO_OLD + "escolhido := PreparaDia(escolhido, jit)\n" + PROG_LINE + "\n"

RAND_FULL_OLD = ("else\n{\nescolhido := EntradaC1 . SaidaC1 . EntradaC2 . SaidaC2 . "
                 "EntradaC3 . SaidaC3\n}\n")
RAND_FULL_NEW = (RAND_FULL_OLD + "escolhido := PreparaDia(escolhido, jit, Completo)\n"
                 + PROG_LINE + "\n")

ESPERA_OLD = "espera :=  round(Aguarda * 1000)"
ESPERA_NEW = ESPERA_OLD + """
jit := (OptJ = 1) ? (JitterMax + 0) : 0
totAtivo := (OptT = 1) ? 1 : 0
if (totAtivo = 1)
{
if not ehNum_Forma(TotMin) or not ehNum_Forma(TotMax)
{
Gui 1:Show
return
}
totMin := SubStr(TotMin, 1, 2)*60 + SubStr(TotMin, 3, 2)
totMax := SubStr(TotMax, 1, 2)*60 + SubStr(TotMax, 3, 2)
if (totMin >= totMax)
{
MsgBox 0x30, ATENÇÃO, O total mínimo do sorteio deve ser menor que o total máximo.
Gui 1:Show
return
}
}"""

OPT1_OLD = ("Gui, Add, Checkbox, Checked xm vOpt1, Inserir outros 2 (dois) dias com "
            "horários diferentes de forma &randômica.")
OPT1_NEW = OPT1_OLD + ("\n"
    "Gui, Add, Checkbox, Checked xm vOptJ, Variar aleatoriamente até\n"
    "Gui, Add, Edit, w40 x+5 vJitterMax number limit2\n"
    "Gui, Add, UpDown, Range1-30, 8\n"
    "Gui, Add, Text, x+5, minutos a posição dos horários (entrada e almoço).\n"
    "Gui, Add, Checkbox, Checked xm vOptT, Sortear o total de horas de cada dia entre\n"
    "Gui, Add, Edit, w45 x+5 vTotMin number limit4, 0851\n"
    "Gui, Add, Text, x+5, e\n"
    "Gui, Add, Edit, w45 x+5 vTotMax number limit4, 0911\n"
    "Gui, Add, Text, x+5, (formato HHMM)\n"
    "Gui, Add, Text, xm+18, O sorteio nunca cai em hora exata (ex.: 0900) nem repete o total do dia anterior.")

CHANGELOG_NEW = ("Gui, 3:Add, Edit, x12 y89 w320 h230 +ReadOnly, "
    "Versão 5.1:`n"
    "• Sorteio do total de horas de cada dia dentro de uma faixa "
    "(padrão 08:51 a 09:11) — nunca em hora exata nem repetindo o dia anterior`n"
    "• A saída do expediente é ajustada para fechar o total sorteado`n`n"
    "Versão 5.0:`n"
    "• Feriados móveis (Carnaval; Sexta-feira Santa; Corpus Christi) calculados "
    "automaticamente para qualquer ano — antes a lista fixa ia só até 2025`n"
    "• Variação aleatória de alguns minutos na posição dos horários`n"
    "• Progresso do preenchimento exibido (dia X de Y)`n"
    "• Correções de textos`n`n"
    "Versão 4.2:`n• Ajuste para selecionar a 'Prática desportiva'`n`n"
    "Versão 4.1:`n• Preenchimento com exceção da atividade física`n`n"
    "Versão 4.0:`n• Só atividade física; novo formato de data; novo layout`n`n"
    "Versões 3.x:`n• Observação/Justificativa; feriados pulados")

FUNCS = """
Espera1()
{
global espera, toltip, progresso
toltip := round(espera / 1000) - 1
ToolTip, %progresso%`n`nNão use o mouse nem o teclado`n%toltip% segundos para a próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
}
FeriadosMoveis(anoIni, anoFim)
{
lista := []
ano := anoIni + 0
fim := anoFim + 0
while (ano <= fim)
{
a := Mod(ano, 19)
b := ano // 100
c := Mod(ano, 100)
d := b // 4
e := Mod(b, 4)
f := (b + 8) // 25
g := (b - f + 1) // 3
h := Mod(19*a + b - d - g + 15, 30)
i := c // 4
k := Mod(c, 4)
l := Mod(32 + 2*e + 2*i - h - k, 7)
m := (a + 11*h + 22*l) // 451
mes := (h + l - 7*m + 114) // 31
dia := Mod(h + l - 7*m + 114, 31) + 1
pascoa := Format("{:04}{:02}{:02}", ano, mes, dia)
For idx, dias in [-48, -47, -2, 60]
{
dt := pascoa
EnvAdd, dt, %dias%, days
FormatTime, feriado, %dt%, dd/MM/yyyy
lista.Push(feriado)
}
ano++
}
return lista
}
PreparaDia(s, j, usaDesp := 1)
{
global totAtivo, totMin, totMax, ultimoTotal
s := AplicaJitter(s, j, usaDesp)
if (totAtivo != 1 or StrLen(s) = 8)
return s
e1 := HmParaMin(SubStr(s, 1, 4))
s1 := HmParaMin(SubStr(s, 5, 4))
e2 := HmParaMin(SubStr(s, 9, 4))
s2 := HmParaMin(SubStr(s, 13, 4))
desp := 0
if (StrLen(s) = 24 and usaDesp)
desp := HmParaMin(SubStr(s, 21, 4)) - HmParaMin(SubStr(s, 17, 4))
Loop, 40
{
Random, alvo, %totMin%, %totMax%
if (Mod(alvo, 60) = 0 or alvo = ultimoTotal)
continue
novoS2 := e2 + alvo - desp - (s1 - e1)
if (novoS2 <= e2 or novoS2 > 1439)
continue
if (StrLen(s) = 24 and usaDesp)
{
e3 := HmParaMin(SubStr(s, 17, 4))
s3 := HmParaMin(SubStr(s, 21, 4))
if !(e3 > novoS2 or s3 < e2)
continue
}
ultimoTotal := alvo
if (StrLen(s) = 24)
return MinParaHm(e1) . MinParaHm(s1) . MinParaHm(e2) . MinParaHm(novoS2) . SubStr(s, 17, 8)
return MinParaHm(e1) . MinParaHm(s1) . MinParaHm(e2) . MinParaHm(novoS2)
}
return s
}
AplicaJitter(s, j, usaDesp := 1)
{
if (j <= 0)
return s
Loop, 30
{
if (StrLen(s) = 8)
{
Random, d1, % 0 - j, % j
e1 := HmParaMin(SubStr(s, 1, 4)) + d1
s1 := HmParaMin(SubStr(s, 5, 4)) + d1
if (e1 >= 0 and s1 <= 1439)
return MinParaHm(e1) . MinParaHm(s1)
continue
}
Random, d1, % 0 - j, % j
Random, d2, % 0 - j, % j
e1 := HmParaMin(SubStr(s, 1, 4)) + d1
s1 := HmParaMin(SubStr(s, 5, 4)) + d1
e2 := HmParaMin(SubStr(s, 9, 4)) + d2
s2 := HmParaMin(SubStr(s, 13, 4)) + d2
if (e1 < 0 or s2 > 1439 or s1 >= e2)
continue
novo := MinParaHm(e1) . MinParaHm(s1) . MinParaHm(e2) . MinParaHm(s2)
if (StrLen(s) = 16)
return novo
Random, d3, % 0 - j, % j
e3 := HmParaMin(SubStr(s, 17, 4)) + d3
s3 := HmParaMin(SubStr(s, 21, 4)) + d3
if (e3 < 0 or s3 > 1439)
continue
if (usaDesp)
{
if !(e3 > s1 or s3 < e1)
continue
if !(e3 > s2 or s3 < e2)
continue
}
return novo . MinParaHm(e3) . MinParaHm(s3)
}
return s
}
HmParaMin(hm)
{
return SubStr(hm, 1, 2)*60 + SubStr(hm, 3, 2)
}
MinParaHm(m)
{
return Format("{:02}{:02}", m // 60, Mod(m, 60))
}
"""


def sub(text, old, new, count):
    found = text.count(old)
    assert found == count, f"anchor com {found} ocorrencias (esperado {count}): {old[:70]!r}"
    return text.replace(old, new)


def main(src_path, dst_path):
    text = open(src_path, encoding='utf-8').read()

    # 1. consolida os blocos repetidos de tooltip+sleep em Espera1()
    text = sub(text, TT_OLD, "Espera1()", 24)
    # 2. texto do label RemoveToolTip acompanha o novo formato
    text = sub(text, TT_LABEL_OLD, TT_LABEL_NEW, 1)
    # 3. feriados moveis calculados em vez de lista fixa 2020-2025
    text = sub(text, MYARRAY3_OLD, MYARRAY3_NEW, 3)
    # 4. progresso nos dias pulados (fim de semana/feriado)
    text = sub(text, WEEKEND_OLD, WEEKEND_NEW, 4)
    # 5-8. jitter + progresso nos quatro loops de preenchimento
    text = sub(text, DIRECT_SO_OLD, DIRECT_SO_NEW, 1)
    text = sub(text, DIRECT_FULL_OLD, DIRECT_FULL_NEW, 1)
    text = sub(text, RAND_SO_OLD, RAND_SO_NEW, 1)
    text = sub(text, RAND_FULL_OLD, RAND_FULL_NEW, 1)
    # 9. inicializacao do jitter
    text = sub(text, ESPERA_OLD, ESPERA_NEW, 1)
    # 10. controles novos na GUI 1
    text = sub(text, OPT1_OLD, OPT1_NEW, 1)
    # 10b. Opt2 volta para a margem esquerda (novo controle mudou a referencia)
    text = sub(text, "Gui, Add, Checkbox, vOpt2,", "Gui, Add, Checkbox, xm vOpt2,", 1)
    # 10c. aviso de "8 horas" nao se aplica quando o total do dia e sorteado
    text = sub(text, "if h_dia != 28800",
               "if (h_dia != 28800 and totAtivo != 1)", 2)
    text = sub(text, "if (h_dia2 != 28800)  or  (h_dia3 != 28800)",
               "if ((h_dia2 != 28800 or h_dia3 != 28800) and totAtivo != 1)", 2)
    # 11. versao
    text = sub(text, "&Versão_4.2", "&Versão_5.1", 1)
    text = sub(text, "ButtonVersão_4.2:", "ButtonVersão_5.1:", 1)
    text = sub(text, "v. 4.2.0", "v. 5.1.0", 1)
    # 12. changelog
    text = re.sub(r"Gui, 3:Add, Edit, x12 y89 w320 h230 \+ReadOnly, [^\n]*",
                  lambda _: CHANGELOG_NEW, text, count=1)
    # 13. typos
    text = sub(text, "horáro", "horário", 6)
    text = sub(text, "corresponte", "corresponde", 2)
    text = sub(text, "deve estra entre", "deve estar entre", 3)
    # 14. funcoes novas no final
    text = text.rstrip("\n") + "\n" + FUNCS

    open(dst_path, 'w', encoding='utf-8', newline='\n').write(text)
    size = len(text.encode('utf-8'))
    print(f"ok: {dst_path} ({size} bytes; limite do recurso: 45199)")
    assert size <= 45199, "script nao cabe no recurso do executavel"


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
