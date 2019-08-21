const commons    = require('common.js');
const templates  = require('template.js');
const runAppName ="今日头条极速版"; 
const runPkg      ="";
const indexBtn     ="首页";
const indexText    ="首页";



templates.init({
    appName:runAppName,
	//indexBtnText:indexBtn,
	indexFlagText : indexText,
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
	
	findVideoItem:function(){
		var videoItem=null;
		var rootNode= className("android.support.v7.widget.RecyclerView").findOnce();
    	app.listNode(rootNode,0);
    	videoItem=app.findNodeById(rootNode,"asr");
		if(videoItem.id() != null) videoItem=null;
	    return videoItem;
             		
    },
	
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
   	    if(!findIndex()) 
		    back();
    },
    //跳到视频页面：
	jumpToVideo:function(){
	   var videoId  = text("视频").findOnce();
	   if(!videoId)return false;
	   if(!videoId.click())
	      return click("视频");
	   return true;
	 
	 	   
    },
    //阅读页面是否应该返回
    isShouldBack:function(){
		//click("点击阅读全文");  //
       return false;
    },
	popWindow:function(){
	 
      popWindowProcess();
	
    }
});


function popWindowProcess()
{
	 var popFlag = id("a1s").findOnce();
	 if(popFlag)popFlag.click();

}

function findIndex(){

    var textW=text(indexText).findOnce(); 
    if(textW)textW=textW.parent();
    return textW;	
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


