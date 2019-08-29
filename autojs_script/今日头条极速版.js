const commons    = require('common.js');
const templates  = require('template.js');
const runAppName ="今日头条极速版"; 
const runPkg      ="";
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
	

});

templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
	    return findIndex();		
    },
	
    //签到
    signIn:function(){
   	  if(!click("任务"))return;
	  sleep(1000);
	  if(!className("android.webkit.WebView").findOnce()){
		click(indexText);     
		return;  
	  }
	  //看视频再领1500金币
	  if(!click("看视频再领1500金币"))
	  {
		  back();
		  sleep(1000);
		  click("首页");
		  return;
	  }
	  waitPlayAd();
	  
      click("首页");
	    
    },
    //找出新闻的条目
    findNewsItem:function(){
		app.dlog("找出新闻条目");
		var newsItem =null;
   	    var rootNode = className("android.widget.TabHost").findOnce();
	    //app.findNodeTest(rootNode,0,0);
		//app.listNode(rootNode,0);
		if(app.compareVersion()>=0)
		     newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,10);
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,10);
		return newsItem;
		
    },
	/*
	findVideoItem:function(){
	    var videoItem=null;
		var rootNode= className("android.widget.FrameLayout").findOnce();
        app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		    videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,16);
		else videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,16);
	    return videoItem;
             		
    },
	*/
	getVideoTitle:function(videoItem){
        return videoItem.child(1).text();
	},
	
	 //跳到视频页面：
	jumpToVideo:function(){
	   var videoId  = text("视频").findOnce();
	   if(!videoId)return false;
	   videoId = videoId.parent();
	   if(videoId && !videoId.click())
	      return click("视频");
	   else return true;
    },
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
   	    if(!findIndex()) 
		    back();
    },
  
    //阅读页面是否应该返回
    isShouldBack:function(){
		//click("点击阅读全文");  //
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
	popWindow:function(){
	 
      popWindowProcess();
	
    }
});


function popWindowProcess()
{
	 var popFlag = id("a1s").findOnce();
	 if(popFlag)popFlag.click();
     popFlag = text("允许").findOnce();  //授权
	 if(popFlag && !popFlag.click())click("允许");
	 popFlag = text("确定").findOnce();  //授权
	 if(popFlag && !popFlag.click())click("确定");
	 
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
      back();
       sleep(1000);  	
	}
	
}


function waitPlayAd()
{   var  adClose=text("关闭广告").findOnce();
    var waitCount = 0;
	while(!adClose  && waitCount<30)
    {
		waitCount++; 
		adClose=text("关闭广告").findOnce();
		sleep(1000);
    }
	adClose = text("关闭广告").findOnce();
	if(adClose&&!adClose.click())
		click("关闭广告");
	
}


