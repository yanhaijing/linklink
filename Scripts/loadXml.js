function loadXml(xmlFile){//加载xml对象返回XMLDOM对
	//定义一个变量
	var subXmlDoc=null;
	
	//判断是否是IE浏览器
	if(window.ActiveXObject){
		subXmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	}else{
		//其他浏览器
		try{
			subXmlDoc=document.implementation.createDocument("","",null);
		}catch(ex){
			alert(ex.message);
			subXmlDoc=null;
		}
	}
		
	//判断是否已经创建了xmldom对象
	if(subXmlDoc!=null){
		//实用同步方式加载xml文档
		subXmlDoc.async=false;
		//加载xml文档
		try{
			subXmlDoc.load(xmlFile);
		}catch(ex){
			alert(ex.message);
			subXmlDoc=null;
		}
	}
	//返回xmldom对象如果浏览器能解析xml文件返回xmldom对象否则返回null
	return subXmlDoc;
}

var xmlDoc=null;//全局变量获取的xmldom对象
var imgs=[];
function loadPhotos(){
	xmlDoc=loadXml("./images.xml");
	if(xmlDoc!=null){
		//加载图片
		var items=xmlDoc.getElementsByTagName('item');
		var j=0;
		for(i=0;i<items.length;i++){//初始化imgs存放图片路径			
			imgs[j]='url('+items.item(i).getElementsByTagName('source').item(0).firstChild.nodeValue+')';
			imgs[j+1]='url('+items.item(i).getElementsByTagName('source').item(0).firstChild.nodeValue+')';
			imgs[j+2]='url('+items.item(i).getElementsByTagName('source').item(0).firstChild.nodeValue+')';
			imgs[j+3]='url('+items.item(i).getElementsByTagName('source').item(0).firstChild.nodeValue+')';
			j=j+4;
		}
		//window.alert(imgs.length);
	}else{
		alert("您的浏览器不支持xml解析器")
	}
}
