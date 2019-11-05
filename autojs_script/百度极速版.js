const commons     = require('common.js');
const templates   = require('template.js');
const runAppName  ="百度极速版"; 
const runAppName1 =null; 
const runPkg      ="com.baidu.searchbox.lite";
const videoMode   = 1;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）
const smallVideoMode   = 2;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）

const indexBtn    ="首页";
const indexBtn1    =null;
const indexText   ="百度logo";
const indexText1  ="热榜";
const SETUP       ="z0"; 

templates.init({
    appName:runAppName,
	packageName:runPkg,
	runVideoMode:videoMode,
	runSmallVideoMode:smallVideoMode,
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
        commons.waitInviteCode(runAppName);
	    loginDone();
	    fillInviteCode(app.getPrefString(runAppName));
	    app.dlog("登陆完成");

	},		
    //签到
    signIn:function(){
		if(commons.clickText("去签到")){
		   sleep(5000);
		   if(commons.waitText("看视频再赚100金币",1)&&commons.clickText("看视频再赚100金币"))
		   {
			  sleep(5000);
              commons.idClick("_san_76");			  
			  commons.waitText("恭喜获得100金币",1);
              back();   			  
		   }
		}	
		clickIndex();
        sleep(5000);
    },
    //找出新闻的条目
    findNewsItem:function(){
		app.dlog("找出新闻的条目");
		var newsItem =null;
   	    var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	    app.findNodeTest(rootNode,0,0);
		newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,-1);
		return newsItem;
		
    },
	
	findVideoItem:function(){
	    var videoItem=null;
		var rootNode= className("android.widget.FrameLayout").findOnce();
        //app.findNodeTest(rootNode,0,0);
		videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,15);
	    if(videoItem){
			var count=videoItem.childCount();
			app.dlog("findVideoItem:count="+count);
			if(count>0)
			for(var i=0;i<count;i++){
				var child=videoItem.child(i);
				if(!child)continue;
				var textStr=child.text();
			    app.dlog("findVideoItem:text="+textStr)
				if(textStr && textStr.indexOf("广告")>=0){
					videoItem=null;
				}
			}
		}
		
		return videoItem;
             
		 
    },
	
	getVideoTitle:function(videoItem){
		if(videoItem.child(1))
          return videoItem.child(1).text();
	    else return null;
	},
	
	 //跳到视频页面：
	jumpToVideo:function(){
	   app.dlog("jumpToVideo");
	   clickVideoIndex();
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
		
	app.dlog("退出popWindowProcess");	
    	
		
}

function findIndex(){
    var flag=commons.text(indexBtn) && (commons.text(indexText)||commons.text(indexText1));
    return flag;
}

function isAppPage(){
    var flag=commons.text(indexBtn)
    return flag;
}



function clickIndex(){
	var flag=commons.clickText(indexBtn);
    return flag; 
}

function findVideoIndex(){
	var flag=false;
    var indexBtNode    =text("视频").findOnce()
	var indexBtn1Node  =null;
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
	if(!commons.waitText("立即提现",0))
	{
	   popWindowProcess();	
	}
	return commons.clickText("视频");
	
}

function isLogin()
{
	if(commons.text("未登录"))return false;
	else
		return true;    	
}

function loginDone()
{
	if(commons.text("我的"))return;
	if(!commons.clickText("未登录"))return;
    if(commons.waitText("登录一下，内容更精彩",0)
	   && commons.idClick("i2"))//微信登陆
	{
      
       app.dlog("微信账号登陆");   

 	   wechatLogin();

	}		
     	
}

function wechatLogin(){
	app.dlog("wechatLogin");
	if(commons.waitText("同意",0)
	   && commons.clickText("同意")
       && commons.waitText("绑定手机号",1) 
	)
	{
	   if(confirm("请手动填写手机号获取验证码并输入，点【确定】实行"))
	   {
           sleep(30000);
	   }
       else{
          exit();
	   } 	   
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
   app.dlog("做任务5,清理内存");  
     
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


