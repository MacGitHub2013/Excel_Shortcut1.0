


var path = '';
var CurPos;

var min;
var objTimer;
var objQues;
var objTemp;
var strQues='Question';
var strAns='Answer';

var grade=
{
10:'You are an expert. Download advanced version',
9:'Excellent. Download advanced version',
8:'Good. Have a review at the all contents',
7:'Above Average. Have a review at the <a href="#contentPage" > all contents </a>',
6:'Average. Have a review at the <a href="#contentPage" > all contents </a>',
5:'Below Average. Review <a href="#contentPage" > all contents </a> and try again',
4:'Poor. Need to spend some time on <a href="#contentPage" > all contents </a>; try again',
3:'Poor. Need to spend some time on <a href="#contentPage" > all contents </a>; try again',
2:'Poor. Need to spend some time on <a href="#contentPage" > all contents </a>; try again',
1:'Poor. Need to spend some time on <a href="#contentPage" > all contents </a>; try again',
0:'Poor. Need to spend some time on <a href="#contentPage" > all contents </a>; try again'
}


var Candidate = new Object();
var dCandidate = {
'Name' : 'User 1',
'MaxQuestions' : 20,
'ScoreUnit' : 5,
'OptionCount' : 4,
'NegativeMarking' : 'Yes',
'TimeDuration' : 5,
'InvertQuestion' : '',
'Score' : 0,
'CorrectAnswer' : 0,
'IncorrectAnswer' : 0
}

$(document).delegate('#testPage','pageinit',function()
{
 
 if(QuestionDB.length==0)LoadDB(false);
 
 
 $('#btnSave').bind('click',fnStartTest);

 $('#divContainer').hide();
 $('#spanButton').hide();
 
 $('#btnStopTest').click(function(){
  
  TestCompleted('Test Aborted');
  
  
  
 
 });
 $('#btnNext').click(NextObj);
 $('#btnBack').click(PrevObj);
 $('#btnResult1').click(function(){ShowResult()});
 

 
 
}
)
function loadDefaultSettings()
{
LoadSettings(dCandidate);
}
var NextObj = function()
{

 if(CheckAnswer())
 {
 if(CurPos  ==(Candidate.MaxQuestions-1))
 {
  if(confirm("All Questioned Answered. Submit?"))
   TestCompleted('All Questions Answered');
 }
 else
 {
   CurPos++;
  if(CurPos == objQues.length)
  {
   CreateQues();
  
  }
  
  DisplayQues(objQues[CurPos]);
 }
 }
 else
 {
  $('#spanMessage').html('<img src=images/err.png /> Select an Answer.');
 }

}
var PrevObj = function()
{
 
 if(CheckAnswer() )
 {
 if(CurPos > -1) 
 CurPos--;
 if(CurPos <0)
 {
  CurPos++;
  $('#spanMessage').html('<img src=images/err.png />First Question. Back not available');
 }
 else
 {
  DisplayQues(objQues[CurPos]);
 }
 }
 else
 {
  $('#spanMessage').html('<img src=images/err.png /> Select an Answer.');
 }
 

}

function CheckAnswer()
{
 
 var flag=false;
 var inputs = $('#divQuestions').find('input');
 if(inputs.length == 0) return true;
 $.each(inputs,function(index,item){
 if(item.checked)
 {
  objQues[CurPos].SelectedAnswer=item.value;
  flag=true;
 }
 
 })
 return flag;
}
function DisplayQues(obj)
{
 var  html='';
 html += '<div>Q' + (CurPos+1) ;
 html +='. ' + obj.Question  ;
html+='<fieldset data-role="controlgroup" ><ol 	>';
$.each(obj.Options,function (index,data){
html+='<li> <div> <input data-mini="true" type="radio" name="options" id=options' +index + ' value="'+ data +'"></input> </div>';
html+='<label for=options'+index+' > '+ data + '</label>';
});



html+='</ol></fieldset>';
html+='</div>';
$('#spanMessage').empty();
$('#divQuestions').html(html).trigger("create");


if(obj.SelectedAnswer !='undefined')
{
 
 $('[name=options]').val([obj.SelectedAnswer]);
 }
 /*
 $('[name=options]').bind('click',function(){
  $('#spanMessage').html('<img src="images/selected.png" ></img>' + $('[name=options]:checked').val());
})*/

}
function CreateQues()
{

if(QuestionDB.length==0)
 alert("Your phone seems slow. Try after sometime");
else
{
var n =getUniqueue(QuestionDB,objTemp);
var Ques=new Object();

Ques.CorrectAnswer=$(QuestionDB[n]).find(strAns).text();
Ques.Question=$(QuestionDB[n]).find(strQues).text();
Ques.Options=new Array(parseInt(Candidate.OptionCount));
var tempOptions=new Array();
var fourOptions =new Array();
fourOptions[0]=n;
var t;
var o;
o = getUniqueue(Ques.Options,tempOptions)

Ques.Options[o]=Ques.CorrectAnswer;


for (var i =0 ; i <parseInt(Candidate.OptionCount)-1; i ++ )
{
 o = getUniqueue(Ques.Options,tempOptions)
 t = getUniqueue(QuestionDB,fourOptions);
 Ques.Options[o]=$(QuestionDB[t]).find(strAns).text();
 
}

objQues[CurPos]=Ques; 
}

}

function SaveSettings()
{

Candidate.OptionCount=$('#sltOptions').val();
Candidate.MaxQuestions=$('#txtMax_Q').val();
Candidate.ScoreUnit=$('#txtScoreUnit').val();
Candidate.NegativeMarking=$('#negMark').val();
Candidate.TimeDuration=$('#txtTimeDuration').val();
Candidate.InvertQuestion=$('#Invert').val();

Candidate.Name=$('#txtName').val();
Candidate.Score=0;
Candidate.CorrectAnswer=0;
Candidate.IncorrectAnswer=0;

if(Candidate.InvertQuestion == 'Invert')
{
 var temp=strQues;
 strQues=strAns;
 strAns=temp;

}


}

function LoadSettings(obj)
{
 $('#txtName').val(obj.Name);
 $('#txtMax_Q').val(obj.MaxQuestions);
 $('#txtScoreUnit').val(obj.ScoreUnit);
 $('#txtTimeDuration').val(obj.TimeDuration);
 $('#negMar').val([obj.NegativeMarking]);
 $('#sltOptions').val(obj.OptionCount);
 $('#Invert').val([obj.Invert]);


}

function verify()
{
 var flag=true;
 if($('#txtName').val()=='')
  flag=false;
 if($('#txtMax_Q').val()=='')
  flag=false;
 if($('#txtScoreUnit').val()=='')
  flag=false;
 if($('#txtTimeDuration').val()=='')
  flag=false;
  return flag;
}
var fnStartTest= function()
{
 $('#spanMessage1').empty();
 if(!verify())
 {
  
  LoadSettings(dCandidate);
  $('#spanMessage1').html("<img src='images/err.png' />Error!. Default settings loaded");
 }
 $('#spanSettings').show();
 objTemp=new Array();
 objQues=new Array();
 CurPos=-1;

 $("#settingsMenu").panel('close');
 SaveSettings();
 SetHeaders();
 $('#divContainer').slideDown('slow');
 $('#divQuestions').empty();
 ShowTimer(); 
 $('#spanControls').show();
 $('#spanButton').hide(); 

 $('#btnNext').trigger('click');


}

function ShowTimer()
{

 min=Candidate.TimeDuration-1;

if(objTimer!='undefined')
{
 clearInterval(objTimer);
 sec=60;
 }
var spanTimer=$('#spanTime');

objTimer=setInterval(function(){nTimer(spanTimer)},1000);

}
function nTimer(obj)
{
sec-=1;
if(sec==0) {
if(min==0)
{

 TestCompleted('Time Out');
 //timeoutHandler('<img src="err.png" /> Time Out. Question Attended : ' + dbTemp.length );
}
else{
sec=59;
min-=1;
}
}

obj.html('Time : ' + min + ":" + sec);

}

function TestCompleted(str)
{

clearInterval(objTimer);
$('#spanMessage').empty();
/*
 var h=$('#divQuestions').height();
 
 $('#divQuestions').css('height',h+'px');
*/
$('#divQuestions').html(str);
$('#spanControls').hide();
$('#spanButton').show();



}

function SetHeaders()
{
$('#spanName').text(Candidate.Name);
$('#spanMax_Q').html('Total Questions : ' + Candidate.MaxQuestions);

$('#spanScoreUnit').html('Score Unit : ' + Candidate.ScoreUnit);
$('#spanNeg').html('Negative Marking : ' + Candidate.NegativeMarking);
$('#spanTime').html('Time : ' + Candidate.TimeDuration);

}


function ShowResult()
{

 Candidate.Score=0;
 Candidate.CorrectAnswer=0;
 Candidate.IncorrectAnswer=0;
 $.each(objQues,function(index,data)
 {
   if(data.SelectedAnswer==data.CorrectAnswer)
   {
    Candidate.Score+=parseInt(Candidate.ScoreUnit);
	Candidate.CorrectAnswer++;
	}
   else
   {
    Candidate.IncorrectAnswer++;
    if(Candidate.NegativeMarking == "Yes")
     Candidate.Score-=parseInt(Candidate.ScoreUnit);
	}
 
 });
 

 var perct=Math.round((Candidate.CorrectAnswer/Candidate.MaxQuestions)*10000)/100


 
 

 if(Candidate.Score <0) Candidate.Score=0;
 var html= "<div  >Summary " +grade[parseInt(perct)/10]+"</div>";
 html+="<div class='ui-grid-a'  >";
 html+='<div class="ui-block-a " ><div class="ui-bar ui-bar-e" > Score </div></div><div class="ui-block-b  " >  <div class="ui-bar ui-bar-e" > ' + Candidate.Score +'</div></div>';

 html+='<div class="ui-block-a" > <div class="ui-bar ui-bar-e" >Total Questions</div> </div><div class="ui-block-b  " > <div class="ui-bar ui-bar-e" >'+Candidate.MaxQuestions+'</div></div>';
 html+='<div class="ui-block-a"  > <div class="ui-bar ui-bar-e" >Total Attended </div></div><div class="ui-block-b  " > <div class="ui-bar ui-bar-e" > '+objQues.length+'</div></div>';

 html+='<div class="ui-block-a "  > <div class="ui-bar ui-bar-e" >Correct Answers  </div> </div><div class="ui-block-b  " ><div class="ui-bar ui-bar-e" >  '+Candidate.CorrectAnswer+' <img src="images/selected.png"  /></div></div>';
 html+='<div class="ui-block-a "  > <div class="ui-bar ui-bar-e" >Incorrect Answers  </div></div><div class="ui-block-b" > <div class="ui-bar ui-bar-e" >  ' + Candidate.IncorrectAnswer + ' <img src="images/err.png" /></div></div>';

 html+='<div class="ui-block-a "  > <div class="ui-bar ui-bar-e" >Correct  </div> </div><div class="ui-block-b  "> <div class="ui-bar ui-bar-e" > '+Math.round((Candidate.CorrectAnswer/Candidate.MaxQuestions)*10000)/100 +'% <img src="images/selected.png" /></div></div>';
 html+='<div class="ui-block-a "  > <div class="ui-bar ui-bar-e" >Incorrect  </div> </div><div class="ui-block-b  " > <div class="ui-bar ui-bar-e" > ' + Math.round((Candidate.IncorrectAnswer/Candidate.MaxQuestions)*10000)/100 +'%<img src="images/err.png" /></div></div>';

 html+='<div class="ui-block-solo" ><button id="btnResultDetails" data-icon="info" data-inline="true" data-mini="true" data-theme="e" >Show Details</button></div></div>'
 $('#divQuestions').html(html).trigger('create');
 $('#btnResultDetails').click(function(){ResultDetails()});
 
 
  
}


function ResultDetails()
{
var html='<div class=header>Score : '+Candidate.Score+' Correct : '+Candidate.CorrectAnswer + ' Incorrect : '+Candidate.IncorrectAnswer
html+=' <button id="btnClose" data-icon="delete" data-inline="true" data-mini="true" data-theme="e" >Close</button></div>';
var str='';
$.each(objQues,function(index,data)
{
 html+='<div>'+(index+1)+'.'+data.Question +'</div><ol>'
 $.each(data.Options,function(j,item)
 {
  html+='<li>'
  str='';
  if(item==data.SelectedAnswer || data.SelectedAnswer=='undefined')
   str='<img src="images/err.png" />'
  if(item==data.CorrectAnswer)
   str='<img src="images/selected.png" />'
   
  html+=item+str+'</li>';

 })
 html+='</ol>';
 })
 
$('#divContainer').hide();


$('#divResultDetails').html(html).show().trigger('create');
$('#btnClose').click(function(){$('#divResultDetails').hide();})
}
function getUniqueue(array,temp)
{
 var no = -1;
 if(temp.length < array.length)
  {
   do
   {
    no=Math.floor(Math.random()*array.length); 
   }while($.inArray(no,temp) > -1);
   temp[temp.length++] = no;
  }
 return no;
}
