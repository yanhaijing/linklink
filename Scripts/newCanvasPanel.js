// JavaScript Document\
(function(window){
	
	var 
		MarkPanel = function(){},
		CanvasPanel = function(){},
		imgs = window.linklink.loadPhotos(),
		initCanvasPanel = function(){},
		canvasPanel = {},
		markPanel = {};
	
	initCanvasPanel = function(){	
		canvasPanel = new CanvasPanel();
		markPanel = new MarkPanel();	

		canvasPanel.init();
		//绑定重排的按钮事件
		document.getElementById('linkMarkPanel').getElementsByTagName('input')[0].onclick=function(){
			canvasPanel.refreshCanvasPanel(null);
		};
		//绑定home按键的事件
		document.getElementById('linkMarkPanel').getElementsByTagName('input')[1].onclick=function(){
			markPanel.linkMardPanelHidden();
			canvasPanel.startCanvasShow(document.getElementById('start'));canvasPanel.tableStop();
		};
		//绑定游戏结束界面的返回home界面按钮 
		document.getElementById('gameOver').getElementsByTagName('input')[0].onclick=function(){
			canvasPanel.startCanvasShow(document.getElementById('start'));
			canvasPanel.model=null;canvasPanel.refreshCanvasPanel(imgs);
		};
	};
	
	window.onload=function(){
		initCanvasPanel();
	};
	
	MarkPanel=function(){//分数面板对象
		this.refreshButton=document.getElementById('linkMarkPanel').getElementsByTagName('input').item(0);//刷新按钮对象
		this.refreshCount=null;//剩余刷新次数
		this.currentLevel=null;//当前关数对象
		this.currentScores=null;//当前分数对象
		this.linker=null;//当前已经消除对数
		this.noLinker=null;//当前剩余对数
		this.times=null;//本局已用时间
		this.timesId=null;//更新times的id
		this.time=null;//进度条剩余时间
		this.timeId=null;//进度条剩余时间
		this.CanvasPanel=canvasPanel;//调用canvasPanel对象
	};
	MarkPanel.prototype={
		linkMardPanelHidden:function(){
			document.getElementById('linkMarkPanel').style.display='none';
			this.timesStop();
			this.timeStop();
		},
		linkMardPanelShow:function(){
			document.getElementById('linkMarkPanel').style.display='block';
			this.timesGo();
			this.timeGo();
		},
		refreshButtonInit:function(count){//刷新按钮初始化参数为能够刷新的次数
			var _thisMarkPanel=this;
			this.refreshButton.disabled=false;
			if(count === null){
				this.refreshButton.value='洗牌';
				this.refreshButton.onclick=function(){_thisMarkPanel.CanvasPanel.refreshCanvasPanel(null);};
			}else{
				this.refreshCount=count;
				this.refreshButton.value=String('洗牌'+_thisMarkPanel.refreshCount);
				this.refreshButton.onclick=function(){
					_thisMarkPanel.refreshCount-=1;
					_thisMarkPanel.refreshButton.value=String('洗牌'+_thisMarkPanel.refreshCount);//更新洗牌次数
					if(_thisMarkPanel.refreshCount>0){
						_thisMarkPanel.CanvasPanel.refreshCanvasPanel(null);//刷新屏幕
						//调用修改刷新按钮
					}else{
						//不能刷新
						_thisMarkPanel.refreshButton.disabled=true;
					}
				};
			}
		},
		currentLevelInit:function(){
			//初始化关
			this.currentLevel=1;
			//调用刷新关
			this.currentLevelRefresh();
		},
		currentLevelRefresh:function(){
			//更新关数数据
			document.getElementById('currentLevel').getElementsByTagName('b').item(0).innerHTML=this.currentLevel++;
		},
		currentScoresInit:function(){
			//初始化分数数据
			this.currentScores=0;
			this.currentScoresRefresh();//刷新分数
		},
		currentScoresRefresh:function(){
			//更新分数数据
			document.getElementById('currentScores').getElementsByTagName('b').item(0).innerHTML=this.currentScores;
			this.currentScores+=10;
		},
		linkerInit:function(){
			//初始化已经消除的对数
			this.linker=0;
			this.linkerRefresh();//刷新已经消除对数
		},
		linkerRefresh:function(){
			document.getElementById('linker').getElementsByTagName('b').item(0).innerHTML=this.linker++;
		},
		noLinkerInit:function(){
			//初始化已经消除的对数
			this.noLinker=64;
			this.noLinkerRefresh();//刷新已经消除对数
		},
		noLinkerRefresh:function(){
			document.getElementById('noLinker').getElementsByTagName('b').item(0).innerHTML=this.noLinker--;
		},
		timesInit:function(){
			var _thisMarkPanel=this;
			this.times=0;
			if(this.timesId !== null){//先清除
				window.clearInterval(_thisMarkPanel.timesId);
			}
			this.timesId=window.setInterval(function(){_thisMarkPanel.timesRefresh()},1000);//一秒更新一次
		},
		timesRefresh:function(){
			document.getElementById('times').getElementsByTagName('b').item(0).innerHTML=this.times++;
		},
		timesStop:function(){//暂停时间
			var _thisMarkPanel=this;
			if(this.timesId !== null){//先清除
				window.clearInterval(_thisMarkPanel.timesId);
				this.timesId=null;
			}
		},
		timesGo:function(){//继续时间
			var _thisMarkPanel=this;
			if(this.timesId !== null){//先清除
				window.clearInterval(_thisMarkPanel.timesId);
				this.timesId=null;
			}
			this.timesId=window.setInterval(function(){_thisMarkPanel.timesRefresh()},1000);//一秒更新一次
		},
		timeInit:function(){
			//初始化进度条时间
			this.time=30;
			var _thisMarkPanel=this;
			document.getElementById('process').style.display='block';
			document.getElementById('processLink').getElementsByTagName('span').item(0).style.width=600+'px';
			document.getElementById('time').getElementsByTagName('b').item(0).innerHTML=30;
			if(this.timeId !== null){
				window.clearInterval(_thisMarkPanel.timeId);
			}
			this.timeId=window.setInterval(function(){_thisMarkPanel.timeRefresh();},1000);
		},
		timeHidden:function(){
			document.getElementById('process').style.display='none';	
		},
		timeRefresh:function(){
			var _thisMarkPanel=this;
			if(document.getElementById('process').style.display === 'block'){
				if(this.time === 0){
					//游戏结束
					this.CanvasPanel.soundPlay('sounds/lose.wav');//播放声音
					document.getElementById('gameOver').style.display='block';
					this.CanvasPanel.startCanvasShow(document.getElementById('gameOver'));
					document.getElementById('linkMarkPanel').style.display='none';//隐藏分数面板
					this.CanvasPanel.tableStop();//进制点击效果
					this.timeStop();
					this.timesStop();
					this.timeHidden();
				}else{
					document.getElementById('processLink').getElementsByTagName('span').item(0).style.width=parseInt(document.getElementById('processLink').getElementsByTagName('span').item(0).style.width, 10)-20+'px';//更新进度条减20px
					this.time-=1;
					document.getElementById('time').getElementsByTagName('b').item(0).innerHTML=this.time;
				}
			}
		},
		timeAdd:function(){
			//window.alert('e');
			//window.alert(document.getElementById('process').style.display);
			if(document.getElementById('process').style.display === 'block'){
				if(this.time<20){
					document.getElementById('processLink').getElementsByTagName('span').item(0).style.width=parseInt(document.getElementById('processLink').getElementsByTagName('span').item(0).style.width, 10)+200+'px';//更新进度条减20px
					this.time+=10;
					document.getElementById('time').getElementsByTagName('b').item(0).innerHTML=this.time;
				}else{
					document.getElementById('processLink').getElementsByTagName('span').item(0).style.width=600+'px';
					this.time=30;
					document.getElementById('time').getElementsByTagName('b').item(0).innerHTML=this.time;
				}
			}
		},
		timeStop:function(){
			var _thisMarkPanel=this;
			if(this.timeId !== null){
				window.clearInterval(_thisMarkPanel.timeId);
				this.timeId=null;
			}
		},
		timeGo:function(){
			var _thisMarkPanel=this;
			if(this.timeId !== null){
				window.clearInterval(_thisMarkPanel.timeId);
			}
			this.timeId=window.setInterval(function(){_thisMarkPanel.timeRefresh();},1000);
		}
	};
	CanvasPanel=function(){	
		this.tds=[];//td的集合
		this.trs=new Array(10);//tr的集合
		this.previewTdX=null;//上一个呗点击的td
		this.previewTdY=null;
		this.currentTdX=null;//当前被电击的td
		this.currentTdY=null;
		this.score=0;
		this.canvas=null;
		this.model=null;//用于存储当前的模式，当回到home后在此开始时判断是否刷新屏幕
		this.MarkPanel=markPanel;
	};
	
	CanvasPanel.prototype={
		start:function(evt){
			this.soundPlay('sounds/start.wav');//播放声音
			var modelTemp=null;
			var _thisStart=this;
			document.getElementById('gameOver').style.display='none';//开始隐藏结束游戏面板
			//获取当前被点击的对象
			if(window.event){
				modelTemp=window.event.srcElement.id;
			}else{
				modelTemp=evt.target.id;
			}
			modelTemp=parseInt(modelTemp, 10);
			if(modelTemp === this.model){//如果所选择模式为当前模式直接将home隐藏
				this.startCanvasHidden(document.getElementById('start'));
				window.setTimeout(function(){_thisStart.MarkPanel.linkMardPanelShow();_thisStart.tableRun();},5000);
			}else{
				//开始新的模式
				this.model=modelTemp;
				switch(modelTemp){
					case 0:
						//一般模式
						this.normal();
						break;
					case 1:
						//挑战模式
						this.challenge();
						break;
					case 2:
						//休闲模式
						this.relaxation();
						break;
					case 3:
						//无敌模式
						this.nothing();
						break;
				}
			}
		},
		newLevel:function(){
			//开始新的一局
			var _thisNewLevel=this;
			//洗牌
			this.soundPlay('sounds/win.wav');//播放声音
			this.MarkPanel.linkMardPanelHidden();//分数面板隐藏
			this.MarkPanel.currentLevelRefresh();//关数刷新
			this.MarkPanel.linkerInit();
			this.MarkPanel.noLinkerInit();
			switch(this.model){
				case 0:
					//一般模式
					//更新关数信息
					document.getElementById('normal').getElementsByTagName('span').item(1).innerHTML='level&nbsp;&nbsp;&nbsp;&nbsp;第 '+(this.MarkPanel.currentLevel-1)+' 关';
					document.getElementById('normal').getElementsByTagName('span').item(2).innerHTML='score&nbsp;&nbsp;&nbsp;&nbsp;'+(this.MarkPanel.currentScores-10);
					this.MarkPanel.refreshButtonInit(3);
					this.startCanvasShow(document.getElementById('normal'));
					window.setTimeout(function(){_thisNewLevel.startCanvasHidden(document.getElementById('normal'));_thisNewLevel.refreshCanvasPanel(imgs);},5000);
					window.setTimeout(function(){normalInit()},10000);
					var normalInit= function(){
						_thisNewLevel.MarkPanel.timesInit();
						_thisNewLevel.MarkPanel.timeInit();
						_thisNewLevel.MarkPanel.linkMardPanelShow();
						_thisNewLevel.tableRun();
					};
					break;
				case 1:
					//挑战模式
					//更新关数信息
					document.getElementById('challenge').getElementsByTagName('span').item(1).innerHTML='level&nbsp;&nbsp;&nbsp;&nbsp;第 '+(this.MarkPanel.currentLevel-1)+' 关';
					document.getElementById('challenge').getElementsByTagName('span').item(2).innerHTML='score&nbsp;&nbsp;&nbsp;&nbsp;'+(this.MarkPanel.currentScores-10);
					this.MarkPanel.refreshButtonInit(0);
					this.startCanvasShow(document.getElementById('challenge'));
					window.setTimeout(function(){_thisNewLevel.startCanvasHidden(document.getElementById('challenge'));_thisNewLevel.refreshCanvasPanel(imgs)},5000);
					window.setTimeout(function(){challengeInit()},10000);
					var challengeInit= function(){
						_thisNewLevel.MarkPanel.timesInit();
						_thisNewLevel.MarkPanel.timeInit();
						_thisNewLevel.MarkPanel.linkMardPanelShow();
						_thisNewLevel.tableRun();
					}
					break;
				case 2:
					//休闲模式
					//更新关数信息
					document.getElementById('relaxation').getElementsByTagName('span').item(1).innerHTML='level&nbsp;&nbsp;&nbsp;&nbsp;第 '+(this.MarkPanel.currentLevel-1)+' 关';
					document.getElementById('relaxation').getElementsByTagName('span').item(2).innerHTML='score&nbsp;&nbsp;&nbsp;&nbsp;'+(this.MarkPanel.currentScores-10);
					this.MarkPanel.refreshButtonInit(null);
					this.startCanvasShow(document.getElementById('relaxation'));
					window.setTimeout(function(){_thisNewLevel.startCanvasHidden(document.getElementById('relaxation'));_thisNewLevel.refreshCanvasPanel(imgs)},5000);
					window.setTimeout(function(){challengeInit()},10000);
					var challengeInit= function(){
						_thisNewLevel.MarkPanel.timesInit();
						_thisNewLevel.MarkPanel.linkMardPanelShow();
						_thisNewLevel.tableRun();
					}
					break;
				case 3:
					//无敌模式
					//更新关数信息
					document.getElementById('nothing').getElementsByTagName('span').item(1).innerHTML='level&nbsp;&nbsp;&nbsp;&nbsp;第 '+(this.MarkPanel.currentLevel-1)+' 关';
					document.getElementById('nothing').getElementsByTagName('span').item(2).innerHTML='score&nbsp;&nbsp;&nbsp;&nbsp;'+(this.MarkPanel.currentScores-10);
					this.MarkPanel.refreshButtonInit(null);
					this.startCanvasShow(document.getElementById('nothing'));
					window.setTimeout(function(){_thisNewLevel.startCanvasHidden(document.getElementById('nothing'));_thisNewLevel.refreshCanvasPanel(imgs)},5000);
					window.setTimeout(function(){challengeInit()},10000);
					var challengeInit= function(){
						_thisNewLevel.MarkPanel.timesInit();
						_thisNewLevel.MarkPanel.linkMardPanelShow();
						_thisNewLevel.tableRun();
					}
					break;
			}
		},
		normal:function(){
			var _thisNormal=this;
			//洗牌
			this.refreshCanvasPanel(imgs);
			//初始化模式界面分数等信息
			document.getElementById('normal').getElementsByTagName('span').item(1).innerHTML='level&nbsp;&nbsp;&nbsp;&nbsp;第 1 关';
			document.getElementById('normal').getElementsByTagName('span').item(2).innerHTML='score&nbsp;&nbsp;&nbsp;&nbsp;0';
			//初始化其他界面
			document.getElementById('challenge').style.display='none';
			document.getElementById('relaxation').style.display='none';
			document.getElementById('nothing').style.display='none';
			document.getElementById('normal').style.display='block';
			document.getElementById('normal').style.height=500+'px';
			this.startCanvasHidden(document.getElementById('start'));
			window.setTimeout(function(){_thisNormal.startCanvasHidden(document.getElementById('normal'))},5000);
			window.setTimeout(function(){normalInit()},12000);
			var normalInit=function (){
				_thisNormal.MarkPanel.refreshButtonInit(3);
				_thisNormal.MarkPanel.currentLevelInit();
				_thisNormal.MarkPanel.currentScoresInit();
				_thisNormal.MarkPanel.linkerInit();
				_thisNormal.MarkPanel.noLinkerInit();
				_thisNormal.MarkPanel.timesInit();
				_thisNormal.MarkPanel.timeInit();
				_thisNormal.MarkPanel.linkMardPanelShow();
				_thisNormal.tableRun();
			}
		},
		challenge:function(){
			var _thisChallenge=this;
			//洗牌
			this.refreshCanvasPanel(imgs);
			//初始化模式界面分数等信息
			document.getElementById('challenge').getElementsByTagName('span').item(1).innerHTML='level&nbsp;&nbsp;&nbsp;&nbsp;第 1 关';
			document.getElementById('challenge').getElementsByTagName('span').item(2).innerHTML='score&nbsp;&nbsp;&nbsp;&nbsp;0';
			document.getElementById('normal').style.display='none';
			document.getElementById('relaxation').style.display='none';
			document.getElementById('nothing').style.display='none';
			document.getElementById('challenge').style.display='block';
			document.getElementById('challenge').style.height=500+'px';
			this.startCanvasHidden(document.getElementById('start'));
			window.setTimeout(function(){_thisChallenge.startCanvasHidden(document.getElementById('challenge'))},5000);
			window.setTimeout(function(){challengeInit()},12000);
			var challengeInit=function (){
				_thisChallenge.MarkPanel.refreshButtonInit(0);
				_thisChallenge.MarkPanel.currentLevelInit();
				_thisChallenge.MarkPanel.currentScoresInit();
				_thisChallenge.MarkPanel.linkerInit();
				_thisChallenge.MarkPanel.noLinkerInit();
				_thisChallenge.MarkPanel.timesInit();
				_thisChallenge.MarkPanel.timeInit();
				_thisChallenge.MarkPanel.linkMardPanelShow();
				_thisChallenge.tableRun();
			}
		},
		relaxation:function(){
			var _thisRelaxation=this;
			//洗牌
			this.refreshCanvasPanel(imgs);
			//初始化模式界面分数等信息
			document.getElementById('relaxation').getElementsByTagName('span').item(1).innerHTML='level&nbsp;&nbsp;&nbsp;&nbsp;第 1 关';
			document.getElementById('relaxation').getElementsByTagName('span').item(2).innerHTML='score&nbsp;&nbsp;&nbsp;&nbsp;0';
			document.getElementById('challenge').style.display='none';
			document.getElementById('nothing').style.display='none';
			document.getElementById('normal').style.display='none';
			document.getElementById('relaxation').style.display='block';
			document.getElementById('relaxation').style.height=500+'px';
			this.startCanvasHidden(document.getElementById('start'));
			window.setTimeout(function(){_thisRelaxation.startCanvasHidden(document.getElementById('relaxation'))},5000);
			window.setTimeout(function(){relaxationInit()},12000);
			var relaxationInit=function (){
				_thisRelaxation.MarkPanel.refreshButtonInit(3);
				_thisRelaxation.MarkPanel.currentLevelInit();
				_thisRelaxation.MarkPanel.currentScoresInit();
				_thisRelaxation.MarkPanel.linkerInit();
				_thisRelaxation.MarkPanel.noLinkerInit();
				_thisRelaxation.MarkPanel.timesInit();
				_thisRelaxation.MarkPanel.timeHidden();
				_thisRelaxation.MarkPanel.linkMardPanelShow();
				_thisRelaxation.tableRun();
			}
		},
		nothing:function(){
			var _thisNothing=this;
			//洗牌
			this.refreshCanvasPanel(imgs);
			//初始化模式界面分数等信息
			document.getElementById('nothing').getElementsByTagName('span').item(1).innerHTML='level&nbsp;&nbsp;&nbsp;&nbsp;第 1 关';
			document.getElementById('nothing').getElementsByTagName('span').item(2).innerHTML='score&nbsp;&nbsp;&nbsp;&nbsp;0';
			document.getElementById('challenge').style.display='none';
			document.getElementById('relaxation').style.display='none';
			document.getElementById('normal').style.display='none';
			document.getElementById('nothing').style.display='block';
			document.getElementById('nothing').style.height=500+'px';
			this.startCanvasHidden(document.getElementById('start'));
			window.setTimeout(function(){_thisNothing.startCanvasHidden(document.getElementById('nothing'))},5000);
			window.setTimeout(function(){nothingInit()},12000);
			var nothingInit=function (){
				_thisNothing.MarkPanel.refreshButtonInit(null);
				_thisNothing.MarkPanel.currentLevelInit();
				_thisNothing.MarkPanel.currentScoresInit();
				_thisNothing.MarkPanel.linkerInit();
				_thisNothing.MarkPanel.noLinkerInit();
				_thisNothing.MarkPanel.timesInit();
				_thisNothing.MarkPanel.timeHidden();
				_thisNothing.MarkPanel.linkMardPanelShow();
				_thisNothing.tableRun();
			}
		},
		startCanvasHidden:function(panel){//开始界面隐藏
			//window.alert(this.canvas.style.height);
			panel.style.height=500+'px';
			hidden(250);
			function hidden(height){
				if(height==0) return;
				window.setTimeout(function(panel){hidden(height-1)},10);
				panel.style.height=parseInt(panel.style.height)-2+"px";
			}	
		},
		startCanvasShow:function(panel){
			panel.style.height=0+'px';
			show(100);
			function show(height){
				if(height==0) return;
				window.setTimeout(function(panel){show(height-1)},10);
				panel.style.height=parseInt(panel.style.height)+5+"px";
			}	
		},
		init:function(){
			this.MarkPanel=markPanel;
			var _this=this;
			this.canvas=document.getElementById('linkCanvasPanel');
			var spans=document.getElementById('start').getElementsByTagName('span');
			for(var i=0;i<spans.length;i++){//初始化开始界面各个模式
				spans.item(i).id=i;
				spans.item(i).onclick=function(event){_this.start(event);};
				spans.item(i).onmouseover=function(){_this.soundPlay('sounds/spread.wav');}
			}
			var table=document.createElement('table');
			//table.onclick=function(){window.alert('e');window.event.cancelBubble=true;return false};
			table.id='CanvasPanel';
			document.getElementById('linkCanvasPanel').appendChild(table);
			for(var j=0;j<10;j++){//创建tr
				var tr=document.createElement("tr");
				for(i=0;i<18;i++){//添加td
					var td=document.createElement('td');
					tr.appendChild(td);
					td.style.visibility='hidden';
					td.id=18*j+i;
				}
				table.appendChild(tr);
			}
			for(i=0;i<this.trs.length;i++){
				this.trs[i]=new Array(18);
			}
			var trsTemp=document.getElementById('CanvasPanel').getElementsByTagName('tr');
			for(i=0;i<trsTemp.length;i++){//初始化this.trs
				var tdsTemp=trsTemp.item(i).getElementsByTagName('td');
				for(j=0;j<tdsTemp.length;j++){
					this.trs[i][j]=tdsTemp[j];
					//window.alert(trs.length);
				}
			}
			//window.alert(this.trs.length);
			var k=0;
			for(i=1;i<this.trs.length-1;i++){//初始化this.tds
				for(j=1;j<this.trs[i].length-1;j++){
					this.tds[k]=this.trs[i][j];
					this.tds[k].style.visibility='visible';
					this.tds[k].style.border='#ccc solid 2px';
					k++;
				}
			}
		},
		returnMax:function(subX,subY){//返回xy中大的值
			if(subX>subY) return subX;
			return subY;
		},
		returnMin:function(subX,subY){
			if(subX<subY) return subX;
			return subY;
		},
		tableRun:function(){
			var _thisTableRun=this,
			i = 0;
			for(i=0;i<this.tds.length;i++){//初始化tds获取需要重新布局的td
				if(this.tds[i].style.visibility!='hidden'){
					this.tds[i].onclick=function(event){_thisTableRun.clickCanvasPanel(event);};
				}
			}
		},
		tableStop:function(){
			for(i=0;i<this.tds.length;i++){//初始化tds获取需要重新布局的td
				if(this.tds[i].style.visibility!='hidden'){
					this.tds[i].onclick=function(){};
				}
			}
		},
		refreshCanvasPanel:function(Imgs){//重新布局画
			//window.alert(imgs);
			var j=0,
				i = 0;
			var tdsTemp=[];
			var _this=this;
			var subImgs=[];
			if(Imgs==null){//传递参数为空即重新洗牌,重新计算imgs
				for(i=0;i<this.tds.length;i++){//初始化tds获取需要重新布局的td
					if(this.tds[i].style.visibility!='hidden'){
						tdsTemp[j]=this.tds[i];
						j++;
					}
				}
				subImgs=[];
				for(i=0;i<tdsTemp.length;i++){
					subImgs[i]=tdsTemp[i].style.backgroundImage;
				}
				//window.alert(subImgs);
			}else{
				tdsTemp=this.tds;
				for(i=0;i<Imgs.length;i++){
					subImgs[i]=Imgs[i];
				}
			}
			//window.alert(tds.length);
			for(i=0;i<tdsTemp.length;i++){
				var index=randomIndex();
				tdsTemp[i].style.background=subImgs[index];
				tdsTemp[i].style.visibility='visible';
				subImgs[index]=null;
			}
			//window.alert(imgs);
			function randomIndex(){//返回一个可用的imgindex
				var index=subImgs.length;
				while(subImgs[index]==null){
					index=Math.floor(Math.random()*subImgs.length);
				}
				return index;//返回index的值
			}
		},
		soundPlay:function(source){
			document.getElementById('sound').src=source;
			document.getElementById('audio').src=source;
		},
		clearImages:function(){//清楚图像
			//this.trs[_this.previewTdX][_this.previewTdY].style.visibility='hidden';
			//this.trs[_this.currentTdX][_this.currentTdY].style.visibility='hidden';
			//加进度条
			var _this = this;
			this.soundPlay('sounds/link.wav');
			this.MarkPanel.timeAdd();
			this.MarkPanel.currentScoresRefresh();
			this.MarkPanel.linkerRefresh();
			this.MarkPanel.noLinkerRefresh();
			this.trs[_this.currentTdX][_this.currentTdY].style.border='#ccc solid 2px';
			this.trs[_this.previewTdX][_this.previewTdY].style.border='#ccc solid 2px';
			this.trs[_this.currentTdX][_this.currentTdY].className='';
			if(this.MarkPanel.noLinker<0){
				//开始新的一局
				this.newLevel();
			}
			//window.alert(this.score);
		},
		drawLine:function(thisX,thisY,thatX,thatY){//画出连线
			var _this=this,
			hiddenY = function(){},
			hiddenX = function(){},
			i = 0,
			j = 0;
			if(thisX==thatX){
				if(thisY>thatY){//交换xy的值使x《y
					var temp=thisY;
					thisY=thatY;
					thatY=temp;
				}
				for(j=thisY;j<=thatY;j++){//画线
					this.trs[thisX][j].style.backgroundImage='url(images/background.gif)';
					this.trs[thisX][j].style.visibility='visible';
				}
				hiddenY = function(){
					for(j=thisY;j<=thatY;j++){//画线
						if(_this.trs[thisX][j].style.visibility!='hidden'){
							_this.trs[thisX][j].style.visibility='hidden';
						}
					}
				}
				window.setTimeout(function(){hiddenY()},300);
			}else{
				if(thisX>thatX){//交换xy的值使x《y
					var temp=thisX;
					thisX=thatX;
					thatX=temp;
				}
				for(i=thisX;i<=thatX;i++){//画线
					this.trs[i][thisY].style.backgroundImage='url(images/background.gif)';
					this.trs[i][thisY].style.visibility='visible';
				}
				
				hiddenX = function(){
					for(i=thisX;i<=thatX;i++){//画线
						if(_this.trs[i][thisY].style.visibility!='hidden'){
							_this.trs[i][thisY].style.visibility='hidden';
						}
					}
				}
				window.setTimeout(function(){hiddenX()},300);
			}
		},
		clickCanvasPanel:function(evt){
			var _this=this,
			i = 0,
			j = 0;
			//window.alert(target);
			var target=null;
			if(window.event){
				target=window.event.srcElement;
			}else{
				target=evt.target;
			}
			//target.style.background='red';
			target.className='select';
			target.style.border='red solid 2px';
			checkTdXY();
			function checkTdXY(){
				for(i=1;i<_this.trs.length-1;i++){
					for(j=1;j<_this.trs[i].length-1;j++){
						if(target.id==_this.trs[i][j].id){
							if(_this.currentTdX==null){
								_this.currentTdX=i;
								_this.currentTdY=j;
								
								//window.alert(_this.previewTdX);
							}else{
								_this.previewTdX=_this.currentTdX;
								_this.previewTdY=_this.currentTdY;
								_this.currentTdX=i;
								_this.currentTdY=j;
								//计算是否可以消除
								_this.trs[_this.previewTdX][_this.previewTdY].style.border='#ccc solid 2px';
								_this.trs[_this.previewTdX][_this.previewTdY].className='';
								//消除算法
								if(target.style.backgroundImage==_this.trs[_this.previewTdX][_this.previewTdY].style.backgroundImage){//如果俩个图像是相同的
									if(_this.previewTdX==_this.currentTdX&&_this.previewTdY!=_this.currentTdY){
										//位于同一行
										var result=checkP2P(_this.previewTdX,_this.previewTdY,_this.currentTdX,_this.currentTdY);
										if(result){
											_this.clearImages();
											_this.drawLine(_this.previewTdX,_this.previewTdY,_this.currentTdX,_this.currentTdY);
										}else{
											//查找
											//window.alert(_this.previewTdX-1)
											for(var ii=_this.previewTdX-1;ii>=0;ii--){
												var tempI=ii;
												//window.alert(tempI);
												if(_this.trs[tempI][_this.previewTdY].style.visibility!='hidden') break;
												if(_this.trs[tempI][_this.currentTdY].style.visibility!='hidden') break;
												//window.alert(tempI);
												var resultThisToPointx=checkP2P(_this.previewTdX,_this.previewTdY,tempI,_this.previewTdY);
												var resultThatToPointy=checkP2P(_this.currentTdX,_this.currentTdY,tempI,_this.currentTdY);
												//window.alert(resultThisToPointx&&resultThatToPointy)
												if(resultThisToPointx&&resultThatToPointy){//x到x，能联通切y到y，能联通验证x，到y，能否联通
													//window.alert(tempI);
													var resultPxToPy=checkP2P(tempI,_this.previewTdY,tempI,_this.currentTdY);
													if(resultPxToPy){
														_this.clearImages();
														_this.drawLine(_this.previewTdX,_this.previewTdY,tempI,_this.previewTdY);
														_this.drawLine(_this.currentTdX,_this.currentTdY,tempI,_this.currentTdY);
														_this.drawLine(tempI,_this.previewTdY,tempI,_this.currentTdY);
														return;//x y能联通跳出循环
													}
												}else{
													break;//不能联通
													window.alert(false);
													window.alert(i);
												}
											}
											//window.alert('end');
											for(var ii=_this.previewTdX+1;ii<_this.trs.length;ii++){
												//window.alert('e');
												var tempI=ii;
												if(_this.trs[tempI][_this.previewTdY].style.visibility!='hidden') break;
												if(_this.trs[tempI][_this.currentTdY].style.visibility!='hidden') break;
												var resultThisToPointx=checkP2P(_this.previewTdX,_this.previewTdY,tempI,_this.previewTdY);
												var resultThatToPointy=checkP2P(_this.currentTdX,_this.currentTdY,tempI,_this.currentTdY);
												//window.alert(resultThisToPointx&&resultThatToPointy)
												if(resultThisToPointx&&resultThatToPointy){//x到x，能联通切y到y，能联通验证x，到y，能否联通
													var resultPxToPy=checkP2P(tempI,_this.previewTdY,tempI,_this.currentTdY);
													if(resultPxToPy){
														_this.clearImages();
														_this.drawLine(_this.previewTdX,_this.previewTdY,tempI,_this.previewTdY);
														_this.drawLine(_this.currentTdX,_this.currentTdY,tempI,_this.currentTdY);
														_this.drawLine(tempI,_this.previewTdY,tempI,_this.currentTdY);
														return;//x y能联通跳出循环
													}
												}else{
													break;//不能联通
												}
											}
										}
									}else if(_this.previewTdY==j&&_this.previewTdX!=i){
										//位于同一列
										var result=checkP2P(_this.previewTdX,_this.previewTdY,_this.currentTdX,_this.currentTdY);
										//window.alert('true');
										if(result){
											_this.clearImages();
											_this.drawLine(_this.previewTdX,_this.previewTdY,_this.currentTdX,_this.currentTdY);
										}else{
											//查找
											result=false;
											//window.alert(_this.previewTdX-1)
											for(var ii=_this.previewTdY-1;ii>=0;ii--){
												var tempI=ii;
												//window.alert(tempI)
												if(_this.trs[_this.previewTdX][tempI].style.visibility!='hidden') break;
												if(_this.trs[_this.currentTdX][tempI].style.visibility!='hidden') break;
												var resultThisToPointx=checkP2P(_this.previewTdX,_this.previewTdY,_this.previewTdX,tempI);
												var resultThatToPointy=checkP2P(_this.currentTdX,_this.currentTdY,_this.currentTdX,tempI);
												//window.alert(resultThisToPointx&&resultThatToPointy)
												if(resultThisToPointx&&resultThatToPointy){//x到x，能联通切y到y，能联通验证x，到y，能否联通
													var resultPxToPy=checkP2P(_this.previewTdX,tempI,_this.currentTdX,tempI);
													if(resultPxToPy){
														_this.clearImages();
														_this.drawLine(_this.previewTdX,_this.previewTdY,_this.previewTdX,tempI);
														_this.drawLine(_this.currentTdX,_this.currentTdY,_this.currentTdX,tempI);
														_this.drawLine(_this.previewTdX,tempI,_this.currentTdX,tempI);
														return;//x y能联通跳出循环
													}
												}else{
													break;//不能联通
													window.alert(false);
													window.alert(i);
												}
											}
											for(var ii=_this.previewTdY+1;ii<_this.trs[0].length;ii++){
												var tempI=ii;
												//window.alert(tempI)
												if(_this.trs[_this.previewTdX][tempI].style.visibility!='hidden') break;
												if(_this.trs[_this.currentTdX][tempI].style.visibility!='hidden') break;
												var resultThisToPointx=checkP2P(_this.previewTdX,_this.previewTdY,_this.previewTdX,tempI);
												var resultThatToPointy=checkP2P(_this.currentTdX,_this.currentTdY,_this.currentTdX,tempI);
												//window.alert(resultThisToPointx&&resultThatToPointy)
												if(resultThisToPointx&&resultThatToPointy){//x到x，能联通切y到y，能联通验证x，到y，能否联通
													var resultPxToPy=checkP2P(_this.previewTdX,tempI,_this.currentTdX,tempI);
													if(resultPxToPy){
														_this.clearImages();
														_this.drawLine(_this.previewTdX,_this.previewTdY,_this.previewTdX,tempI);
														_this.drawLine(_this.currentTdX,_this.currentTdY,_this.currentTdX,tempI);
														_this.drawLine(_this.previewTdX,tempI,_this.currentTdX,tempI);
														return;//x y能联通跳出循环
													}
												}else{
													break;//不能联通
													window.alert(false);
													window.alert(i);
												}
											}
										}
									}else if(_this.previewTdX!=i&&_this.previewTdY!=j){
										//不再同一列也不再同一行
										//单个折线行
										var resultThisToTemp=checkP2P(_this.previewTdX,_this.previewTdY,_this.previewTdX,_this.currentTdY);
										var resultThatTopTemp=checkP2P(_this.currentTdX,_this.currentTdY,_this.previewTdX,_this.currentTdY);
										if(resultThisToTemp&&resultThatTopTemp&&_this.trs[_this.previewTdX][_this.currentTdY].style.visibility=='hidden'){
											_this.clearImages();
											_this.drawLine(_this.previewTdX,_this.previewTdY,_this.previewTdX,_this.currentTdY);
											_this.drawLine(_this.currentTdX,_this.currentTdY,_this.previewTdX,_this.currentTdY);
											return;//结束
										}
										//单个折线行
										resultThisToTemp=checkP2P(_this.previewTdX,_this.previewTdY,_this.currentTdX,_this.previewTdY);
										resultThatTopTemp=checkP2P(_this.currentTdX,_this.currentTdY,_this.currentTdX,_this.previewTdY);
										if(resultThisToTemp&&resultThatTopTemp&&_this.trs[_this.currentTdX][_this.previewTdY].style.visibility=='hidden'){
											result=true;
											_this.clearImages();
											_this.drawLine(_this.previewTdX,_this.previewTdY,_this.currentTdX,_this.previewTdY);
											_this.drawLine(_this.currentTdX,_this.currentTdY,_this.currentTdX,_this.previewTdY);
											return;//结束
										}
										//内双向折线行
										var tempPreviewTdX=null;
										var tempPreviewTdY=null;
										var tempCurrentTdX=null;
										var tempCurrentTdY=null;
										//x方向
										if(_this.previewTdX>_this.currentTdX){//交换xy的值
											tempPreviewTdX=_this.currentTdX;
											tempPreviewTdY=_this.currentTdY;
											tempCurrentTdX=_this.previewTdX;
											tempCurrentTdY=_this.previewTdY;
										}else{
											tempPreviewTdX=_this.previewTdX;
											tempPreviewTdY=_this.previewTdY;
											tempCurrentTdX=_this.currentTdX;
											tempCurrentTdY=_this.currentTdY;
										}
										for(var ii=tempPreviewTdX+1;ii<tempCurrentTdX;ii++){//循环查找内折现
											var tempI=ii;
											//window.alert(ii);
											if(_this.trs[tempI][tempPreviewTdY].style.visibility!='hidden') continue;
											if(_this.trs[tempI][tempCurrentTdY].style.visibility!='hidden') continue;
											if(_this.trs[tempI][tempPreviewTdY].style.visibility!='hidden'&&_this.trs[tempI][tempCurrentTdY].style.visibility!='hidden') break;
											//window.alert(ii);
											resultThisToTempX=checkP2P(tempPreviewTdX,tempPreviewTdY,tempI,tempPreviewTdY);
											if(resultThisToTempX){
												//this-x能联通
												resultThatTopTempY=checkP2P(tempCurrentTdX,tempCurrentTdY,tempI,tempCurrentTdY);
												if(resultThatTopTempY){
													//that-y能联通
													if(checkP2P(tempI,tempPreviewTdY,tempI,tempCurrentTdY)){
														//x-y能联通
														_this.clearImages();
														_this.drawLine(tempPreviewTdX,tempPreviewTdY,tempI,tempPreviewTdY);
														_this.drawLine(tempCurrentTdX,tempCurrentTdY,tempI,tempCurrentTdY);
														_this.drawLine(tempI,tempPreviewTdY,tempI,tempCurrentTdY);
														return;
													}
												}
											}else{
												break;//跳出this-x不能联通
											}
										}
										//y方向
										if(_this.previewTdY>_this.currentTdY){//交换xy的值
											tempPreviewTdX=_this.currentTdX;
											tempPreviewTdY=_this.currentTdY;
											tempCurrentTdX=_this.previewTdX;
											tempCurrentTdY=_this.previewTdY;
										}else{
											tempPreviewTdX=_this.previewTdX;
											tempPreviewTdY=_this.previewTdY;
											tempCurrentTdX=_this.currentTdX;
											tempCurrentTdY=_this.currentTdY;
										}
										for(var jj=tempPreviewTdY+1;jj<tempCurrentTdY;jj++){//循环查找内折现
											var tempJ=jj;
											//window.alert(jj);
											//window.alert(_this.trs[tempPreviewTdX][tempJ].style.visibility!='hidden');
											//window.alert(_this.trs[tempCurrentTdX][tempJ].style.visibility!='hidden');
											if(_this.trs[tempPreviewTdX][tempJ].style.visibility!='hidden') continue;
											if(_this.trs[tempCurrentTdX][tempJ].style.visibility!='hidden') continue;
											if(_this.trs[tempPreviewTdX][tempJ].style.visibility!='hidden'&&_this.trs[tempCurrentTdX][tempJ].style.visibility!='hidden') break;
											//window.alert(jj);
											resultThisToTempX=checkP2P(tempPreviewTdX,tempPreviewTdY,tempPreviewTdX,tempJ);
											if(resultThisToTempX){
												//this-x能联通
												resultThatTopTempY=checkP2P(tempCurrentTdX,tempCurrentTdY,tempCurrentTdX,tempJ);
												if(resultThatTopTempY){
													//that-y能联通
													if(checkP2P(tempPreviewTdX,tempJ,tempCurrentTdX,tempJ)){
														//x-y能联通
														_this.clearImages();
														_this.drawLine(tempPreviewTdX,tempPreviewTdY,tempPreviewTdX,tempJ);
														_this.drawLine(tempCurrentTdX,tempCurrentTdY,tempCurrentTdX,tempJ);
														_this.drawLine(tempPreviewTdX,tempJ,tempCurrentTdX,tempJ);
														return;
													}
												}
											}else{
												break;//跳出this-x不能联通
											}
										}
										//双向外折现
										//在x点的x方向y-x方向
										if(_this.previewTdX>_this.currentTdX){//交换xy的值
											tempPreviewTdX=_this.currentTdX;
											tempPreviewTdY=_this.currentTdY;
											tempCurrentTdX=_this.previewTdX;
											tempCurrentTdY=_this.previewTdY;
										}else{
											tempPreviewTdX=_this.previewTdX;
											tempPreviewTdY=_this.previewTdY;
											tempCurrentTdX=_this.currentTdX;
											tempCurrentTdY=_this.currentTdY;
										}
										for(var ii=tempPreviewTdX-1;ii>=0;ii--){
											var tempI=ii;
											if(_this.trs[tempI][tempPreviewTdY].style.visibility!='hidden') break;
											if(_this.trs[tempI][tempCurrentTdY].style.visibility!='hidden') break;
											if(checkP2P(tempPreviewTdX,tempPreviewTdY,tempI,tempPreviewTdY)){
												//this-x能联通
												if(checkP2P(tempCurrentTdX,tempCurrentTdY,tempI,tempCurrentTdY)){
													//that-y能联通
													if(checkP2P(tempI,tempPreviewTdY,tempI,tempCurrentTdY)){
														//x-y能联通
														_this.clearImages();
														_this.drawLine(tempPreviewTdX,tempPreviewTdY,tempI,tempPreviewTdY);
														_this.drawLine(tempCurrentTdX,tempCurrentTdY,tempI,tempCurrentTdY);
														_this.drawLine(tempI,tempPreviewTdY,tempI,tempCurrentTdY);
														return;
													}
												}
											}else{
												break;//跳出this-x不能联通
											}
										}
										for(var ii=tempCurrentTdX+1;ii<_this.trs.length;ii++){
											var tempI=ii;
											if(_this.trs[tempI][tempPreviewTdY].style.visibility!='hidden') break;
											if(_this.trs[tempI][tempCurrentTdY].style.visibility!='hidden') break;
											if(checkP2P(tempPreviewTdX,tempPreviewTdY,tempI,tempPreviewTdY)){
												//this-x能联通
												if(checkP2P(tempCurrentTdX,tempCurrentTdY,tempI,tempCurrentTdY)){
													//that-y能联通
													if(checkP2P(tempI,tempPreviewTdY,tempI,tempCurrentTdY)){
														//x-y能联通
														_this.clearImages();
														_this.drawLine(tempPreviewTdX,tempPreviewTdY,tempI,tempPreviewTdY);
														_this.drawLine(tempCurrentTdX,tempCurrentTdY,tempI,tempCurrentTdY);
														_this.drawLine(tempI,tempPreviewTdY,tempI,tempCurrentTdY);
														return;
													}
												}
											}else{
												break;//跳出this-x不能联通
											}
										}
										if(_this.previewTdY>_this.currentTdY){//交换xy的值
											tempPreviewTdX=_this.currentTdX;
											tempPreviewTdY=_this.currentTdY;
											tempCurrentTdX=_this.previewTdX;
											tempCurrentTdY=_this.previewTdY;
										}else{
											tempPreviewTdX=_this.previewTdX;
											tempPreviewTdY=_this.previewTdY;
											tempCurrentTdX=_this.currentTdX;
											tempCurrentTdY=_this.currentTdY;
										}
										for(var jj=tempCurrentTdY+1;jj<_this.trs[0].length;jj++){//循环查找内折现
											var tempJ=jj;
											if(_this.trs[tempPreviewTdX][tempJ].style.visibility!='hidden') break;
											if(_this.trs[tempCurrentTdX][tempJ].style.visibility!='hidden') break;
											resultThisToTempX=checkP2P(tempPreviewTdX,tempPreviewTdY,tempPreviewTdX,tempJ);
											if(resultThisToTempX){
												//this-x能联通
												resultThatTopTempY=checkP2P(tempCurrentTdX,tempCurrentTdY,tempCurrentTdX,tempJ);
												if(resultThatTopTempY){
													//that-y能联通
													if(checkP2P(tempPreviewTdX,tempJ,tempCurrentTdX,tempJ)){
														//x-y能联通
														_this.clearImages();
														_this.drawLine(tempPreviewTdX,tempPreviewTdY,tempPreviewTdX,tempJ);
														_this.drawLine(tempCurrentTdX,tempCurrentTdY,tempCurrentTdX,tempJ);
														_this.drawLine(tempPreviewTdX,tempJ,tempCurrentTdX,tempJ);
														return;
													}
												}
											}else{
												break;//跳出this-x不能联通
											}
										}
										//
										//在y点的x方向y-x方向
										
										for(var jj=tempPreviewTdY-1;jj>=0;jj--){//循环查找内折现
											var tempJ=jj;
											if(_this.trs[tempPreviewTdX][tempJ].style.visibility!='hidden') break;
											if(_this.trs[tempCurrentTdX][tempJ].style.visibility!='hidden') break;
											resultThisToTempX=checkP2P(tempPreviewTdX,tempPreviewTdY,tempPreviewTdX,tempJ);
											if(resultThisToTempX){
												//this-x能联通
												resultThatTopTempY=checkP2P(tempCurrentTdX,tempCurrentTdY,tempCurrentTdX,tempJ);
												if(resultThatTopTempY){
													//that-y能联通
													if(checkP2P(tempPreviewTdX,tempJ,tempCurrentTdX,tempJ)){
														//x-y能联通
														_this.clearImages();
														_this.drawLine(tempPreviewTdX,tempPreviewTdY,tempPreviewTdX,tempJ);
														_this.drawLine(tempCurrentTdX,tempCurrentTdY,tempCurrentTdX,tempJ);
														_this.drawLine(tempPreviewTdX,tempJ,tempCurrentTdX,tempJ);
														return;
													}
												}
											}else{
												break;//跳出this-x不能联通
											}
										}
									}
								}
								//初始化当前点
								//_this.currentTdX=null;
								//_this.currentTdY=null;
								//target.style.border='0px';
							}
							break;//跳出循环
						}
					}
				};
				function checkP2P(thisPointX,thisPointY,thatPointX,thatPointY){//检查同行或同列的俩点之间是否联通
					if(thisPointX==thatPointX){//位于同一行
						if(thisPointY>thatPointY){
							var temp=thisPointY;
							thisPointY=thatPointY;
							thatPointY=temp;
						}
						for(i=thisPointY+1;i<thatPointY;i++){
							if(_this.trs[thisPointX][i].style.visibility=='visible'){
								return false;
							}
						}
					}else if(thisPointY==thatPointY){//位于同一列
						if(thisPointX>thatPointX){
							var temp=thisPointX;
							thisPointX=thatPointX;
							thatPointX=temp;
						}
						for(i=thisPointX+1;i<thatPointX;i++){
							if(_this.trs[i][thisPointY].style.visibility=='visible'){
								return false;
							}
						}
					}
					return true;
				}
			}
		}
	}
}(window))
