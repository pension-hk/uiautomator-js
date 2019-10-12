const commons    = require('common.js');
const templates  = require('template.js');
const runAppName = "追看视频"; 
const runAppName1= "追看视频"; 
const runPkg      ="com.yy.yylite";

templates.init({
    appName:runAppName,
	runMode:"视频",
    indexFlagText:"推荐",
});

templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
		var idW=id("aes").findOnce(); //视频id
        if(idW)idW=idW.parent();
		return idW;
	},
	
	//获取首页标志
    findIndexPage:function(){
      return findIndex();
    },
	
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
    signIn:function(){ //刷宝签到改版以后是用android.webkit.WebView，暂时不能签
        toast("进入任务签到");
        
    },
    //找出视频
    findVideoItem:function(){  
        var rootNode = className("android.support.v4.view.ViewPager").findOnce();
		var testNode = className("android.widget.RelativeLayout").findOnce();
		var videoItem = app.findNodeById(testNode,"com.yy.yylite:id/afy");
		if(!videoItem)
		{
		   toast("没有得到的视频");
		   //popWindowProcess();
		}
		return videoItem;
    
	},
	
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
       //var btnView  =  id("btn_view").findOnce();
	   //if(btnView)btnView.click();
	   
    },


	
    //阅读页面是否应该返回
    isShouldBack:function(){
       var closeFlag= id("imgClose").findOnce();
       if(closeFlag){
          closeFlag.click();
	   }
	   return false;
    },
	getAppName:function(appName){
       return appName+"短视频";
    },
	
	download:function(appName){
		
		var appPackage=app.getPackageName(appName);
		if(!appPackage)appPackage=app.getPackageName(appName+"短视频");			
        if(!app.isAppInstalled(appPackage)){
            downloadProcess(appName);
			//var inviteUrl  =  commons.getVideoRefferUrl("刷宝"); 
            //if(!inviteUrl)return false;
			//commons.download(appName,inviteUrl);
			return true;
        }
        else{
     	   return false;	
        }		
	}
});

function findIndex(){

    return text("推荐").findOnce();	
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
	  while(!findIndex() && waitCount<20)
	  {
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
		 /*
		 uiele = text("马上开启").findOnce();
         if(uiele){
            uiele.click();
            sleep(1000);
			continue;
         }
		 */
		 if(!findIndex())
	     { 	 
            back();
            sleep(1000);			
		 	var curPkg = currentPackage();
			app.dlog("curPkg="+curPkg);
			if(curPkg != runPkg)
			{
				if(!app.launchApp(runAppName))
					app.launchApp(runAppName1);
			}
		 }
	  }	
	  app.dlog("登陆：app 启动成功");
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

