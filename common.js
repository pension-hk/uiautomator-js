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
util.backToIndex = function(indexFlagText) {
    var indexBtn = false;
    var loop = 0;
    while(!indexBtn){
        back();
        sleep(1000);
        indexBtn = text(indexFlagText).findOnce();

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
    if(true){
      return util.getConfigByMail();
    }
    else{
       toast("开始获取配置");
       var url = "https://raw.githubusercontent.com/pension-hk/uiautomator-js/master/autojs_script/config.json";
       var str = http.get(url);
	   
       str = JSON.parse(str.body.string());
       toast("配置获取完成");
       return str;
    }
}
util.getConfigByMail=function(){
   toast("开始获取配置");
   var emailAddr=app.getMyEmail();
   var password=app.getMyPassword();
   var recvStr=app.getTaskReffer(emailAddr,password);
   //解析json：
   var str = JSON.parse(recvStr);
   toast("配置获取完成");
   return str;
}





module.exports = util;