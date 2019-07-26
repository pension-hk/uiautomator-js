const commons    = require('common.js');
const templates  = require('video.js');
const runAppName = "刷宝"; 
const runAppName1= "刷宝短视频"; 
const runPk      ="com.jm.video";

templates.init({
    appName:runAppName,
    indexFlagText:"首页",
});

templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
		
        return text("首页").findOnce();
    },
	
	//获取首页标志
    findIndexPage:function(){
      return findIndex();
    },
	
	//登陆：
    login:function(){
      toast("登陆......");       	  
      var inviteCode  =  commons.getVideoReffer("刷宝"); 
      waitAppSuccess();
	  loginDone();
	  //fillInviteCode(inviteCode);
	  toast("登陆完成");
	  
	},

	
    //签到
    signIn:function(){
        toast("进入任务签到");
		//进入任务 
        var taskFlag=text("任务").findOnce();
        if(!taskFlag)return;
        click("任务");
        sleep(2000);
        //去掉广告
		var waitCunt=0;
		var animationView=id("imgClose").findOnce();
        while(!animationView && waitCunt<10){
              waitCunt++;
			  animationView=id("imgClose").findOnce();
			  sleep(1000);
        }
        if(animationView)animationView.click();
		sleep(1000);
        //点击签到领红包
    	var waitCunt=0;
	    var signAtonce=text("立即签到").findOnce();
		while(!signAtonce && waitCunt<10)
		{
			waitCunt++;
			signAtonce=text("立即签到").findOnce();
			if(!signAtonce)//commons.UITextClick("立即签到");
			{
			  var continueEarn=text("继续赚元宝").findOnce();
	          if(continueEarn)break;
			}
			else
			{
			  commons.UITextClick("立即签到");
              break;			  
			}
			sleep(1000); 
			
		}
	    //删除弹出界面
        //寻找“恭喜您获得”
		//var findWelcome=text("恭喜您获得").findOnce();
		animationView=id("imgClose").findOnce();
        if(animationView)animationView.click();
        sleep(500);
		
		//com.jm.video:id/tt_video_reward_container
		//com.jm.video:id/tt_video_ad_close
		
		//开箱领元宝
		//commons.UITextClick("开箱领元宝");
	    //sleep(1000);	
       
        //返回主页面
        click("首页");
        
    },
    //找出视频
    findVideoItem:function(){  
        //检查首页是否注焦：
		if(!text("首页").findOnce()){  //比如，东方头条推送弹窗
		   back();
		   sleep(200);
		}
     	var videoItem = text("空空如也").findOnce();
	    return videoItem;
    },
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
       var btnView  =  id("btn_view").findOnce();
	   if(btnView)btnView.click();
	   
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
			return true;
        }
        else{
     	   return false;	
        }		
	}
});

function findIndex(){

    return text("首页").findOnce();	
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
			var curPkg= currentPackage();
			toast("curPkg="+curPkg);
			back();   
			sleep(1000);
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
  		 if(findIndex())
	     {
			waitFlag=false;
			break;
			
	     }
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
		 
		 //再次检查是否到首页
		 if(findIndex())
	     {
			waitFlag=false;
	     }
		 else
		 {
	        back();   //条件是当前运行的是自己
			sleep(1000);
		 
		 }
	  }	
	  toast("登陆：app 启动成功");
}

function loginDone()
{
	  var waitCount=0;
	  var myBtn = text("我的").findOnce();
	  while(!myBtn  && waitCount<20){
		 waitCount++;
		 myBtn = text("我的").findOnce();
		 if(!myBtn)
		 {
			var curPkg= currentPackage();
			toast("curPkg="+curPkg);
			back();   
			sleep(1000);
		 }
		 
	  }	 
      if(myBtn)
		myBtn.click();
      sleep(2000);  
	  
	  toast("填手机号登陆"); 
	  mobileLoginByhand();
	  
}

function mobileLoginByhand(){ //手动登陆
	  var loginTip=text("请输入手机号").findOnce();
	  var waitCount = 0;
	  while(!loginTip  && waitCount<20)
	  {
		 waitCount++; 
		 loginTip=text("请输入手机号").findOnce(); 
		 sleep(1000);
	  }
	  waitCount = 0;		
	  while(loginTip && waitCount<30)
	  {
		 waitCount++; 
		 loginTip=text("请输入手机号").findOnce(); 
		 sleep(5000);
		 toast("请手动输入手机号");
	  }
	  waitCount = 0;
	  loginTip=text("请输入验证码").findOnce(); 
	  while(loginTip && waitCount<30)
	  {
		 waitCount++; 
		 loginTip=text("请输入验证码").findOnce(); 
		 sleep(5000);
		 toast("请手动输入验证码");
	  }
	  
	  
	  toast("登陆退出,waitCount="+waitCount);
	  sleep(2000);
	
	
}



function  fillInviteCode(inviteCode)
{
		 
	  //填邀请码：
	  toast("填邀请码，先到我的");
      waitIndex();
		 
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

