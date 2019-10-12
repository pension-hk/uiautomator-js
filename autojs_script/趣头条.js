const commons = require('common.js');
const templates = require('template.js');
const runAppName = "趣头条";
const runPkg     ="com.jifen.qukan";
const indexBtn    ="头条"
const indexBtn1    ="刷新";
const indexText   ="热点";
const indexText1  ="美食";


templates.init({
    appName:runAppName,
	packageName:runPkg,
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
		if(commons.text("任务")){
		  sleep(3000); 	
		  if(commons.text("去签到")){
			commons.clickText("去签到"); 
		    sleep(2000);
		  }
		  if(commons.text("开启提醒")){
			commons.clickText("开启提醒"); 
		    sleep(2000);
		  }
		  if(commons.text("始终允许")){
			commons.clickText("始终允许"); 
		  }
		  clickIndex();
		}
		
    },
	
    //找出新闻的条目
    findNewsItem:function(){
     	app.dlog("找出新闻的条目");
		
		var newsItem =null;
   	    var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
        //app.findNodeTest(rootNode,0,0);
		newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,-1);
		if(!newsItem){
		   rootNode = className("android.widget.FrameLayout").findOnce();
	       //app.findNodeTest(rootNode,0,0);
		   newsItem=app.findNodeByClassById(rootNode,"android.widget.TextView","agi",0,0);
	 	   if(!newsItem)newsItem=app.findNodeByClassById(rootNode,"android.widget.TextView","ag8",0,0);
		}
		else{
		  var count = newsItem.childCount();
		  var flag=false;
		  for(var i=0;i<count;i++){
		     var childNode=newsItem.child(i);	
			 if(!childNode)continue;
			 var childText=childNode.text();
			 app.dlog("index="+i+" childText="+childText);
			 if(i==0 && childText)flag=true;
		  }
		  if(!flag){
			 app.dlog("无标题");
		  }
		}
		return newsItem;
	},
	
	findVideoItem:function(){
		var videoItem=null;
		rootNode = className("android.widget.FrameLayout").findOnce();
	    app.findNodeTest(rootNode,0,0);
		videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","ai_",0,0);
		if(!videoItem)videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","nq",0,0);
		
		return videoItem;
             		
    },
	
    getVideoTitle:function(videoItem){

        return videoItem.child(0).text();
	},
    //跳到视频页面：
	jumpToVideo:function(){
	   return clickVideoIndex();
    },
	
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
	    if(viewMode=="video"){
		   return false;		
		}
		//图集直接返回
        var imgItem = className("android.support.v4.view.ViewPager").className("ImageView").findOnce();
        if(imgItem){
           return true;
        }
          	
	    ucMobile();
		
		var idTg = id("tg").findOnce();
		if(idTg)idTg.click();
        //请完成验证，。。。
		//向右滑动滑块填充拼图
		if(desc("向右滑动滑块填充拼图").findOnce())
	    {
		   app.dlog("趣头条阅读新闻需滑块验证"); 
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
	var adFlag=id("iv_activity").findOnce();
    if(adFlag){
       back();
       sleep(500);
    }
	adFlag=id("tv_close").findOnce();
    if(adFlag){
       back();
       sleep(500);
    }
	adFlag=id("iv_close").findOnce();
    if(adFlag){
       back();
       sleep(500);
    }
	
    var knowText=text("禁止").findOnce(); 
    if(knowText){
		back();  
	}

    if(commons.text("立即下载"))
		back();  
   		
    if(commons.text("先去逛逛"))
	   commons.clickText("先去逛逛");
    if(commons.text("我知道了"))
	   commons.clickText("我知道了");
	if(commons.text("点击领钱"))
	   commons.clickText("点击领钱");
	if(commons.text("开启提醒"))
	   commons.clickText("开启提醒");
	
	
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
	var indexBtn1Node  =text("刷新").findOnce();
    var indexTextNode  =text("影视").findOnce();
	var indexText1Node =text("广场舞").findOnce();
	if((indexBtNode || indexBtn1Node) && (indexTextNode||indexText1Node))flag=true;
	else flag=false;
    return flag;
}

function isAppVideoPage(){
    var flag=false;
    var indexBtNode    =text(indexBtn).findOnce();
	var indexBtn1Node  =text(indexBtn1).findOnce();
	if(indexBtNode || indexBtn1Node)flag=true;
	else flag=false;
    return flag;
}



function clickVideoIndex(){
	if(findVideoIndex())return true;
	if(!commons.clickText("我的"))return false;
	sleep(3000);
	if(!commons.clickText("视频")
	   &&!commons.clickText("刷新")	
      )return false;
	else
		return true;
		
}






function isLogin()
{
	var flag=true;
	if(commons.text("先去逛逛")){
	   commons.clickText("先去逛逛");	
	   sleep(1000);   
	}
	commons.clickText("我的");
    sleep(3000);
    if(commons.text("看资讯就可以赚钱的APP")||commons.text("短信登录")){
	  flag=false;
	}    
	return flag;	
}


function loginDone()
{
	if(!commons.text("看资讯就可以赚钱的APP")||commons.text("短信登录")){
	   clickIndex();
	   sleep(1000);
	   commons.clickText("我的");
	   sleep(1000);
	}
    if(!confirm("需要手动点【微信一键登录】，点【确定】后进行。")) 
	    exit();
    
	commons.waitText("同意",0);
    wechatLogin(); 	

}

function wechatLogin(){
    commons.waitText("同意",0);
    commons.clickText("同意");	
}

function  fillInviteCode(inviteCode)
{
	if(!inviteCode)return;

}

/*
function wechatLogin(){
	 //微信一键登陆：
	 var wechatLogin = id("b73").findOnce();//text("微信一键登陆").findOnce();
	 if(!wechatLogin)return;
	 wechatLogin.click();
	 sleep(2000); 
	 var textPhone=text("请输入手机号码").findOnce();
	 var waitCount = 0;
	 while(!textPhone  && waitCount<5)
	 {
		waitCount++; 
		textPhone=text("请输入手机号码").findOnce(); 
		//toast("请输入手机号码");
		sleep(1000);
	 }
	 waitCount=0;
	 while(textPhone  && waitCount<20)
	 {
		waitCount++; 
		var phoneNumber=text("请输入11位手机号码").findOnce();
		if(phoneNumber)phoneNumber=phoneNumber.text();
		if(phoneNumber.length==11){
	       commons.UIClick("h3"); //获取短信验证码
           sleep(1000);
		}
		textPhone=text("请输入手机号码").findOnce(); 
		sleep(2000);
	 }
     
	 //请输入短信验证码：
	 waitCount=0;
	 //调试到这
	 
	 
	 
	
	 var agreeBtn  =  text("同意").findOnce();
	 if(!agreeBtn)agreeBtn=id("eb8").findOnce();
	 if(!agreeBtn)return;
	 agreeBtn.click();
		 
	 waitCount = 0;		
     while(currentClass && waitCount<30)
	 {
		 waitCount++; 
		 currentClass=className("android.widget.ScrollView").findOnce(); 
		 sleep(1000);
	 }
	 toast("登陆退出,waitCount="+waitCount); 
	 sleep(2000);
	
}

function  fillInviteCode(inviteCode)
{
	  var runPkg=getPackageName(runAppName);
	  toast("填邀请码");
	  //inviteCode="123456";
	  if(!inviteCode)return;
   
      toast("等待首页");
	   
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
  
      toast("退出等待首页，waitCount="+waitCount+"  waitFlag="+waitFlag);
	
      commons.UITextBoundsClick("我的");
	  sleep(2000);
	 
      toast("上翻找输入邀请码");
	  var waitCount = 0;//循环次数
      var inviteBtn = text("输入邀请码").findOnce();//输入邀请码
	  while(!inviteBtn  && waitCount < 20){
        waitCount++;
        //进行下翻
        
		swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
     	sleep(1000);
        inviteBtn = text("输入邀请码").findOnce();
	  
	  } 
	  toast("退出上翻找，waitCount="+waitCount);
	  
	  if(!inviteBtn ||  waitCount>=20)return;
	  if(!inviteBtn.click()){
	     toast("点击失败，再点父类");
	     inviteBtn=inviteBtn.parent();
	  }
      if(!inviteBtn){
		toast("找不到父类");
	    return;
	  }
	  if(!inviteBtn.click())
	  {
		 click("输入邀请码"); 
	  }
	  
	  sleep(1000);
      var fillInvite=text("填写邀请码").findOnce();  
	  if(!fillInvite) {
		  toast("找不到填写邀请码");
		  return;
	  }
      toast("输入邀请码:");
	  
	  var inputInvite = id("et_input").findOnce();
	  if(!inputInvite)return;
	  inputInvite.click();
	  sleep(1000);
	  inputInvite.setText(inviteCode);
	  sleep(1000);
	  commons.UIClick("iv_done");//领取
	  sleep(2000);
      
	  var btOk = id("view_get").findOnce();//提交邀请码	
	  if(btOk)btOk.click();
	

}	
*/
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

