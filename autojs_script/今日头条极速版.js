const commons    = require('common.js');
const templates  = require('template.js');
const runAppName ="今日头条极速版"; 
const runPkg      ="com.ss.android.article.lite";
const indexBtn    ="首页";
const indexBtn1   ="刷新";
const indexText   ="热点";
const indexText1  =null;



templates.init({
    appName:runAppName,
	packageName:runPkg,
	indexBtnText:indexBtn,
	indexBtnText1:indexBtn1,
	indexFlagText:indexText,
	indexFlagText1:indexText1,
	timeAwardText:"开宝箱",
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
    signIn:function(){
	  	
   	  if(commons.clickText("任务")){
	     sleep(5000);
		 if(commons.text("好的")){
            commons.click("好的"); 
		 }
		 
	     if(commons.clickTextOf("看视频再领"))
	     {
		    //commons.waitPlayVideoAd(className("android.widget.FrameLayout").findOnce(),"tt_video_ad_close")//"关闭广告"
            commons.waitPlayVideoAdByText("关闭广告");  		 
	        sleep(1000);
		    if(commons.text("好的")){
              commons.click("好的"); 
		    }			 
	     }
	     //app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	     if(commons.clickText("开宝箱得金币")){
            app.dlog("进入开宝箱得金币"); 
            sleep(5000);	   
            if(commons.clickTextOf("看完视频再领"))
		    {
	          //commons.waitPlayVideoAd(className("android.widget.FrameLayout").findOnce(),"tt_video_ad_close")//"关闭广告"
              commons.waitPlayVideoAdByText("关闭广告");  		 
	          sleep(3000); 
		    }			 
         }
	  }
	  
	  
	  clickIndex();     
	    
    },
    //找出新闻的条目
    findNewsItem:function(){
		app.dlog("找出新闻条目");
		var newsItem =null;
   	    var rootNode = className("android.widget.TabHost").findOnce();
        //var rootNode = className("android.widget.FrameLayout").findOnce();
	    //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		     newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,10);
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,10);
		return newsItem;
		
    },
	
	findVideoItem:function(){
	    var videoItem=null;
		var rootNode= className("android.widget.FrameLayout").findOnce();
        app.findNodeTest(rootNode,0,0);
	    videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","yf");
	    if(!videoItem)videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","yn");	
		return videoItem;
             		
    },
	
	getVideoTitle:function(videoItem){
        return videoItem.child(1).text();
	},
	
	 //跳到视频页面：
	jumpToVideo:function(){
	   clickVideoIndex();
	   sleep(3000);
	
    },
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
   	    if(!findIndex()) 
		    back();
    },
  
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
	   if(viewMode=="video"){
		   return false;		
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
	popWindow:function(){
	 
      popWindowProcess();
	
    },
    download:function(){
	   commons.yingyongbao(runAppName);
    }

});



function popWindowProcess()
{
	var popFlag = id("a1s").findOnce();
	if(popFlag)popFlag.click();
    if(commons.text("允许"))commons.clickText("允许")//授权
	if(commons.text("确定"))commons.clickText("确定")//授权
	if(commons.text("红包可立即提现"))
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
	var flag=false;
	var textW=text(indexBtn).findOnce();
    if(textW)textW=textW.parent();
    if(textW)
	{  
       flag=textW.click();
	   if(!flag)
		  flag=click(indexBtn);	
	}
	else{
	   if(indexBtn1){	
	      textW=text(indexBtn1).findOnce();
          if(textW)textW=textW.parent();
          if(textW)
	      {  
            flag=textW.click();
	        if(!flag)
		      flag=click(indexBtn1);	
	      }
	   }
	}
    return flag;	
}

function findVideoIndex(){
	var flag=false;
    var indexBtNode    =text("视频").findOnce()
	var indexBtn1Node  =null;//text("").findOnce();
    var indexTextNode  =text("音乐").findOnce();
	var indexText1Node =text("影视").findOnce();
	if((indexBtNode || indexBtn1Node) && (indexTextNode||indexText1Node))flag=true;
	else flag=false;
    return flag;
}

function isAppVideoPage(){
    return findVideoIndex();
}



function clickVideoIndex(){
	
	if(!commons.clickText("我的") && !commons.UITextBoundsClick("我的"))return false;
	if(!isAppVideoPage()){
	   popWindowProcess();	
	}
	return commons.clickText("视频")||commons.UITextBoundsClick("视频");
	
}
	

	

function isLogin()
{
	return !commons.text("未登录");    	
}


function loginDone()
{
	commons.clickText("未登录");
	sleep(3000);
	if(!commons.text("点击登录")){
	   commons.waitText("点击登录",0);
    }
	commons.clickText("点击登录");
	sleep(3000);
	if(!commons.text("微信登录")){
	   commons.waitText("微信登录",0);
    }
	commons.clickText("微信登录");
    sleep(3000);
	
	if(!commons.text("微信登录失败")){
	   commons.waitText("微信登录失败",0);
    }
	if(!commons.text("微信登录失败")){
	   commons.clickText("确定");
	   sleep(3000);
	   commons.clickText("知道了");
	   sleep(3000);
	   commons.clickText("注册");
	   sleep(3000);
	   if(commons.text("注册立即领红包"))
		 if(confirm("请手动输入手机号注册，点【确定】后开始"))
		 {
			var waitCount=0  
		    while(commons.text("注册立即领红包") && waitCount<600)
            {
				waitCount++;
			    sleep(1000); 
			}
			if(waitCount>=600)exit();
            else 
			{
				return;	
            }				
		 }
	     else
             exit();			 
	}
	else
	   wechatLogin(); 	

}

function wechatLogin(){
	app.dlog("wechatLogin()......");
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
    app.dlog("fillInviteCode():inviteCode="+inviteCode); 
    commons.clickText("任务");
	sleep(3000);
    commons.clickText("去填写");
	sleep(5000);
	var inEdit=app.findTextNode(className("android.widget.FrameLayout").findOnce(),"请输入他人给你的邀请码");
    if(inEdit)
	{
	   inEdit.setText(inviteCode);
       sleep(3000);
       commons.clickText("马上提交");  	   
	}
}

function gotoTask1(){
   app.dlog("做任务1...");  

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

