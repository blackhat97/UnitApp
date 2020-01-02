unit Unit1;

interface

uses
  Windows, Messages, SysUtils, Classes, Graphics, Controls, Forms, Dialogs,
  StdCtrls, Buttons, Spin, ExtCtrls, Gauges, AfDataDispatcher,
  AfComPort;

  procedure SendBuf;
  procedure BtnEnable;
  procedure BtnDisable;
  procedure ReadInforFile;     { Read Infor.ini file }
  procedure WriteInforFile;    { Write Infor.ini file }
  procedure OpenInforFile;     { Open Infor.ini file }
  function NumberStr(TempStr:String; N:Integer):String;
  function CheckSumProcess(TempStr:String; N:Integer):Word;

  const InforFileName  = 'INFOR.INI';   // Information file
  const ciEndLine= 3;

  const	EXT	=	3;
  const	EOT	=	4;
  const	ENQ	=	5;
  const ACK	=	6;

type
  TForm1 = class(TForm)
    BitBtn1: TBitBtn;
    GroupBox1: TGroupBox;
    Label5: TLabel;
    Image3: TImage;
    Image4: TImage;
    ComboBox1: TComboBox;
    BitBtn3: TBitBtn;
    Edit2: TEdit;
    Label4: TLabel;
    HexBox1: TCheckBox;
    AfComPort1: TAfComPort;
    Label1: TLabel;
    Label2: TLabel;
    Label3: TLabel;
    Label6: TLabel;
    Label7: TLabel;
    Label8: TLabel;
    Label9: TLabel;
    Label10: TLabel;
    Label14: TLabel;
    Label15: TLabel;
    EditT1: TEdit;
    EditT2: TEdit;
    EditT3: TEdit;
    EditT4: TEdit;
    EditT5: TEdit;
    EditT6: TEdit;
    EditW11: TEdit;
    EditW12: TEdit;
    Label16: TLabel;
    Label11: TLabel;
    Label12: TLabel;
    EditW21: TEdit;
    EditW22: TEdit;
    EditW31: TEdit;
    EditW32: TEdit;
    Label13: TLabel;
    Label17: TLabel;
    Label18: TLabel;
    EditC11: TEdit;
    EditC12: TEdit;
    EditC21: TEdit;
    EditC22: TEdit;
    EditC31: TEdit;
    EditC32: TEdit;
    EditM11: TEdit;
    EditM12: TEdit;
    EditM21: TEdit;
    EditM22: TEdit;
    EditM31: TEdit;
    EditM32: TEdit;
    Label19: TLabel;
    Label20: TLabel;
    Label21: TLabel;
    Label22: TLabel;
    EditS11: TEdit;
    EditS12: TEdit;
    Label23: TLabel;
    Label24: TLabel;
    Label25: TLabel;
    EditS21: TEdit;
    EditS22: TEdit;
    EditS31: TEdit;
    EditS32: TEdit;
    Label26: TLabel;
    Label27: TLabel;
    Label28: TLabel;
    EditG11: TEdit;
    EditG12: TEdit;
    EditG21: TEdit;
    EditG22: TEdit;
    EditG31: TEdit;
    EditG32: TEdit;
    EditAD11: TEdit;
    EditAD12: TEdit;
    EditAD21: TEdit;
    EditAD22: TEdit;
    EditAD31: TEdit;
    EditAD32: TEdit;
    Label29: TLabel;
    Label30: TLabel;
    Label31: TLabel;
    EditA1: TEdit;
    EditA2: TEdit;
    EditA3: TEdit;
    Label32: TLabel;
    Label33: TLabel;
    Label34: TLabel;
    Label35: TLabel;
    Label36: TLabel;
    Label37: TLabel;
    Label38: TLabel;
    Label39: TLabel;
    Label40: TLabel;
    Label41: TLabel;
    EditR1: TEdit;
    EditR2: TEdit;
    EditR3: TEdit;
    EditR4: TEdit;
    EditR5: TEdit;
    EditR6: TEdit;
    EditR7: TEdit;
    EditR8: TEdit;
    Label42: TLabel;
    Label43: TLabel;
    Label44: TLabel;
    Label45: TLabel;
    EditR9: TEdit;
    EditR10: TEdit;
    EditR11: TEdit;
    EditR12: TEdit;
    EditR13: TEdit;
    Memo1: TMemo;
    DPBtn: TBitBtn;
    BitBtn4: TBitBtn;
    Label46: TLabel;
    Label47: TLabel;
    LabelS: TLabel;
    Label48: TLabel;
    LabelCK: TLabel;
    RadioGroup1: TRadioGroup;
    Label49: TLabel;
    LabelR: TLabel;
    Bevel1: TBevel;
    Bevel2: TBevel;
    Bevel3: TBevel;
    Bevel4: TBevel;
    procedure FormCreate(Sender: TObject);
    procedure BitBtn1Click(Sender: TObject);
    procedure BitBtn3Click(Sender: TObject);
    procedure DPBtnClick(Sender: TObject);
    procedure BitBtn4Click(Sender: TObject);
    procedure AfComPort1DataRecived(Sender: TObject; Count: Integer);
  private
    { Private declarations }
  public
    { Public declarations }
    function SendDataCheck(Command: String): Integer;
  end;

var
  Form1: TForm1;

  InforList: array [1..ciEndLine] of String; // 초기화 파일 리스트
  InforDir: String;
  Tstat: Boolean;

implementation

uses Generic;

{$R *.DFM}

//------------------------------------------------------------------------------
procedure SendBuf;
var
  I: Integer;
begin
  for I:=0 to RitLen-1 do begin
    Form1.AfComPort1.WriteChar(RtBuff[I]);
//    Sleep(1);
  end;
end;

function TForm1.SendDataCheck(Command: String): Integer;
var
  rlt, i : Integer;
begin
  Respons := '';
  rlt := -2;

  Try
    AfComPort1.WriteString(Command);
  Except
    Rlt := -3;
    AfComPort1.Close;
  end;

  for i := 0 to 500 do begin
    Application.ProcessMessages;
//    Sleep(1);
    if Pos(#6, Respons) > 0 then begin
      rlt := 0;
      Break;
    end else if Pos(#15, Respons) > 0 then begin
      rlt := -1;
      Break;
    end;
  end;

  //0 : 성공, -1 : 실패, -2 : 응답 값 없음, -3 : CommPort Error
  Result := Rlt;
end;

procedure BtnEnable;
begin
  with Form1  do begin
    DPBtn.Enabled:= True;
  end;
end;

procedure BtnDisable;
begin
  with Form1  do begin
    DPBtn.Enabled:= False;
  end;
end;

procedure ReadInforFile;     { Read Infor.ini file }
var
  FH: TextFile;
  I: Integer;
begin
  GetDir(0,InforDir);         // 현재의 디렉토리
  for I:=1 to ciEndLine do
    InforList[I]:= '';       // Clear infor list buffer
  AssignFile(FH,InforFileName);
  Reset(FH);
  for I:=1 to ciEndLine do
    Readln(FH, InforList[I]);
  CloseFile(FH);
end;

procedure WriteInforFile;       { Write Infor.ini file }
var
  FH: TextFile;
  I: Integer;
begin
  InforList[1]:= Form1.Edit2.Text;
  InforList[2]:= IntToStr(Form1.ComboBox1.ItemIndex);
  InforDir:= InforDir+'\'+ InforFileName;
  AssignFile(FH,InforDir);
  Rewrite(FH);
  for I:=1 to ciEndLine do
    Write(FH, InforList[I]+Chr($0D)+Chr($0A));
  CloseFile(FH);
end;

procedure OpenInforFile;
var
  CH: Integer;
begin
  if InforList[1] = ''  then InforList[1]:= '1';
  Form1.Edit2.Text:= InforList[1];                      // get COM Port
  if InforList[2] = ''  then InforList[2]:= '3';
  Form1.ComboBox1.ItemIndex:= StrToInt(InforList[2]);   // get Baudrate
end;

function NumberStr(TempStr:String; N:Integer):String;
var
  Temp: String;
  I,J,K: Integer;
begin
  I:= StrLen(PChar(TempStr));
  if I > N then begin
    MessageDlg('자리수가 오버되었습니다.(최대' + IntToStr(N) + '자리)',mtWarning,[mbOk],0);
    Exit;
  end;
  if N = 6 then  Temp:= '      '
  else           Temp:= '       ';
  K := 1;
  for J:= N-I to N do begin
    Temp[J+1] := TempStr[K];
    Inc(K);
  end;
  Result := Temp;
end;

function CheckSumProcess(TempStr:String; N:Integer):Word;
var
  LCK, HCK: Byte;
  CK: Word;
  I: Integer;
begin
  LCK:= 0;    HCK:= 0;
  for I:=0 to N do begin
    if ((I mod 2) = 0)  then  LCK := LCK xor Byte(TempStr[I+1])
    else                      HCK := HCK xor Byte(TempStr[I+1]);
  end;
  CK:= (HCK shl 8) + LCK;
  Result := CK;
end;

procedure TForm1.FormCreate(Sender: TObject);
begin
  ReadInforFile;
  OpenInforFile;
  Label5.Font.Color:= clRed;
  Label5.Caption:= 'COM Not Opend';
  Image3.Visible:= True;
  Image4.Visible:= False;
  BtnDisable;
  EditT5.Text:= (FormatDateTime('yyyy-mm-dd',now));
end;

procedure TForm1.BitBtn1Click(Sender: TObject);
begin
  WriteInforFile;
  Close;
end;

procedure TForm1.BitBtn3Click(Sender: TObject);
begin
  if BitBtn3.Tag = 0 then begin
    BitBtn3.Caption:= '&Close';
    BitBtn3.Tag:= 1;
    AfComPort1.ComNumber:= StrToInt(Edit2.Text);
    Case (ComboBox1.ItemIndex) of
      0: AfComPort1.BaudRate:= br2400;
      1: AfComPort1.BaudRate:= br4800;
      2: AfComPort1.BaudRate:= br9600;
      3: AfComPort1.BaudRate:= br19200;
      4: AfComPort1.BaudRate:= br38400;
      5: AfComPort1.BaudRate:= br57600;
      6: AfComPort1.BaudRate:= br115200;
    else
      AfComPort1.BaudRate:= br9600;
    end;
    Try
      AfComPort1.Open;
      Label5.Font.Color:= clNavy;
      Label5.Caption:= 'COM'+ Edit2.Text + ' Port Opened';
      Image3.Visible:= False;
      Image4.Visible:= True;
      BtnEnable;
    Except
      AfComPort1.Close;
      Label5.Font.Color:= clRed;
      Label5.Caption:= ' Cannot Port';
      Image3.Visible:= True;
      Image4.Visible:= False;
      BtnDisable;
      Exit;
    end;
  end
  else  begin
      BitBtn3.Caption:= '&Open';
      BitBtn3.Tag:= 0;
      AfComPort1.Close;
      Label5.Font.Color:= clRed;
      Label5.Caption:= 'COM Not Opend';
      Image3.Visible:= True;
      Image4.Visible:= False;
      BtnDisable;
  end;
end;

procedure TForm1.DPBtnClick(Sender: TObject);
var
  FormStart, FormEnd: String;
  TempStr: String;
  TempStr11,TempStr12: String;
  TempStr21,TempStr22: String;
  TempStr31,TempStr32: String;
  DS, CK: Word;
begin
  if RadioGroup1.ItemIndex = 0 then begin         // 일반데이터 인쇄
    TempStr:= EditT1.Text + Char($0d)+ Char($0a);
    SendDataCheck(TempStr);
    Exit;
  end;

  if RadioGroup1.ItemIndex = 2 then begin         // 펌만 인쇄
    TempStr:= Char($1e)+ 'P';
    SendDataCheck(TempStr);
    Exit;
  end;

  Tstat:= True;
  DPBtn.Enabled:= False;

  TempStr:= '';
  FormStart:= Char($1e)+ 'S';                   //Form Data Start
  FormEnd:= Char($1e)+ 'E';                     //Form Data End

  if RadioGroup1.ItemIndex = 3 then begin       //사업자명 1라인만 펌+데이터 인쇄
    TempStr:=   EditT1.Text + Char($0d)+ Char($0a);
  end
  else begin
    TempStr:= EditT1.Text + Char($0d)+ Char($0a) +
              EditT2.Text + Char($0d)+ Char($0a) +
              EditT3.Text + Char($0d)+ Char($0a) +
              EditT4.Text + Char($0d)+ Char($0a) +
              EditT5.Text + Char($0d)+ Char($0a) +
              EditT6.Text + Char($0d)+ Char($0a);
  
    TempStr11:= NumberStr(EditW11.Text, 6);  TempStr12:= NumberStr(EditW12.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditW21.Text, 6);  TempStr12:= NumberStr(EditW22.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditW31.Text, 6);  TempStr12:= NumberStr(EditW32.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
  
    TempStr11:= NumberStr(EditC11.Text, 6);  TempStr12:= NumberStr(EditC12.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditC21.Text, 6);  TempStr12:= NumberStr(EditC22.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditC31.Text, 6);  TempStr12:= NumberStr(EditC32.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
  
    TempStr11:= NumberStr(EditM11.Text, 6);  TempStr12:= NumberStr(EditM12.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditM21.Text, 6);  TempStr12:= NumberStr(EditM22.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditM31.Text, 6);  TempStr12:= NumberStr(EditM32.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
  
    TempStr11:= NumberStr(EditS11.Text, 6);  TempStr12:= NumberStr(EditS12.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditS21.Text, 6);  TempStr12:= NumberStr(EditS22.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditS31.Text, 6);  TempStr12:= NumberStr(EditS32.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
  
    TempStr11:= NumberStr(EditG11.Text, 6);  TempStr12:= NumberStr(EditG12.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditG21.Text, 6);  TempStr12:= NumberStr(EditG22.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditG31.Text, 6);  TempStr12:= NumberStr(EditG32.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
  
    TempStr11:= NumberStr(EditAD11.Text, 6);  TempStr12:= NumberStr(EditAD12.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditAD21.Text, 6);  TempStr12:= NumberStr(EditAD22.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditAD31.Text, 6);  TempStr12:= NumberStr(EditAD32.Text, 7);
    TempStr:= TempStr + TempStr11 + TempStr12 + Char($0d)+ Char($0a);
  
    TempStr11:= NumberStr(EditA1.Text, 6);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditA2.Text, 6);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditA3.Text, 6);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
  
    TempStr11:= NumberStr(EditR1.Text, 7);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditR2.Text, 7);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditR3.Text, 7);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditR4.Text, 7);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditR5.Text, 7);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditR6.Text, 7);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditR7.Text, 7);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditR8.Text, 7);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditR9.Text, 7);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditR10.Text, 7);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditR11.Text, 7);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditR12.Text, 7);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
    TempStr11:= NumberStr(EditR13.Text, 7);
    TempStr:= TempStr + TempStr11 + Char($0d)+ Char($0a);
  end;
  
  DS:= StrLen(PChar(TempStr));
  LabelS.Caption:= IntToStr(DS)+'(Dec),  ' +  IntToHex(DS,4)+ '(Hex)';

//jslee 2019/12/23
// Form Overlay 변동데이터 checksum 삭제 ==> 대윤 issue
//  CK:= CheckSumProcess(TempStr, DS);
//  LabelCK.Caption:= IntToHex(Word(CK),4) + '(Hex)';

  if RadioGroup1.ItemIndex = 4 then begin         // Size Error 발생
    TempStr:= FormStart + Char(DS shr 8) + Char((DS and $00ff) + 1) + TempStr + FormEnd;
  end

//jslee 2019/12/23
// Form Overlay 변동데이터 checksum 삭제 ==> 대윤 issue
//  else if RadioGroup1.ItemIndex = 5 then begin    // CheckSum Error 발생
//    TempStr:= FormStart + Char(DS shr 8) + Char(DS and $00ff) + TempStr + Char(CK shr 8) + Char((CK and $00ff) + 1) + FormEnd;
//  end

  else if RadioGroup1.ItemIndex = 5 then begin    // Form End 명령어 없음 발생
    TempStr:= FormStart + Char(DS shr 8) + Char(DS and $00ff) + TempStr;
  end
  else begin
    TempStr:= FormStart + Char(DS shr 8) + Char(DS and $00ff) + TempStr + FormEnd;
  end;
  SendDataCheck(TempStr);
  Sleep(10);
  DPBtn.Enabled:= True;
end;

procedure TForm1.BitBtn4Click(Sender: TObject);
begin
  Memo1.Clear;
end;

procedure TForm1.AfComPort1DataRecived(Sender: TObject; Count: Integer);
var
  I: Integer;
  B: Byte;
  RLen: Word;
  TempStr1: String;
begin
  Respons := AfComPort1.ReadString;
  TempStr1:= '';
  for I:=1 to Length(Respons) do  begin
    if(Tstat) then begin
      if Respons[I] = Char(ACK) then begin        // 정상 인쇄
        LabelR.Font.Color:= clBlue;
        LabelR.Caption:= 'PASS';
      end
      else if Respons[I] = Char(ENQ) then begin   // 사이즈 오류
        LabelR.Font.Color:= clRed;
        LabelR.Caption:= 'Data Size Error!';
      end
      else if Respons[I] = Char(EXT) then begin   // 체크섬 오류
        LabelR.Font.Color:= clRed;
        LabelR.Caption:= 'Check Sum Error!';
      end;
    end;
    if HexBox1.Checked then  TempStr1:= TempStr1 + IntToHex(Byte(Respons[I]),2) + ' '
    else                     TempStr1:= TempStr1 + Respons[I];
  end;
  Memo1.Text:= Memo1.Text + TempStr1;
end;


end.


