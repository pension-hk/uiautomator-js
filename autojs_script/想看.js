const commons    = require('common.js');
const templates  = require('template.js');
const runAppName ="想看"; 
const runPkg      ="com.xiangkan.android";
const videoMode   = 1;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）
const smallVideoMode   = 2;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）
const indexBtn    ="首页"
const indexBtn1    ="刷新"
const indexText   ="热点";
const indexText1  ="情感";



templates.init({
    appName:runAppName,
	packageName:runPkg,
	runVideoMode:videoMode,
	runSmallVideoMode:smallVideoMode,
	indexBtnText:indexBtn,
	indexBtnText1:indexBtn1,
	indexFlagText:indexText,
	indexFlagText1:indexText1,
	timeAwardText:"领金币"	
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
   	    
		if(commons.clickText("签到")){
		   popWindowProcess();
		   sleep(1000);
        }
        clickIndex();		
 
    },
    //找出新闻的条目
    findNewsItem:function(){
		var newsItem =null;
	    var rootNode= className("android.widget.FrameLayout").findOnce();
        //app.findNodeTest(rootNode,0,0);
		newsItem=app.findNodeByClassById(rootNode,"android.widget.TextView","tvTitle");
		if(!newsItem)newsItem=app.findNodeByClassById(rootNode,"android.widget.TextView","tv_text_image_title");
		if(!newsItem)newsItem=app.findNodeByClassById(rootNode,"android.widget.TextView","tv_sub_title");
		return newsItem;
		
    },
	getNewsTitle:function(newsItem){

        return newsItem.child(0).text();
	},
	
	findVideoItem:function(){
		var videoItem=null;
	    var rootNode= className("android.widget.FrameLayout").findOnce();
        //app.findNodeTest(rootNode,0,0);
		videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","video_item_title");
		return videoItem;
    },
	
    getVideoTitle:function(videoItem){

        return videoItem.child(2).text();
	},
	//跳到视频页面：
	jumpToVideo:function(){
	   if(clickVideoIndex()){
		   sleep(3000);
		   return true;
	   }
	   return false;
	 
	 	   
    },
	//时段奖励之后执行
    doingAfterTimeAward:function(){
       if(text("开福袋").findOnce()){
		   if(click("开福袋"))
		   {
			  sleep(1000);
              click("继续阅读");			  
		   }
	   }
	},
  
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
		if(viewMode=="video"){
	       
		   return false;		
		}
		commons.clickText("点击阅读全文");  
		var meKnow  =  text("我知道了").findOnce();
	    if(meKnow)meKnow.click();
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
	findVideoIndexPage:function()
	{
		return findVideoIndex();
	},
	checkIsAppVideoPage:function()
	{
		return isAppVideoPage();  //如果是，不要back();
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
    var awardFlag = text("领取奖励").findOnce();
    if(awardFlag){
       if(!awardFlag.click())click("领取奖励");
	}
		
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
    var indexBtNode    =text("视频").findOnce();
	var indexBtn1Node  =null;//text(indexBtn1).findOnce();
    var indexTextNode  =text("影视").findOnce();
	var indexText1Node =null;
	if((indexBtNode || indexBtn1Node) && (indexTextNode||indexText1Node))flag=true;
	else flag=false;
    return flag;
}

function isAppVideoPage(){
    var flag=false;
    var indexBtNode    =text("视频").findOnce();
	var indexBtn1Node  =null;//.findOnce();
	if((indexBtNode || indexBtn1Node) && (text("影视").findOnce()))flag=true;
	else flag=false;
    return flag;
}



function clickVideoIndex(){
	if(!commons.clickText("我的"))return false;
	sleep(1000);
	return commons.clickText("视频");
}


function isLogin()
{
	var flag=false;
	if((commons.text("首页")||commons.text("刷新"))
	   &&commons.text("视频")
       &&commons.text("围观")   
	   &&commons.text("我的"))flag=true;
	app.dlog("isLogin()="+flag);
	return flag;	
}


function loginDone()
{
	if(!commons.clickText("围观")){
       exit(); 
    }
 	sleep(3000);
	commons.waitText("热门",0);
	commons.UIClick("publish");
	sleep(2000);
	if(!commons.waitText("微信一键登录",0))
	{
		exit();
	}
	
	commons.clickText("微信一键登录");
	wechatLogin();
	  
	
}

function wechatLogin(){
	sleep(5000);
	commons.clickText("同意");
    sleep(5000);
	if(commons.text("稍后选图")){
		back();
		sleep(1000);
	}
	
	if(!isAppPage()){
	   back();
	   sleep(1000);
	}
    clickIndex();	
}


function  fillInviteCode(inviteCode)
{
	if(!inviteCode)return;
	app.dlog("fillInviteCode():inviteCode="+inviteCode);
	if(!commons.clickText("我的")){
		exit();
	}
    sleep(1000);
	if(!commons.waitText("填写邀请码",0)){
		return;
	}		
	if(!commons.clickText("填写邀请码"))return;
    if(!commons.waitText("请输入好友给的邀请码",0))return;	
	var inviteEdit=text("请输入好友给的邀请码").findOnce(); 	
	if(inviteEdit)inviteEdit.setText(inviteCode);
	sleep(2000);
	if(!commons.clickText("确认提交"))
	{
	  if(confirm("系统点击确认提交失败，请点【确定】后手动点【确认提交】")){
	     sleep(5000); 
	  }		  
	}
}	




