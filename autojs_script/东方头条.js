const commons    = require('common.js');
const templates  = require('template.js');
const runAppName ="东方头条"; 
const runPkg      ="com.songheng.eastnews";
const indexBtn    ="新闻";
const indexBtn1    ="刷新";
const indexText   ="发布";
const indexText1  ="扫一扫";

templates.init({
    appName:runAppName,
	packageName:runPkg,
	indexBtnText:indexBtn,
	indexBtnText1:indexBtn1,
	indexFlagText:indexText,
	indexFlagText1:indexText1,
});


templates.run({
    
    //获取首页按钮,不可以删除！
    getIndexBtnItem:function(){
	    var textW=text(indexBtn).findOnce(); 
	    if(!textW && indexBtn1)textW=text(indexBtn1).findOnce();
        if(textW)textW=textW.parent();
        return textW;
    },

    //签到
    signIn:function(){
   	    if(text("立即登陆").findOnce()){
			toast("没有登陆，请登陆！");
			exit();
		}
		else
		{
		  if(text("去签到").findOnce()){ 
		     //签到
             commons.UITextClick("去签到");
              sleep(2000);
             //删除弹出界面
        
             //返回主页面
        
             sleep(5000);
             //回到新闻
			 clickIndex();
     		 return;
          }
		  app.dlog("没有去签到字样，需检查是否登陆");
          commons.UITextClick("我的");
          var waitCount=0;
		  while(waitCount<5){
			 waitCount++;
			 popWindowProcess();
			 sleep(1000);
		  }
		  
		  //var rootNode=className("android.widget.FrameLayout").findOnce();
          //var ifItem=app.findNodeByClassByText(rootNode,"android.view.View","登陆领金币",0,0,-1);
	      //if(ifItem)
		  if(text("点击登录").findOnce())
		  {
		     toast("没有登陆，请登陆！");
			 exit();
		  }
		  else{
		     app.dlog("好像登陆了");
             //回到首页
     	     //var textW=findIndex(); 
		     //if(textW)textW.click();
		  	 clickIndex();  
		  }
		  
		  
		}
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
	/*
	// 东方头条找不到视频？
	findVideoItem:function(){
	    var videoItem=null;
		var rootNode= className("android.widget.FrameLayout").findOnce();
        app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		    videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,15);
		else videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,15);
	    return videoItem;
             
		 
    },
	*/
	getVideoTitle:function(videoItem){

        return videoItem.child(0).text();
	},
	
	 //跳到视频页面：
	jumpToVideo:function(){
	   var videoId  = text("视频").findOnce();
	   if(!videoId)return false;
	   if(!videoId.click())
	      return click("视频");
	   return true;
    },
	//时段奖励之后执行
    doingAfterTimeAward:function(){
   	    //if(!findIndex()) 
		//    back();
    },
   
    //阅读页面是否应该返回
    isShouldBack:function(){
		//clickReadAll();
		
    	//要文推送
        var adFlag = text("立即查看").findOnce();
        if(adFlag){
		    adFlag=adFlag.click();
		    if(!adFlag)adFlag=click("立即查看"); 
		    if(adFlag){
               sleep(5000);
			   back();
			   sleep(500);
			}
 	    }
		
		if(currentPackage()==="com.android.packageinstaller")
		{
			var textNo=text("禁止").findOnce();
			if(textNo && !textNo.click()){
				click("禁止");
			}
			else back();
		    sleep(1000);
			return true;
		}
        /*
		adFlag=text("禁止").findOnce();
	    if(adFlag){
            adFlag.click();
			return  true;
        }
		*/
	    adFlag=text("立即下载").findOnce();
	    if(adFlag){
       	   return  true;
        }
		
		adFlag=id("tt_video_ad_close").findOnce();
		if(adFlag){
            adFlag.click();
			return  true;
        }
	    
		//东方头条无响应。。。。。。
		adFlag=text("确定").findOnce();
		if(adFlag){
            if(!adFlag.click())click("确定");
			return  true;
        }
		
		//com.android.packageinstaller
		if(currentPackage()==="com.android.packageinstaller"){
           if(text("取消").findOnce())click("取消");		
 			return  true;
    	}
		
		var coinDouble=text("金币翻倍x2倍").findOnce();//金币翻倍奖励
		if(coinDouble){
		   click("金币翻倍x2倍");
		   sleep(1000);
		   waitPlayAd();
		   
		}
		//阅读中
		//click("点击查看原文");
		var  flag=false;
		var clickView=text("点击阅读全文").findOnce();
		if(clickView  && clickView.parent())flag=clickView.parent().click();
		if(!flag)flag=click("点击阅读全文");
		if(!flag){
		  clickView=text("点击查看原文").findOnce();
		  if(clickView  && clickView.parent())flag=clickView.parent().click();
		  if(!flag)flag=click("点击查看原文");
		}
	    return false;
    },
	findIndexPage:function()
	{
		return findIndex();
	},
	clickIndexPage:function()
	{
		return clickIndex();
	},
	popWindow:function()
	{
	 
      popWindowProcess();
	
    },
	waitRefresh:function(){
       
	   var waitCount=0;
       while(waitCount<5)
	   {
		   waitCount++;
		   if(text("刷新中...").findOnce())break;
		   sleep(1000);
	   }
	   //app.dlog("退出刷新中waitCount="+waitCount);
	   waitCount=0;
	   while(waitCount<5)
	   {
	 	   waitCount++;
		   if(text("下拉刷新").findOnce())break;
		   sleep(1000);
	   }
	   //app.dlog("0 退出下拉刷新waitCount="+waitCount);
	   
	   var  textRef=text("下拉刷新").findOnce();
	   waitCount=0;
	   while(textRef && waitCount<5)
	   {
		   waitCount++;
		   textRef=text("下拉刷新").findOnce();
		   sleep(1000);
	   }
	  
	   
	 
	  
    }
});


function popWindowProcess()
{
		var adFlag = id("aa3").findOnce();
        if(adFlag){
           back();
           sleep(1000);
     	}
		
	    adFlag = id("ab0").findOnce();
        if(adFlag){
           back();
		   sleep(1000);
	    }
		
		//关闭微信提现提示窗
        adFlag = id("a_y").findOnce();//"a_y";//提现到微信ID
        if(adFlag){
            back();
			sleep(1000);
        }
    
	    //东方头条无响应。。。。。。
		adFlag=text("确定").findOnce();
		if(adFlag){
            if(!adFlag.click())click("确定");
	    }
	
	
	    /*
        //关闭要闻推送
        adFlag = text("忽略").findOnce();
        if(adFlag){
            adFlag.click();
        }
		*/
       
	    //要文推送
        adFlag = text("立即查看").findOnce();
        if(adFlag){
            if(adFlag.click()){
               sleep(2000);
			   back();
			   sleep(500);
			}
 	    }
	   
        //处理回退提示
        var backTip = text("继续赚钱").findOnce();
        if(backTip){
            backTip.click();
        }
		
		var videoAd = id("tt_video_ad_close").findOnce();
        if(videoAd){
            videoAd.click();
        }
	    
	 
		
		var coinTip = id("ax3").findOnce(); //立即领取
		if(coinTip)coinTip.click();
		
		//升级处理：
		var upgradeP = text("立即安装").findOnce(); //立即安装
		if(upgradeP){
		   back();
		   sleep(1000);
		}
		//东方头条 无响应。是否将其关闭？
		var closeApp = text("关闭应用").findOnce();
		if(closeApp){
			if(!closeApp.click()){
			   click("关闭应用");
			}
		}
	
	   //立即领取 > (金币翻倍x2倍)
	    var coinDouble=text("金币翻倍x2倍").findOnce();//金币翻倍奖励
		if(coinDouble){
		   click("金币翻倍x2倍");
		   sleep(1000);
		   waitPlayAd();
		}
	
	    /*     
	    //处理时段奖励提醒，这里只能回退
        var timeAward = text("立即领取").findOnce(); //"立即领取";//时段奖励领取提醒
        if(timeAward){
            back();
			sleep(500);
        }
		*/
		//var coinTip = id("ax3").findOnce(); //立即领取 金豆奖励提醒
		//if(coinTip)coinTip.click();
		
		//立即领取 金豆奖励提醒
		var coinTip = text("立即领取").findOnce(); //立即领取 金豆奖励提醒
		if(coinTip)click("立即领取");
		
		if(currentPackage()==="com.android.packageinstaller")
		{
			var textNo=text("禁止").findOnce();
			if(textNo && !textNo.click())click("禁止");
		}
		
		
		
}

function findIndex(){
    var textW=text(indexBtn).findOnce()||text(indexBtn1).findOnce(); 
    var textW1=text(indexText).findOnce()||text(indexText1).findOnce();
	return textW && textW1;
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

function clickReadAll()
{
    app.dlog("clickReadAll");
    //if(click("点击查看全文"))return;	
	if(click("点击阅读全文"))return;	
	
	var rootNode=className("android.widget.FrameLayout").findOnce();
    //app.findNodeTest(rootNode,0,0);
	//android.view.View
	//if(className("android.view.View").findOnce())
	var newsItem=app.findNodeByClassByText(rootNode,"android.view.View","点击阅读全文",0,0,-1);
	if(newsItem){app.dlog("点击阅读全文，点击");click("点击阅读全文");}
    //else 
	//newsItem=app.findNodeByClassByText(rootNode,"android.view.View","点击查看全文",0,0,-1);
	//if(newsItem){app.dlog("点击点击查看全文，点击");click("点击查看全文");}	
	
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
	ucMobile();
	popWindowProcess();
	if(!findIndex())
	{
	   //toast("发现webview界面，回退");
       back();
       sleep(1000);  	
	}
	
}


function waitRefresh()
{
    app.dlog("等待刷新......");
	var  waitCount=0;
	var textFlag=text("刷新中…").findOnce(); //刷新中…
	while(!textFlag && waitCount<10){
		  waitCount++;
		  textFlag=text("刷新中…").findOnce();
		  sleep(1000);
	}
	app.dlog("刷新退出 0：textFlag="+textFlag+" waitCount="+waitCount);
    while(textFlag && waitCount<10){
		waitCount++;
		textFlag=text("刷新中…").findOnce();
		sleep(1000);
	}
	app.dlog("刷新退出 1：textFlag="+textFlag+" waitCount="+waitCount);
		
}

function waitPlayAd()
{         //com.songheng.eastnews:id/tt_video_reward_container
		   //com.songheng.eastnews:id/tt_video_ad_close
		 var  currentClass=className("android.webkit.WebView").findOnce();
		 var waitCount = 0;
		 while(!currentClass  && waitCount<30)
		 {
			waitCount++; 
			currentClass=className("android.webkit.WebView").findOnce(); 
			sleep(1000);
		 }
		 waitCount = 0;
		 while(currentClass  && waitCount<30)
		 {
			waitCount++; 
			var adClose = id("tt_video_ad_close").findOnce();
			if(adClose)
			{
			   adClose.click();
			   break;
			}
			currentClass=className("android.webkit.WebView").findOnce(); 
			sleep(1000);
		
		 }
	
	
}


