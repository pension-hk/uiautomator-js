const commons    = require('common.js');
const templates  = require('template.js');
const runAppName = "波波视频"; 
const runAppName1= "波波视频"; 
const runPkg      ="tv.yixia.bobo";

templates.init({
    appName:runAppName,
	appAlias:
	runMode:"视频",
    indexFlagText1:"音乐",
	indexFlagText2:"推荐",
	timeAwardText:"免费领"	

});



templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
		return findIndex();
	},
	/*
	//获取首页标志
    findIndexPage:function(){
      var result= findIndex();
      if(result)return result;
	  popWindowProcess();
      return findIndex();
    
    },
	*/
	//登陆：
    login:function(){
      toast("登陆......");       	  
      var inviteCode  =  commons.getVideoReffer(runAppName); 
      waitAppSuccess();
	  loginDone();
	  //fillInviteCode(inviteCode);
	  toast("登陆完成");
	  return waitIndex();
	},
    
	
    //签到
    signIn:function(){ 
        app.dlog("进入任务签到");
		var signFlag=id("avg").findOnce();
		if(signFlag)signFlag=signFlag.parent();
		if(signFlag)signFlag=signFlag.click();
		if(!signFlag)signFlag=click("任务");
		if(!signFlag)return;
		back();
		sleep(1000);
        
    },
    //找出视频
    findVideoItem:function(){  
     	app.dlog("找出视频条目");
		var videoItem =null;
   	    var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
        //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		     videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,1,2);
		else videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,2);
		return videoItem;
	},
	
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
       if(text("观看视频 金币翻倍").findOnce()&&click("观看视频 金币翻倍"))
	   {
          waitPlayAd();  

	   }		   
	   
    },


	
    //阅读页面是否应该返回
    isShouldBack:function(){
	   //领取奖励：
       //1.播放页里的奖励：

       /*
       //2.我的里面的奖励：
       click("我的");
	   sleep(1000);
	   click("金币");
	   sleep(1000);
	   //android.webkit.WebView
	   if(className("android.webkit.WebView").findOnce()){
	      if(desc("一键领取").findOnce())
   	      {
		     app.dlog("发现 一键领取");
		  }
          else
			  app.dlog("发现 一键领取");
		  
		  click("一键领取");    
          sleep(1000);
          back();
          sleep(1000);
		  click("首页");
		  
	   }
		
	   */  
       if(className("android.webkit.WebView").findOnce()){ 
		   back();   
		   return true;
	   }
	   
       return false;
    },
	
	download:function(appName){
		
		var appPackage=app.getPackageName(appName);
        if(!app.isAppInstalled(appPackage)){
            downloadProcess(appName);
			return true;
        }
        else{
     	   return false;	
        }		
	}
});

function popWindowProcess()
{
	 //点任务，进来的弹窗是分享再赚，但是是：android.webkit.WebView
	 if(className("android.webkit.WebView").findOnce())
	 {
        back();
        sleep(1000); 		
	 }
	 
	 if(text("禁止").findOnce()) //com.android.packageinstaller
        click("禁止"); 
}

function findIndex(){

    var textW=text("首页").findOnce();  
	if(!textW)textW=text("刷新").findOnce();  
    if(textW)textW=textW.parent();
    return textW;	
}

function ucMobile(){
    var currentPkgName=currentPackage();
    if(currentPkgName=="com.UCMobile")
    {
	   app.dlog("处理打开的："+currentPkgName);
       while(currentPkgName=="com.UCMobile")
	   {
		   var  exitText =  text("退出").findOnce();
           if(exitText){
		        if(!exitText.click())click("退出");
		   }
           else
		   {
			     back();
                 sleep(1000);
		   }
		   currentPkgName=currentPackage();
	    }		   
	}	
	
}

function  backToIndex()
{
	ucMobile();
	popWindowProcess();
	if(!findIndex())
	{
	   //toast("发现webview界面，回退");
       back();
       sleep(1000);  	
	}
	
}

	
function waitPlayAd()
{   
    app.dlog("waitPlayAd()");
	var waitCount = 0;
    var currentClass=className("android.webkit.WebView").findOnce();
	while(!currentClass  && waitCount<30)
	{
		waitCount++; 
		currentClass=className("android.webkit.WebView").findOnce(); 
		sleep(1000);
	}
	app.dlog("0 waitPlayAd() waitCount="+waitCount);
	waitCount = 0;
	while(currentClass  && waitCount<10)
    {
	   waitCount++; 
	   var adClose = id("tt_video_ad_close").findOnce();
	   if(adClose)
	   {
	      adClose.click();
		  sleep(1000);
		  back();
	   }
	   currentClass=className("android.webkit.WebView").findOnce(); 
	   sleep(1000);
    }
    app.dlog("1 waitPlayAd() waitCount="+waitCount);
    app.dlog("waitPlayAd() back()");
    if(currentClass)
	  back(); 	
}



function waitIndex()
{
	var waitCount=0;
	var waitFlag=true;
	while(waitFlag  && waitCount<20){
		 waitCount++;
		 if(findIndex())
		 {
			waitFlag=false;
			break;
		 }
		 else
		 {
			back();   
			sleep(1000);
			var curPkg = currentPackage();
			toast("curPkg="+curPkg);
			if(curPkg != runPkg)
			{
				if(!app.launchApp(runAppName))
					app.launchApp(runAppName1);
			}
		 }
	}	 
  
    toast("退出waitIndex()，waitCount="+waitCount+"  waitFlag="+waitFlag);
	if(waitFlag||waitCount>=20)
		return   false;
	else
		return true;
	
}

function  waitAppSuccess()
{
	  toast("登陆:等待启动......");
	  var waitCount=0;
	  var waitFlag=true;
	  while(waitFlag  && waitCount<20){
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
		 
		 uiele = text("去授权").findOnce();
         if(uiele){
            uiele.click();
            sleep(2000);
         }
		 
		 uiele = text("马上开启").findOnce();
         if(uiele){
            uiele.click();
            sleep(1000);
			continue;
         }
		 
		 if(findIndex())
	     {
			waitFlag=false;
			break;
			
	     }
	     else{ 	 
            back();
            sleep(1000);			
		 	var curPkg = currentPackage();
			toast("curPkg="+curPkg);
			if(curPkg != runPkg)
			{
				if(!app.launchApp(runAppName))
					app.launchApp(runAppName1);
			}
		 }
	  }	
	  toast("登陆：app 启动成功");
}

function loginDone()
{
	  var indexBtn = text("我的").findOnce();
	  if(indexBtn)
	  {
	  	click("我的");
	  }
	  sleep(1000);
	  indexBtn = text("登陆").findOnce();
	  if(!indexBtn){
	    toast("LoginDone：解析不到登陆");
	  	indexBtn = id("xy").findOnce();
		if(indexBtn)
        {
		   toast("LoginDone：点登陆id");
	       indexBtn.click();
		}
		else
		{
		  toast("LoginDone：解析不到登陆id",点击登陆);
	  	  click("登陆");	
		}
	  }
	  else
	  {
	  	indexBtn.click();
	  }
	  sleep(1000);
	 

	 
	  var loginTip=text("手机号").findOnce();
	  var waitCount = 0;
	  while(!loginTip  && waitCount<20)
	  {
		 waitCount++; 
		 loginTip=text("手机号").findOnce(); 
		 sleep(1000);
	  }
	  //本app必须要绑定手机，所以设置填邀请码标志后退出
	  app.setWaitLogin(runAppName,true);
	  
}

function wechatLogin(){
	 //微信一键登陆：
	 toast("微信一键登陆");
	 var tencentPkg="com.tencent.mm";
	 var classTarget="android.widget.ScrollView"; 
	 var currentPkg= currentPackage();
	 var waitCount = 0;
	 toast("点击微信登陆后,当前包名="+currentPkg);
	 while(currentPkg != tencentPkg  && waitCount<20)
	 {
		waitCount++;
		if(findIndex()){
		   toast("点微信一键登陆后，已经是app界面，退出");
	       break;
		}
		currentPkg= currentPackage();
		sleep(1000);
	 }
	 if(findIndex()){
	    toast("点微信一键登陆后，已经是app界面，返回");
	    return;
	 }
     if(currentPkg != tencentPkg)
	 {
         //登录需要先绑定手机，请点击此处
		 var mobileTip = text("登录需要先绑定手机").findOnce();
         if(mobileTip){
	        toast("登录需要先绑定手机，请点击此处");
            if(!mobileTip.click())
			    commons.UIClick("y");
            mobileLogin();
			return;
		 }		 

	 } 

	
	 var classN=className(classTarget).findOnce();
	 toast("点击微信登陆后,classN 1="+(classN==null)?"null":classN.className());
	
	 waitCount = 0;		
	 while(classN && waitCount<20)
	 {
		 waitCount++; 
		 var agreeBtn  =  text("同意").findOnce();
	     if(!agreeBtn)agreeBtn=id("eb8").findOnce();
	     if(!agreeBtn)agreeBtn=text("确认登陆").findOnce();
	     if(!agreeBtn)agreeBtn=id("c1u").findOnce();
	     if(agreeBtn)agreeBtn.click();
		 classN=className(classTarget).findOnce(); 
		 sleep(1000);
	 }
	 toast("点击微信登陆后,classN 2="+(classN==null)?"null":classN.className());
	
	 toast("登陆退出,waitCount="+waitCount);
}

function mobileLogin(){ //手动登陆
	  var classN=className("android.webkit.WebView").findOnce();
	  var waitCount = 0;
	  while(!classN  && waitCount<20)
	  {
		 waitCount++; 
		 classN=className("android.webkit.WebView").findOnce(); 
		 sleep(1000);
	  }
	  waitCount = 0;		
	  while(classN && waitCount<30)
	  {
		 waitCount++; 
		 classN=className("android.webkit.WebView").findOnce(); 
		 sleep(5000);
		 toast("请手动用手机登陆");
	  }
	  toast("登陆退出,waitCount="+waitCount);
	  sleep(1000);
	
	
}
	  


function  fillInviteCode(inviteCode)
{
		 if(!inviteCode)return;
	     //填邀请码：
	     toast("填邀请码，先到我的");
         waitIndex();
		 //进我的：
		 var indexBrn = text("我").findOnce();
	     if(indexBrn)
	     {
	  	    click("我");
	     }
	     sleep(2000);

		 
		 
		 var inviteBtn = text("填邀请码").findOnce();
		 if(!inviteBtn)return;
		 if(!inviteBtn.click())
		 {
            click("填邀请码");
		 }
         sleep(2000);
		 //android.webkit.WebView
		 currentClass=className("android.webkit.WebView").findOnce();
		 var waitCount = 0;
		 while(!currentClass  && waitCount<20)
		 {
			waitCount++; 
			currentClass=className("android.webkit.WebView").findOnce(); 
			sleep(5000);
		 }
	     waitCount = 0;		
		 while(currentClass && waitCount<20)
		 {
			waitCount++; 
			currentClass=className("android.webkit.WebView").findOnce(); 
			sleep(5000);
			toast("请手动填入邀请码：【 "+inviteCode+" 】，然后点提交");
		 }
	

}	


function downloadProcess(appName)
{  
 	commons.yingyongbao(appName);
    
}

