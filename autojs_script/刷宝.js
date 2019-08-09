const commons    = require('common.js');
const templates  = require('template.js');
const runAppName = "刷宝"; 
const runAppName1= "刷宝短视频"; 
const runPkg      ="com.jm.video";

templates.init({
    appName:runAppName,
	runMode:"视频",
    indexFlagText:"首页",
});

templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
		
        return text("首页").findOnce();
    },
	
	//获取首页标志
    findIndexPage:function(){
      return findIndex();
    },
	
    //签到
    signIn:function(){ //刷宝签到改版以后是用android.webkit.WebView，暂时不能签
        /*
		toast("进入任务签到");
		//进入任务 
        var taskFlag=text("任务").findOnce();
        if(!taskFlag)return;
        click("任务");
        sleep(2000);
        //去掉广告
		var waitCunt=0;
		var animationView=id("imgClose").findOnce();
        while(!animationView && waitCunt<10){
              waitCunt++;
			  animationView=id("imgClose").findOnce();
			  sleep(1000);
        }
        if(animationView)animationView.click();
		sleep(1000);
        
		app.listNode(className("android.support.v4.view.ViewPager").findOnce(),0);
		
		//点击签到领红包
    	waitCunt=0;
	 	var signWebview=className("android.webkit.WebView").findOnce();
		while(!signWebview && waitCunt<15)
		{
			waitCunt++;
	    	signWebview=className("android.webkit.WebView").findOnce();
			sleep(1000); 
			
		}
 	   
	    //app.listNode(signWebview,0);
		sleep(5000);
		
		
		
		waitCunt=0
	    while(waitCunt<10)
		{
			waitCunt++;
			if(click("立即签到")){
			   sleep(2000);
			   break;
		    }
		}
        
		waitCount=0;
		if(click("开箱领元宝"))
		{
			var idClose = id("tt_video_ad_close").findOnce();
			while(!idClose && waitCount<30){
				waitCount++;
				idClose = id("tt_video_ad_close").findOnce();
				sleep(1000);
			}
		         	
		    if(idClose)idClose.click();
		
		}
	     	
	
		
	    //删除弹出界面
        //寻找“恭喜您获得”
		//var findWelcome=text("恭喜您获得").findOnce();
		animationView=id("imgClose").findOnce();
        if(animationView)animationView.click();
        sleep(500);
		
		//com.jm.video:id/tt_video_reward_container
		//com.jm.video:id/tt_video_ad_close
		
		//开箱领元宝
		//commons.UITextClick("开箱领元宝");
	    //sleep(1000);	
       
        //返回主页面
        click("首页");
        */
		
    },
    //找出视频
    findVideoItem:function(){  
        //检查首页是否注焦：
		if(!text("首页").findOnce()){  
		   back();
		   sleep(200);
		}
     	var videoItem = text("空空如也").findOnce();
	    return videoItem;
    },
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
       var btnView  =  id("btn_view").findOnce();
	   if(btnView)btnView.click();
	   
    },


	
    //阅读页面是否应该返回
    isShouldBack:function(){
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
	       utils.UIClick("tv_praise_text");//点赞

	   }
	   
	   return false;
    },
	getAppName:function(appName){
       return appName+"短视频";
    }
});

function findIndex(){

    return text("首页").findOnce();	
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

function loginDone()
{
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
	  wechatLogin();
	  
}

function wechatLogin(){
	 //微信一键登陆：
	 var pkg="com.tencent.mm";
	 var classTarget="android.widget.ScrollView";
	 var currentPkg= currentPackage();
	 if(currentPkg !=  pkg){
	     toast("非微信登陆界面");
		 return;
	 }
	 toast("点击微信登陆后,当前包名="+currentPkg);
	 
	 var rootNode = className("android.widget.LinearLayout").findOnce();
	                      
	 var classN=app.findSelfOfClass(rootNode,"android.widget.ScrollView");
	 toast("点击微信登陆后,classN 0="+(classN==null)?"null":classN.className());
	 var waitCount = 0;
	 while(!classN  && waitCount<20)
	 {
		waitCount++; 
		classN=app.findSelfOfClass(rootNode,"android.widget.ScrollView"); 
		sleep(1000);
	 }
	 toast("点击微信登陆后,classN 1="+(classN==null)?"null":classN.className());
	
	 waitCount = 0;		
	 while(classN && waitCount<20)
	 {
		 waitCount++; 
		 var agreeBtn  =  text("同意").findOnce();
	     if(!agreeBtn)agreeBtn=id("eb8").findOnce();
	     if(!agreeBtn)agreeBtn=text("确认登陆").findOnce();
	     if(!agreeBtn)agreeBtn=id("c1u").findOnce();
	     if(agreeBtn)agreeBtn.click();
		 classN=app.findSelfOfClass(rootNode,"android.widget.ScrollView"); 
		 sleep(1000);
	 }
	 toast("点击微信登陆后,classN 2="+(classN==null)?"null":classN.className());
	
	 toast("登陆退出,waitCount="+waitCount);
}

	  


function  fillInviteCode(inviteCode)
{
		 
	     //填邀请码：
	     toast("填邀请码，先到我的");
         waitIndex();
		 //进我的：
		 var indexBrn = text("我").findOnce();
	     if(indexBrn)
	     {
	  	    click("我");
	     }
	     sleep(2000);

		 
		 
		 var inviteBtn = text("填邀请码").findOnce();
		 if(!inviteBtn)return;
		 if(!inviteBtn.click())
		 {
            click("填邀请码");
		 }
         sleep(2000);
		 //android.webkit.WebView
		 currentClass=className("android.webkit.WebView").findOnce();
		 var waitCount = 0;
		 while(!currentClass  && waitCount<20)
		 {
			waitCount++; 
			currentClass=className("android.webkit.WebView").findOnce(); 
			sleep(5000);
		 }
	     waitCount = 0;		
		 while(currentClass && waitCount<20)
		 {
			waitCount++; 
			currentClass=className("android.webkit.WebView").findOnce(); 
			sleep(5000);
			toast("请手动填入邀请码：【 "+inviteCode+" 】，然后点提交");
		 }
	

}	

