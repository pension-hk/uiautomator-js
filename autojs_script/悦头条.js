const commons    = require('common.js');
const templates  = require('template.js');
const runAppName ="悦头条"; 
const runPkg      ="com.expflow.reading";
const indexBtn    ="头条";
const indexBtn1   ="刷新";
const indexText   ="生活";
const indexText1  ="时尚";

templates.init({
    appName:runAppName,
	packageName:runPkg,
	indexBtnText:indexBtn,
	indexBtnText1:indexBtn1,
	indexFlagText:indexText,
	indexFlagText1:indexText1,
    timeAwardText:"阅读领取"	
});

templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
	    return findIndex();		
    },
	
    //签到
    signIn:function(){
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
		app.dlog("找出新闻条目");
		var newsItem =null;
   	    var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	    //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		     newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,-1);
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,-1);
		return newsItem;

		
    },
	/*
	findVideoItem:function(){
	    var videoItem=null;
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
 		//back();
    },
  
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
		if(viewMode=="video"){
		   return false;
		}
		click("点击阅读全文");
        jumpProc();   //跳转页面
        return false;
    },
	findIndexPage:function()
	{
		return findIndex();
	},
	checkIsAppPage:function()
	{
		return isAppPage();  //如果是，不要back();
	},
	clickIndexPage:function()
	{
		return clickIndex();
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





