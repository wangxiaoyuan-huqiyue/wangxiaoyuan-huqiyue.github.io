verifyLogin()
//是否结束
var finish=false;
//分数
var score;
//数组
var arry;
var keys=["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15"];
var colors = ["#ccc0b3","PINK","AntiqueWhite","#92dbef","#0FF0FF","#FF0","#CDF0AB",
		"#FEDCBA","#F0F","#905fbb","#00F","#00FF00","Purple"];
//初始化
function initialize(){
	score=0;
	arry=[0,0,0,0,
		  0,0,0,0,
		  0,0,0,0,
		  0,0,0,0];
	arry[sjwz()]=sjs();
	arry[sjwz()]=sjs();
	// score=79832;
	// arry=[0,2,256,512,
	// 	  0,0,128,1024,
	// 	  2,16,64,2048,
	// 	  8,16,32,4096];
	draw();
}
//绘制数组到格子上
function draw(){
	for(var i=0;i<16;i++){
		$("#gride"+keys[i]).text((arry[i]==0) ?"" :arry[i]);
		var index=(arry[i]==0)? 0 :(arry[i].toString(2).length-1);
		$("#gride"+keys[i]).css("background-color",colors[index]);
	}
	$("#score").text(score);
}
//向下
function down(){
	var yuan=[0,0,0,0,
		      0,0,0,0,
		      0,0,0,0,
		      0,0,0,0];
	for(j=0;j<16;j++){
		yuan[j]=arry[j];
	}
	for(var i=0;i<4;i++){
		var r=[arry[i+12],arry[i+8],arry[i+4],arry[i]];
		var s= sort(r);
		//把排序好的数组值赋值给总数组
		arry[i+12]=s[0];
		arry[i+8]=s[1];
		arry[i+4]=s[2];
		arry[i]=s[3];
	}
	if(yuan.toString()!=arry.toString()){
		arry[sjwz()]=sjs();
	}
	draw();
	finish = over();
	js();
}
//向上
function up(){
	var yuan=[0,0,0,0,
		      0,0,0,0,
		      0,0,0,0,
		      0,0,0,0];
	for(j=0;j<16;j++){
		yuan[j]=arry[j];
	}
	for(var i=0;i<4;i++){
		var r=[arry[i],arry[i+4],arry[i+8],arry[i+12]];
		var s= sort(r);
		//把排序好的数组值赋值给总数组
		arry[i]=s[0];
		arry[i+4]=s[1];
		arry[i+8]=s[2];
		arry[i+12]=s[3];
	}
	if(yuan.toString()!=arry.toString()){
		arry[sjwz()]=sjs();
	}
	draw();
	finish = over();
	js();
}
//向右
function right(){
	var yuan=[0,0,0,0,
		      0,0,0,0,
		      0,0,0,0,
		      0,0,0,0];
	for(j=0;j<16;j++){
		yuan[j]=arry[j];
	}
	for(var i=0;i<4;i++){
		var r=[arry[(i*4)+3],arry[(i*4)+2],arry[(i*4)+1],arry[(i*4)]];
		var s= sort(r);
		//把排序好的数组值赋值给总数组
		arry[(i*4)+3]=s[0];
		arry[(i*4)+2]=s[1];
		arry[(i*4)+1]=s[2];
		arry[(i*4)]=s[3];
	}
	if(yuan.toString()!=arry.toString()){
		arry[sjwz()]=sjs();
	}
	draw();
	finish = over();
	js();
}
//向左
function left(){
	var yuan=[0,0,0,0,
		      0,0,0,0,
		      0,0,0,0,
		      0,0,0,0];
	for(j=0;j<16;j++){
		yuan[j]=arry[j];
	}
	for(var i=0;i<4;i++){
		var r=[arry[(i*4)],arry[(i*4)+1],arry[(i*4)+2],arry[(i*4)+3]];
		var s= sort(r);
		//把排序好的数组值赋值给总数组
		arry[(i*4)]=s[0];
		arry[(i*4)+1]=s[1];
		arry[(i*4)+2]=s[2];
		arry[(i*4)+3]=s[3];
	}
	if(yuan.toString()!=arry.toString()){
		arry[sjwz()]=sjs();
	}
	draw();
	finish = over();
	js();
}
//对数组合并及排序
function sort(r){
	if( r[0]!=0 || r[1]!=0 || r[2]!=0 || r[3]!=0){
		for(var i=0;i<4;i++){
			for(var j=0;j<3;j++){	
				if(r[j]==0){
					r[j]=r[j+1];
					r[j+1]=0;
				}
			}
		}
	}
	
	for(var i=0;i<3;i++){
		if(r[i]==r[i+1]){
			var j=i;
			r[j]+=r[j+1];
			score+=r[j];
			while(++j<3){
				r[j]=r[j+1];
			}
			r[3]=0;
		}
	}
	return r;
}
//生成2或者4
function sjs(){
	if(Math.random()>0.8){
		return 4;
	}
	else{
		return 2;
	}
}
//随机生成位置
function sjwz(){
	var random=Math.floor(Math.random()*16);
	while(arry[random]!=0){
		random=Math.floor(Math.random()*16);
	}
	return random;
}
//判断是否结束
function over(){
	if(arry.indexOf(0)==-1){
		if(overx()==true && overy()==true){
			return true;
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
}
//结束
function js(){
	if(finish==true){
		var flag=confirm("游戏结束\n您的分数为"+score+"\n是否重新开始");
		if(flag==true){
			initialize();
		}
	}
}
//判断横向
function overx(){
	var p=true;
	for(var i=0;i<4;i++){
		var a=[arry[(i*4)],arry[(i*4)+1],arry[(i*4)+2],arry[(i*4)+3]];
		if(a[0]==a[1] || a[1]==a[2] || a[2]==a[3]){
			p=false;
		}
	}
	return p;
}
//判断纵向
function overy(){
	var p=true;
	for(var i=0;i<4;i++){
		var a=[arry[i],arry[i+4],arry[i+8],arry[i+12]];
		if(a[0]==a[1] || a[1]==a[2] || a[2]==a[3]){
			p=false;
		}
	}
	return p;
}

$(function(){
	//新游戏按键
	$("#butt").click(initialize);
	//绑定键值
	$("body").keydown(function(e){
		if(e.keyCode==83||e.keyCode==40){
			down();
		}
		else if(e.keyCode==87||e.keyCode==38){
			up();
		}
		else if(e.keyCode==65||e.keyCode==37){
			left();
		}
		else if(e.keyCode==68||e.keyCode==39){
			right();
		}
	})
})