const commons     = require('common.js');

const runAppName  ="超级淘"; 
const runPkg      ="com.lexiangquan.supertao";
const appName     =runAppName;
const appAlias    =null;

const indexBtn    ="取钱";//"生钱";
const indexBtn1   =null;
const indexText   ="可提现余额";//"让每天生的钱更多";
const indexText1  =null;//"可提现余额";

const indexBtnText=indexBtn;
const indexFlagText=indexText;
const indexBtnText1=indexBtn1;
const indexFlagText1=indexText1;

const timeAwardText = "领取"; 

var   totalNewsReaded=0;
var   totalNewsOneTime=20;
var   lastNewsText="";
var   loopTimeToFindNews=20;
  
 	wakeUp(); 
    var launched=app.launchApp(appName);
    if(!launched)
    {
         exit();
    }
    app.dlog(appName+"启动中......");
	waitForPackage(runPkg);
	waitFlag=true;
	var waitCount=0;
    while(waitFlag  && waitCount<10){
	     waitCount++;
	     if(findIndexPage())
	     {
		  	waitFlag=false;
	     }
	     else
	     sleep(1000);
    }	
	app.dlog(appName+"启动成功");
    //app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
    jumpToIndex();
    commons.clickTextById("生钱","icon_txt");	
	sleep(1000);

	app.dlog("点抢红包");
	
	if(commons.clickText("抢红包"))
	{
      app.dlog("点抢红包成功");
	  sleep(5000);
	  if(commons.clickText("进群抢红包")){
		 app.dlog("点进群抢红包成功");
		 sleep(5000);
         
		 waitCount=0;
		 var rootNode=className("android.widget.FrameLayout").findOnce();
		 var redItem =app.findNodeByText(rootNode,"已被抢光");
         if(redItem)app.dlog("找到已被抢光");
		 if(!redItem)
		 {
			redItem =app.findNodeByText(rootNode,"立即领红包");
          	if(redItem){
			   app.dlog("找到立即领红包:坐标="+redItem.bounds()+" 当前界面坐标="+rootNode.bounds());
			   var rootBounds=rootNode.bounds();
			   var  targetBounds=redItem.bounds();
			   app.dlog("util.clickText():查到的Y坐标="+targetBounds.centerY()
			         +" 当前界面Y坐标的中心位置="+rootBounds.centerY());
		   
			   if(!rootBounds.contains(targetBounds)||targetBounds.centerY()<rootBounds.centerY())
			   {
		          app.dlog("util.clickText():查到的坐标="+redItem.bounds()+"超出当前界面");
		          redItem=null;
			   }
			}
		 }
		 
		 while(!redItem && waitCount<10){
			waitCount++;
            if(!redItem){
			   swipe(device.width / 2, device.height * 0.5 ,
                           device.width / 2, device.height * 0.8, 1000);
			   sleep(3000);
			   redItem =app.findNodeByText(rootNode,"已被抢光");
               if(redItem)app.dlog("找到已被抢光");
			   if(!redItem){
			      redItem =app.findNodeByText(rootNode,"立即领红包");
          	      if(redItem){
					  app.dlog("1 找到立即领红包,坐标="+redItem.bounds()+" 当前界面坐标="+rootNode.bounds());
					  if(!rootNode.bounds().contains(redItem.bounds())){
		                 app.dlog("util.clickText():查到的坐标="+redItem.bounds()+"超出当前界面");
		                 redItem=null;
					  }
				  }
			   }
	           if(redItem && !redItem.bounds())redItem=null;
		  	  
			}
		 }
  		 if(waitCount>=10){
            app.dlog("搜索10次没有发现可抢的红包");
		 }
             			 
         if(redItem){
		    var bounds= redItem.bounds();
		    app.dlog("有可抢的广告红包坐标="+bounds);
            if(commons.boundsClick(redItem))
			{
              app.dlog("点击广告红包坐标="+bounds+"成功");
              sleep(2000);
			   if(commons.clickText("领平台福利红包")){
		          app.dlog("领平台福利红包成功");
				  sleep(1000);
				  commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close");
			
			   }
		       else
			   {
		          app.dlog("领平台福利红包失败");
		          back(); //去掉弹窗
				  sleep(1000);
			   }

		    }					
		
		  }				 
			  
	      back();//退出到进群抢红包 
		  sleep(1000);
	 		 
	  }		  
	  else
	      app.dlog("进群抢红包失败");
	  back();//返回入口 
	  sleep(1000);	 

	}
    else 	
	app.dlog("点抢红包失败");
	
	exit();
     
	
	
	
	
	
function wakeUp(){
   if(!device.isScreenOn()){gwm
   
        device.wakeUpIfNeeded();
    }
}	
 
function swapeToRead() 
{
   swipe(device.width / 2, device.height * 0.8 ,
        device.width / 2, device.height * 0.5, 1000);
   sleep(6000);		
}

/**
 * 跳转到首页
 * 1、返回和首页标识一起判断
 */
function jumpToIndex(){

    toast("跳转到首页......");
	var waitCount  =  0;
    var indexFlag = findIndexPage();
	while(!indexFlag && waitCount<10){
		waitCount++;
		toast("点击首页标识性文字");  
	   	var flag = clickIndexPage();
	    //执行返回
        if(!flag){
           //回退前检查目前运行的APP状况
		   var currentPkg=currentPackage();
		   app.dlog("找首页时，没有发现首页,back(),当前页面="+currentPkg);
           if(currentPkg==="org.yuyang.automake"||currentPkg.indexOf("launcher")>=0)
		   {
			  var launched=app.launchApp(appName);
		      if(!launched && appAlias != null)launched=app.launchApp(appAlias);
              if(!launched)
	          {
                 exit();
              }
           }
           else 
    	   if(currentPkg != runPkg){   
		        app.dlog("当前页面="+currentPkg+"非运行页面："+runPkg+",回退2次");
				back();
				sleep(200);
				back();
		   }
		   else
				back();
			   
        }
        sleep(1000);
        //重新取flag
        indexFlag = findIndexPage();
		if(!indexFlag){
			back();
			sleep(1000);
		}
	    indexFlag = findIndexPage();  
		
    }
	
	//toast("找首页时，waitCount="+waitCount);
    toast("已经到首页");  
	  
	if(waitCount>=10){
	   toast("找首页时，没有发现首页,连续返回5次都不起作用,退出!");
       exit(); 
    }
}





function  backToIndex(indexFlagText) {
    
	app.dlog("backToIndex start");
    if(desc(friendIndexPage).findOnce())return;	
	var runPkgName  = getPackageName(appName);	
	var indexBtn = desc(friendIndexPage).findOnce();
    var loop = 0;
    while(!indexBtn && loop<20 ){
		app.dlog("backToIndex...");
        loop++;
	    indexBtn=desc(friendIndexPage).findOnce();	
	    if(!indexBtn)
		{ 
		  var currentPkgName=currentPackage();
		  if(runPkgName  != null  && currentPkgName !=  runPkgName)
		  {
		     app.dlog("当前包不是运行包:"+currentPkgName+"，重启它");
		     app.launchApp(appName);	
             sleep(5000);
             indexBtn=desc(friendIndexPage).findOnce();	
	     			 
		  }
		  else
		  {
	          if(className("com.tencent.tbs.core.webkit.WebView").findOnce()
		         ||className("android.webkit.WebView").findOnce())
	          {
	     	     app.dlog("当前广告页，处理返回键");
	             var backTo = desc("返回").findOnce();
		         if(backTo)backTo=backTo.parent();
                 if(backTo){
		            app.dlog("处理【返回】键");
	                if(!backTo.click()&& !click("返回")){
		                app.dlog("点返回失败，改back()");
	               	    back();
						sleep(1000);
					}
					else{
						app.dlog("处理【返回】键成功");
						sleep(5000);
					}
	               
		         }
                 else
				 {
					app.dlog("找不到【返回】,back()");
	                back();   
                    sleep(1000); 
					
				 }					 
    
		       }
               else{
        		  app.dlog("当前非广告页，back()......");
	              back();   
                  sleep(5000);
				  indexBtn=desc(friendIndexPage).findOnce();	
	              sleep(1000);
				  
			   }				   
		  }
		  
		}
		else{
			
		   app.dlog("backToIndex: no action");
        
	    }
		
		

    }
}


//获取入口页标志
function findIndexPage()
{
    return findIndex();
}
function clickIndexPage()
{
	return clickIndex();
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
	var indexTextNode  =text(indexText).findOnce();
	var indexText1Node =text(indexText1).findOnce();
	if(indexBtNode || indexBtn1Node||indexTextNode||indexText1Node)flag=true;
	else flag=false;
    return flag;
}



function clickIndex(){
  	
    return commons.clickTextById(indexBtn,"icon_txt");
		
}
	

    


