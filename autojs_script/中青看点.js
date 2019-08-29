const commons = require('common.js');
const templates = require('template.js');
const runAppName ="中青看点"; 
const runPkg     ="cn.youth.news";
const indexBtn    ="首页"
const indexBtn1    ="刷新";
const indexText   ="美文";
const indexText1  =null;


templates.init({
    appName:runAppName,
	packageName:runPkg,
  	indexBtnText:indexBtn,
	indexBtnText1:indexBtn1,
	indexFlagText:indexText,
	indexFlagText1:indexText1,
	timeAwardText:"领取"
});


templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
        return id("a0s").findOnce();
    },
	
    //签到
    signIn:function(){
        //进入我的
        app.dlog("签到......");
		popWindowProcess();
		var myFlag=id("a4a").findOnce();
        if(myFlag)myFlag=myFlag.parent();
        if(!myFlag){
		  app.dlog("找【我的】ID失败");
		  if(!click("我的"))
		  {
		     app.dlog("点[我的]失败");
		     return;
		  }
		}
		else
		 if(!myFlag.click() && !click("我的")){
		   app.dlog("点[我的id]与【我的】均失败");
		   return;
		 }
        sleep(1000);
        //去掉广告
        var animationView=id("animationView").findOnce();
        if(animationView)animationView.click();
        
        sleep(500);
        //进入任务中心
		app.dlog("进入任务中心......");
	    var taskCenter = text("任务中心").findOnce();
        if(taskCenter)taskCenter=taskCenter.parent();
        else 
		{
			app.dlog("找不到文本任务中心，尝试id");
		    taskCenter=id("iy").findOnce();
			if(taskCenter)taskCenter=taskCenter.parent();
		}
		if(taskCenter){
		  if(!taskCenter.click())
			  click("任务中心");
           sleep(5000);
		   app.dlog("点了任务中心"); 
        }
		else{
		   app.dlog("【任务中心】无可点的父节点，无法进入");
		}
		
        //点击签到领红包
		app.dlog("点击签到领红包");
		//等10秒:
		var waitCount=0;
		var classN=className("android.webkit.WebView").findOnce();
		while(!classN  &&  waitCount<10){
			waitCount++;
			classN=className("android.webkit.WebView").findOnce();
		    sleep(1000);
		}
		classN=className("android.webkit.WebView").findOnce();
		if(classN){
          
		  /*
          app.dlog("点击签到领红包,类="+classN.className());
          //if(!click("立即签到")){
		  if(!click("签到")){
		      app.dlog("点立即签到失败，尝试点看视频得青豆");
			   if(click("看视频得青豆")) 
			   {
		          app.dlog("等待看视频得青豆");
			      //5秒判断是否进入了看青豆广告界面 	  
				  waitCount=0;
				  classN=className("android.webkit.WebView").findOnce();
				  var flag=true;
				  while(flag && waitCount<15){
				     waitCount++;
					 flag=click("看视频得青豆");
					 sleep(1000);
				  }
				  waitPlayAd();
				  popWindowProcess();
			      
			   }
			   else
               app.dlog("点看视频得青豆失败");
			  				   
		  }	
		  else{
			  app.dlog("点立即签到OK");
		  }
		  */
		  if(!commons.clickWebViewText("android.widget.FrameLayout","签到")){
		      app.dlog("点签到失败，尝试点看视频得青豆");
			   if(click("看视频得青豆")) 
			   {
		          app.dlog("等待看视频得青豆");
			      //5秒判断是否进入了看青豆广告界面 	  
				  waitCount=0;
				  classN=className("android.webkit.WebView").findOnce();
				  var flag=true;
				  while(flag && waitCount<15){
				     waitCount++;
					 flag=click("看视频得青豆");
					 sleep(1000);
				  }
				  waitPlayAd();
				  popWindowProcess();
			      
			   }
			   else
               app.dlog("点看视频得青豆失败");
			  				   
		  }	
		  else{
			  app.dlog("点立即签到OK");
		  }
		  
		  
		}
        else  app.dlog("没有进入android.webkit.WebView");   		
		
		//累计阅读60分钟:
		award60Minutes();
		
		app.dlog("返回主页面");
	    //返回主页面
        //back();
		//sleep(1000);
        //back();
        //sleep(1000);
	   
		//回到新闻
		/*
        var indexId=id("a0s").findOnce();
		while(!indexId){
		   back();
		   sleep(1000);
		   popWindowProcess();
       	   indexId=id("a0s").findOnce();
		}
		if(indexId){
		   app.dlog("有首页ID a0s");
	       if(!indexId.click()){
			 app.dlog("点击ID失败");
			 if(!click("首页")){
			    app.dlog("点击首页失败,再点刷新");
				click("刷新"); 
			 }
	       }
		   
		}
		else{
			 app.dlog("没有首页ID a0s");
	      
		}
		*/

        var indexId=findIndex();
		while(!indexId){
		   back();
		   sleep(1000);
		   popWindowProcess();
       	   indexId=findIndex();//id("a0s").findOnce();
		}
		if(indexId){
		   app.dlog("有首页ID a0s");
	       clickIndex();
		   
		}
		else{
			 app.dlog("没有首页ID a0s");
	      
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
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,-1);
		return newsItem;
    },	
	findVideoItem:function(){
		var videoItem=null;
		var rootNode= className("android.support.v7.widget.RecyclerView").findOnce();
         //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		    videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,2);
		else videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,2);
	    return videoItem;
             		
    },
    getVideoTitle:function(videoItem){

        return videoItem.child(1).text();
	},		
	//跳到视频页面：
	jumpToVideo:function(){
	   var videoId  = id("a4f").findOnce();
	   if(!videoId)return false;
	   if(!videoId.click())
	      return click("视频");
	   return true;
    },

	//时段奖励之后执行
    doingAfterTimeAward:function(){
		//检查是否有弹窗：
         var adFlag= text("青豆奖励").findOnce();
         if(adFlag){
		    adFlag=adFlag.parent();
		    adFlag=findParentOfImagView(adFlag);
		    if(adFlag){
		         adFlag.click();
		    }
		   
		 }
  	
    },
	
    //阅读页面是否应该返回
    isShouldBack:function(){
		commons.clickWebViewText("android.widget.FrameLayout","查看全文，奖励更多")
		if(text("搜索").findOnce())return true; //带有搜索字样的页面，直接退出
		//推送处理：
        var viewText=text("查看详情").findOnce(); 
        if(viewText){
			click(立即查看); 
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
	popWindow:function(){
		
		popWindowProcess();
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

function award60Minutes(){
	
	swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 2000);
	sleep(1000);
	swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 2000);
	sleep(1000);
    swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 2000);
	sleep(1000);
	swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 2000);
	sleep(1000);
	
    if(!commons.clickWebViewText("android.widget.FrameLayout","立即阅读"))return;
	
	var waitCount=0;
	while(commons.clickWebViewText("android.widget.FrameLayout","点击领取")&& waitCount<3){
       waitCount++;
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
		
		adFlag=id("tt_video_ad_close").findOnce();
        if(adFlag){
            adFlag.click();
		}
	    
		adFlag=id("im").findOnce();
        if(adFlag){
            adFlag.click();
		}
		
		adFlag= text("点我继续赚青豆").findOnce();
		if(adFlag){
		   if(!adFlag.click() && !click("点我继续赚青豆")){
               commons.UIClick("jp");
		   }  		   
		}
    	else
		{
		  adFlag= text("青豆奖励").findOnce();
          if(adFlag){
		     adFlag=adFlag.parent();
		     //var count = adFlag.childCount();
		     //toast("青豆奖励:"+" child count="+count);
		     //for(var i=0;i<count;i++)
		     //{
		 	  //  var classN= adFlag.child(i);
              //  toast("className="+classN+" i="+i);  			  
			     
		     //}
		   
		     adFlag=findParentOfImagView(adFlag);
		     if(adFlag){
		       adFlag.click();
		     }
	   
		  }
     	}
		
		adFlag= text("查看详情").findOnce();
        if(adFlag){
		   if(!adFlag.click())
               click("查看详情"); 			   
		   
		   waitPlayAd();
		   back();
           sleep(1000);
		   
		}
		adFlag= desc("off").findOnce();
        if(adFlag){
		   adFlag.click();  
		   sleep(1000);
		   
		}
       
	    adFlag= text("青豆奖励").findOnce();
        if(!adFlag && id("jp").findOnce()){
		   commons.UIClick("jp");  //x
		}
		
	
		
}

function findIndex(){
	var indexW  = id("a0s").findOnce();
	var indexW1 = text(indexBtn).findOnce()||text(indexBtn1).findOnce()||text(indexText).findOnce()||text(indexText1).findOnce();
	return indexW && indexW1;
}

function clickIndex(){
	var flag=false;
	var clickW=id("a0s").findOnce();
    if(clickW)
	{  
       flag=clickW.click();
	   if(!flag && indexBtn)
		  flag=click(indexBtn);	
	   if(!flag && indexBtn1)
		  flag=click(indexBtn1);	
	   
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

function waitPlayAd()
{   
    app.dlog("检测是否广告界面");
 	var waitCount = 0;
	var  currentClass=className("android.webkit.WebView").findOnce();
	while(!currentClass  && waitCount<30)
	{
		waitCount++; 
		currentClass=className("android.webkit.WebView").findOnce(); 
		sleep(1000);
	}
	app.dlog("是广告界面");
 	
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
	app.dlog("退出广告");
	
}



function downloadProcess(appName)
{  
	commons.yingyongbao(appName);
    
}

function findParentOfImagView(node)
{
    return node.child(4);	
 	
}


