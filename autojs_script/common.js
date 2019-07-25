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
    setScreenMetrics(1080, 1920);
    sleep(15000);
};

//通过坐标点击
util.boundsClick = function(item) {
    var bounds = item.bounds();
    click(bounds.centerX(),bounds.centerY());
    sleep(1000);
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
        uiele.click();
        flag = true;
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
        uiele.click();
        flag = true;
    }
    sleep(1000);
    return flag;
}

//通过UI文本的坐标点击
util.UITextBoundsClick = function(textContent) {
    var thisEle = text(textContent).findOnce();
    var flag = false;
    if (thisEle) {
        util.boundsClick(thisEle);
        flag = true;
    }
    sleep(1000);
    return flag;
}
util.textBoundsClick = function(textContent) {
    var thisEle = text(textContent).findOnce();
    var flag = false;
    if (thisEle) {
        util.boundsClick(thisEle);
        flag = true;
    }
    sleep(1000);
    return flag;
}



util.backToIndex = function(indexFlagText,indexFlagText1,indexFlagText2) {
    
	var indexBtn = false;
    var loop = 0;
    while(!indexBtn && loop<20 ){
		toast("backToIndex:back()");
        back();
        sleep(1000);
        indexBtn = text(indexFlagText).findOnce();
		if(!indexBtn)indexBtn=text(indexFlagText1).findOnce();
		if(!indexBtn)indexBtn=text(indexFlagText2).findOnce();
        if(indexBtn)continue;
		
		//uc浏览器处理:		
		var  exitText =  text("退出").findOnce();
        if(exitText)exitText.click();
             
		
		
        //超出退出时长的，做一些特殊处理
        if(loop > 5){
			
			
            //无限返回的页面
            var isSucc = util.textClick("关闭");
            if(!isSucc){
                util.textBoundsClick("关闭");
            }

            //系统的安装页面
            if(!isSucc){
                util.UITextClick("取消");
            }

            //成功关闭
            if(isSucc){
                indexBtn = true;
            }
        }
        loop++;
    }
}


//滑动阅读新闻
util.swapeToRead = function() {
    //滑动阅读新闻
    swipe(device.width / 2, device.height * 0.8 ,
        device.width / 2, device.height * 0.5, 5000);
    swipe(device.width / 2, device.height * 0.8 ,
        device.width / 2, device.height * 0.5, 5000);
}


//找到有TextView的上一级，返回
util.findParentOfTextWiew=function(node)
{   
	return app.findParentNode(node);
}



//获取主配置
util.getConfig=function(){
    toast("开始获取配置");
    var url = "https://raw.githubusercontent.com/pension-hk/uiautomator-js/master/java/config.json";
    var str = http.get(url);
	   
    str = JSON.parse(str.body.string());
    toast("配置获取完成");
    return str;
    
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


util.yingyongbao=function(name){
    
	var installPkg="com.android.packageinstaller";
	var tencentDownPkg = "com.tencent.android.qqdownloader";
	if(!app.isAppInstalled(app.getPackageName("应用宝")))
    {
        toast("请安装应用宝");
        return;
    }
    toast("启动应用宝");
    util.launch("应用宝");
	var currentPkg=currentPackage();
	var waitCount=0;
    while(currentPkg != tencentDownPkg && waitCount<20){
          waitCount++;
		  currentPkg=currentPackage();
	      if(currentPkg==installPkg)break;
		  sleep(1000);
    }
	if(waitCount>=20)return;
    toast("应用宝启动成功，waitCount="+waitCount);
    if(currentPkg != installPkg)
	{ 
       //先清理应用宝：
       waitCount=0;
	   var idBtn = id("ax5").findOnce();  //下载管理按钮
	   while(!idBtn && waitCount<20)
	   {
		   waitCount++;
		   idBtn = id("ax5").findOnce();  //下载管理按钮
	   }
	   if(idBtn){
		  idBtn.click(); 
		  sleep(1000);
		  
		  //下载管理界面：
		  var delBtn=text("删除").findOnce();
          if(delBtn){
			 delBtn.click();
             sleep(1000);
           
		  }
	      back();
	      sleep(2000);
     	  currentPkg=currentPackage();
	      toast("应用宝清理完成，当前界面："+currentPkg);
       }
	   
	   //sleep(5000);
       util.UIClick("awt");  //搜索框
       sleep(1000);
       var searchId=id("yv").findOnce();
       if(!searchId)return;
       searchId.setText(name);
       sleep(1000);
	
	
       util.UITextClick("搜索");
       sleep(10000);
       var searchCount = 3;
	   var targetApp=text(name).findOnce(1);
       while(!targetApp && searchCount--){
	      toast("找不到目标APP："+name+"再次搜索......");
          util.UITextClick("搜索");
          sleep(10000);
          targetApp=text(name).findOnce(1);
	   }
	   if(!searchCount){
	      toast("找不到目标APP："+name);
          return;    
	   }
	
       toast("找到目标APP："+name);
       var downloadBtn=text("下载").findOnce();
       if(!downloadBtn){
           toast("找不到下载按钮");
           return;
       }
    
       toast("准备下载......");
       downloadBtn.parent().click();
       waitCount =  0;
	   while(currentPkg==tencentDownPkg && waitCount<20){//等待离开下载界面
          waitCount++;
		  currentPkg=currentPackage();
          sleep(5000);
       }
       if(waitCount>=20)return;
	   toast("下载完成！waitCount="+waitCount);
        
	   //	删除：
	   var delBtn=text("删除").findOnce();
 	   waitCount =  0;
	   while(!delBtn && waitCount<20){//等待删除20秒
          waitCount++;
		  delBtn=text("删除").findOnce();
          sleep(1000);
       }
       if(delBtn){
           delBtn.click();
       }
	   currentPkg=currentPackage();
	   toast("已退出下载，当前处于："+currentPkg+",如果界面超过10秒不动，请手动配合一次。");

	}
  
    if(currentPkg != installPkg)
	{
       return;
	}
    util.install(name);
	
   
     
}

util.install=function(appName)
{ 
    var waitCount=0;
	var installPkg="com.android.packageinstaller";
	
	toast("准备安装");
    
	//循环找安装
    var installFlag = false;
    while(!installFlag && waitCount <= 20){
	   waitCount++;	
       var uiele = text("安装").findOnce();
       if(uiele){
          uiele.click();
          installFlag = true;
       }
	   else
	   {
          util.UIClick("ok_button"); //点下一步
	   } 
	   
	   
    }
    
	toast("安装中......");
	sleep(2000);
        
    //安装完成
	waitCount=0;
    var installFinishFlag = false;
    while(!installFinishFlag && waitCount<=20){
      var uiele = text("打开").findOnce();
      if(uiele){
          if(!uiele.click())click("打开");
          installFinishFlag = true;
      }
	  waitCount++;
      sleep(2000);
    }
    
	var targetPkg=app.getPackageName(appName);
  
	//等待打开APP
    toast("install:等待打开APP");
    waitCount=0;
    var currentPkg=currentPackage();
    while(currentPkg != targetPkg && waitCount<=30){
	   waitCount++;
    	
       var uiele = text("允许").findOnce();
       if(uiele){
          uiele.click();
          sleep(2000);
       }
       uiele = text("始终允许").findOnce();
       if(uiele){
          uiele.click();
          sleep(2000);
       }
       
	   uiele = text("打开").findOnce();
       if(uiele){
          uiele.click();
          sleep(2000);
       }
       uiele = text("删除").findOnce();
       if(uiele){
          uiele.click();
          sleep(2000);
       }
    
	
	   currentPkg=currentPackage();
	   //toast("当前界面："+currentPkg+" 目标界面："+targetPkg);
       sleep(2000);
    }
	
    toast("install:打开APP退出,waitCount="+waitCount);
    

}




module.exports = util;