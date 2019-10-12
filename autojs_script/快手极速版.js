const commons    = require('common.js');
const templates  = require('template.js');
const runAppName = "快手极速版"; 
const runPkg      ="com.kuaishou.nebula";
const indexBtn    ="com.kuaishou.nebula:id/tabs"
const indexBtn1    =null;
const indexText   ="com.kuaishou.nebula:id/tabs";
const indexText1  =null;


templates.init({
    appName:runAppName,
	packageName:runPkg,
	runMode:"视频",
	indexBtnText:indexBtn,
    indexBtnText:indexBtn1,
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
       app.dlog("签到");
	   if(!commons.idClick("left_btn"))return;
	   app.dlog("进入主页后台");
	   if(commons.clickText("去赚钱")){
	       sleep(2000);
		   if(commons.clickText("去签到"))
		    {
               app.dlog("点【去签到】成功");			
			   sleep(3000);
			   if(commons.text("好的"))
			       commons.clickText("好的");
			   if(commons.text("立即签到"))
			       commons.clickText("立即签到");
		
			}
	   
	   }
		   
	   back();
       sleep(1000);	
       clickIndex(); 	   
	   
		
    },
    //找出视频
    findVideoItem:function(){ 
        var videoItem= id("com.kuaishou.nebula:id/container").findOnce();
    	if(videoItem)videoItem.click();
		else{
		  app.dlog("找红包圈或金蛋圈")	
		  videoItem=id("cycle_progress").findOnce()||id("redFloat").findOnce();	
		}
		return videoItem;
     
    },
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
    
	   
    },


	
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
	   if(id("live_close").findOnce()){ //播放了“关注”的直播，没有奖励
		  back();
          sleep(1000);         
          return true;		  
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
	 app.dlog("popWindowProcess()......"); 
	 if(commons.text("我知道了"))
		 commons.clickText("我知道了");
	
}




function findIndex(){
	
	var flag=false;
	if(id("login_text").findOnce())flag=true;
	return (id("tabs").findOnce() && !id("live_close").findOnce())||flag||commons.text("微信登录");

}


function isAppPage(){
    return findIndex();
}



function clickIndex(){
	app.dlog("clickIndex()......");
	var flag=false;
	if(id("live_close").findOnce()){
		back();
		sleep(1000);
	}
	
	//app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	
    var rootNode=id("tabs").findOnce(); 
	if(!rootNode){
	  app.dlog("clickIndex():没找到tabs组合");
	  return false;	
	}
    rootNode = rootNode.child(0);
	if(!rootNode){
	  app.dlog("clickIndex():没找到tabs里面的元素");
	  return false;	
	}
	var count= rootNode.childCount();
	app.dlog("clickIndex():tabs组合count="+count);
    /*
	var childNode=rootNode.child(1);
    if(childNode)flag=commons.boundsClick(childNode);
	*/
	for(var i=0;i<count;i++){
	  var childNode=rootNode.child(1);
      if(!childNode)continue;
	  commons.boundsClick(childNode)
	  sleep(3000);
	  if(id("cycle_progress").findOnce()
		 ||id("redFloat").findOnce()
	  ) 
	  flag=true;
	}
	
	app.dlog("clickIndex():flag="+flag);
	return flag;
    
 
}




function isLogin()
{
	var flag=false;
	var loginId=id("login_text").findOnce();
	if(loginId)flag=true;
	flag=flag||commons.text("微信登录",0);
    app.dlog("isLogin()="+!flag);
	return !flag;	
}


function loginDone()
{
	commons.idClick("login_text");
	sleep(3000);
	if(commons.waitText("一键登录",0))
	{
	   commons.clickText("一键登录");	
	}
    else{
       commons.waitText("微信登录",0);
	   if(commons.text("微信登录")&&!commons.clickText("微信登录"))
	   {
	      exit();
	      return;
	    }
        wechatLogin(); 	
	}
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
	if(!commons.idClick("left_btn"))return;
	sleep(3000);   
	app.dlog("进入主页后台");
	if(!commons.clickText("去赚钱"))return;
	sleep(3000);
    if(!commons.clickText("去填写")){
		back();
		return;
	}
	
	
    	   
	
	

}	
