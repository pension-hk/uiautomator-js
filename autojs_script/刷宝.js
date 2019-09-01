const commons    = require('common.js');
const templates  = require('template.js');
const runAppName = "刷宝"; 
const runAppName1= "刷宝短视频"; 
const runPkg      ="com.jm.video";

const indexBtn    ="首页"
const indexBtn1    =null;
const indexText   ="首页";
const indexText1  =null;


templates.init({
    appName:runAppName,
	appAlias:runAppName1,
	packageName:runPkg,
	runMode:"视频",
	indexBtnText:indexBtn,
    indexFlagText:indexText,
});

templates.run({
    
 	//签到
    signIn:function(){ //刷宝签到改版以后是用android.webkit.WebView，暂时不能签
        app.dlog("进入任务,签到");
		//进入任务 
        var taskFlag=text("任务").findOnce();
        if(!taskFlag){
		    app.dlog("无任务字样，退出");
			return;
		}
        taskFlag = taskFlag.parent();
		if(taskFlag && !taskFlag.click() && !click("任务"))return;
		sleep(3000);
	    app.dlog("进入签到页");
		var waitCunt=0;
		var webViewW=className("com.tencent.tbs.core.webkit.WebView").findOnce();
        while(!webViewW && waitCunt<15){
              waitCunt++;
			  webViewW=className("com.tencent.tbs.core.webkit.WebView").findOnce();
			  if(!webViewW)sleep(1000);
        }
		waitCount=0;
		var popW=text("去邀请").findOnce();
		while(!popW && waitCunt<15){
              waitCunt++;
			  popW=text("去邀请").findOnce();
			  if(!popW)sleep(1000);
        }
		if(popW  && !popW.click())
		{
			click("去邀请");
		}
		 
        waitCount=0; 
		popW=text("取消").findOnce();
		while(!popW && waitCunt<15){
              waitCunt++;
     	      popW=text("取消").findOnce();
			  if(!popW)sleep(1000);
        }
        if(popW)popW=popW.parent();
		if(popW && !popW.click()){
			click("取消"); 	
		}
		waitCount=0; 
		popW=text("立即签到").findOnce();
		while(!popW && waitCunt<15){
            waitCunt++;
			popW=text("立即签到").findOnce();
			if(!popW){
			   if(text("继续赚元宝").findOnce()){
			      app.dlog("已签到！");
				  clickIndex();
                  return;  				  
			   }
			   else sleep(1000);
			}
        }
		if(popW  && !popW.click())
		{
			click("立即签到");
		}
		
		waitCount=0;
		popW=text("看视频签到").findOnce();
		while(!popW && waitCunt<15){
            waitCunt++;
			popW=text("看视频签到").findOnce();
		    if(!popW)sleep(1000);
        }
		if(popW  && !popW.click())
		{
			click("看视频签到");
		}
		
		waitPlayAd();
		
        //返回主页面
        clickIndex();
        
		
    },
    //找出视频
    findVideoItem:function(){  
        //检查首页是否注焦：
		if(!text("首页").findOnce()){  
		   back();
		   sleep(200);
		}
     	var videoItem = text("空空如也").findOnce();
	    return !videoItem;
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
	   closeFlag= id("iv_box_open_new").findOnce(); //点击收取金豆
	   if(closeFlag){
          closeFlag.click();
	   }

	   //领取额外福利:
       var idBtn= id("idBtn").findOnce();
       if(idBtn)
	   {
	      idBtn.click();
	   }

	   // 点关注:
       var idAttention= id("tv_attention_text").findOnce();
       if(idAttention)
	   {
	       //idAttention.click();
	       commons.UIClick("tv_praise_text");//点赞

	   }
	   var popFlag = text("知道了").findOnce(); 
       if(popFlag)click("知道了");
   
	   return false;
    },
	findIndexPage:function()
	{
		return findIndex();
	},
	clickIndexPage:function()
	{
		return clickIndex();
	},

	popWindow:function(){
	  popWindowProcess();
	
    }
	/*,
	getAppName:function(appName){
       return appName+"短视频";
    }
	*/
});

function popWindowProcess()
{
	var popFlag = text("知道了").findOnce(); 
    if(popFlag)click("知道了");
	popFlag=id("btn_view").findOnce(); //知道了 id
	if(popFlag)popFlag.click();
	
	popFlag=id("tt_video_ad_close").findOnce();
	if(popFlag)popFlag.click();
	
		
}




function findIndex(){
	var indexW  = text(indexBtn).findOnce()||text(indexBtn1).findOnce();
	var indexW1 = text(indexText).findOnce()||text(indexText1).findOnce();
	if(indexW && indexW1)return true;
	else return false;
}

function clickIndex(){
	var flag=false;
	var clickW=text(indexBtn).findOnce();
    if(clickW)
	{  
       flag=clickW.click();
	   if(!flag && indexBtn)
		  flag=click(indexBtn);	
	   if(!flag && indexBtn1)
		  flag=click(indexBtn1);	
	   
	}
    return flag;	
}

function waitPlayAd()
{   	 var  currentClass=className("android.webkit.WebView").findOnce();
		 var waitCount = 0;
		 while(!currentClass  && waitCount<30)
		 {
			waitCount++; 
			currentClass=className("android.webkit.WebView").findOnce(); 
			sleep(1000);
		 }
		 waitCount = 0;
		 while(currentClass  && waitCount<30)
		 {
			waitCount++; 
			var adClose = id("tt_video_ad_close").findOnce();
			if(adClose)
			{
			   adClose.click();
			   break;
			}
			currentClass=className("android.webkit.WebView").findOnce(); 
			sleep(1000);
		
		 }
	
	
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
	  var indexBrn = text("我").findOnce();
	  if(indexBrn)
	  {
	  	click("我");
	  }
	  sleep(1000);
	  
	  var loginTip=text("请输入手机号").findOnce();
	  var waitCount = 0;
	  while(!loginTip  && waitCount<20)
	  {
		 waitCount++; 
		 loginTip=text("请输入手机号").findOnce(); 
		 sleep(1000);
	  }
	  var loginWechat=id("login_weixin").findOnce();
	  if(!loginWechat)return;
	  loginWechat.click();
	  sleep(2000);
	  wechatLogin();
	  
}

function wechatLogin(){
	 //微信一键登陆：
	 var pkg="com.tencent.mm";
	 var classTarget="android.widget.ScrollView";
	 var currentPkg= currentPackage();
	 if(currentPkg !=  pkg){
	     toast("非微信登陆界面");
		 return;
	 }
	 toast("点击微信登陆后,当前包名="+currentPkg);
	 
	 var rootNode = className("android.widget.LinearLayout").findOnce();
	                      
	 var classN=app.findSelfOfClass(rootNode,"android.widget.ScrollView");
	 toast("点击微信登陆后,classN 0="+(classN==null)?"null":classN.className());
	 var waitCount = 0;
	 while(!classN  && waitCount<20)
	 {
		waitCount++; 
		classN=app.findSelfOfClass(rootNode,"android.widget.ScrollView"); 
		sleep(1000);
	 }
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
		 classN=app.findSelfOfClass(rootNode,"android.widget.ScrollView"); 
		 sleep(1000);
	 }
	 toast("点击微信登陆后,classN 2="+(classN==null)?"null":classN.className());
	
	 toast("登陆退出,waitCount="+waitCount);
}

	  


function  fillInviteCode(inviteCode)
{
		 
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

