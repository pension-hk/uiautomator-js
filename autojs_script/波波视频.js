const commons    = require('common.js');
const templates  = require('template.js');
const runAppName = "波波视频"; 
const runPkg      ="tv.yixia.bobo";
const indexBtn    ="首页";
const indexBtn1    ="刷新";
const indexText   ="搞笑";
const indexText1  ="影视";


templates.init({
    appName:runAppName,
	packageName:runPkg,
	runMode:"视频",
    indexBtnText:indexBtn,
	indexBtnText1:indexBtn1,
	indexFlagText:indexText,
	indexFlagText1:indexText1,	
    timeAwardText:"免费领"	

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
        app.dlog("进入任务签到");
		if(!commons.clickText("赚钱"))return;
		if(commons.clickText("签到") && commons.text("签到成功")){
		   if(commons.clickText("看视频立刻领")){
              commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close");
		   }			   
		}
	    if(!isAppPage()) 	
		    back();
		sleep(1000);
		clickIndex();
        
    },
    //找出视频
    findVideoItem:function(){  
     	app.dlog("找出视频条目");
		var videoItem =null;
   	 	var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
        app.findNodeTest(rootNode,0,0);
		videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,1,2);
		return videoItem;
		
	},
	
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
	   if(commons.clickText("观看视频 金币翻倍"))  	
       {
          commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close");
	      commons.clickText("关闭？？");
	   }		   
	   
    },


	
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
	   if(className("android.webkit.WebView").findOnce()){ 
		   back();   
		   return true;
	   }
	   if(currentPackage()!= runPkg){ 
		   back();   
		   return true;
	   }
	   if(commons.text("禁止")  && commons.text("允许")){ //安装应用
		   back();
           return true;
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
	
	var adClose = id("tt_video_ad_close").findOnce();
	if(adClose)
	{
	   adClose.click();
    }
	if(commons.findText("立即下载")
		||commons.findText("火速升级")
		||commons.findText("收下福利")
		||commons.findText("点击打开")
	)
	commons.clickClassName("android.widget.ImageView");
	 
		
	commons.clickText("知道了");
	if(commons.text("禁止")  && commons.text("允许")) //安装应用
		back();
	
		
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
	
	var flag=commons.clickText(indexBtn)||commons.clickText(indexBtn1);
	return flag;
}


/*
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
*/

function isLogin()
{
	var flag=true;
	if(!isAppPage()){
	   back();	
	   sleep(1000);
	}
	commons.clickText("我的");
	sleep(3000);
	if(commons.text("看视频赚零花")
	   ||commons.text("点击登录")	
	)flag=false;   //填写拜师邀请码
	
	app.dlog("isLogin()="+flag);
	return flag;	
}


function loginDone()
{
	commons.clickText("我的");
	sleep(3000);
	if(commons.clickText("点击登录")){
	  commons.waitText("看视频赚零花",0);
	}//填写拜师邀请码
    if(commons.text("看视频赚零花") && commons.clickText("我也要"))
	{
        sleep(5000);
		wechatLogin();
	}		
 	else exit();
	  
	
}

function wechatLogin(){
	commons.clickText("同意");
    sleep(5000);
	
		
}


function  fillInviteCode(inviteCode)
{
	if(!inviteCode)return;
	app.dlog("fillInviteCode():inviteCode="+inviteCode);
	if(commons.clickText("填写拜师邀请码")||commons.clickText("拜师:填写邀请码"))
	{
	    sleep(1000);
        commons.clickText("去填写");
 	}
	if(commons.waitText("填写拜师邀请码",0))
	{
	   if(confirm("邀请码是:【"+inviteCode+"】，记住后，点【确定】，然后输入它，滑动验证，点拆红包"))
	   {
		   sleep(10000);
	   }		   
		
	}
	
}	

function gotoTask1(){
   app.dlog("做任务1...");  
   commons.clickText("我的");
   sleep(3000);
   commons.clickText("金币");
   sleep(3000);
   commons.waitText("一键领取",1);
   commons.clickText("一键领取");
   sleep(1000);
   back();
   sleep(1000);
   clickIndex();
   sleep(1000);
 
}


function gotoTask2(){
   app.dlog("做任务2...");  
	
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

