const commons    = require('common.js');
const templates  = require('template.js');
const runAppName ="闪电盒子"; 
const runPkg      ="c.l.a";

templates.init({
    appName:runAppName,
	packageName:runPkg,	
	indexBtnText:"首页",
    indexFlagText:"首页",	
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
        commons.UITextClick("任务");
        sleep(2000);
   
   
        //返回主页面
        sleep(5000);
        //回到新闻
     	var textW=findIndex(); 
        if(textW)textW.click();
        
    },
    //找出新闻的条目
    findNewsItem:function(){
		app.dlog("找出新闻的条目");
		var newsItem =null;
   	    var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	    //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		     newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,-1);
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,-1);
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
	   return false;
    },
	popWindow:function(){
	 
      popWindowProcess();
	
    }
});


function popWindowProcess()
{
	
		
}

function findIndex(){

    var textW=text("首页").findOnce(); 
    if(textW)textW=textW.parent();
    return textW;	
}


function  backToIndex()
{
	toast("没找到新闻,检查是否在首页......");
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
    
	popWindow();
	
	if(!findIndex())
	{
	   toast("不在首页，回退");
       
	   back();
       sleep(1000);  	
	}
	
}


