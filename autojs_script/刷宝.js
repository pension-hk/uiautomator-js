const commons    = require('common.js');
const templates  = require('template.js');
const runAppName = "刷宝"; 
const runAppName1= "刷宝短视频"; 
const runPkg      ="com.jm.video";
const videoMode   = 2;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）

const indexBtn    ="首页"
const indexBtn1    =null;
const indexText   ="任务";
const indexText1  =null;


templates.init({
    appName:runAppName,
	appAlias:runAppName1,
	packageName:runPkg,	
	runMode:"视频",
	runVideoMode:videoMode,
	indexBtnText:indexBtn,
    indexFlagText:indexText,
});

templates.run({
    checkLogin:function(){
        return isLogin(); 
	},   
    login:function(){
        app.dlog("login......");
        commons.waitInviteCode(runAppName);
	    loginDone();
	    fillInviteCode(app.getPrefString(runAppName));
	    app.dlog("登陆完成");


	},
 	//签到
    signIn:function(){ //刷宝签到改版以后是用android.webkit.WebView，暂时不能签
        app.dlog("进入任务,签到");
		//进入任务 
        if(!commons.clickText("任务"))return;
		popWindowProcess();  							   
		sleep(3000);
		if(commons.waitText("立即签到",1)&&commons.clickText("立即签到")){
		   if(commons.waitText("看视频签到",1) && commons.clickText("看视频签到"))
		      commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close"); 

			
		}
		else{
		   if(commons.clickText("开箱领元宝"))
		   {
               if(commons.waitText("翻倍领取",1) && commons.clickText("翻倍领取")){
				  commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close");
				  if(commons.text("恭喜您获得翻倍奖励"))back();
			   }				  
		   }			   
			
		}	
		if(!isAppPage())back();
	    //返回主页面
        clickIndex();
   	
    },
    //找出视频
    findVideoItem:function(){  
        //检查首页是否注焦：
		if(!commons.text("首页"))
		{  
		   back();
		   sleep(200);
		}
     	var videoItem = id("layProgress").findOnce()||id("share").findOnce();
	    return videoItem;
    },
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
       var btnView  =  id("btn_view").findOnce();
	   if(btnView)btnView.click();
	   
    },


	
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
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
	             
	   if(commons.findTextOf("元宝到手啦!"))
	   { 
           app.dlog("有元宝奖励弹窗"); 
		   var openNode=app.findTextNode(className("android.widget.FrameLayout").findOnce(),"开");   
	       if(openNode)
		   {
			 openNode.scrollRight(); 
             back(); //videoAd X
		   }
		   back(); //videoAd X
		
	   }
   
	   return false;
    },
	findIndexPage:function()
	{
		return findIndex();
	},
	checkIsAppPage:function()
	{
		return isAppPage();  //如果是，不要back();
	},
	clickIndexPage:function()
	{
		return clickIndex();
	},
    checkIsAppVideoPage:function()
	{
		return isAppPage();  //如果是，不要back();
	},
	findVideoIndexPage:function()
	{
		return findIndex();
	},
	clickVideoIndexPage:function()
	{
		return clickIndex();
	},
	popWindow:function(){
	  popWindowProcess();
	
    },
	download:function(){
	   commons.yingyongbao(runAppName);
    }

});



function popWindowProcess()
{
	var popFlag=id("btn_view").findOnce(); //知道了 id
	if(popFlag)popFlag.click();
    if(commons.text("知道了"))
		commons.clickText("知道了");	
	popFlag=id("tt_video_ad_close").findOnce();
	if(popFlag)popFlag.click();
	popFlag=id("imgClose").findOnce();
	if(popFlag)popFlag.click();
	
		
}




function findIndex(){
	var flag=false;
    var indexBtNode    =text(indexBtn).findOnce();
	var indexBtn1Node  =text(indexBtn1).findOnce();
    var indexTextNode  =text(indexText).findOnce();
	var indexText1Node =text(indexText1).findOnce();
	if((indexBtNode || indexBtn1Node) && (indexTextNode||indexText1Node))flag=true;
	else flag=false;
    return flag;
}

function isAppPage(){
    var flag=false;
    var indexBtNode    =text(indexBtn).findOnce();
	var indexBtn1Node  =text(indexText).findOnce();
	if(indexBtNode || indexBtn1Node)flag=true;
	else flag=false;
    return flag;
}



function clickIndex(){
	var flag=commons.clickText(indexBtn);

    return flag;	
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


function isLogin()
{
	commons.clickText("任务");
	sleep(3000);
    return !commons.waitText("点击登录",0);	
}

function loginDone()
{
	commons.clickText("任务");
	sleep(3000);
 	commons.waitText("微信账号登录",0);
    if(!commons.clickText("微信账号登录"))	
       exit();
       
    /*
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
	*/  
	wechatLogin();
	  
}

function wechatLogin(){
	//微信一键登陆：
	app.dlog("wechatLogin()......");
	if(!commons.text("同意"))
	   commons.waitText("同意",0);
	commons.clickText("同意");
    if(commons.text("登陆微信")){
	   app.dlog("微信没有登录，请登陆后再操作");
	   exit();	
	}
}

function  fillInviteCode(inviteCode)
{
    if(!inviteCode)return;
	commons.clickText("我的");
    sleep(3000);
    commons.waitText("填邀请码",0); 
    commons.clickText("填邀请码"); 
    sleep(3000);
    if(!confirm("手动输入邀请码，点提交。点【确定】后实行"))
	{
		return;
	}
	var waitCount=0;
	while(commons.findText("提交") && waitCount<30){
		waitCount++;
		sleep(1000);
	}
	

}	

