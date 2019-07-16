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

//通过UI点击
util.backToIndex = function(indexFlagText,indexFlagText1,indexFlagText2) {
    
	var indexBtn = false;
    var loop = 0;
    while(!indexBtn){
        back();
        sleep(1000);
        indexBtn = text(indexFlagText).findOnce();
		if(!indexBtn)indexBtn=text(indexFlagText1).findOnce();
		if(!indexBtn)indexBtn=text(indexFlagText2).findOnce();
        //uc浏览器处理:
		if(indexBtn)continue;
		
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

//获取主配置
util.getConfig=function(){
    toast("开始获取配置");
    var url = "https://raw.githubusercontent.com/pension-hk/uiautomator-js/master/java/config.json";
    var str = http.get(url);
	   
    str = JSON.parse(str.body.string());
    toast("配置获取完成");
    return str;
    
}

util.yingyongbao=function(name){
    if(!app.isAppInstalled(app.getPackageName("应用宝")))
    {
        toast("请安装应用宝");
        return;
    }
    toast("启动应用宝");
    util.launch("应用宝");
    var curPackage=currentPackage();
    while(curPackage!="com.tencent.android.qqdownloader"){
       curPackage=currentPackage();
       sleep(1000);
    }
    
    //sleep(5000);
    util.UIClick("awt");
    sleep(1000);
    var searchId=id("yv").findOnce();
    if(!searchId)return;
    searchId.setText(name);
    sleep(1000);
    util.UITextClick("搜索");
    sleep(5000);
    var targetApp=text(name).findOnce(1);
    if(!targetApp){
        toast("找不到目标APP："+name);
        return;
    }
    toast("找到目标APP："+name);
    var download=text("下载").findOnce();
    if(!download){
        
        toast("找不到下载按钮");
        return;
     }
    
    //toast("找到下载按钮，准备下载");
    download.parent().click();
    var currentP=currentPackage();
    var tencentDl="com.tencent.android.qqdownloader";
    while(currentP==tencentDl){//等待离开下载界面
       currentP=currentPackage();
       sleep(500);
    }
    
    var del=text("删除").findOnce();
    if(del){
        
        del.click();
        
    }
     
}

util.install=function(appName)
{ 
	  
	toast("准备安装");
  
    var installCount = 0;  
    //循环找安装
    var installFlag = false;
    while(!installFlag && installCount <= 10){
	   installCount++;	
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
        
    //安装完成
    var installFinishFlag = false;
    while(!installFinishFlag){
      //var uiele = text("完成").findOnce();
      var uiele = text("打开").findOnce();
      if(uiele){
          uiele.click();
          installFinishFlag = true;
      }
	 
      sleep(2000);
    }
    //等待打开APP
    var curApp=currentPackage();
    var targetApp=app.getPackageName(appName);
    while(curApp != targetApp){
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
            
       curApp=currentPackage();
       sleep(2000);
    }
    //app 打开成功

}




module.exports = util;