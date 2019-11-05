
var util = {};


//唤醒主屏幕
util.wakeUp = function(){
    if(!device.isScreenOn()){
        device.wakeUpIfNeeded();
    }
}


//打开APP
util.launch = function(appName) {
    //打开应用
    var b=app.launchApp(appName);
    if(!b)
    {
	   toast(appName+",启动不成功！");
       return; 	
    }
	
    //如果存在提示，则点击允许
    var loop = 0;
    while(loop < 5){
        loop++;
        util.UITextClick("允许");
    }

    //设置屏幕缩放
    //setScreenMetrics(1080, 1920);
    //sleep(15000);
};

//通过坐标点击
util.boundsClick = function(item) {
     
	var flag=false;
	if(!item)return false;
	if(app.compareVersion()<0){
		return flag;
	}		
	var bounds = item.bounds();
	if(bounds && bounds.centerX()>=0 && bounds.centerY()>=0)
	{
	  flag=click(bounds.centerX(),bounds.centerY());
      sleep(1000);
	}
	return flag;
}

//通过UI点击
util.UIClick = function(eleId) {
    var uiele = id(eleId).findOnce();
    if(uiele){
        uiele.click();
    }
    sleep(1000);
}
util.idClick = function(eleId) {
    var uiele = id(eleId).findOnce();
    var flag = false;
    if(uiele){
        flag=uiele.click();
    }
    sleep(1000);
    return flag;
}

//通过UI文本点击
util.UITextClick = function(textContent) {
    var uiele = text(textContent).findOnce();
    if(uiele){
        uiele.click();
    }
    sleep(1000);
}
util.textClick = function(textContent) {
    var uiele = text(textContent).findOnce();
    var flag = false;
    if(uiele){
        flag=uiele.click();
        //flag = true;
    }
    sleep(1000);
    return flag;
}

//通过UI文本的坐标点击
util.UITextBoundsClick = function(textContent) {
    var thisEle = text(textContent).findOnce();
    var flag = false;
    if (thisEle) 
	{
	   flag=util.boundsClick(thisEle);
    }
    //sleep(1000);
    return flag;
}
util.textBoundsClick = function(textContent) {
    if(app.compareVersion()<0){
		return false;
	}
	var thisEle = text(textContent).findOnce();
    var flag = false;
    if (thisEle) {
        flag = util.boundsClick(thisEle);
    }
    //sleep(1000);
    return flag;
}




util.clickTextFilt = function(testTextName,exitTextName,timeOut)
{
	var flag=false;
	var waitCunt=0;
	var textNode=text(testTextName).findOnce();
	while(!textNode && waitCunt<timeOut){
		waitCunt++;
		textNode=text(testTextName).findOnce();
		if(!textNode)
		{
		   if(text(exitTextName).findOnce())
		   {
			  app.dlog("找到："+exitTextName+",退出");
			  return false;
		   }
           else  		   
		   sleep(1000);
		}
	}
	if(!textNode || waitCunt>=timeOut){
	   app.dlog("无"+testTextName+"字样，退出");
	   return false;	
	}
	
	if(!textNode.clickable()){
	   app.dlog(testTextName+"所在节点不可以点击，查父节点");
       textNode = textNode.parent();
	   if(textNode)flag=textNode.click();
	}
	else  flag=textNode.click();
    
	if(!flag)flag=click(testTextName);
	if(!flag)flag=util.textBoundsClick(testTextName);
	app.dlog(testTextName+"点击="+flag);
 	return flag;

}

util.clickTextById = function(testTextName,testId)
{
	var flag=false;
	var rootNode=className("android.widget.FrameLayout").findOnce();
	//var testClassName="android.widget.TextView";
	var testNode=app.findNodeByTextById(rootNode,testTextName,testId);
	if(testNode)
	{
	   var boundsR =  testNode.bounds();
	   app.dlog(testTextName+"所在节点的坐标="+boundsR);
        
	   if(!testNode.clickable()){
	      var parentNode = testNode.parent();
	      if(parentNode)flag=parentNode.click();
	      app.dlog(testTextName+"所在节点的坐标:"+boundsR+"所在节点不可以点击，点父节点="+flag+"");
       
	   }
	   else  flag=testNode.click();
	   if(!flag){
	      if(boundsR && boundsR.centerX()>0 && boundsR.centerY()>0){
	        if(app.compareVersion()>=0)  
               flag=click(boundsR.centerX(),boundsR.centerY());
		    else
				app.dlog("6.0不能点击坐标");
	      }	
          else{
             app.dlog(testTextName+"所在节点的坐标："+boundsR+"非法");
 		  }			  
	   }
	   app.dlog("【"+testTextName+"】被点击，结果："+flag);
 	   return flag;
    }
	else{
	   app.dlog("没有找到text="+testTextName+" id="+testId+"的节点");
	}
	return flag;

}

util.clickTextNoTimeOut = function(testTextName)
{
   return util.clickText(testTextName); 
}



//不考虑弹窗：text/desc
util.clickTextOfWebView = function(rootNode,testClassName,testTextName)
{   
 	//app.dlog("util.clickTextOfWebView......");
	var flag=false;
	var textNode=app.findTextNode(rootNode,testTextName);
    if(!textNode){
	    app.dlog("util.clickTextOfWebView():没找到"+testTextName+"的节点");
		return false;
	}
	var childBounds=textNode.bounds();
	if(!childBounds)return false;	
	//app.dlog(testTextName+"的坐标="+childBounds+" rootNode.bounds()="+rootNode.bounds());
    if(!rootNode.bounds().contains(childBounds))return false;
    flag=util.boundsClick(textNode); 
	if(!flag && app.compareVersion()<0){
	    app.dlog("6.0不能点坐标！");
		var count=textNode.childCount();
		app.dlog("count="+count);
		var childText=textNode.text();
		app.dlog("text="+childText);
        if(childText)flag=click(childText); 			
		
	}
    //app.dlog("util.clickTextOfWebView()退出：flag="+flag);
	return flag;
}

//读取testTextName的文本值，如【微信号：szddffg】，getText("微信号")=szddffg;
util.getText=function(testTextName)
{   
    //app.dlog("util.getText():搜索"+testTextName+"的父节点");
    var result=null;
	//app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	var textNode=app.findNodeByText(className("android.widget.FrameLayout").findOnce(),testTextName);
    if(!textNode){
	    //app.dlog("util.getText():没找到"+testTextName+"的父节点");
		return null;
	}
	textNode=textNode.parent();
	if(!textNode){
	   //app.dlog("util.getText():没找到"+textNode+"的父节点");
	   return null;
	}
	for(var i=0;i<textNode.childCount();i++)
	{
		var childNode=textNode.child(i);
		if(!childNode)continue;
		var destText=childNode.text();
	    //app.dlog("util.getText():找到"+destText);		
		if(destText && destText != testTextName){
			result=destText;
			break;
		}
	}
    return  result; 

}
//点击全部文本，无论webview，无论text/desc，无论textview/view/button
util.clickText=function(testTextName)
{   
	app.dlog("util.clickText()，搜索并点击：【"+testTextName+"】");
 	var rootNode=className("android.widget.FrameLayout").findOnce();
	var textNode=app.findTextNode(rootNode,testTextName);
    if(!textNode){
	    app.dlog("util.clickText():没找到"+testTextName+"的节点");
		return false;
	}
	var flag=util.clickTextDone(rootNode,textNode);
	app.dlog("util.clickText()退出搜索并点击文本：【"+testTextName+"】flag="+flag);
	return flag;
}

//点击部分文本，无论webview，无论text/desc，无论textview/view/button
util.clickTextOf=function(textNameOf)
{
	app.dlog("util.clickTextOf()，搜索并点击部分文本：【"+textNameOf+"】");
 	var rootNode=className("android.widget.FrameLayout").findOnce();
	var textNode=app.findTextNodeOf(rootNode,textNameOf);
    if(!textNode){
	    app.dlog("util.clickText():没找到"+textNameOf+"的节点");
		return false;
	}
	var flag=util.clickTextDone(rootNode,textNode);
	app.dlog("util.clickText()退出搜索并点击部分文本：【"+textNameOf+"】flag="+flag);
	return flag;

}

util.clickTextDone=function(rootNode,textNode)
{
    	
    app.dlog("util.clickTextDone......");
	var  flag=false;
	var childBounds=textNode.bounds();
	if(!childBounds)return false;	
	app.dlog("textNode的坐标="+childBounds+" rootNode.bounds()="+rootNode.bounds());
    if(!rootNode.bounds().contains(childBounds)){
		app.dlog("util.clickTextDone():查到"+"textNode的坐标="+childBounds+"超出当前界面");
		return false;
    }
	flag=util.boundsClick(textNode); 
	app.dlog("点textNode的坐标="+childBounds+" flag="+flag);
	if(!flag)
	{
	   flag=util.clickTextNode(textNode);
	   app.dlog("6.0不能点坐标，或者坐标可能有负数,对节点遍历点击，flag="+flag);
       if(!flag &&textNode.text())
	   {
		   flag=click(textNode.text());  
	       app.dlog("节点遍历点击失败，强点【"+textNode.text()+"】flag="+flag);
       }
	}
	sleep(1000);	
    app.dlog("util.clickTextDone退出：flag="+flag);
	return flag;
}
	

//偏历text的所有节点，直到找到可点的父节点点击
util.clickTextNode=function(node)
{
	var flag=false;
	if(!node)return false;
	if(node.clickable())flag=node.click();
	else
	{
      flag=util.clickTextNode(node.parent());
	}
    if(flag)sleep(1000);	
    return flag; 	
}


util.isWebViewPage=function(){
    if(className("android.webkit.WebView").findOnce() 
		|| className("com.tencent.tbs.core.webkit.WebView").findOnce())return true;
    else
        return  false;  		
	
}

util.waitPlayVideoAd = function(testClassName,testIdName)
{
	app.dlog("waitPlayVideoAd......");
    var waitCount = 0;
    var classNode=className(testClassName).findOnce();
	while(!classNode  && waitCount<60)
	{
	    waitCount++; 
		classNode=className(testClassName).findOnce(); 
		if(!classNode)sleep(1000);
	}
	if(classNode)
	   app.dlog("waitPlayVideoAd():等60秒后当前类="+classNode.className());
 	var flag=false;
	waitCount = 0;
	var idNode = id(testIdName).findOnce();
	//app.dlog("waitPlayVideoAd():当前类="+classNode.className()+"  当前Id="+idNode);
    if(idNode && idNode.className()===testIdName)flag=idNode.click();
	else  idNode = null;
	while(!idNode && waitCount<60)
	{
		waitCount++; 
		idNode = id(testIdName).findOnce();
		if(idNode)
		{
		   app.dlog("waitPlayVideoAd():有id："+testIdName);
   	       flag=idNode.click();
		   app.dlog("waitPlayVideoAd:点id:"+ testIdName+"="+flag);
		}
		else
		{
		   flag=util.clickClassName("android.widget.ImageView");	
		   if(!flag){
	          app.dlog("waitPlayVideoAd:没有id:"+ testIdName+"也没有图片类X，back()");
	          back();   
		   }			   
		   app.dlog("waitPlayVideoAd:点X img="+flag);
		
		}
		if(flag)break;
		sleep(1000);
	}
    app.dlog("waitPlayVideoAd:退出");
	
	
}

util.waitPlayVideoAdByText = function(testTextName)
{
    var waitCount = 0;
 	var flag = util.clickText(testTextName);
	while(!flag && waitCount<60)
	{
		waitCount++; 
		flag = util.clickText(testTextName);
		if(!flag)sleep(1000);
	}
	if(waitCount>=60)
		back();
	
}

util.clickClassName = function(testClassName){
	//"android.widget.ImageView"/"android.view.View"
    app.dlog("clickClassName()处理图片类X......"); 
	
	
	var flag=false;
    var clickNode=null; 	//GWM
	app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	var imgNode=className(testClassName).findOnce();
    var parentNode=imgNode?imgNode.parent():null;
	var count = parentNode?parentNode.childCount():0;
    if(count>1)
	{   
       app.dlog("parentNode.class="+parentNode.className());
	   app.dlog("图片类X是有多个，选最小的可以点击的X图片点击,count="+count); 
       for(var i=0;i<count;i++)
	   {
           var childNode=parentNode.child(i);
		   if(!childNode)
		   {
			   app.dlog("i="+i+" childNode=null");
			   continue;
		   }
		   var childClass=childNode.className();
		   if(childClass != testClassName){
			   app.dlog("i="+i+" childClass="+childClass);
			   continue;
		   }
		   var childBounds=childNode.bounds();
		   app.dlog("i="+i+" img bounds="+childBounds);
		   if(childBounds){
              var w=  Math.abs(childBounds.right)-Math.abs(childBounds.left);
			  var h=  Math.abs(childBounds.bottom)-Math.abs(childBounds.top);
		      app.dlog("img bounds.w="+w+" img bounds.h="+h);
			  w=Math.abs(w);
			  h=Math.abs(h);
			  app.dlog("img w="+w+" img h="+h);
			  if(w<=200&& h<=200){
			     app.dlog("找到img w="+w+" img h="+h+" clickable="+childNode.clickable());
				 clickNode=childNode;
				 break;
			  }
		   }
	   }
	   if(clickNode)
	      app.dlog("所有图片搜索完，clickNode=非空，class="+clickNode.className());
       else
	     app.dlog("所有图片搜索完，clickNode=null");
     	   
    }
	else{
	   clickNode=imgNode;	
	   if(clickNode && !clickNode.clickable())
	   {
          //flag=util.boundsClick(clickNode);
		  app.dlog("图片类X只有一个，类型为："+clickNode.className()+",不可点"); 
       }		   
	}
	
    var fClickable = clickNode ? clickNode.clickable():false;
	app.dlog("找到的图片类X是否可点：fClickable="+fClickable); 
    if(clickNode && fClickable)
    {
	    flag=clickNode.click();
	    app.dlog("clickClassName():有可点的X img，点X="+flag);
	    if(!flag){
		   flag=util.boundsClick(clickNode);
		   app.dlog("clickClassName():点X img失败，尝试点坐标="+flag);
		}
    }
    else
    if(clickNode && !fClickable)
	{
        flag=util.boundsClick(clickNode);
     	app.dlog("clickClassName():有img X，但不可点，改点坐标,flag="+flag);
	
	}
	else
	  	app.dlog("clickClassName():无可点的img  X");
		
	
	app.dlog("clickClassName():点img  X="+flag);
	
	return flag;
}

util.clickLeftXByWebView=function()
{
   
   if(!util.clickClassName("android.widget.ImageView") 
	   && !util.clickClassName("android.view.View"))return false;
   else return true;
	   
	
   /*	
   var webviewNode=	className("android.webkit.WebView").findOnce();
   if(!webviewNode)return;
   var webviewBounds=webviewNode.bounds();
   if(!webviewBounds)return;
   app.dlog("clickLeftXByWebView......"); 
   var xNode=className("android.view.View").findOnce();
   if(!xNode)xNode=className("android.widget.ImageView").findOnce();
   var flag=false;
   var clickNode=null; 	
   var parentNode=xNode?xNode.parent():null;
   if(parentNode && parentNode.childCount()>1)
   {
	   app.dlog("是否有多个，选最小的可以点击的且居于webview中心偏左的点击"); 
       for(var i=0;i<parentNode.childCount();i++)
	   {
           var childNode=parentNode.child(i);
		   if(!childNode)continue;
		   var childBounds=childNode.bounds();
		   app.dlog("x bounds="+childBounds);
		   if(childBounds){
              var w=  Math.abs(childBounds.right)-Math.abs(childBounds.left);
			  var h=  Math.abs(childBounds.bottom)-Math.abs(childBounds.top);
		      app.dlog("x bounds.w="+w+" x bounds.h="+h);
			  if((Math.abs(w)<=160&& Math.abs(h)<=160) && Math.abs(w)<= webviewBounds.centerX()){
				 clickNode=childNode;
				 break;
			  }
		   }
		 
	   }				  
   }
   else{
	   app.dlog("X只有一个，点击它"); 
       clickNode=xNode;	
   }
   var fClickable = clickNode ? clickNode.clickable():false;
   if(clickNode && fClickable)
   {
	    flag=clickNode.click();
	    app.dlog("clickLeftXByWebView():有可点的X，点X="+flag);
	    if(!flag){
		   flag=util.boundsClick(clickNode);
		   app.dlog("clickLeftXByWebView():点X失败，尝试点坐标="+flag);
		}
   }
   else 
		app.dlog("clickLeftXByWebView():无可点的 X");
   
	app.dlog("clickLeftXByWebView():exit");
   */
   
}

util.waitInviteCode=function(runAppName){
    var inviteCode  =  app.getPrefString(runAppName+"_inviteCode"); 
    //app.dlog("inviteCode="+inviteCode);
    if(!inviteCode)
	{
		app.dlog("没有邀请码，请输入！");
   
        if(!confirm("请问朋友要【"+runAppName+"】的邀请码，再点【确定】"))
		{
           app.dlog("没有输入邀请码，请输入！");
            
		   exit();
		}
		
		inviteCode = rawInput("请输入【"+runAppName+"】邀请码");
		if(inviteCode =="")
	    {
			  //app.dlog("输入的邀请码为空");
			  exit(); 
	    }
		//app.dlog("输入的邀请码="+inviteCode);
		app.setPrefString(runAppName+"_inviteCode",inviteCode);
    }	
}


//text:这个好像不行哦
util.clickWebViewText = function(classN,textContent){
	
	app.dlog("查找并点击："+textContent);
		 
	var flag=click(textContent);
	if(!flag){	
	   var rootNode=className(classN).findOnce();
       //app.findNodeTest(rootNode,0,0);
	   var resourceItem=util.findNodeByClassByText(rootNode,"android.view.View",textContent,0,0,-1);
	   if(resourceItem){
		   flag=resourceItem.click();
		   if(!flag)flag=click(textContent);
	   }
    }
	
	app.dlog("点击："+textContent+" "+flag);
		
	return flag;
}

//desc:
util.clickWebViewElement = function(classRoot,classN,descContent){
	
	app.dlog("查找并点击："+descContent);
		 
	var flag=click(descContent);
	if(!flag){	
	   var rootNode=className(classRoot).findOnce();
       //app.findNodeTest(rootNode,0,0);
	   var viewItem=util.findNodeByClassByText(rootNode,classN,descContent,0,0,-1);
	   if(viewItem){
		   var count = viewItem.childCount();
		   for(var i=0;i<count;i++){
			   var childNode=viewItem.child(i);
			   if(childNode==null)continue;
			   var childDesc  = childNode.desc();
               //app.dlog("childDesc="+childDesc);
			   if(childDesc===descContent)flag=childNode.click();
		   }
		   if(!flag)flag=viewItem.click();
	   }
    }
	if(flag)sleep(5000);
	app.dlog("点击："+descContent+" "+flag);
	return flag;
}


//
util.jumpToById=function(testIdNode)
{
	if(!testIdNode){
		app.dlog("jumpToById()：testIdNode=null");
		return false;
	}
	app.dlog("跳到由id节点="+testIdNode.id()+"指定的页面......")
	if(testIdNode.clickable()){
	   return testIdNode.click();
	}
	app.dlog("id节点="+testIdNode.id()+"不可点击，找到可以点击的父节点并点击")
    var parentNode=testIdNode.parent();
    if(parentNode && parentNode.clickable() && parentNode.click())
	{
	   
	   app.dlog("id节点="+testIdNode.id()+"点击成功");
	   return true;
    }
	app.dlog("id节点="+testIdNode.id()+"点击失败")
	return false;
	
}

util.findNodeByClassByText=function(node,className,textName,level,startIndex,endIndex) 
{
    var  result=null;
    if(null==node) return  null;
    level++;
    var levelStr="";
    for(var  i=0;i<level;i++){
            levelStr =levelStr+" ";
    }
    var levelCount = level-1;
    levelStr = levelStr+levelCount;
    var childCount=node.childCount();
    var parentClassName=  node.className();
    var textString = node.text();
    var  start=0;
    if(level==1)start=startIndex;
    for(var index=start;index<childCount;index++)
    {
       if(null != result)break;
       var childNode =  node.child( index );
       if(null==childNode)continue;
       var childNodeCount   =  childNode.childCount();
       var childClassName=  childNode.className();
       var childId = childNode.id();
       var childDesc  = childNode.desc();
       var childText  =  childNode.text();
       var lvl = level-1;
       if(endIndex>=0)
       {
          if(childClassName && childClassName== className && lvl == endIndex){
              if (childText && childText===textName) 
			  {
                  // Log.e( "TAG", levelStr + childClassName + "(index:" + index + ")" + "  " + childText
                  //        +"[child:"+ childNodeCount+"]"+"id:"+childId);
                  result = node;
                  break;
              }
			  else
			  if (childDesc && childDesc===textName) 
			  {
                  //app.dlog( "TAG:"+levelStr + childClassName + "(index:" + index + ")" + "  " + childDesc
                  //        +"[child:"+ childNodeCount+"]"+"id:"+childId);
                  result = node;
                  break;
              }
              //else
              //Log.e( "TAG", levelStr + childClassName + "(index:" + index + ")"+"[child:"+ childNodeCount+"]"+"id:"+childId);
          }
        }
        else 
		{
          if(childClassName && childClassName.indexOf(className )>=0)
		  {
              //if (childText && childText.indexOf( textName)>=0) 
			  if (childText && childText===textName) 
			  {
                  //Log.e( "TAG", levelStr + childClassName + "(index:" + index + ")" + "  " + childText
                  //        +"[child:"+ childNodeCount+"]"+"id:"+childId);
                  result = node;
                  break;
              }
			  else
			  if (childDesc && childDesc===textName) 
			  {
                  //app.dlog( "TAG:"+levelStr + childClassName + "(index:" + index + ")" + "  " + childDesc
                  //        +"[child:"+ childNodeCount+"]"+"id:"+childId);
                  result = node;
                  break;
              }	  
              //else
              //    Log.e( "TAG", levelStr + childClassName + "(index:" + index + ")"+"[child:"+ childNodeCount+"]"+"id:"+childId);
          }
        }
        if(childNodeCount>0){
            result=util.findNodeByClassByText(childNode,className,textName,level,startIndex,endIndex);
        }
    }
    return result;

}


util.swapeToRead = function() {
    /*
	swipe(device.width / 2, device.height * 0.8 ,
          device.width / 2, device.height * 0.5, 4000);
    sleep(1000); 		
    swipe(device.width / 2, device.height * 0.8 ,
          device.width / 2, device.height * 0.5, 4000);
	sleep(1000); 		
	*/
	swipe(device.width / 2, device.height * 0.8 ,
          device.width / 2, device.height * 0.5, 2000);
    sleep(3000); 		
    swipe(device.width / 2, device.height * 0.8 ,
          device.width / 2, device.height * 0.5, 2000);
	sleep(3000); 		
	
	/*  
	shell("input swipe " + device.width / 2 + " " + device.height*0.5 + " " + device.width / 2 + " " + device.height*0.8,true);
	shell("input swipe " + device.width / 2 + " " + device.height*0.5 + " " + device.width / 2 + " " + device.height*0.8,true);
    sleep(1000);
   */
}


util.swapeToReadVideo = function() {
 	swipe(device.width / 2, device.height * 0.8 ,
           device.width / 2, device.height * 0.5, 500);  
    swipe(device.width / 2, device.height * 0.8 ,
           device.width / 2, device.height * 0.5, 500);  
 	
	swipe(device.width / 2, device.height * 0.8 ,
           device.width / 2, device.height * 0.5, 500);  
    swipe(device.width / 2, device.height * 0.8 ,
           device.width / 2, device.height * 0.5, 500);  
 	
	/*
       shell("input swipe " + device.width / 2 + " " + device.height*0.5 + " " + device.width / 2 + " " + device.height*0.8,true);
	  shell("input swipe " + device.width / 2 + " " + device.height*0.5 + " " + device.width / 2 + " " + device.height*0.8,true);
      sleep(10000);		   
    */ 
}



//找到有TextView的上一级，返回
util.findParentOfTextWiew=function(node)
{   
	return app.findParentNode(node);
}


//只能搜索非WebView的文本
util.text=function(testTextName)
{
	if(text(testTextName).findOnce()||desc(testTextName).findOnce())return true;
	else return false;
	
}


//搜索包括WebView的文本
util.findText=function(testTextName)
{
	
	if(app.findTextNode(
	      className("android.widget.FrameLayout").findOnce(),
		  testTextName)
	)return true;
	else return false;
	
}

//搜索部分文本，包括WebView文本
util.findTextOf=function(textNameOf)
{
	app.dlog("util.findTextOf()，搜索部分文本：【"+textNameOf+"】");
 	var rootNode=className("android.widget.FrameLayout").findOnce();
	var textNode=app.findTextNodeOf(rootNode,textNameOf);
    if(!textNode){
	    app.dlog("util.clickText():没找到"+textNameOf+"的节点");
		return false;
	}
    return  true; 	
}


util.waitText= function(testTextName,type)//type=0,text;type=1,webview
{   
    var flag=false; 	
    var waitCount = 0;	
    while(waitCount<20)
	{
	   waitCount++; 
	   //app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	   if(type==0){
		  flag=util.text(testTextName);     
		if(flag){
		  app.dlog("waitText:非webview"+testTextName+" success");
		  break;
		}
	    else sleep(1000);  
	   }
       if(type==1)
	   {
		  flag=util.findText(testTextName);  
		  if(flag){
	         app.dlog("waitText:"+testTextName+" success");
			 break;
		  }
	      else
		   sleep(1000);
	   }
	}
	if(!flag)app.dlog("waitText:"+testTextName+" fail");
    return flag 
}



//检测chlidNode是否包括在rootNode里
util.findNodeOfValid=function(rootNode,chilNode)
{
	var result=chilNode;
	if(!rootNode||!chilNode)return null; 
	var  rootBounds=rootNode.bounds();
	var  childBounds=chilNode.bounds();
    app.dlog("chilNode:坐标="+childBounds+" 当前界面坐标="+rootBounds);
	if(!rootBounds.contains(childBounds))
    {
	   app.dlog("查到的坐标="+childBounds+"超出当前界面");
	   result=null;
	}
	if(childBounds.centerY()>=rootBounds.centerY())
	{
	   app.dlog("查到的坐标Y="+childBounds.centerY()+"超出当前界面坐标Y="+rootBounds.centerY());
	   result=null;
	}	
	return result;	
}


//跳到页面的指定条目，如火山极速版:jumpToEarnCoinByViewVideo
util.jumpToItemByText=function(rootClass,testText,searchCount){
    var waitCount=0;                  	
	var rootNode=className(rootClass).findOnce();
	var childNode =app.findNodeByText(rootNode,testText);
  	childNode=util.findNodeOfValid(rootNode,childNode);
	while(!childNode && waitCount<searchCount){
        waitCount++;
        if(!childNode)
		{
		   swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000); //up swipe
		   sleep(1000);
		   //app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
		   childNode =app.findNodeByText(rootNode,testText);
  	       childNode=util.findNodeOfValid(rootNode,childNode);
    	}
	}		
    if(waitCount>=searchCount)
	   return false;
    else
       return true;
}

util.findClickText=function(testText,searchCount,searchDir){//searchDir=true,up swipe
    var waitCount=0;                  	
	while(waitCount<searchCount){
        waitCount++;
        if(util.text(testText))  //虽然已经找到，但有可能坐标点不到，所以由searchCount调试决定是否退出
		{
		   var rootNode=className("android.widget.FrameLayout").findOnce();
	       var rootBounds=rootNode?rootNode.bounds():null;
		   var textNode=app.findTextNode(rootNode,testText);
		   var childBounds=textNode?textNode.bounds():null;    
    	   app.dlog(testText+"的坐标："+childBounds+",Y中心坐标="+childBounds.centerY()+" 屏幕Y坐标="+rootBounds.centerY()); 
	       
		   if(rootNode && textNode && rootBounds && childBounds 
		      && rootBounds.contains(childBounds)
			  && childBounds.centerY() <= rootBounds.centerY()
		   ){
			   app.dlog(testText+"的坐标："+childBounds+"处于界面坐标里"); 
			   break;
		   }
		}
		if(searchDir){
	 	   swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000); //up swipe
		}
		else{
	 	   swipe(device.width / 2, device.height / 4,  device.width / 2, device.height / 4*2, 1000); //down swipe
	    }
		sleep(1000);
	}		
    return util.clickText(testText);
}


util.ucMobile=function()
{
	var currentPkgName=currentPackage();
    if(currentPkgName=="com.UCMobile")
    {
	   app.dlog("处理打开的："+currentPkgName);
       while(currentPkgName=="com.UCMobile")
	   {
		   if(!util.clickText("退出"))
		   {
			     back();
                 sleep(1000);
		   }
		   currentPkgName=currentPackage();
		   sleep(1000);
				   
	   	
	
	   }
	}
	
}

util.clearMem=function(packageName)
{	
    openAppSetting(packageName);
	sleep(5000);
	if
	(
	  (util.text("存储")      //华为手机
	   ||util.text("存储空间") //美图手机	
	   ||util.text("清除数据")//小米手机
	  )
	  &&  
	  (
	     (util.clickText("存储")          //华为手机
		  &&util.waitText("清空缓存",0)
	      &&util.clickText("清空缓存"))
		 ||(util.clickText("存储空间")   //美图手机
		  &&util.waitText("清除缓存",0)
	      &&util.clickText("清除缓存"))
		 ||(util.clickText("清除数据")   //小米手机 
		  &&util.waitText("清除缓存",0)
	      &&util.clickText("清除缓存")
		  &&util.waitText("确定",0)
	      &&util.clickText("确定"))
	  )      	 
    )	
	{
		sleep(2000);
		back();
		sleep(1000);
	}
	else
	{
	  back();
	  sleep(1000);
	}
	
	util.clickText("关闭应用");
	
	if(util.text("强行停止")){
	   back();
	   sleep(1000);
	}
	
	
}

util.getResourceItem=function (resourceName){
  
	app.dlog("开始获取资源......");
    if(!util.text("我的收藏") &&  !util.text("小程序")){
	    app.dlog("开始获取资源,没有我的收藏或小程序，退出");
		return;
	}
	app.dlog("开始在【我的收藏】/【小程序】获取【"+resourceName+"】......");
	//上滑找资源
	var flag=false;
    var isFindItem = false;//是否找到资源
    var resourseItem=null;
    var loopTimeToFindResource = 0;//循环次数
	var lastRecourceText=null;
	var recourceText=null;
    while((!isFindItem || lastRecourceText === recourceText)  && loopTimeToFindResource < 20)
	{
        loopTimeToFindResource++;
		//app.dlog("loopTimeToFindResource="+loopTimeToFindResource);
		//app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
        resourceItem = app.findNodeByText(className("android.widget.FrameLayout").findOnce(),resourceName);
   	    if(resourceItem)
		{  /*
		   var count=resourceItem.childCount();
		   for(var i=0;i<count;i++)
		   {
			  var childNode=resourceItem.child(i);
			  if(!childNode)continue;
			  var textS=childNode.text();
			  app.dlog("i="+i+" textS="+textS);
		   }
		   */
		   isFindItem=true;
        }
		else{ 		
		  //进行下翻
		  app.dlog("未找到"+resourceName+",进行下翻");
    	  if(app.compareVersion()>=0){
            swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
    	    sleep(1000);
		  }
		  else 
		  {
		      app.dlog("6.0不能下翻，手动翻吧!");
    		  sleep(5000);
		  }
		  if(!util.text("我的收藏")&& !util.text("小程序")){
	          app.dlog("获取资源时,没有【我的收藏】，也没有【小程序】，怎么办？");
		      return;
	      }
        }
    }
    
    if(isFindItem){
		lastRecourceText = resourceName;
        app.dlog("找到资源，请阅读："+resourceName);
  	    var flag=false;
		if(resourceItem)
		{
		   flag=util.boundsClick(resourceItem);
		   if(!flag && app.compareVersion()<0)
		   {
		      flag=util.clickText(resourceName);
		   }
	  
		   
		}
	   
  	    if(flag){
		  app.dlog("找到资源，已点击进入");
        }
		else{
		  app.dlog("找到资源，点击未进入");
		  sleep(5000);
    	}
		
    }else{
        toast("20次滑动没有找到资源，请检查!");
	    exit();
    }

}

util.wechatLogin=function(){
	app.dlog("wechatLogin......");
    if(util.text("微信") && util.text("更多功能按钮") && util.text("我")
	  ||util.text("我")&& util.text("收藏")&& util.text("设置") 
      ||util.text("我的收藏")
    )
	{
      app.dlog("已登陆微信");
	  return;
	}		
	if(util.text("登录") || util.text("注册"))
    {
       app.dlog("没有登录微信");
	   exit();
	}
	app.dlog("不确定是否登录微信");
	
}

util.jumpToWechatMyCllection=function(){
	
	app.dlog("jumpToWechatMyCllection......");
  	if(util.text("登录")){
	   app.dlog("没有登录微信");
       exit();
	}
	
	if(util.text("微信登录")&&util.text("允许") && util.clickText("允许")){
	   app.dlog("第三方登录微信");
    }
	if(util.text("我的收藏")){
	    app.dlog("当前是【我的收藏】");
		return;
	}
	
	
	//app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	if(util.text("微信") && util.text("更多功能按钮") && util.text("我"))
	{
	   app.dlog("现在处于【微信】主页面......");
	   sleep(3000);
       if(util.clickText("我")){
		  sleep(3000);
		  util.waitText("收藏",0);
	   }
	   
    }
	if(util.text("我")
	   && util.text("收藏")
	   && util.text("设置")
	)
	{
       app.dlog(appName+"现在处于【我】的页面，包含【收藏】，要跳到【我的收藏】");
	   if(util.clickText("收藏")){
	      sleep(3000);
	      util.waitText("我的收藏",0);
	   }
	}
 	
}

	
util.backtoWechatMyCollection=function()
{
	var waitCount=0;
	var flag=util.text("我的收藏");
	while(!flag && waitCount<10){
	    waitCount++;
		back();
		sleep(1000);
	    flag=util.text("我的收藏");
		if(!flag)sleep(1000);
	}
	
}


util.jumpToAppletIndex=function()
{
	if(util.text("登录")){
	   app.dlog("没有登录微信");
       exit();
	}
	
	if(util.text("小程序"))return;
	
	if(util.text("微信") && util.text("更多功能按钮") && util.text("我"))
	{
	   app.dlog("现在处于【微信】主页面......");
	   if(app.compareVersion()>=0)
	     swipe(device.width / 2, device.height * 0.5 ,
                           device.width / 2, device.height * 0.8, 1000);
	   else{
         if(confirm("请手动下滑显示【小程序】，点【确定】后实行")){
			sleep(5000); 
		 }
	   }		   
						   
	}
	
	

}


//get nickname or account
util.getWechat=function(testText){ //testText="昵称"/"微信号"
    var result=null;
	if(util.text("个人信息")&& util.text("昵称") ){
	  app.dlog("当前界面是【个人信息】界面");  
	  back();	
	  sleep(1000);
	}
	if(util.text("微信")
	   && util.text("通讯录")
	   && util.text("发现")
	   && util.text("更多功能按钮")
	)
	{
	   app.dlog("当前界面是【微信】");  
	   if(!util.clickText("我"))return null;
	   sleep(2000);       
	}
	if(util.text("微信")
	   && util.text("通讯录")
	   && util.text("发现")
	   && util.text("我")
	)
    {
	   app.dlog("当前界面是微信");           		
	   if(!util.clickText("我"))return null;
	   sleep(2000);
	   if(util.text("支付") 
		  && util.text("设置") 
	      && util.text("收藏"))  	
	   {
	      app.dlog("当前界面是【我】");  
          if(util.clickTextOf("微信号")){
             sleep(2000); 
             app.dlog("点【微信号】成功"); 
			 result=util.getText(testText);
		     back();
             sleep(200);			 
		  }
	   }
	   util.clickText("微信");
	}
	return result;
}



util.getNewsReffer=function(name){
    var reffer_code=null;
	var path=files.getSdcardPath()+"/脚本/reffer.json";
    if(files.exists(path)){
	  var reffer = files.read(path);
	  reffer   = JSON.parse(reffer);
      var newsList = reffer.newsAppList;
      var appNum = newsList.length;
      for(var i = 0;i< appNum;i++){
          var scriptName=newsList[i].name;
		  if(scriptName==name)
	      {
             reffer_code   = newsList[i].reffer_code;
             break;
		  }	  
 	  }   
	}
    return reffer_code;
		
}

util.getVideoReffer=function(name){
    var reffer_code=null;
	var path=files.getSdcardPath()+"/脚本/reffer.json";
    if(files.exists(path)){
	  var reffer = files.read(path);
	  reffer   = JSON.parse(reffer);
	  var videoList = reffer.videoAppList;
      var appNum = videoList.length;
      for(var i = 0;i< appNum;i++){
          var scriptName=videoList[i].name;
		  if(scriptName==name)
	      {
             reffer_code   = videoList[i].reffer_code;
             break;
		  }	  
 	  }   
	}
    return reffer_code;
}

util.getVideoRefferUrl=function(appName){
	var reffer_url=null;
	var path=files.getSdcardPath()+"/脚本/reffer.json";
    if(files.exists(path)){
	  var refferPara = files.read(path);
	  refferPara   = JSON.parse(refferPara);
	  var videoList = refferPara.videoAppList;
      var appNum = videoList.length;
      for(var i = 0;i< appNum;i++){
          var scriptName=videoList[i].name;
		  if(scriptName==appName)
	      {
             reffer_url   = videoList[i].reffer_url;
             break;
		  }	  
 	  }   
	}
    return reffer_url;
	
}
util.clearQQDownload=function(){
	app.dlog("clearQQDownload");
	var waitCount=0;
    var rootNode=className("android.widget.FrameLayout").findOnce();
	var delItem =app.findNodeByText(rootNode,"删除");
    if(delItem)
	{
	   app.dlog("找到【删除】");
  	}
	while(!delItem && waitCount<10){
	   waitCount++;
       if(!delItem)
	   {
		  if(app.compareVersion()>=0) 
		  swipe(device.width / 2, device.height * 0.5 ,
                           device.width / 2, device.height * 0.8, 1000);
		  else 				   
		    sleep(3000);
	   }
	   delItem =app.findNodeByText(rootNode,"删除");
    }    
  	if(waitCount>=10){
       app.dlog("搜索10次没有发现删除");
	   return false;
	}
    
	util.clickText("删除"); 	 	  
	return true;
	
}


util.yingyongbao=function(appName){
    
	//当前界面：com.yuncheapp.android.pearl 目标界面：null 当前app：快看点
	var currentPkg       =null;
	var installPkg       ="com.android.packageinstaller";
	var qqDownloadPkg    = "com.tencent.android.qqdownloader";
	
	if(!app.isAppInstalled(app.getPackageName("应用宝")))
    {
        toast("请安装应用宝");
        return;
    }
	
    currentPkg=currentPackage();
	if(currentPkg===installPkg)
	{
	   util.install(appName);
       return;	 
	}
	
	if(currentPkg != qqDownloadPkg)
	{
	   app.dlog("启动应用宝......");
       util.launch("应用宝");
	   waitForPackage(qqDownloadPkg);
	   app.dlog("应用宝启动成功");
	   util.clickClassName("android.widget.ImageView");//pop window
	   sleep(1000);
	}		
    if(id("a3m").findOnce()){
	   app.dlog("应用宝需升级");
	   util.clickText("取消");
	   sleep(2000);
	} 
	
	//先清理应用宝：
    util.UIClick("ax5");//("下载管理");
	
	sleep(5000);
    if(util.text("返回") 
		&& util.text("下载管理") 
	)
	{
	   app.dlog("下载管理......");
	   while(!util.text("暂无下载任务")){	
		  if(!util.clearQQDownload())break;  
	      util.text("清理历史");
		  sleep(5000);    
	   }
	 
	   back();
	   sleep(1000);
	}
	
	app.dlog("准备搜素......");
	
	//返回到首页了：
    util.UIClick("awt");  //搜索框
    sleep(1000);
    var searchId=id("yv").findOnce();  
    if(!searchId)return;
    searchId.setText(appName);
    sleep(1000);
	
    util.UITextClick("搜索");
    sleep(10000);
	
	if(!(util.text(appName) && util.text("搜索")))
	{
	   app.dlog("点搜索后找不到包含"+appName+"&搜索页面");
       exit();	   
	}
	app.dlog("点搜索后找到包含"+appName+"&搜索页面");

	var searchCount = 0;
	
    for(searchCount=0;searchCount<10;searchCount++){
	   //app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	   var targetApp=app.findNodeByClassByText(className("android.widget.FrameLayout").findOnce()
	                                          ,"android.widget.TextView"
											   ,appName,0);
	   if(!targetApp)
	   {
		  app.dlog("找不到:"+appName);
          if(!util.clickText("搜索"))continue;
          sleep(10000);
 		  continue;
	   }
       app.dlog("targetApp="+targetApp); 
       var parentNode=targetApp.parent();
	   if(!parentNode)
	   {
		   exit();
	   }
	   parentNode=targetApp.parent();
	   if(!parentNode)
	   {
		   exit();
	   }
	   var appNode=app.findNodeByText(parentNode,"下载");
	   if(appNode){
           util.clickTextNode(appNode);
		   break;
	   }		   
	}		
    if(searchCount>=10)
	{
	  app.dlog("找不到目标APP："+appName);
	  exit();
 	}		
   
	/*
	var searchCount = 0;
	var targetApp=text(appName).findOnce(1);
    while(!targetApp && searchCount--){
	  app.dlog("找不到目标APP："+appName+"再次搜索......");
      util.UITextClick("搜索");
      sleep(10000);
      targetApp=text(appName).findOnce(1);
	}
	if(!searchCount){
	  app.dlog("找不到目标APP："+appName);
	  exit();
      return;    
	}
    */
	app.dlog("找到目标APP："+appName);
    
	
	/*
	var downloadBtn=text("下载").findOnce();
    if(!downloadBtn){
       app.dlog("找不到下载按钮");
       return;
    }
	if(!util.clickText("下载")){
	   app.dlog("找不到下载按钮");
       exit();
	   return;
	}
    */	
    app.dlog("准备下载......");
    //downloadBtn.parent().click();
    sleep(2000);
	var waitCount =  0;  
	currentPkg=currentPackage();
	while(currentPkg===qqDownloadPkg && waitCount<60){//等待离开下载界面
        waitCount++;
		currentPkg=currentPackage();
        if(currentPkg===qqDownloadPkg)sleep(5000);
        util.clickText("安装");
    }
	app.dlog("下载完成！waitCount="+waitCount+" 当前界面："+currentPkg);
	if(waitCount>=60){
	    app.dlog("下载失败！");
		exit();
		return;
	}
	if(currentPkg === installPkg)
	   util.install(appName);
    else
	{
        app.dlog("下载失败！");
		exit();
		return;
	}		
}




util.download=function(appName,url)
{     
     //toast("download");
	 app.dlog("download:url="+url+" appName="+appName);
     var installPkg="com.android.packageinstaller";
	 app.openUrlD(url);
     sleep(10000);
     if(util.text("无法访问").findOnce())return;
    
	 var waitCount =  0;
	 var rootNode = className("android.widget.FrameLayout").findOnce();
	 var classN = app.findSelfOfClass(rootNode,"WebView");
	 app.dlog("当前类："+classN.className()+"，检索是否安装界面");
	 while( !classN  && waitCount<120){
		waitCount++;
	    if(util.findInstallIndex())break;
		var localDownload = text("打开").findOnce();
		if(!localDownload)localDownload=text("本地下载").findOnce();
        if(!localDownload)localDownload=text("下载").findOnce();
		if(!localDownload)localDownload=text("确定").findOnce();//下载列表中已存在，点确定继续
		if(localDownload)localDownload.click();	
		classN=app.findSelfOfClass(rootNode,"WebView"); 
    	sleep(1000);
	 }
	 app.dlog("检索后当前类="+classN.className());
	 if(classN&&desc("Join GitHub today").findOnce())
	 {
        app.dlog("检测到GitHub页面");
		if(app.compareVersion()<0)		
        {
		   var yes = confirm("你的安卓低于6.0，请手动上滑找到【Download】并点击后等待");
           if(yes){
              
			   sleep(5000); 
				  
		   
		   }
		   else
		   {
    
                   app.dlog("6.0不能滑动，需手动支持");
				   exit();
	             
           }



		}			
		else{
		    waitCount=0;
		    while(waitCount<5){
	 	       waitCount++;
			   if(util.clickTextOfWebView(
			          className("android.widget.FrameLayout").findOnce(),
				      "android.view.View",
				      "Download")){
		                  app.dlog("检测到GitHub页面，点击Download成功");
					      break;
				      }
			   else
			   {   
                  if(app.compareVersion()>=0){		
                     swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
			      }
			      else{
			          app.dlog("6.0不能滑动，需手动滑支持");
	              }
	              sleep(1000);			  
			   }				
		    }
		}
        app.dlog("退出GitHub页面");
	  
	 }
	 else
     if(classN)
	 {
		 toast("请手动点击【普通下载】，再点确定，然后等待");
	 }
	 
	 waitCount =  0;
	 while(classN  && waitCount<120){
		waitCount++;
	    if(util.findInstallIndex())break;
  	    var localDownload = text("打开").findOnce();
		if(!localDownload)localDownload=text("本地下载").findOnce();
        if(!localDownload)localDownload=text("下载").findOnce();
		if(!localDownload)localDownload=text("确定").findOnce();//下载列表中已存在，点确定继续
		if(localDownload)localDownload.click();	
		classN=app.findSelfOfClass(rootNode,"WebView");
    	sleep(1000);
   		
	 }
	 //toast("当前类2："+classN+" waitCount="+waitCount);
	 if(waitCount>=120)return;
	 
	 waitCount=0;
	 var currentPkg=currentPackage();
	 toast("当前包名="+currentPkg);
	 while(currentPkg != installPkg  &&  waitCount<120)
	 {
		 waitCount++;
		 currentPkg=currentPackage();
		 if(util.findInstallIndex())break;
		 var localDownload = text("打开").findOnce();
		 if(!localDownload)localDownload=text("本地下载").findOnce();
         if(!localDownload)localDownload=text("下载").findOnce();
		 if(!localDownload)localDownload=text("确定").findOnce();//下载列表中已存在，点确定继续
		 if(localDownload)localDownload.click();	
		 sleep(1000);
	 }
 	 toast("当前包名="+currentPackage());
     while(currentPkg===installPkg){
	    //com.android.packageinstaller:id/decide_to_continue
	    var continueGo=id("decide_to_continue").findOnce();//id:勾选已充分了解该风险，继续安装
        if(!continueGo){
	       //toast("找不到ID：勾选已充分了解该风险，继续安装");
		   continueGo=text("勾选已充分了解该风险，继续安装").findOnce();//text:勾选已充分了解该风险，继续安装
           //if(!continueGo)toast("找不到text：勾选已充分了解该风险，继续安装");
		}
		if(continueGo){
	       if(!continueGo.click()){
			    toast("找到ID：勾选已充分了解该风险，继续安装,点击失败");
		   }
		}
	    continueGo=id("goinstall").findOnce();//继续安装
        if(continueGo){
		   break;
		}
		if(util.findInstallIndex())break;
  	    var localDownload = text("打开").findOnce();
		if(!localDownload)localDownload=text("本地下载").findOnce();
        if(!localDownload)localDownload=text("下载").findOnce();
		if(!localDownload)localDownload=text("确定").findOnce();//下载列表中已存在，点确定继续
		if(localDownload)localDownload.click();	
		sleep(1000);
     
	 }
     //toast("当前包名="+currentPackage());
     app.dlog("准备安装:"+appName);
     util.install(appName);
	 
 	
}


util.install=function(appName)
{ 
    var installPkg="com.android.packageinstaller";
	var targetPkg=app.getPackageName(appName);  
	var waitCount=0;
	app.dlog("util.install():准备安装；"+appName);
	//循环找安装
    var currentPkg=null;//currentPackage();
 	var installFlag = false;
    while(!installFlag && waitCount <= 20){
	   waitCount++;	
	   if(util.clickText("安装")){
		  installFlag = true;
		  continue;
       }
	   
	   
	   uiele=id("goinstall").findOnce();//继续安装
       if(uiele){
		  uiele.click();
          installFlag = true;
		  continue;
       }
	   if(util.clickText("继续安装")||util.clickText("同意并继续")){
          installFlag = true;
		  continue;
	   }
	   util.clickText("允许");
	   util.UIClick("ok_button"); //点下一步
	   util.clickText("下一步"); //点下一步
	   if(currentPackage()===installPkg)break;
	   
    }
    app.dlog("util.install():安装中......");
	sleep(2000);
    //等待安装完成
	waitCount=0;
	currentPkg=currentPackage();
    var installFinishFlag = false;
	while(currentPkg==installPkg  &&   waitCount<=120){
        waitCount++;
   	    if(util.text("安装"))
		   util.clickText("安装");
	    if(util.text("安装成功"))
		{
		  util.clickText("打开");
		  sleep(2000);
		  break;
		}
		if(util.text("允许"))
		   util.clickText("允许");
	    if(util.text("继续安装"))
		   util.clickText("继续安装");
	    if(util.text("同意并继续"))
		   util.clickText("同意并继续");
	  
		if(util.text("下一步"))
	       util.clickText("下一步");
	    if(util.text("打开"))
	       util.clickText("打开");
	    if(util.text("完成"))
	       util.clickText("完成");
	    if(util.findTextOf("正在安装")){
		   app.dlog("正在安装:installPkg && waitCount<=120:currentPkg="+currentPkg);
		}
		else
		{
           if(className("android.widget.ImageView").findOnce()){
              app.dlog("找不到【正在安装】,发现image块");
			  back();
			  sleep(1000);
			  break;
           }			   
		   else{
             app.dlog("找不到【正在安装】。。。。。。");
		   }			   
		   
		}
		sleep(1000);
		currentPkg=currentPackage();
		app.dlog("currentPkg===installPkg&&waitCount<=120:currentPkg="+currentPkg);
    }
      
	//等待打开APP
    app.dlog("install:等待打开APP");
    waitCount=0;
	var targetAppName=null;
    currentPkg=currentPackage();
    var flag=false;
	while(currentPkg != targetPkg && waitCount<=120){
	   waitCount++;
       flag=util.clickText("安装");
	   if(!flag)flag=util.clickText("允许");
	   if(!flag)flag=util.clickText("始终允许");
	   if(!flag)flag=util.clickText("打开");
	   if(!flag)flag=util.clickText("删除");
	   if(!flag)flag=util.clickText("确定");
	   if(!flag)flag=util.clickText("下一步");
	   currentPkg=currentPackage();
	   var currentAppName=app.getAppName(currentPkg); 
       app.dlog("当前界面："+currentPkg+" 目标界面："+targetPkg+" 当前app："+currentAppName);
       if(currentAppName.indexOf(appName)>=0)
	   {
		   targetPkg=currentPkg;
		   targetAppName=currentAppName;
	   }
	   sleep(1000);
    }
	if(!(targetAppName && targetAppName.indexOf(appName)>=0))targetAppName=appName;
	app.dlog("install:已下载好的APP是："+targetAppName+"启动中......");
	app.launchApp(targetAppName);
	waitForPackage(targetPkg);
    app.dlog("install:【"+targetAppName+"】打开成功,准备登陆");
}

//检测是否安装界面：
util.findInstallIndex=function(){
 	 var uiele = text("安装").findOnce();
     if(!uiele)uiele=id("goinstall").findOnce();//继续安装
     if(!uiele)uiele=id("ok_button").findOnce();//点下一步
     return uiele;
}

module.exports = util;