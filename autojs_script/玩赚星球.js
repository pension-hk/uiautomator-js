const commons    = require('common.js');
const templates  = require('template.js');
const runAppName ="玩赚星球"; 
const runPkg      ="com.planet.light2345";
const indexBtn    ="头条"
const indexBtn1    =null;
const indexText   ="社会";
const indexText1  ="笑话";


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
	    return findIndex();		
    },
	
    //签到
    signIn:function(){
   	    commons.UITextClick("首页");
        sleep(1000);
        var signText = text("签到").findOnce(); 
        if(signText)signText=signText.parent();
        if(signText){
           if(!signText.click()){
			   if(!click("签到"))
				  commons.UIClick(home_sign_text);
           }
           popWindowProcess();		
        }			
	    sleep(1000);
        //回到新闻
     	var textW=text(indexBtn).findOnce(); 
        if(textW)textW=textW.parent(); 
 		if(textW)textW.click();
        
    },
    //找出新闻的条目
    findNewsItem:function(){
		app.dlog("找出新闻的条目");
		var newsItem =null;
   	    var rootNode = className("android.widget.ListView").findOnce();
        //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		     newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,-1);
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,-1);
		return newsItem;
		
    },
	/*
	findVideoItem:function(){
		var videoItem=null;
		var rootNode= className("android.support.v7.widget.RecyclerView").findOnce();
         //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		    videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,2);
		else videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,2);
	    return videoItem;
             		
    },
	*/
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
   	    //if(!findIndex()) 
		//    back();
    },

    //阅读页面是否应该返回
    isShouldBack:function(){
		//if(findIndex()) return true;
		//click("点击阅读全文"); 
	    commons.clickWebViewText("android.widget.FrameLayout","点击阅读全文")
			
	
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
		var adFlag = id("iv_close").findOnce();
        if(adFlag){
		   if(!adFlag.click()){
			   back();
			   sleep(1000);
		   }
		}
		
}

/*
function findIndex(){

    var textW=text(indexBtn).findOnce(); 
	if(textW)textW=textW.parent();
    return textW;	
}
*/

function findIndex(){
	var indexW  = text(indexBtn).findOnce()||text(indexBtn1).findOnce();
	var indexW1 = text(indexText).findOnce()||text(indexText1).findOnce();
	return indexW && indexW1;
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
	   //toast("发现webview界面，回退");
       back();
       sleep(1000);  	
	}
	
}


function waitPlayAd()
{        var  currentClass=className("android.webkit.WebView").findOnce();
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


