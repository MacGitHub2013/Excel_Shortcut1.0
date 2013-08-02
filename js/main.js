
var QuestionDB=new Array();
var temp =new Array();

$(document).delegate('#tipPage','pageinit',function(){
 $.support.cors=true;
 $.mobile.allowCrossDomainPages=true;
 
 LoadDB(true);
 
 


})

function LoadDB(isToolTip)
{
 
QuestionDB=new Array();
 $.ajax(
  { 
   url: 'xml/EXCEL.xml',
   dataType:'xml',
   type:'GET'
   
  })
 .done(function(data){
 QuestionDB=$(data).find('Record');
// alert(QuestionDB.length + " : " + data)
 if(isToolTip)
 showTip();
  })
  .fail(function(jqXHR,txtStatus,trownError){
  
  
  alert("failed : " + txtStatus);
  alert(jqXHR.status);
  alert(trownError);
  alert(jqXHR.responseText);
  
  })

}



 
$(document).delegate('#contentPage','pageinit',function(){
 
 LoadHTML();
 

})
function showTip()
{
 var u = getUniqueue(QuestionDB,temp);
 var html="<div data-role='collapsible' data-collapsed=false >" ;
 html+="<h3>" + $(QuestionDB[u]).find('Question').text() + "</h3>";;
 html+="<p>" + $(QuestionDB[u]).find('Answer').text() + "</p></div>";
 $('#tipContainer').html(html);
 
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
function LoadHTML()
{
var html="<ul data-role='listview' data-inset=true data-mini='true' data-filter=true data-filter-placeholder='Type shortcut or function..' >";
 $.each(QuestionDB,function(index,data){
 html+="<li>"+$(data).find('Question').text();
 html+=" : "+ $(data).find('Answer').text()+"</li>";
})
 html+="</ul>";
$('#divContent').html(html).trigger('create');

}
function loadTestPage()
{
 $.mobile.changePage('#testPage');
 $('#settingsMenu').panel('open');
 $('#spanButton').show(); 
 TestCompleted('Page Changed. Test Aborted');
}




