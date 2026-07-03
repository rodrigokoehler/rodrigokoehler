; <COMPILER: v1.1.33.10>
#SingleInstance, Off
permiteMsg := false
Menu, Tray, NoStandard
Menu, Tray, Add, Fechar, ByeScript
Menu, Tray, Default, Fechar
SysIcons := A_WinDir . "\system32\SHELL32.dll"
Menu, tray, Icon , %SysIcons%, 21, 1
SetKeyDelay, 50
FormatTime, CurrentDateTime,, dd/MM/yyyy
inicioMes := substr(CurrentDateTime, 7, 4) . substr(CurrentDateTime, 4, 2) . "01000000"
const = 60
Gui, 1:New, HWNDhwnd, Preenche REF
Gui, Margin,20, 5
Gui, Color,
Gui +LastFound
WinSet, TransColor, FFFFA7
Gui, Font, underline
Gui, Add, Button, x+260 y+3 w90 h24 hwndIcon6 , &Versão_4.2
Gui, Font, norm
Gui, Add, Text, xm vTexto, • Somente executar no navegador: Google Chrome e Mozilla Firefox
Gui, Add, Text,xm , • Final de semana e feriados não serão preenchidos (serão pulados).
Gui, Add, Text,xm , Coloque os horários com quatro dígitos, somente números (ex. 0800):
Gui, Add, Radio, xm vCompleto Checked %Completo% gRadioB, Com prát. desportiva
Gui, Add, Radio, x+5 vSemdesporto %Semdesporto% gRadioB, Sem prát. desportiva
Gui, Add, Radio, x+5 vSodesporto %Sodesporto% gRadioB, Só prát. desportiva
Gui, Add, GroupBox, xm r8 w350, Horário expediente
Gui, Add, Text, xp+%const% yp+15 , Entrada expediente / Saída almoço
Gui, Add, Edit, w60 vEntrada number limit4, 0900
Gui, Add, Edit, x+%const% w60 vSaida1 number limit4, 1200
Gui, Add, Text, xp-120 yp+30, Volta do almoço / Saída expediente
Gui, Add, Edit, w60 vEntrada2 number limit4, 1300
Gui, Add, Edit, x+%const% w60 vSaida2 number limit4, 1700
Gui, Add, Checkbox, xp-170 yp+30 vSteamAPIToggle %SteamApiToggle% gBOX, Inserir '&Observação / Justificativa'
Gui, Add, Edit, Disabled xp  yp+20 w320 vObs limit200,
Gui, Add, GroupBox, xm r5 w350, Horário da prática desportiva
Gui, Add, Text, xp+%const% yp+15, Desporto entrada / Desporto saída
Gui, Add, Edit, w60 vDesportoE number limit4, 2000
Gui, Add, Edit, x+%const% w60 vDesportoS number limit4, 2100
Gui, Add, Checkbox, xp-170 yp+30 vSteamAPIToggle2 %SteamApiToggle2% gBOX2, Inserir '&Observação / Justificativa'
Gui, Add, Edit, Disabled xp  yp+20 w320 vObs2 limit200,
Gui, Add, Text, xm, Insira a data inicial e a final, com números e barras (ex. 27/06/2020):
Gui, Add, DateTime, xm+%const%  w80 Choose%inicioMes% vData limit10, dd/MM/yyyy
Gui, Add, DateTime, x+40 w80  vDataFim limit10, dd/MM/yyyy
Gui, Add, Text, xm, Insira o tempo em segundos de resposta do &navegador (entre 1 a 99):
Gui, Add, Edit, w40 xm+140 vAguarda number limit2
Gui, Add, UpDown, Range1-99, 5
Gui, Add, Checkbox, Checked xm vOpt1, Inserir outros 2 (dois) dias com horários diferentes de forma &randômica.
Gui, Add, Checkbox, vOpt2, Após a execução do script realizar o &bloqueio do computador.
Gui, Add, Button,xm+36 w85 h40 hwndIcon1 ,&Avançar
Gui, Add, Button,x+80 w85 h40 hwndIcon2 ,&Cancelar
GuiControl, +Default, Avançar
GuiButtonIcon(Icon1, "shell32.dll", 145, "s32 a0 l2")
GuiButtonIcon(Icon2, "shell32.dll", 132, "s32 a0 l2")
GuiButtonIcon(Icon6, "shell32.dll", 24, "s32 a0 l2")
Gui, 2:Margin,20, 5
Gui, 2:Add, Button, x+45 y+5 w85 h40 Default gButtonVoltar hwndIcon5, &Voltar
Gui, 2:Add, Text, xm , _____________DIA 2_____________
Gui, 2:Add, GroupBox, xm r5 w200, Horário expediente
Gui, 2:Add, Text, xp+10 yp+15, Entrada expediente / Saída almoço
Gui, 2:Add, Edit, w60 vEntradaB1 number limit4, 0930
Gui, 2:Add, Edit, x+40 w60 vSaidaB1 number limit4, 1230
Gui, 2:Add, Text, xp-100 yp+25 , Volta do almoço / Saída expediente
Gui, 2:Add, Edit, w60 vEntradaB2 number limit4, 1315
Gui, 2:Add, Edit, x+40 w60 vSaidaB2 number limit4, 1715
Gui, 2:Add, GroupBox, xm r3 w200, Horário da prática desportiva
Gui, 2:Add, Text, xp+10 yp+15 , Desporto entrada / Desporto saída
Gui, 2:Add, Edit, w60 vEntradaB3 %Completo% %Sodesporto% gRadioB number limit4, 0800
Gui, 2:Add, Edit, x+40 w60 vSaidaB3 number limit4, 0900
Gui, 2:Add, Text, xm , _____________DIA 3_____________
Gui, 2:Add, GroupBox, xm r5 w200, Horário expediente
Gui, 2:Add, Text, xp+10 yp+15 , Entrada expediente / Saída almoço
Gui, 2:Add, Edit,  w60 vEntradaC1 number limit4, 0915
Gui, 2:Add, Edit, x+40 w60 vSaidaC1 number limit4, 1215
Gui, 2:Add, Text, xp-100 yp+25 , Volta do almoço / Saída expediente
Gui, 2:Add, Edit, w60 vEntradaC2 number limit4, 1330
Gui, 2:Add, Edit, x+40 w60 vSaidaC2 number limit4, 1730
Gui, 2:Add, GroupBox, xm r3 w200, Horário da prática desportiva
Gui, 2:Add, Text, xp+10 yp+15 , Desporto entrada / Desporto saída
Gui, 2:Add, Edit, w60 vEntradaC3 number limit4, 0730
Gui, 2:Add, Edit, x+40 w60 vSaidaC3 number limit4, 0830
Gui, 2:Add, Button, xm w85 h40 Default gButtonAplicar hwndIcon3, &Aplicar
Gui, 2:Add, Button, x+15 w85 h40 gButtonEncerrar hwndIcon4, &Encerrar
GuiButtonIcon(Icon3, "shell32.dll", 138, "s32 a0 l2")
GuiButtonIcon(Icon4, "shell32.dll", 110, "s32 a0 l2")
GuiButtonIcon(Icon5, "shell32.dll", 239, "s32 a0 l2")
Gui, 3:Add, Edit, x12 y89 w320 h230 +ReadOnly, Versão 4.2:`n• Ajuste para selecionar a "Prática desportiva"`n`nVersão 4.1:`n• Opção de preenchimento com exceção da atividade física`n`nVersão 4.0:`n• Opção de preenchimento só da atividade física`n• Alteração no formato da data`n• Inserção de horários de forma mais dinâmica`n• Novo layout`n`nVersão 3.1:`n• Inclusão 'Observação / Justificativa'`n• Preservação da área de trabalho`n`nVersão 3.0:`nFeriados que não serão preenchidos:`n• Feriados fixos:`n- 01 de maio - Dia do trabalho`n- 07 de setembro - Independência do Brasil`n- 12 de outubro - Nossa Srª. de Aparecida`n- 02 de novembro - Finados`n- 15 de novembro - Proclamação da República`n- 25 de dezembro - Natal`n• Feriados móveis (de 2020 a 2025):`n- Segunda-feira de carnaval`n- Terça-feria de carnaval`n- Sexta-feira santa`n- Corpus Christi
Gui, 3:Add, Button, x232 y329 w100 h30 gOK Default, &OK
Gui, 3:Font, Bold
Gui, 3:Add, Text, x92 y9 w140 h20 , Preenche REF
Gui, 3:Add, Text, x92 y29 w140 h20 , v. 4.2.0
Gui, 3:Font
SysIcons := A_WinDir . "\system32\SHELL32.dll"
Gui, 3:Add, Picture, x12 y9 w70 h70 Icon21, %SysIcons%
OnMessage(0x200, "Help")
OnMessage(0x102, "WM_CHAR")
WM_CHAR(wParam, lParam){
If((A_GuiControl = "Data" or A_GuiControl = "DataFim") and !RegExMatch(Chr(wParam), "^[/0-9\x08]$"))
Return false
}
Help(wParam, lParam, Msg) {
MouseGetPos,,,, OutputVarControl
IfEqual, OutputVarControl, Edit5
Help := "Exceto para desporto"
if WinExist("Preenche REF")
ToolTip % Help
}
Gui 1:Show, AutoSize Center
return
ChangeOtherData:
Loop
{
Input, Key, L1 V
IF Key is not Integer
Date := Key := ""
IF StrLen(Date .= Key) < 8
Continue
Try := (Year:=SubStr(Date,5)) (Month:=SubStr(Date,3,2)) SubStr(Date,1,2)
Try -= A_Now, Days
IF Try > ""
SendInput, {BackSpace 6}/%Month%/%Year%
Date := ""
}
return
BOX:
{
Gui, Submit, NoHide
If (SteamAPIToggle = 1)
GuiControl, Enable, Obs
Else If (SteamApiToggle = 0)
GuiControl, Disable, Obs
}
return
BOX2:
{
Gui, Submit, NoHide
If (SteamAPIToggle2 = 1)
GuiControl, Enable, Obs2
Else If (SteamApiToggle2 = 0)
GuiControl, Disable, Obs2
}
return
BOX3:
{
Gui, Submit, NoHide
If (Atividade = 1)
{
GuiControl, Enable, EntradaC3
GuiControl, Enable, SaidaC3
}
Else If (Atividade = 0)
{
GuiControl, Disable, EntradaC3
GuiControl, Disable, SaidaC3
}
}
return
RadioB:
{
Gui, Submit, NoHide
If (Completo)
{
GuiControl, Enable, Entrada
GuiControl, Enable, Saida1
GuiControl, Enable, Entrada2
GuiControl, Enable, Saida2
GuiControl, Enable, SteamAPIToggle
GuiControl, Show, Obs
GuiControl, Enable, DesportoE
GuiControl, Enable, DesportoS
GuiControl, Enable, SteamAPIToggle2
GuiControl, Show, Obs2
}
If (Sodesporto)
{
GuiControl, Disable, Entrada
GuiControl, Disable, Saida1
GuiControl, Disable, Entrada2
GuiControl, Disable, Saida2
GuiControl, Disable, SteamAPIToggle
GuiControl, Hide, Obs
GuiControl, Enable, DesportoE
GuiControl, Enable, DesportoS
GuiControl, Enable, SteamAPIToggle2
GuiControl, Show, Obs2
}
If (Semdesporto)
{
GuiControl, Enable, Entrada
GuiControl, Enable, Saida1
GuiControl, Enable, Entrada2
GuiControl, Enable, Saida2
GuiControl, Enable, SteamAPIToggle
GuiControl, Show, Obs
GuiControl, Disable, DesportoE
GuiControl, Disable, DesportoS
GuiControl, Disable, SteamAPIToggle2
GuiControl, Hide, Obs2
}
}
return
ButtonVersão_4.2:
{
Gui, 3:Show, Center w348 h370, Preenche REF - Versões
permiteMsg := false
return
}
OK:
{
Gui, 3:Hide
}
return
Gui3Close:
{
Gui, 3:Hide
}
return
ButtonAvançar:
{
Gui 1: Submit
}
global clipsaved:= ClipboardAll
clipboard :=
espera :=  round(Aguarda * 1000)
toltip := round(espera / 1000) - 1
ModernBrowsers := "ApplicationFrameWindow,Chrome_WidgetWin_0,Chrome_WidgetWin_1,Maxthon3Cls_MainFrm,MozillaWindowClass,Slimjet_WidgetWin_1"
LegacyBrowsers := "IEFrame,OperaWindowClass"
Data := substr(Data, 7,2) . "/" . substr(Data, 5,2) . "/" . substr(Data, 1,4)
DataFim := substr(DataFim, 7,2) . "/" . substr(DataFim, 5,2) . "/" . substr(DataFim, 1,4)
validacao := false
if Completo
{
if ehNum_Forma(Entrada) and ehNum_Forma(Saida1) and ehNum_Forma(Entrada2) and ehNum_Forma(Saida2) and ehNum_Forma(DesportoE) and ehNum_Forma(DesportoS)
{
if inicioFim(Entrada,Saida1) and inicioFim(Entrada2,Saida2) and inicioFim(DesportoE,DesportoS)
{
myArray := [Entrada, Saida1, Entrada2, Saida2, DesportoE, DesportoS]
if ehRepetido(myArray)
{
if not sobreposicao(Entrada, Saida1, Entrada2, Saida2, DesportoE, DesportoS)
{
if not ValidateDate(Data) or Data = "" or StrLen(Data) != 10
{
MsgBox 0x30, ATENÇÃO, A data de início não é válida, corrija o erro!
}
else
{
myArray2 := ["01/01", "21/04", "01/05", "07/09", "12/10","02/11","15/11","25/12"]
myArray3 := ["25/02/2020", "16/02/2021", "01/03/2022", "21/02/2023", "13/02/2024", "04/03/2025", "24/02/2020", "15/02/2021", "28/02/2022", "20/02/2023", "12/02/2024", "03/03/2025", "10/04/2020", "02/04/2021", "15/04/2022", "07/04/2023", "29/03/2024", "18/04/2025", "11/06/2020", "03/06/2021", "16/06/2022", "08/06/2023", "30/05/2024", "19/06/2025"]
if Diasemana(Data) = 0
{
MsgBox 0x30, ATENÇÃO, Erro definição dia da semana. Entre em contato com o desenvolvedor.
}
else if Diasemana(Data) = 7 or Diasemana(Data) = 1 or hasValue(myArray2, substr(Data,1,5)) or hasValue(myArray3, Data)
{
MsgBox 0x30, ATENÇÃO, O primeiro dia tem que ser dia útil, não pode ser final de semana nem feriado!
}
else
{
if not ValidateDate(DataFim) or DataFim = "" or StrLen(DataFim) != 10
{
MsgBox 0x30, ATENÇÃO, A data final não é válida, corrija o erro!
}
else
{
dtIni := substr(Data, 7,4) . substr(Data, 4, 2) . substr(Data, 1, 2)
dtFim := substr(DataFim, 7,4) . substr(DataFim, 4, 2) . substr(DataFim, 1, 2)
teste := DateDiff(dtIni, dtFim, "days")
if teste < 0
{
MsgBox 0x30, ATENÇÃO, A data inicial não pode ser maior que a data final, corrija o erro!
}
else
{
if Aguarda < 1
{
MsgBox 0x30, ATENÇÃO, O campo tempo de resposta deve estra entre 1 e 99, corrija o erro!
}
else
{
validacao := true
}
}
}
}
}
}
}
}
}
}
else if (Sodesporto)
{
if ehNum_Forma(DesportoE) and ehNum_Forma(DesportoS)
{
if inicioFim(DesportoE,DesportoS)
{
myArray := [DesportoE, DesportoS]
if ehRepetido(myArray)
{
if not ValidateDate(Data) or Data = "" or StrLen(Data) != 10
{
MsgBox 0x30, ATENÇÃO, A data de início não é válida, corrija o erro!
}
else
{
myArray2 := ["01/01", "21/04", "01/05", "07/09", "12/10","02/11","15/11","25/12"]
myArray3 := ["25/02/2020", "16/02/2021", "01/03/2022", "21/02/2023", "13/02/2024", "04/03/2025", "24/02/2020", "15/02/2021", "28/02/2022", "20/02/2023", "12/02/2024", "03/03/2025", "10/04/2020", "02/04/2021", "15/04/2022", "07/04/2023", "29/03/2024", "18/04/2025", "11/06/2020", "03/06/2021", "16/06/2022", "08/06/2023", "30/05/2024", "19/06/2025"]
if Diasemana(Data) = 0
{
MsgBox 0x30, ATENÇÃO, Erro definição dia da semana. Entre em contato com o desenvolvedor.
}
else if Diasemana(Data) = 7 or Diasemana(Data) = 1 or hasValue(myArray2, substr(Data,1,5)) or hasValue(myArray3, Data)
{
MsgBox 0x30, ATENÇÃO, O primeiro dia tem que ser dia útil, não pode ser final de semana nem feriado!
}
else
{
if not ValidateDate(DataFim) or DataFim = "" or StrLen(DataFim) != 10
{
MsgBox 0x30, ATENÇÃO, A data final não é válida, corrija o erro!
}
else
{
dtIni := substr(Data, 7,4) . substr(Data, 4, 2) . substr(Data, 1, 2)
dtFim := substr(DataFim, 7,4) . substr(DataFim, 4, 2) . substr(DataFim, 1, 2)
teste := DateDiff(dtIni, dtFim, "days")
if teste < 0
{
MsgBox 0x30, ATENÇÃO, A data inicial não pode ser maior que a data final, corrija o erro!
}
else
{
if Aguarda < 1
{
MsgBox 0x30, ATENÇÃO, O campo tempo de resposta deve estra entre 1 e 99, corrija o erro!
}
else
{
validacao := true
}
}
}
}
}
}
}
}
}
else if (Semdesporto)
{
if ehNum_Forma(Entrada) and ehNum_Forma(Saida1) and ehNum_Forma(Entrada2) and ehNum_Forma(Saida2)
{
if inicioFim(Entrada,Saida1) and inicioFim(Entrada2,Saida2)
{
myArray := [Entrada, Saida1, Entrada2, Saida2]
if ehRepetido(myArray)
{
if not sobreposicao2(Entrada, Saida1, Entrada2, Saida2)
{
if not ValidateDate(Data) or Data = "" or StrLen(Data) != 10
{
MsgBox 0x30, ATENÇÃO, A data de início não é válida, corrija o erro!
}
else
{
myArray2 := ["01/01", "21/04", "01/05", "07/09", "12/10","02/11","15/11","25/12"]
myArray3 := ["25/02/2020", "16/02/2021", "01/03/2022", "21/02/2023", "13/02/2024", "04/03/2025", "24/02/2020", "15/02/2021", "28/02/2022", "20/02/2023", "12/02/2024", "03/03/2025", "10/04/2020", "02/04/2021", "15/04/2022", "07/04/2023", "29/03/2024", "18/04/2025", "11/06/2020", "03/06/2021", "16/06/2022", "08/06/2023", "30/05/2024", "19/06/2025"]
if Diasemana(Data) = 0
{
MsgBox 0x30, ATENÇÃO, Erro definição dia da semana. Entre em contato com o desenvolvedor.
}
else if Diasemana(Data) = 7 or Diasemana(Data) = 1 or hasValue(myArray2, substr(Data,1,5)) or hasValue(myArray3, Data)
{
MsgBox 0x30, ATENÇÃO, O primeiro dia tem que ser dia útil, não pode ser final de semana nem feriado!
}
else
{
if not ValidateDate(DataFim) or DataFim = "" or StrLen(DataFim) != 10
{
MsgBox 0x30, ATENÇÃO, A data final não é válida, corrija o erro!
}
else
{
dtIni := substr(Data, 7,4) . substr(Data, 4, 2) . substr(Data, 1, 2)
dtFim := substr(DataFim, 7,4) . substr(DataFim, 4, 2) . substr(DataFim, 1, 2)
teste := DateDiff(dtIni, dtFim, "days")
if teste < 0
{
MsgBox 0x30, ATENÇÃO, A data inicial não pode ser maior que a data final, corrija o erro!
}
else
{
if Aguarda < 1
{
MsgBox 0x30, ATENÇÃO, O campo tempo de resposta deve estra entre 1 e 99, corrija o erro!
}
else
{
validacao := true
}
}
}
}
}
}
}
}
}
}
if not validacao
{
Gui 1:Show
return
}
entr := SubStr(Entrada, 1 , 2)*3600 + SubStr(Entrada, 3 , 2)*60
said1 := SubStr(Saida1, 1 , 2)*3600 + SubStr(Saida1, 3 , 2)*60
entr2 := SubStr(Entrada2, 1 , 2)*3600 + SubStr(Entrada2, 3 , 2)*60
said2 := SubStr(Saida2, 1 , 2)*3600 + SubStr(Saida2, 3 , 2)*60
despE := SubStr(DesportoE, 1 , 2)*3600 + SubStr(DesportoE, 3 , 2)*60
despS := SubStr(DesportoS, 1 , 2)*3600 + SubStr(DesportoS, 3 , 2)*60
pri_turno := said1 - entr
seg_turno := said2 - entr2
atividade := despS - despE
if (Sodesporto)
{
h_dia := atividade
s_dia := substr(FormatSeconds(h_dia), 1,SubStr(FormatSeconds(h_dia), 2,1) = ":" ? 4 : 5)
if h_dia != 3600
{
MsgBox 0x24, Preenche REF, O horáro da atividade física está diferente de 1 (uma) hora por dia. `nQuantidade de horas e minutos inseridos: %s_dia%`n`nDeseja continuar assim mesmo?
IfMsgBox No,{
Gui 1:Show
return
}
}
}
else if (Completo)
{
h_dia := pri_turno + seg_turno + atividade
s_dia := substr(FormatSeconds(h_dia), 1,SubStr(FormatSeconds(h_dia), 2,1) = ":" ? 4 : 5)
if h_dia != 28800
{
MsgBox 0x24, Preenche REF, O horáro do expediente somado com a atividade física está diferente de 8 (oito) horas por dia. `nQuantidade de horas inseridas: %s_dia%`n`nDeseja continuar assim mesmo?
IfMsgBox No,{
Gui 1:Show
return
}
}
}
else If (Semdesporto)
{
h_dia := pri_turno + seg_turno
s_dia := substr(FormatSeconds(h_dia), 1,SubStr(FormatSeconds(h_dia), 2,1) = ":" ? 4 : 5)
if h_dia != 28800
{
MsgBox 0x24, Preenche REF, O horáro do expediente está diferente de 8 (oito) horas por dia. `nQuantidade de horas inseridas: %s_dia%`n`nDeseja continuar assim mesmo?
IfMsgBox No,{
Gui 1:Show
return
}
}
}
If Opt1 = 1
{
if (Sodesporto)
{
GuiControl, 2: Disable, EntradaB1
GuiControl, 2: Disable, SaidaB1
GuiControl, 2: Disable, EntradaB2
GuiControl, 2: Disable, SaidaB2
GuiControl, 2: Disable, EntradaC1
GuiControl, 2: Disable, SaidaC1
GuiControl, 2: Disable, EntradaC2
GuiControl, 2: Disable, SaidaC2
GuiControl, 2: Enable, EntradaB3
GuiControl, 2: Enable, SaidaB3
GuiControl, 2: Enable, EntradaC3
GuiControl, 2: Enable, SaidaC3
}
if (Completo)
{
GuiControl, 2: Enable, EntradaB1
GuiControl, 2: Enable, SaidaB1
GuiControl, 2: Enable, EntradaB2
GuiControl, 2: Enable, SaidaB2
GuiControl, 2: Enable, EntradaC1
GuiControl, 2: Enable, SaidaC1
GuiControl, 2: Enable, EntradaC2
GuiControl, 2: Enable, SaidaC2
GuiControl, 2: Enable, EntradaB3
GuiControl, 2: Enable, SaidaB3
GuiControl, 2: Enable, EntradaC3
GuiControl, 2: Enable, SaidaC3
}
If (Semdesporto)
{
GuiControl, 2: Enable, EntradaB1
GuiControl, 2: Enable, SaidaB1
GuiControl, 2: Enable, EntradaB2
GuiControl, 2: Enable, SaidaB2
GuiControl, 2: Enable, EntradaC1
GuiControl, 2: Enable, SaidaC1
GuiControl, 2: Enable, EntradaC2
GuiControl, 2: Enable, SaidaC2
GuiControl, 2: Disable, EntradaB3
GuiControl, 2: Disable, SaidaB3
GuiControl, 2: Disable, EntradaC3
GuiControl, 2: Disable, SaidaC3
}
Gui, 2:Show, AutoSize , DIA: 2 e 3
return
}
else
{
toltip := round(espera / 1000)
MsgBox 0x40, Preenche REF, Após essa mensagem ative em %toltip% segundos o navegador com a janela aberta no primeiro dia a ser preenchido os horários e clique na barra de títulos escrito 'Detalhamento dos Registros', e após essa ação NÃO use o mouse e NÃO use o teclado!`nQuando o script acabar aparecerá uma mensagem de concluído com o tempo decorrido.`n`nSe quiser interromper a execução do script pressione ESC a qualquer instante.
permiteMsg := true
toltip2 := round(espera / 1000)
ToolTip, Clique uma vez na barra de título 'Detalhamento dos Registros'`n`n%toltip2% segundos restantes para próxima ação...
SetTimer, RemoveToolTip2, 1000
sleep, %espera%
sURL := GetActiveBrowserURL()
WinGetClass, sClass, A
If (sURL != "")
{
IfNotInString, sURL, ref/registroFrequencia
{
MsgBox  0x10, Preenche REF, %sURL% `n`nA página da web ativa não corresponte ao Registro de Frequência.
permiteMsg := false
Gui 1:Show
return
}
}
Else If sClass In % ModernBrowsers "," LegacyBrowsers
{
MsgBox  0x10, Preenche REF, % "Não foi possível determinar o URL (" sClass ")"
permiteMsg := false
Gui 1:Show
return
}
Else
{
MsgBox  0x10, Preenche REF, % "Não é um navegador ou navegador não suportado (" sClass ")`n`nAtive o navegador no Registro de Frequência (REF)."
permiteMsg := false
Gui 1:Show
return
}
inicio:= Data
comeco := substr(inicio, 7,4) . substr(inicio, 4, 2) . substr(inicio, 1, 2)
termino := dtFim
diferenca := DateDiff(comeco, termino, "days") + 1
i := 0
corrente := Data
if (Sodesporto)
{
escolhido := DesportoE . DesportoS
global time1:=A_Now
while(i < diferenca)
{
if Diasemana(corrente) = 7 or else Diasemana(corrente) = 1 or else hasValue(myArray2, substr(corrente,1,5)) or else hasValue(myArray3, corrente)
{
Send, {Tab 4}
Send, {Space}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
}
else
{
if (i = 0)
{
Send, +{Tab 6}
if VerificaCursor() == false
return
Send, +{Tab 1}
}
else
{
Send, +{Tab 4}
if VerificaCursor() == false
return
Send, +{Tab 1}
}
Send, {Space}
Send, pr
Send, {Tab}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
Send, +{Tab 5}
if VerificaCursor() == false
return
if (SteamAPIToggle2 = 1) and (StrLen(trim(Obs2))<> 0)
{
clipboard := Obs2
Send, ^v
}
Send, +{Tab 2}
hr1 := substr(escolhido, 1,4)
SendInput, %hr1%
Send, {Tab}
hr2 := substr(escolhido, 5,8)
SendInput, %hr2%
Send, {Enter}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
if (i < diferenca - 1)
{
Send, {Tab 4}
Send, {Space}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
}
}
atual := substr(corrente, 7,4) . substr(corrente, 4, 2) . substr(corrente, 1, 2)
atual += 1, days
FormatTime, corrente, %atual%, dd/MM/yyyy
i++
}
}
else
{
escolhido := Entrada . Saida1 . Entrada2 . Saida2 . DesportoE . DesportoS
global time1:=A_Now
while(i < diferenca)
{
if Diasemana(corrente) = 7 or else Diasemana(corrente) = 1 or else hasValue(myArray2, substr(corrente,1,5)) or else hasValue(myArray3, corrente)
{
Send, {Tab 4}
Send, {Space}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
}
else
{
if (i = 0)
{
Send, +{Tab 6}
if VerificaCursor() == false
return
Send, +{Tab 2}
}
else
{
Send, +{Tab 4}
if VerificaCursor() == false
return
Send, +{Tab 2}
}
Send, {Right}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
Send, +{Tab 4}
if VerificaCursor() == false
return
if (SteamAPIToggle = 1) and (StrLen(trim(Obs))<> 0)
{
clipboard := Obs
Send, ^v
}
Send, +{Tab 2}
hr1 := substr(escolhido, 1,4)
SendInput, %hr1%
Send, {Tab}
hr2 := substr(escolhido, 5,8)
SendInput, %hr2%
Send, {Enter}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
Send, +{Tab 4}
if VerificaCursor() == false
return
Send, +{Tab 2}
Send, {Right}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
Send, +{Tab 4}
if VerificaCursor() == false
return
if (SteamAPIToggle = 1) and (StrLen(trim(Obs))<> 0)
{
clipboard := Obs
Send, ^v
}
Send, +{Tab 2}
hr1 := substr(escolhido, 9,12)
SendInput, %hr1%
Send, {Tab}
hr2 := substr(escolhido, 13,16)
SendInput, %hr2%
Send, {Enter}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
If (Completo)
{
Send, +{Tab 4}
if VerificaCursor() == false
return
Send, +{Tab 1}
Send, {Space}
Send, pr
Send, {Tab}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
Send, +{Tab 5}
if VerificaCursor() == false
return
if (SteamAPIToggle2 = 1) and (StrLen(trim(Obs2))<> 0)
{
clipboard := Obs2
Send, ^v
}
Send, +{Tab 2}
hr := substr(escolhido, 17,20)
SendInput, %hr%
Send, {Tab}
hr := substr(escolhido, 21,24)
SendInput, %hr%
Send, {Enter}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
}
if (i < diferenca - 1)
{
Send, {Tab 4}
Send, {Space}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
}
}
atual := substr(corrente, 7,4) . substr(corrente, 4, 2) . substr(corrente, 1, 2)
atual += 1, days
FormatTime, corrente, %atual%, dd/MM/yyyy
i++
}
}
time2:=A_Now
time2 -=%time1%,s
tempo := FormatSeconds(time2)
If Opt2 = 1
{
clipboard := "Preenche REF - Tempo decorrido (h:mm:ss): " tempo
permiteMsg := false
Gui 1:Show
DllCall("LockWorkStation")
return
}
else
{
MsgBox 0x40, Preenche REF - Temporizador, Concluído! Tempo decorrido (h:mm:ss): %tempo%
permiteMsg := false
Gui 1:Show
Clipboard := clipsaved
return
}
}
ButtonVoltar:
{
GUI, 2:Hide
GUI, 1:Show
return
}
ButtonAplicar:
Gui, 2:Submit
validaDia2 := false
if (Sodesporto)
{
if ehNum_Forma(EntradaB3) and ehNum_Forma(SaidaB3)
{
if inicioFim(EntradaB3,SaidaB3)
{
validaDia2 := true
}
}
}
else if (Completo)
{
if ehNum_Forma(EntradaB1) and ehNum_Forma(SaidaB1) and ehNum_Forma(EntradaB2) and ehNum_Forma(SaidaB2) and ehNum_Forma(EntradaB3) and ehNum_Forma(SaidaB3)
{
if inicioFim(EntradaB1,SaidaB1) and inicioFim(EntradaB2,SaidaB2) and inicioFim(EntradaB3,SaidaB3)
{
myArray := [EntradaB1, SaidaB1, EntradaB2, SaidaB2, EntradaB3, SaidaB3]
if ehRepetido(myArray)
{
if not sobreposicao(EntradaB1, SaidaB1, EntradaB2, SaidaB2, EntradaB3, SaidaB3)
{
validaDia2 := true
}
}
}
}
}
else If (Semdesporto)
{
if ehNum_Forma(EntradaB1) and ehNum_Forma(SaidaB1) and ehNum_Forma(EntradaB2) and ehNum_Forma(SaidaB2)
{
if inicioFim(EntradaB1,SaidaB1) and inicioFim(EntradaB2,SaidaB2)
{
myArray := [EntradaB1, SaidaB1, EntradaB2, SaidaB2]
if ehRepetido(myArray)
{
if not sobreposicao2(EntradaB1, SaidaB1, EntradaB2, SaidaB2)
{
validaDia2 := true
}
}
}
}
}
if not validaDia2
{
Gui, 2:Show
return
}
validaDia3 := false
if (Sodesporto)
{
if ehNum_Forma(EntradaC3) and ehNum_Forma(SaidaC3)
{
if inicioFim(EntradaC3,SaidaC3)
{
validaDia3 := true
}
}
}
else if (Completo)
{
if ehNum_Forma(EntradaC1) and ehNum_Forma(SaidaC1) and ehNum_Forma(EntradaC2) and ehNum_Forma(SaidaC2) and ehNum_Forma(EntradaC3) and ehNum_Forma(SaidaC3)
{
if inicioFim(EntradaC1,SaidaC1) and inicioFim(EntradaC2,SaidaC2) and inicioFim(EntradaC3,SaidaC3)
{
myArray := [EntradaC1, SaidaC1, EntradaC2, SaidaC2, EntradaC3, SaidaC3]
if ehRepetido(myArray)
{
if not sobreposicao(EntradaC1, SaidaC1, EntradaC2, SaidaC2, EntradaC3, SaidaC3)
{
validaDia3 := true
}
}
}
}
}
else If (Semdesporto)
{
if ehNum_Forma(EntradaC1) and ehNum_Forma(SaidaC1) and ehNum_Forma(EntradaC2) and ehNum_Forma(SaidaC2)
{
if inicioFim(EntradaC1,SaidaC1) and inicioFim(EntradaC2,SaidaC2)
{
myArray := [EntradaC1, SaidaC1, EntradaC2, SaidaC2]
if ehRepetido(myArray)
{
if not sobreposicao2(EntradaC1, SaidaC1, EntradaC2, SaidaC2)
{
validaDia3 := true
}
}
}
}
}
if not validaDia3
{
Gui, 2:Show
return
}
entrB1 := SubStr(EntradaB1, 1 , 2)*3600 + SubStr(EntradaB1, 3 , 2)*60
saidB1 := SubStr(SaidaB1, 1 , 2)*3600 + SubStr(SaidaB1, 3 , 2)*60
entrB2 := SubStr(EntradaB2, 1 , 2)*3600 + SubStr(EntradaB2, 3 , 2)*60
saidB2 := SubStr(SaidaB2, 1 , 2)*3600 + SubStr(SaidaB2, 3 , 2)*60
despEB3 := SubStr(EntradaB3, 1 , 2)*3600 + SubStr(EntradaB3, 3 , 2)*60
despSB3 := SubStr(SaidaB3, 1 , 2)*3600 + SubStr(SaidaB3, 3 , 2)*60
pri_turnoB := saidB1 - entrB1
seg_turnoB := saidB2 - entrB2
atividadeB := despSB3 - despEB3
h_dia2 := pri_turnoB + seg_turnoB + atividadeB
s_dia2 := substr(FormatSeconds(h_dia2), 1,SubStr(FormatSeconds(h_dia2), 2,1) = ":" ? 4 : 5)
entrC1 := SubStr(EntradaC1, 1 , 2)*3600 + SubStr(EntradaC1, 3 , 2)*60
saidC1 := SubStr(SaidaC1, 1 , 2)*3600 + SubStr(SaidaC1, 3 , 2)*60
entrC2 := SubStr(EntradaC2, 1 , 2)*3600 + SubStr(EntradaC2, 3 , 2)*60
saidC2 := SubStr(SaidaC2, 1 , 2)*3600 + SubStr(SaidaC2, 3 , 2)*60
despEC3 := SubStr(EntradaC3, 1 , 2)*3600 + SubStr(EntradaC3, 3 , 2)*60
despSC3 := SubStr(SaidaC3, 1 , 2)*3600 + SubStr(SaidaC3, 3 , 2)*60
pri_turnoC := saidC1 - entrC1
seg_turnoC := saidC2 - entrC2
atividadeC := despSC3 - despEC3
h_dia3 := pri_turnoC + seg_turnoC + atividadeC
s_dia3 := substr(FormatSeconds(h_dia3), 1,SubStr(FormatSeconds(h_dia3), 2,1) = ":" ? 4 : 5)
if (Completo)
{
if (h_dia2 != 28800)  or  (h_dia3 != 28800)
{
MsgBox 0x24, Preenche REF, O horáro do expediente somado com a atividade física está diferente de 8 (oito) horas por dia. `nQuantidade de horas inseridas no DIA 2: %s_dia2%`nQuantidade de horas inseridas no DIA 3: %s_dia3%`n`nDeseja continuar assim mesmo?
IfMsgBox No,{
Gui 2:Show
return
}
}
}
else if (Sodesporto)
{
h_dia2 := atividadeB
s_dia2 := substr(FormatSeconds(h_dia2), 1,SubStr(FormatSeconds(h_dia2), 2,1) = ":" ? 4 : 5)
h_dia3 := atividadeC
s_dia3 := substr(FormatSeconds(h_dia3), 1,SubStr(FormatSeconds(h_dia3), 2,1) = ":" ? 4 : 5)
if (h_dia2 != 3600)  or  (h_dia3 != 3600)
{
MsgBox 0x24, Preenche REF, O horáro da atividade física está diferente de 1 (uma) hora por dia. `nQuantidade de horas e minutos inseridos no DIA 2: %s_dia2%`nQuantidade de horas e minutos inseridos no DIA 3: %s_dia3%`n`nDeseja continuar assim mesmo?
IfMsgBox No,{
Gui 2:Show
return
}
}
}
else if (Semdesporto)
{
h_dia2 :=  pri_turnoB + seg_turnoB
s_dia2 := substr(FormatSeconds(h_dia2), 1,SubStr(FormatSeconds(h_dia2), 2,1) = ":" ? 4 : 5)
h_dia3 := pri_turnoC + seg_turnoC
s_dia3 := substr(FormatSeconds(h_dia3), 1,SubStr(FormatSeconds(h_dia3), 2,1) = ":" ? 4 : 5)
if (h_dia2 != 28800)  or  (h_dia3 != 28800)
{
MsgBox 0x24, Preenche REF, O horáro do expediente está diferente de 8 (oito) horas por dia. `nQuantidade de horas inseridas no DIA 2: %s_dia2%`nQuantidade de horas inseridas no DIA 3: %s_dia3%`n`nDeseja continuar assim mesmo?
IfMsgBox No,{
Gui 2:Show
return
}
}
}
toltip := round(espera / 1000)
MsgBox 0x40, Preenche REF, Após essa mensagem ative em %toltip% segundos o navegador com a janela aberta no primeiro dia a ser preenchido os horários e clique na barra de títulos escrito 'Detalhamento dos Registros', e após essa ação NÃO use o mouse e NÃO use o teclado!`nQuando o script acabar aparecerá uma mensagem de concluído com o tempo decorrido.`n`nSe quiser interromper a execução do script pressione ESC a qualquer instante.
permiteMsg := true
toltip2 := round(espera / 1000)
ToolTip, Clique uma vez na barra de título 'Detalhamento dos Registros'`n`n%toltip2% segundos restantes para próxima ação...
SetTimer, RemoveToolTip2, 1000
sleep, %espera%
sURL := GetActiveBrowserURL()
WinGetClass, sClass, A
If (sURL != "")
{
IfNotInString, sURL, ref/registroFrequencia
{
MsgBox  0x10, Preenche REF, %sURL% `n`nA página da web ativa não corresponte ao Registro de Frequência.
permiteMsg := false
Gui 1:Show
return
}
}
Else If sClass In % ModernBrowsers "," LegacyBrowsers
{
MsgBox  0x10, Preenche REF, % "Não foi possível determinar o URL (" sClass ")"
permiteMsg := false
Gui 1:Show
return
}
Else
{
MsgBox  0x10, Preenche REF, % "Não é um navegador ou navegador não suportado (" sClass ")`n`nAtive o navegador no Registro de Frequência (REF)."
permiteMsg := false
Gui 1:Show
return
}
global time1:=A_Now
inicio:= Data
comeco := substr(inicio, 7,4) . substr(inicio, 4, 2) . substr(inicio, 1, 2)
termino := dtFim
diferenca := DateDiff(comeco, termino, "days") + 1
i := 0
corrente := Data
if (Sodesporto)
{
while(i < diferenca)
{
Random, Random1, 1, 3
if   Random1 = 1
{
escolhido := DesportoE . DesportoS
}
else if Random1 = 2
{
escolhido := EntradaB3 . SaidaB3
}
else
{
escolhido := EntradaC3 . SaidaC3
}
if Diasemana(corrente) = 7 or else Diasemana(corrente) = 1 or else hasValue(myArray2, substr(corrente,1,5)) or else hasValue(myArray3, corrente)
{
Send, {Tab 4}
Send, {Space}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
}
else
{
if (i = 0)
{
Send, +{Tab 6}
if VerificaCursor() == false
return
Send, +{Tab 1}
}
else
{
Send, +{Tab 4}
if VerificaCursor() == false
return
Send, +{Tab 1}
}
Send, {Space}
Send, pr
Send, {Tab}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
Send, +{Tab 5}
if VerificaCursor() == false
return
if (SteamAPIToggle2 = 1) and (StrLen(trim(Obs2))<> 0)
{
clipboard := Obs2
Send, ^v
}
Send, +{Tab 2}
hr := substr(escolhido, 1,4)
SendInput, %hr%
Send, {Tab}
hr := substr(escolhido, 5,8)
SendInput, %hr%
Send, {Enter}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
if (i < diferenca - 1)
{
Send, {Tab 4}
Send, {Space}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
}
}
atual := substr(corrente, 7,4) . substr(corrente, 4, 2) . substr(corrente, 1, 2)
atual += 1, days
FormatTime, corrente, %atual%, dd/MM/yyyy
i++
}
}
else
{
while(i < diferenca)
{
Random, Random1, 1, 3
if   Random1 = 1
{
escolhido := Entrada . Saida1 . Entrada2 . Saida2 . DesportoE . DesportoS
}
else if Random1 = 2
{
escolhido := EntradaB1 . SaidaB1 . EntradaB2 . SaidaB2 . EntradaB3 . SaidaB3
}
else
{
escolhido := EntradaC1 . SaidaC1 . EntradaC2 . SaidaC2 . EntradaC3 . SaidaC3
}
if Diasemana(corrente) = 7 or else Diasemana(corrente) = 1 or else hasValue(myArray2, substr(corrente,1,5)) or else hasValue(myArray3, corrente)
{
Send, {Tab 4}
Send, {Space}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
}
else
{
if (i = 0)
{
Send, +{Tab 6}
if VerificaCursor() == false
return
Send, +{Tab 2}
}
else
{
Send, +{Tab 4}
if VerificaCursor() == false
return
Send, +{Tab 2}
}
Send, {Right}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
Send, +{Tab 4}
if VerificaCursor() == false
return
if (SteamAPIToggle = 1) and (StrLen(trim(Obs))<> 0)
{
clipboard := Obs
Send, ^v
}
Send, +{Tab 2}
hr1 := substr(escolhido, 1,4)
SendInput, %hr1%
Send, {Tab}
hr2 := substr(escolhido, 5,8)
SendInput, %hr2%
Send, {Enter}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
Send, +{Tab 4}
if VerificaCursor() == false
return
Send, +{Tab 2}
Send, {Right}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
Send, +{Tab 4}
if VerificaCursor() == false
return
if (SteamAPIToggle = 1) and (StrLen(trim(Obs))<> 0)
{
clipboard := Obs
Send, ^v
}
Send, +{Tab 2}
hr1 := substr(escolhido, 9,12)
SendInput, %hr1%
Send, {Tab}
hr2 := substr(escolhido, 13,16)
SendInput, %hr2%
Send, {Enter}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
if (Completo)
{
Send, +{Tab 4}
if VerificaCursor() == false
return
Send, +{Tab 1}
Send, {Space}
Send, pr
Send, {Tab}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
Send, +{Tab 5}
if VerificaCursor() == false
return
if (SteamAPIToggle2 = 1) and (StrLen(trim(Obs2))<> 0)
{
clipboard := Obs2
Send, ^v
}
Send, +{Tab 2}
hr := substr(escolhido, 17,20)
SendInput, %hr%
Send, {Tab}
hr := substr(escolhido, 21,24)
SendInput, %hr%
Send, {Enter}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
}
if (i < diferenca - 1)
{
Send, {Tab 4}
Send, {Space}
toltip := round(espera / 1000) - 1
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
SetTimer, RemoveToolTip, 1000
sleep, %espera%
}
}
atual := substr(corrente, 7,4) . substr(corrente, 4, 2) . substr(corrente, 1, 2)
atual += 1, days
FormatTime, corrente, %atual%, dd/MM/yyyy
i++
}
}
time2:=A_Now
time2 -=%time1%,s
tempo := FormatSeconds(time2)
If Opt2 = 1
{
clipboard := "Preenche REF - Tempo decorrido (h:mm:ss): " tempo
permiteMsg := false
Gui 1:Show
DllCall("LockWorkStation")
return
}
else
{
MsgBox 0x40, Preenche REF - Temporizador, Concluído! Tempo decorrido (h:mm:ss): %tempo%
permiteMsg := false
Gui 1:Show
Clipboard := clipsaved
return
}
ByeScript:
{
MsgBox, 36, ATENÇÃO, Deseja realmente fechar o programa do 'Preenche REF'?
IfMsgBox No
return
ExitApp
}
Esc::
if permiteMsg
{
MsgBox 0x40, Preenche REF, Saindo...,1
permiteMsg := false
Clipboard := clipsaved
Reload
}
return
ButtonCancelar:
ButtonEncerrar:
GuiClose:
2GuiClose:
ExitApp
RemoveToolTip:
toltip -=1
if %toltip% >= 0
{
SetTimer, RemoveToolTip, Off
ToolTip
return
}
else
{
ToolTip, Não clique o mouse e não use o teclado`n`n%toltip% segundos restantes para próxima ação...
return
}
RemoveToolTip2:
toltip2 -=1
if %toltip2% >= 0
{
SetTimer, RemoveToolTip2, Off
ToolTip
return
}
else
{
ToolTip, Clique uma vez na barra de título 'Detalhamento dos Registros'`n`n%toltip2% segundos restantes para próxima ação...
return
}
ehNum_Forma(input)
{
if StrLen(input) != 4  or substr(input, 1, 2) + 0 > 23  or substr(input, 3, 2) + 0 > 59
{
msgbox 0x30, ATENÇÃO, O campo digitado '%input%' está errado! Deve ser digitado exatos 4 (quatro) números no formato 23:59 (sem os dois pontos).
return	false
}
return	true
}
inicioFim(pri, seg)
{
if (pri + 0) >= (seg + 0)
{
MsgBox 0x30, ATENÇÃO, O campo de Entrada '%pri%' não pode ser maior nem igual ao campo '%seg%' referente a Saída.
return false
}
return	true
}
ehRepetido(myarray)
{
valueCount := {}
repetido :=
Pack := "0000"
for index, value in myArray
{
valueCount[value] ? valueCount[value]++ : valueCount[value] := 1
if valueCount[value] > 1
{
{
repetido := value
}
}
}
if repetido !=
{
MsgBox 0x30, ATENÇÃO, % "O valor '" SubStr("000" . repetido, -3) "' está duplicado, corrija a sobreposição do horário!"
return false
}
return true
}
hasValue(palheiro, agulha) {
if(!isObject(palheiro))
return false
if(palheiro.Length()==0)
return false
for k,v in palheiro
if(v==agulha)
return true
return false
}
sobreposicao(entr1,said1,entr2,said2,entr3,said3)
{
sobreposto := false
if !((entr1 + 0) > (said2 + 0) or else (said1 + 0) < (entr2 + 0))
{
sobreposto := true
}
else if !((entr1 + 0) > (said3 + 0) or else (said1 + 0) < (entr3 + 0))
{
sobreposto := true
}
else if !((entr2 + 0) > (said3 + 0) or else (said2 + 0) < (entr3 + 0))
{
sobreposto := true
}
if sobreposto
{
MsgBox 0x30, ATENÇÃO, Está ocorrendo interseção de horários, corrija o erro!
}
return sobreposto
}
sobreposicao2(entr1,said1,entr2,said2)
{
sobreposto2 := false
if !((entr1 + 0) > (said2 + 0) or else (said1 + 0) < (entr2 + 0))
{
sobreposto2 := true
}
if sobreposto2
{
MsgBox 0x30, ATENÇÃO, Está ocorrendo interseção de horários, corrija o erro!
}
return sobreposto2
}
ValidateDate(d)
{
StringSplit, m, d, `/
v := (StrLen(m3)=2 ? "20" : "") m3 m2 m1
v += 0, Days
return v
}
Diasemana(dt)
{
UserInput := substr(dt, 7,4) . substr(dt, 4, 2) . substr(dt, 1, 2)
StringSplit, d, UserInput, /
date := d3 d1 d2
FormatTime, day_of_Week, %date%, dddd
if (day_of_week == "segunda-feira")
{
return 2
}
else if (day_of_week == "terça-feira")
{
return 3
}
else if (day_of_week == "quarta-feira")
{
return 4
}
else if (day_of_week == "quinta-feira")
{
return 5
}
else if (day_of_week == "sexta-feira")
{
return 6
}
else if (day_of_week == "sábado")
{
return 7
}
else if (day_of_week == "domingo")
{
return 1
}
else
{
return 0
}
}
LDOM(TimeStr="")
{
If TimeStr=
TimeStr:= A_Now
TimeStr := substr(TimeStr, 7,4) . substr(TimeStr, 4, 2) . substr(TimeStr, 1, 2)
StringLeft,Date,TimeStr,6
Day  = 28
Date = %Date%%Day%
FormatTime,cMonth,%Date%,M
Loop,3
{
Date+=1,days
FormatTime,tMonth,%Date%,M
if tMonth != %cMonth%
break
else
Day+=1
}
Return Day
}
DateDiff(Start, End, unit)
{
Diff := End
Diff -= Start, %unit%
return Diff
}
FormatSeconds(NumberOfSeconds)
{
time = 19990101
time += %NumberOfSeconds%, seconds
FormatTime, mmss, %time%, mm:ss
return NumberOfSeconds//3600 ":" mmss
}
GuiButtonIcon(Handle, File, Index := 1, Options := "")
{
RegExMatch(Options, "i)w\K\d+", W), (W="") ? W := 16 :
RegExMatch(Options, "i)h\K\d+", H), (H="") ? H := 16 :
RegExMatch(Options, "i)s\K\d+", S), S ? W := H := S :
RegExMatch(Options, "i)l\K\d+", L), (L="") ? L := 0 :
RegExMatch(Options, "i)t\K\d+", T), (T="") ? T := 0 :
RegExMatch(Options, "i)r\K\d+", R), (R="") ? R := 0 :
RegExMatch(Options, "i)b\K\d+", B), (B="") ? B := 0 :
RegExMatch(Options, "i)a\K\d+", A), (A="") ? A := 4 :
Psz := A_PtrSize = "" ? 4 : A_PtrSize, DW := "UInt", Ptr := A_PtrSize = "" ? DW : "Ptr"
VarSetCapacity( button_il, 20 + Psz, 0 )
NumPut( normal_il := DllCall( "ImageList_Create", DW, W, DW, H, DW, 0x21, DW, 1, DW, 1 ), button_il, 0, Ptr )
NumPut( L, button_il, 0 + Psz, DW )
NumPut( T, button_il, 4 + Psz, DW )
NumPut( R, button_il, 8 + Psz, DW )
NumPut( B, button_il, 12 + Psz, DW )
NumPut( A, button_il, 16 + Psz, DW )
SendMessage, BCM_SETIMAGELIST := 5634, 0, &button_il,, AHK_ID %Handle%
return IL_Add( normal_il, File, Index )
}
GetActiveBrowserURL() {
global ModernBrowsers, LegacyBrowsers
WinGetClass, sClass, A
If sClass In % ModernBrowsers
Return GetBrowserURL_ACC(sClass)
Else If sClass In % LegacyBrowsers
Return GetBrowserURL_DDE(sClass)
Else
Return ""
}
GetBrowserURL_DDE(sClass) {
WinGet, sServer, ProcessName, % "ahk_class " sClass
StringTrimRight, sServer, sServer, 4
iCodePage := A_IsUnicode ? 0x04B0 : 0x03EC
DllCall("DdeInitialize", "UPtrP", idInst, "Uint", 0, "Uint", 0, "Uint", 0)
hServer := DllCall("DdeCreateStringHandle", "UPtr", idInst, "Str", sServer, "int", iCodePage)
hTopic := DllCall("DdeCreateStringHandle", "UPtr", idInst, "Str", "WWW_GetWindowInfo", "int", iCodePage)
hItem := DllCall("DdeCreateStringHandle", "UPtr", idInst, "Str", "0xFFFFFFFF", "int", iCodePage)
hConv := DllCall("DdeConnect", "UPtr", idInst, "UPtr", hServer, "UPtr", hTopic, "Uint", 0)
hData := DllCall("DdeClientTransaction", "Uint", 0, "Uint", 0, "UPtr", hConv, "UPtr", hItem, "UInt", 1, "Uint", 0x20B0, "Uint", 10000, "UPtrP", nResult)
sData := DllCall("DdeAccessData", "Uint", hData, "Uint", 0, "Str")
DllCall("DdeFreeStringHandle", "UPtr", idInst, "UPtr", hServer)
DllCall("DdeFreeStringHandle", "UPtr", idInst, "UPtr", hTopic)
DllCall("DdeFreeStringHandle", "UPtr", idInst, "UPtr", hItem)
DllCall("DdeUnaccessData", "UPtr", hData)
DllCall("DdeFreeDataHandle", "UPtr", hData)
DllCall("DdeDisconnect", "UPtr", hConv)
DllCall("DdeUninitialize", "UPtr", idInst)
csvWindowInfo := StrGet(&sData, "CP0")
StringSplit, sWindowInfo, csvWindowInfo, `"
Return sWindowInfo2
}
GetBrowserURL_ACC(sClass) {
global nWindow, accAddressBar
If (nWindow != WinExist("ahk_class " sClass))
{
nWindow := WinExist("ahk_class " sClass)
accAddressBar := GetAddressBar(Acc_ObjectFromWindow(nWindow))
}
Try sURL := accAddressBar.accValue(0)
If (sURL == "") {
WinGet, nWindows, List, % "ahk_class " sClass
If (nWindows > 1) {
accAddressBar := GetAddressBar(Acc_ObjectFromWindow(nWindows2))
Try sURL := accAddressBar.accValue(0)
}
}
If ((sURL != "") and (SubStr(sURL, 1, 4) != "http"))
sURL := "http://" sURL
If (sURL == "")
nWindow := -1
Return sURL
}
GetAddressBar(accObj) {
Try If ((accObj.accRole(0) == 42) and IsURL(accObj.accValue(0)))
Return accObj
Try If ((accObj.accRole(0) == 42) and IsURL("http://" accObj.accValue(0)))
Return accObj
For nChild, accChild in Acc_Children(accObj)
If IsObject(accAddressBar := GetAddressBar(accChild))
Return accAddressBar
}
IsURL(sURL) {
Return RegExMatch(sURL, "^(?<Protocol>https?|ftp)://(?<Domain>(?:[\w-]+\.)+\w\w+)(?::(?<Port>\d+))?/?(?<Path>(?:[^:/?# ]*/?)+)(?:\?(?<Query>[^#]+)?)?(?:\#(?<Hash>.+)?)?$")
}
Acc_Init()
{
static h
If Not h
h:=DllCall("LoadLibrary","Str","oleacc","Ptr")
}
Acc_ObjectFromWindow(hWnd, idObject = 0)
{
Acc_Init()
If DllCall("oleacc\AccessibleObjectFromWindow", "Ptr", hWnd, "UInt", idObject&=0xFFFFFFFF, "Ptr", -VarSetCapacity(IID,16)+NumPut(idObject==0xFFFFFFF0?0x46000000000000C0:0x719B3800AA000C81,NumPut(idObject==0xFFFFFFF0?0x0000000000020400:0x11CF3C3D618736E0,IID,"Int64"),"Int64"), "Ptr*", pacc)=0
Return ComObjEnwrap(9,pacc,1)
}
Acc_Query(Acc) {
Try Return ComObj(9, ComObjQuery(Acc,"{618736e0-3c3d-11cf-810c-00aa00389b71}"), 1)
}
Acc_Children(Acc) {
If ComObjType(Acc,"Name") != "IAccessible"
ErrorLevel := "Invalid IAccessible Object"
Else {
Acc_Init(), cChildren:=Acc.accChildCount, Children:=[]
If DllCall("oleacc\AccessibleChildren", "Ptr",ComObjValue(Acc), "Int",0, "Int",cChildren, "Ptr",VarSetCapacity(varChildren,cChildren*(8+2*A_PtrSize),0)*0+&varChildren, "Int*",cChildren)=0 {
Loop %cChildren%
i:=(A_Index-1)*(A_PtrSize*2+8)+8, child:=NumGet(varChildren,i), Children.Insert(NumGet(varChildren,i-8)=9?Acc_Query(child):child), NumGet(varChildren,i-8)=9?ObjRelease(child):
Return Children.MaxIndex()?Children:
} Else
ErrorLevel := "AccessibleChildren DllCall Failed"
}
}
VerificaCursor()
{
Send, {Space}
clipboard :=
Send, {Shift}+{Home}
Send, ^x
if not (Clipboard = " ")
{
time2:=A_Now
time2 -=%time1%,s
tempo := FormatSeconds(time2)
MsgBox  0x10, Preenche REF, O cursor não está na posição correta. Volte a reexecutar o script seguindo as recomendações.`n`nTempo decorrido até aqui (h:mm:ss): %tempo%
permiteMsg := false
Clipboard := clipsaved
Gui 1:Show
return false
}
return true
}