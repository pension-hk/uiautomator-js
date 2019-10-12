const commons    = require('common.js');
const templates  = require('template.js');
const runAppName ="快看点"; 
const runAppName1 =null; 
const videoMode   = 1;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）

const runPkg      ="com.yuncheapp.android.pearl";
const indexBtn    ="首页";
const indexBtn1    =null;
const indexText   ="小视频";
const indexText1  =null;

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
		if(!commons.text("去签到"))return;
		if(!commons.clickText("去签到")){
		   return;
		}
		sleep(5000);
		//回到新闻
		clickIndex();
        sleep(1000);
    },
    //找出新闻的条目
    findNewsItem:function(){
		app.dlog("找出新闻的条目");
		var newsItem =null;
   	    var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	    app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		     newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,-1);
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,1);
		return newsItem;
		
    },
	
	// 东方头条找不到视频？
	findVideoItem:function(){
	    var videoItem=null;
		var rootNode= className("android.widget.FrameLayout").findOnce();
        app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		    videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,14);
		else videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,14);
	    return videoItem;
             
		 
    },
	
	getVideoTitle:function(videoItem){
        return videoItem.child(2).text();
	},
	
	 //跳到视频页面：
	jumpToVideo:function(){
	   app.dlog("jumpToVideo");
	   clickVideoIndex();
	   sleep(3000);
	
    },
	//时段奖励之后执行
    doingAfterTimeAward:function(){
   	  if(commons.clickText("任务")&&commons.clickText("领取"))
	  {
     	    sleep(2000);
      }		  
      if(findIndex()){
		  app.dlog("时段奖励退出，检查已经在首页！");
		  return;
	  }
	  else{
		  app.dlog("时段奖励退出，检查不在首页，点击首页");
		  clickIndex(); 
	  }	
	
	},
   
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
		if(viewMode=="video"){
		   if(findIndex()||findVideoIndex())return true;	
		   return false; 	
		}
		if(findIndex())return true;
		
		commons.clickText("收入囊中");
		commons.clickText("知道了");
		
		//本APP是文本的点击阅读全文
		//if(!commons.clickText("点击阅读全文"))
		//   commons.clickText("点击查看原文")
		
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
	commons.clickText("收入囊中");
	commons.clickText("知道了");
	if(commons.text("立即领取"))//com.yuncheapp.android.pearl:id/close_img
	{
	   commons.clickClassName("android.widget.ImageView");//x 掉pop window
	}
	var idClose=id("close_img").findOnce();
	if(idClose)idClose.click();
	
	
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
	return commons.clickText(indexBtn);
}

function findVideoIndex(){
	var flag=false;
    var indexBtNode    =text("视频").findOnce()
	var indexBtn1Node  =null;//text("").findOnce();
    var indexTextNode  =text("影视").findOnce();
	var indexText1Node =null;//text("").findOnce();
	if((indexBtNode || indexBtn1Node) && (indexTextNode||indexText1Node))flag=true;
	else flag=false;
    return flag;
}

function isAppVideoPage(){
    return findVideoIndex();
}



function clickVideoIndex(){
	if(isAppVideoPage())return true;
	
	return commons.clickTextById("视频","tab_tv");
	
}



function isLogin()
{
	if(!commons.clickText("任务"))return true;
    return !commons.waitText("微信登录",0);	
}


function loginDone()
{
	if(!commons.clickText("任务"))return;
    commons.waitText("微信登录",0);
	if(!commons.clickText("微信登录"))
	{
	   exit();
	   return;
	}
    wechatLogin(); 	

}

function wechatLogin(){
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
    var waitCount=0;
	var rootNode=className("android.widget.FrameLayout").findOnce();
	var inviteItem =app.findNodeByText(rootNode,"填写邀请码");
    while(!inviteItem && waitCount<10){
	    waitCount++;
        if(!inviteItem){
		   if(app.compareVersion()>=0){	
		     swipe(device.width / 2, device.height * 0.5 ,
                           device.width / 2, device.height * 0.8, 1000);
		     sleep(3000);
		   }
		   else{
               var yesTip = confirm("请往上翻一下屏");
               if(yesTip){
                  sleep(5000);  
               }else{
                 sleep(1000); 
              }			 
 		   }
		     
		   inviteItem =app.findNodeByText(rootNode,"填写邀请码");
          
		}
	}
  	if(waitCount>=10){
       app.dlog("搜索10次没有发现填写邀请码");
	}
    if(inviteItem  && commons.clickText("领1元"))
	{
       commons.waitText("请输入好友提供的邀请码",1);
       var editText=app.findTextNode(className("android.widget.FrameLayout").findOnce(),"请输入好友提供的邀请码");
       if(editText)	
	   {
		  editText.setText(inviteCode);
	      sleep(1000);
		  var openNode=app.findNodeByClass(className("android.webkit.WebView").findOnce(),"android.widget.Button");
	      if(openNode)
		  {
		    for(var i=0;i<openNode.childCount();i++){
               var child =  openNode.child(i);
			   if(!child)continue;
			   var childClass=child.className();
			   var childDesc = child.desc();
			   if(childClass && childClass==="android.widget.Button" && !childDesc){
	               if(child.clickable() && child.click()){
					   sleep(1000);
				   }
	           }
		    }			  
	      }
	   }  
       back();	   
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


