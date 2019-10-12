const commons     = require('common.js');
const templates   = require('template.js');
const runAppName  ="东方头条"; 
const runAppName1 =null; 
const runPkg      ="com.songheng.eastnews";
const videoMode   = 1;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）

const indexBtn    ="新闻";
const indexBtn1    ="刷新";
const indexText   ="发布";
const indexText1  ="扫一扫";

templates.init({
    appName:runAppName,
	packageName:runPkg,
	runVideoMode:videoMode,
	indexBtnText:indexBtn,
	indexBtnText1:indexBtn1,
	indexFlagText:indexText,
	indexFlagText1:indexText1
});


templates.run({
   
    checkLogin:function(){
        return isLogin(); 
	},
    login:function(){
        app.dlog("login......");
        var inviteCode  =  app.getPrefString(runAppName+"_inviteCode"); 
        app.dlog("inviteCode="+inviteCode);
        if(!inviteCode){
           if(!confirm("请问朋友要邀请码，再点【确定】"))
		   {
              exit();
		   }
		   inviteCode = rawInput("请输入邀请码");
		   if(inviteCode =="")
		   {
			  app.dlog("输入的邀请码为空");
			  exit(); 
		   }
		   app.dlog("输入的邀请码="+inviteCode);
		   app.setPrefString(runAppName+"_inviteCode",inviteCode);
		  
		}
	    loginDone();
	    fillInviteCode(inviteCode);
	    app.dlog("登陆完成");

	},		
    //签到
    signIn:function(){
		if(!commons.clickText("去签到")){
		  return;
		}
		sleep(5000);
		clickIndex();
        sleep(1000);
    },
    //找出新闻的条目
    findNewsItem:function(){
		app.dlog("找出新闻的条目");
		var newsItem =null;
   	    var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	    //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		     newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,-1);
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,1);
		return newsItem;
		
    },
	
	// 东方头条找不到视频？
	findVideoItem:function(){
	    var videoItem=null;
		var rootNode= className("android.widget.FrameLayout").findOnce();
        //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		    videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,15);
		else videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,15);
	    return videoItem;
             
		 
    },
	
	getVideoTitle:function(videoItem){
        return videoItem.child(1).text();
	},
	
	 //跳到视频页面：
	jumpToVideo:function(){
	   app.dlog("jumpToVideo");
	   if(commons.clickText("立即查看"))
	   {
		  sleep(5000);
          back();
          sleep(500);		  
	   }
	   clickVideoIndex();
	   //commons.idClick("aaz");
	   sleep(3000);
	
    },
	//时段奖励之后执行
    doingAfterTimeAward:function(){
   	    //if(!findIndex()) 
		//    back();
    },
   
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
		if(viewMode=="video"){
		   if(findIndex()||findVideoIndex())return true;	
		   return false; 	
		}
		
		if(findIndex())return true;
		//本APP是文本的点击阅读全文
		if(!commons.clickText("点击阅读全文"))
		   commons.clickText("点击查看原文")
	
		if(commons.text("腾讯广告-助力企业实现营销目标"))return true;
		
		if(commons.clickText("立即查看")){
			sleep(5000);
			back();
			sleep(500);
		}
	    
		var adFlag=text("立即下载").findOnce();
	    if(adFlag){
       	   return  true;
        }
	
		if(commons.clickText("金币翻倍x2倍")){
		   commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close");	
		   
		}
	    return false;
    },
	
	doTask1:function(){
        gotoTask1();		
	},
	doTask2:function(){
        gotoTask2();		
	},
	doTask3:function(){
        gotoTask3();		
	},
    doTask4:function(){
        gotoTask4();		
	},
	doTask5:function(){
        gotoTask5();		
	},
		
	walkingMoney:function()
	{
		
       walkMoney(); 		
		
	},
	checkIsAppPage:function()
	{
		return isAppPage();  //如果是，不要back();
	},
	findIndexPage:function()
	{
		return findIndex();
	},
	clickIndexPage:function()
	{
		return clickIndex();
	},
	checkIsAppVideoPage:function()
	{
		return isAppVideoPage();  //如果是，不要back();
	},
	findVideoIndexPage:function()
	{
		return findVideoIndex();
	},
	clickVideoIndexPage:function()
	{
		return clickVideoIndex();
	},
	
	popWindow:function()
	{
	 
      popWindowProcess();
	
    },
	download:function(){
	   commons.yingyongbao(runAppName);
    }
	
});


function popWindowProcess()
{
	    app.dlog("popWindowProcess()");
		var adFlag = id("aa3").findOnce();
        if(adFlag){
           back();
           sleep(1000);
     	}
		
		adFlag = id("rh").findOnce();  //立即体验
        if(adFlag){
           back();
		   sleep(1000);
	    }
	    adFlag = id("ab0").findOnce();
        if(adFlag){
           back();
		   sleep(1000);
	    }
		adFlag = id("fk").findOnce();  //点我的，弹出立即赚钱
        if(adFlag){
           adFlag.click();
	    }
		
		adFlag = id("oi").findOnce();  //点任务，弹出新玩法上线
        if(adFlag){
           adFlag.click();
	    }
	
	    adFlag = id("pu").findOnce();  //点种菜，弹出开启宝箱
        if(adFlag){
           adFlag.click();
	    }
		
		adFlag = id("ua").findOnce();  //palyvideo ad 后广告弹窗
        if(adFlag){
           adFlag.click();
	    }
		var videoAd = id("tt_video_ad_close").findOnce();
        if(videoAd){
            videoAd.click();
        }
		
		if(commons.clickText("立即领取"))
			sleep(1000);
		
		//关闭微信提现提示窗
        adFlag = id("a_y").findOnce();//"a_y";//提现到微信ID
        if(adFlag)
		{
            back();
			sleep(1000);
        }
    
	    //东方头条无响应。。。。。。
		commons.clickText("确定");
        
		
		//最新推送
        if(text("最近推送").findOnce())	
        {
           back();
		   sleep(1000);
		}
	    
		
		//我知道了
        /*
		if(text("我知道了").findOnce())	
        {
           back();
		   sleep(1000);
		}
		*/
		commons.clickText("我知道了");
	   
	    //要文推送
        if(commons.clickText("立即查看"))	
        {
           sleep(5000);
		   back();
		   sleep(500);
		}
	
        //处理回退提示
        commons.clickText("继续赚钱");
       
	    
    	
		//升级处理：
		//var upgradeP = text("立即安装").findOnce(); //立即安装
		if(commons.text("立即安装")){
		   back();
		   sleep(1000);
		}
		
		//东方头条 无响应。是否将其关闭？
		commons.clickText("关闭应用");
   
        commons.clickText("取消");    //参加本次活动，确认退出码？取消/确认退出
       
	 
		if(commons.clickText("金币翻倍x2倍"))
		   commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close");	
		
		//处理时段奖励提醒,立即领取 金豆奖励提醒
		commons.clickText("立即领取");
		
		
		//是否允许“超级淘”安装应用？
		var currentPkg=currentPackage();
		app.dlog("退出popWindowProcess，当前活动在前台的App是："+currentPkg);	
		if(currentPkg != runPkg){
		   var waitCount=0;
           while(currentPkg != runPkg  &&  waitCount<15)		   
		   {
			   waitCount++;
		       if(currentPkg != "com.android.packageinstaller"){
				   back();
                   sleep(200);   				   
			   }
			   else
			   {
				   back();
                   sleep(2000);
				   if(currentPackage()==="com.android.packageinstaller"){
				      if(commons.text("禁止")){
						  back();
						  sleep(200);
					  }
			          commons.clickText("取消");
				   }
			   }
	           currentPkg=currentPackage();
    	   }			   
			
		}
		
		
		
		app.dlog("退出popWindowProcess");	
        
		
		
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
	var indexBtn1Node  =text(indexBtn1).findOnce();
	if(indexBtNode || indexBtn1Node)flag=true;
	else flag=false;
    return flag;
}



function clickIndex(){
	var flag=false;
	if(!commons.clickText(indexBtn) && !commons.clickText(indexBtn1))return false 
	else return true;
}

function findVideoIndex(){
	var flag=false;
    var indexBtNode    =text("视频").findOnce()
	var indexBtn1Node  =null;//text("").findOnce();
    var indexTextNode  =text("小视频").findOnce();
	var indexText1Node =text("影视").findOnce();
	if((indexBtNode || indexBtn1Node) && (indexTextNode||indexText1Node))flag=true;
	else flag=false;
    return flag;
}

function isAppVideoPage(){
    return findVideoIndex();
}



function clickVideoIndex(){
	if(isAppVideoPage())return true;
	if(!commons.clickText("我的"))return false;
	sleep(3000);
	if(!isAppVideoPage()){
	   popWindowProcess();	
	}
	return commons.clickText("视频");
	
}

function isLogin()
{
	if(commons.text("登录/注册"))return false;
	if(!commons.clickText("我的"))return false;
	sleep(1000);
	commons.clickClassName(android.widget.ImageView);
    sleep(1000);
    if(commons.text("登录/注册")){
		app.dlog("isLogin="+false);
		return false;
	}
    else 
	{
	    app.dlog("isLogin="+true);
		clickIndex();
		sleep(1000);
		return true;    	
	}
}

function loginDone()
{
	if(!commons.clickText("任务"))return;
    //commons.waitText("登录领金币",1);
	sleep(2000);
	var yes=confirm("需要手动点【登录领金币】。请点【确定】后实行，如果点【取消】，将结束本任务！");
	if(!yes){
	  exit();
	  return;
	}
	var waitCount=0;
	while(waitCount<20)
    {
		waitCount++;  
        if(commons.text("看新闻赚金币，提现秒到账"))break;
		else sleep(1000);
	}		   
	if(waitCount>=20){
		exit();
        return;		  
	}
	yes=confirm("需要手动点【微信一键登陆】并勾选【已阅读并同意....】。请点【确定】后实行，如果点【取消】，将结束本任务！");
	if(!yes)
	{
      exit(); 	
	  return;
	}	   
    while(waitCount<30)
    {
		waitCount++;  
        if(commons.text("同意"))break;
		else sleep(1000);
	}		   
	if(waitCount>=30){
		exit();
        return;		  
	}
 	wechatLogin();
     	
}

function wechatLogin(){
	app.dlog("wechatLogin");
	if(!commons.clickText("同意")){
	   back();
       return;	   
	}

}

function  fillInviteCode(inviteCode)
{
	if(!inviteCode)return;
    var waitCount=0;
	

}



function gotoTask1(){
    if(!findIndex())clickIndex();
	//app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	if(commons.clickText("恭喜你获得"))
	{
	   commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close");	
    }
	if(commons.clickText("拆红包"))
	{
	   popWindowProcess();	
	}
		  
	if(findIndex())return;
    sleep(1000);
    //回到新闻
    clickIndex();
}


function gotoTask2(){
   app.dlog("做任务2...");  
   if(!findIndex())clickIndex();
	//签到领金币|走路赚金币
   if(!commons.clickText("任务"))return;
  
   var taskName= "种菜赚钱";//"收获金币"//"走路赚金币"
   if(!clickTextOfWebView(
       className("android.widget.FrameLayout").findOnce(),
	   "android.view.View",taskName)){
		   
		   clickIndex();
		   return; 
   }	   
   app.dlog("已进入"+taskName+",处理弹窗");
   popWindowProcess();
   app.dlog("处理弹窗完毕");
   if(!text(taskName).findOnce() && !clickTextOfWebView(
       className("android.widget.FrameLayout").findOnce(),
	   "android.view.View",taskName)){
		   clickIndex();
		   return; 
   }	
   app.dlog("已进入"+taskName);
	
}

function gotoTask3(){
   app.dlog("做任务3...");  
	
}
function gotoTask4(){
   app.dlog("做任务4...");  
	
}
function gotoTask5(){
   app.dlog("做任务5...");  
	
}

function walkMoney()
{
	app.dlog("走路赚金币进入...");  
	/*
	var meW=null;
	var flag=click("我的");
	if(!flag)
	{	
	   meW=text("我的").findOnce();
	   if(!meW)return;
	   meW=meW.parent();
	   if(meW && !meW.click())return;
 	}
	sleep(1000);
	*/
    if(!commons.clickText("我的"))return;
	popWindowProcess();
	if(!commons.clickText("走路赚金币"))return;
	popWindowProcess();
	app.dlog("走路赚金币已进入");  
    if(!clickTextOfWebView(className("android.widget.FrameLayout").findOnce(),"android.view.View","立即领取")){
		
 	   app.dlog("点立即领取失败");  
  
	}
	else
	   app.dlog("点立即领取成功");  
 		
	if(desc("继续").findOnce() && desc("努力哦").findOnce()){
        back();
	    sleep(1000);
    }		
    else{
        back();
	    sleep(1000);
	}
	
	clickIndex();
	
	if(commons.clickText("恭喜你获得"))
	{
	   commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close");	
	   popWindowProcess();
	}
	app.findNodeTest(className(FrameLayout).findOnce,0.0);
	
	if(commons.clickText("拆红包"))
	{
	   popWindowProcess();	
	}
	
}


