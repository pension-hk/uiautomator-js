const commons    = require('common.js');
const templates  = require('template.js');
const runAppName ="悦头条"; 
const runPkg      ="com.expflow.reading";

templates.init({
    appName:runAppName,
	indexBtnText:"头条",
    indexFlagText:"生活",
    timeAwardText:"阅读领取"	
});

templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
	    return findIndex();		
    },
		//获取首页标志
    findIndexPage:function(){
	  var result= findIndex();
      if(result)return result;
	  popWindowProcess();
      return findIndex();
    },
	
    //签到
    signIn:function(){
   	    //签到
		app.dlog("签到......");
		var taskText=text("任务").findOnce();
		if(taskText)taskText=taskText.parent();
		if(!taskText)return;
	    if(!taskText.click() && !click("任务"))return;
	    sleep(1000);
        if(text("已签到").findOnce()){
		   //回到新闻
     	   var textW=text("头条").findOnce(); 
		   if(!textW)textW=text("刷新").findOnce();
           if(textW)textW=textW.parent(); 
 		   if(textW)textW.click();
		   return;
		}
		commons.UITextClick("立即签到");
        sleep(2000);
        //立即领取
		var idClose = null;
		if(text("立即领取").findOnce()&&click("立即领取"))
		{
          var waitCount=0;
          idClose = id("tt_video_ad_close").findOnce();
		  while(!idClose&& waitCount<30)		
		  {
	         waitCount++;
			 idClose = id("tt_video_ad_close").findOnce();
             sleep(1000);			 
		  }
		}
		if(idClose){
		  idClose.click();
		  sleep(1000);
		}
		 
		idClose = id("iv_close").findOnce();
		if(idClose)idClose.click();
			
		//回到新闻
     	var textW=text("头条").findOnce(); 
		if(!textW)textW=text("刷新").findOnce();
        if(textW)textW=textW.parent(); 
 		if(textW)textW.click();
		toast("签到完成");
        
    },
    //找出新闻的条目
    findNewsItem:function(){
		var newsItem =null;
   	    var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	    //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		     newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0);
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2);
		if(!newsItem && !findIndex()) backToIndex();
		return newsItem;
	
		
    },
	
	findVideoItem:function(){
		//click("推荐");
		var videoItem=null;
		
		var rootNode= className("android.support.v7.widget.RecyclerView").findOnce();
    	app.listNode(rootNode,0);
    	videoItem=app.findNodeById(rootNode,"asr");
		if(videoItem.id() != null) videoItem=null;
	    return videoItem;
             		
    },
	
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
    	
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
		if(findIndex()) return true;
        jumpProc();   //跳转页面
        return false;
    },
	popWindow:function(){
	  popWindowProcess();
	
    }
});

function jumpProc(){
	
	
}

function popWindowProcess()
{
	var adFlag = id("iv_dismiss").findOnce(); //限时抢
    if(adFlag)adFlag.click();

    adFlag = id("iv_close").findOnce();
	if(adFlag)adFlag.click();
	
	var knowText=text("我知道了").findOnce(); //新版时段奖励
    if(knowText){
		click("我知道了");  
	}
	
	knowText=text("继续阅读").findOnce(); 
    if(knowText){
		click("继续阅读");  
	}
		
}

function findIndex(){

    var textW=text("头条").findOnce(); 
	if(!textW)textW=text("刷新").findOnce();
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
	//toast("没找到新闻");
	/*
    var currentPkgName=currentPackage();
			//toast("查找新闻发现打开了："+currentPkgName);
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
	   app.dlog("发现非主页，回退");
       back();
       sleep(1000);  	
	}
	
}





