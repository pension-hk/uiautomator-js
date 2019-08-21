const commons = require('common.js');
const templates = require('template.js');
const runAppName ="微鲤"; 
const runPkg     ="cn.weli.story";
const indexBtn    ="美食";
const indexText   ="美食";


templates.init({
    appName:runAppName,
	indexBtnText:indexBtn,
    indexFlagText:indexText,
    timeAwardText:"领红包",
});


templates.run({
    //获取首页按钮
    getIndexBtnItem:function(){
        return id("rl_bottom_1").findOnce();
    },
	/*
	//获取首页标志
    findIndexPage:function(){
      return findIndex();
    },
    */
    //签到
    signIn:function(){
        
		app.dlog("签到");
		if(!commons.idClick("rl_bottom_4"))
		{
           app.dlog("点我的失败");
		   return;
		}			
        if(!commons.idClick("ll_not_sign"))
		{
           app.dlog("点签到失败");
		   return;
		}
        var waitCount = 0;
		var classN=className("android.webkit.WebView").findOnce();
        while(!classN && waitCount<15){
           waitCount++;
		   classN=className("android.webkit.WebView").findOnce();
		   sleep(1000);
		}			
        
		app.dlog("签到界面waitCount="+waitCount);
	    app.findNodeTest(classN,0,0);
		//app.printCurrentViewPageInfo();
		if(classN){
           app.dlog("点立即签到");
		   var flag=desc("立即签到").findOnce();//click("立即签到");
		   
		   if(flag){
			  app.dlog("立即签到id=true");
		 	  if(!flag.click())click("立即签到");
		   }
		   else
			  app.dlog("立即签到id=false");
			   
		}
	   
        back();
     	sleep(1000);
        commons.idClick("rl_bottom_1");
		
    },
    //找出新闻的条目
    findNewsItem:function(){
        //领取宝藏
        commons.UIClick("text_ok");
        commons.UIClick("bt_ok");
		app.dlog("找出新闻条目");
		var newsItem =null;
   	    var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	    //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		     newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,-1);
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,-1);
		return newsItem;

	
		
    },
    //时段奖励之后执行
    doingAfterTimeAward:function(){
		app.dlog("doingAfterTimeAward");
		//cn.weli.story:id/rl_bottom_0 聊一聊
        if(commons.idClick("rl_bottom_0")){
           //android.support.v7.widget.RecyclerView 聊一聊界面
		   sleep(1000);
	       /*
		   var rootNode = className("android.widget.FrameLayout").findOnce();
		   //app.findNodeTest(rootNode,0,0);
		   app.listNode(rootNode,0); //tv_group_tag
		   var newsItem =app.findNodeByTextById(rootNode,"红包","tv_group_tag");
   	 	   if(newsItem){
			  var count = newsItem.childCount();
			  for(var i=0;i<count;i++){
				  var child  = newsItem.child(i);
                  var classN=  child.className();
                  if(classN && classN.indexOf("android.widget.TextView")>=0) 
                     app.dlog("text="+child.text());					  
				  
			  }
		   }
		   */
		   var idW= id("tv_group_tag").findOnce()
		   if(idW){
			   
			  idW.parent().click(); 
		   }
		   
		   
	    }
    },
    //阅读页面是否应该返回
    isShouldBack:function(){
	  
		
	    //领取宝藏
        commons.UIClick("text_ok");
        
		commons.UIClick("bt_ok");      //如阅读奖励提醒，点知道了
	    
		//阅读中
		//if(text("展开查看全文").findOnce()){
    	click("展开查看全文");
		
		
        return false;
    },
	popWindow:function(){
	    popWindowProcess();
	
	  
    },
	getAppName:function(appName){
       return appName;
    },
	download:function(appName){
		
		var appPackage=app.getPackageName(appName);
        if(!app.isAppInstalled(appPackage)){
            toast(appName+"没有安装");
            downloadProcess(appName);
			return true;
        }
        else{
           //toast("appName="+appName+"已经安装");
		   return false;	
        }		
	}
});

function findIndex(){
   return text("美食").findOnce(); 
}

function ucMobile(){
    var currentPkgName=currentPackage();
    if(currentPkgName=="com.UCMobile")
    {
	   app.dlog("处理打开的："+currentPkgName);
       while(currentPkgName=="com.UCMobile")
	   {
		   var  exitText =  text("退出").findOnce();
           if(exitText){
		        if(!exitText.click())click("退出");
		   }
           else
		   {
			     back();
                 sleep(1000);
		   }
		   currentPkgName=currentPackage();
	    }		   
	}	
	
}


function  backToIndex()
{
    /*
	var currentPkgName=currentPackage();
    if(currentPkgName=="com.UCMobile")
	{
	     toast("处理打开的："+currentPkgName);
         var  exitText =  text("退出").findOnce();
         if(exitText)exitText.click();
         else
		 {
			back();
            sleep(1000);
		 }		   
	}
    */
	ucMobile();
	popWindowProcess();
     
	
	if(!findIndex())
	{
	   //toast("发现webview界面，回退");
       back();
       sleep(1000);  	
	}
	
}

function popWindowProcess()
{
	var adFlag=id("iv_activity").findOnce();
    if(adFlag){
        back();
        sleep(500);
    }
}

function  waitAppSuccess()
{
	  toast("登陆:等待启动......");
	  var waitCount=0;
	  var waitFlag=true;
	  while(waitFlag  && waitCount<20){
	     waitCount++;
  		 if(findIndex())
	     {
			waitFlag=false;
			break;
			
	     }
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
		 //再次检查是否到首页
		 if(findIndex())
	     {
			waitFlag=false;
	     }
		 else
		 {
	        back();   //条件是当前运行的是自己
			sleep(1000);
		 
		 }
	  }	
	  toast("登陆：app 启动成功");
}

function loginDone(){
	 var myBtn = id("rl_bottom_4").findOnce();//我的
	  if(myBtn){
		 myBtn.click();
	     sleep(2000);
	  }
     
	  toast("登陆领红包");       	  
	  var loginBtn=loginBtn=id("et_login").findOnce();//("立即赚钱").findOnce();
	  if(loginBtn)
	  {
		 loginBtn.click();
		 sleep(2000);
	  } 	 
      wechatLogin();
	  
	
}

function wechatLogin(){
	 //微信一键登陆：
	 var wechatLogin = id("login_0").findOnce();//text("微信一键登陆").findOnce();
	 if(!wechatLogin)return;
	 wechatLogin.click();
	 sleep(2000); 
	 var currentClass=className("android.widget.ScrollView").findOnce();
	 var waitCount = 0;
	 while(!currentClass  && waitCount<20)
	 {
		waitCount++; 
		currentClass=className("android.widget.ScrollView").findOnce(); 
		sleep(1000);
	 }
		 
	 var agreeBtn  =  text("同意").findOnce();
	 if(!agreeBtn)agreeBtn=id("eb8").findOnce();
	 if(agreeBtn)agreeBtn.click();
		 
	 waitCount = 0;		
     while(currentClass && waitCount<30)
	 {
		 waitCount++; 
		 currentClass=className("android.widget.ScrollView").findOnce(); 
		 sleep(1000);
	 }
	 toast("登陆退出,waitCount="+waitCount);
}


function  fillInviteCode(inviteCode)
{
	
	  if(!inviteCode)return;
	  //填邀请码：
	  var inviteBtn = id("et_input").findOnce();//输入邀请码
	  if(inviteBtn){
	     if(inviteBtn.click())
		 {
			sleep(1000);
			inviteBtn.setText(inviteCode);
			sleep(1000);
			commons.UIClick("iv_done");//领取
			sleep(2000);
		 }
	  }
      var btOk = id("bt_ok").findOnce();//确定 	
	  if(btOk)btOk.click();
	

}	
	  


function downloadProcess(appName)
{  
	commons.yingyongbao(appName);	
}
