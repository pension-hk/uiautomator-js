const commons       = require('common.js');

const readName      ="番茄看看"; 
const resourceName  ="阅读A任务 - 番茄看看";
const resourceName1  ="助力阅读A - 番茄看看";

const runAppName    ="微信"; 
const runPkg        ="com.tencent.mm";

const indexBtn      ="微信";
const indexText     ="当前所在页面,阅读A任务 - 番茄看看";
const indexText1    ="当前所在页面,助力阅读A - 番茄看看";



const appName       =runAppName;
const indexBtnText  =indexBtn;
const indexFlagText =indexText;
const timeAwardText = "领取"; 
var   totalNewsReaded=0;
var   totalNewsOneTime=20;
var   lastRecourceText="";
var   loopTimeToFindResource=20;
var   nickName=null;
var   currentIndexPage = indexText;
var   currentIndexPage1 = indexText1;
    
	commons.wakeUp(); 
	var launched=app.launchApp(appName);
    if(!launched)
    {
       exit();
    }
    app.dlog(appName+"启动中......");
	waitForPackage(runPkg);
	app.dlog(appName+"启动成功");
 	/*
	if(currentPackage()==runPkg)
    {
	  var nickName=commons.getWechat("昵称");
	  var account=commons.getWechat("微信号");
	  app.dlog("nickName="+nickName+" account="+account);
      
	}
	exit();
	*/
	commons.wechatLogin();
	
	while(currentPackage()==runPkg)
	{   
    	app.dlog(appName+"/"+readName+"......");
		//app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
		commons.jumpToWechatMyCllection();
		getResourceItem();
	    
		if((commons.text(resourceName)
			||commons.text(resourceName1)
		    )
			&& commons.findText("开始阅读")
			&& !commons.findText("停止阅读") 
			
		)
		{
		   app.dlog(readName+"位于："+currentIndexPage+"&开始阅读");
           var flag=false;
		   var idClose=app.findNodeById(className("android.widget.FrameLayout").findOnce(),"closeTips",1);
		   if(idClose){
				//app.dlog("找到重要通知,idClose yes,bounds="+idClose.bounds());
				flag=commons.boundsClick(idClose);
		   }
		   sleep(1000);
		    	
		
		   if(commons.findText("下一批文章将在30分钟后到来")
			   ||commons.findText("你今天已达到任务上限，请明天再来")
		   )
		   {
              app.dlog(readName+"位于："+currentIndexPage+"&下一批文章将在30分钟后到来,退出本资源");
		      commons.backtoWechatMyCollection();
		      app.dlog("返回微信界面");
		      back();
		      sleep(1000);
		      break; 
    	   }
		   else
		   {
			   app.dlog(readName+"没有发现：下一批文章将在30分钟后到来");
    	       if(commons.clickText("开始阅读")){		  
		          app.dlog(readName+"已点开始阅读");
			      //sleep(5000);
			 	  //readNews();			
    	          //back();
		       }
		   }					  
	 	}
		if((commons.text(resourceName)|| commons.text(resourceName1))
			&& commons.findText("停止阅读"))
		{
		    app.dlog(readName+"位于：停止阅读");
	    	var waitCount=0;
			while(waitCount<10){
			   waitCount++;
			   if(!commons.findText("停止阅读"))break;
			   else sleep(1000);
			}
			readNews();			
    	    back();
			sleep(1000);
		}
		if((commons.text(resourceName)|| commons.text(resourceName1)) 
			&& commons.findText("立即收徒")
			&& commons.findText("好友助力")
		    )
		{
		   app.dlog(readName+"位于："+currentIndexPage+"&立即收徒&好友助力中,退出本资源");
		   commons.backtoWechatMyCollection();
		   app.dlog("返回微信界面");
		   back();
		   sleep(1000);
		   break; 
		}
		if((commons.text(resourceName)|| commons.text(resourceName1)) 
			&& commons.findText("暂无任务，请稍后再来")
		    )
		{
		   app.dlog(readName+"位于："+currentIndexPage+"&暂无任务，请稍后再来");
		   commons.backtoWechatMyCollection();
		   app.dlog("返回微信界面");
		   back();
		   sleep(1000);
		   break; 
		}
		if(commons.text("关注任务 - 番茄看看")
			&& commons.findText("暂无任务，请稍后再来")
		)
		{
		   commons.clickText("阅读A");
		   sleep(3000);	
		}
		if(commons.text("返回")  
			&& commons.text("更多")
            && commons.text("404 Not Found")		
			&& commons.isWebViewPage())
		{
		    app.dlog("404 Not Found，返回并退出");	
			app.dlog("返回微信界面");
		 	back();
	        sleep(1000);
		    break;	
		}
		if(commons.text("返回")  
			&& commons.text("更多")
            && commons.findText("您已被微信限制，暂无任务可做")		
			&& commons.isWebViewPage())
		{
		    app.dlog("您已被微信限制，暂无任务可做，返回并退出");	
			app.dlog("返回微信界面");
		 	back();
	        sleep(1000);
		    break;	
		}
		
		if((commons.text("返回")  && commons.text("更多") && commons.isWebViewPage())
				   && !commons.findText("立即收徒")
			       && !commons.findText("好友助力")
			       && !commons.findText("开始阅读")
				   && !commons.findText("停止阅读")
		)
		{
		    app.dlog("不知在什么界面，返回");
		    readNews();			
  	        back();
		}
	    
	 	
	}
	back();
	sleep(1000);	
    app.dlog("退出"+readName+"！！！");
	exit();

	


	

function getResourceItem()
{
    app.dlog("开始获取资源......");
    if(!commons.text("我的收藏")){
	    app.dlog("开始获取资源,没有我的收藏，退出");
		return;
	}
	app.dlog("开始在【我的收藏】获取【"+resourceName+"】......");
	//上滑找资源
	var flag=false;
    var isFindItem = false;//是否找到资源
    var resourseItem=null;
    var loopTimeToFindResource = 0;//循环次数
	var lastRecourceText=null;
	var recourceText=null;
	var tmpResourceName= null;
    while((!isFindItem || lastRecourceText === recourceText)  && loopTimeToFindResource < 20)
	{
        loopTimeToFindResource++;
		//app.dlog("loopTimeToFindResource="+loopTimeToFindResource);
		//app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
        tmpResourceName=resourceName;
		resourceItem = app.findNodeByText(className("android.widget.FrameLayout").findOnce(),tmpResourceName);
   	    if(!resourceItem){
           tmpResourceName=resourceName1;
		   resourceItem = app.findNodeByText(
	                             className("android.widget.FrameLayout").findOnce(),tmpResourceName);
   		}
		if(resourceItem)
		{  /*
		   var count=resourceItem.childCount();
		   for(var i=0;i<count;i++)
		   {
			  var childNode=resourceItem.child(i);
			  if(!childNode)continue;
			  var textS=childNode.text();
			  app.dlog("i="+i+" textS="+textS);
		   }
		   */
		   isFindItem=true;
        }
		else{ 		
		  //进行下翻
		  app.dlog("未找到"+tmpResourceName+",进行下翻");
    	  if(app.compareVersion()>=0){
            swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
    	    sleep(1000);
		  }
		  else 
		  {
		      app.dlog("6.0不能下翻，手动翻吧!");
    		  sleep(5000);
		  }
		  if(!commons.text("我的收藏")){
	          app.dlog("获取资源时,没有【我的收藏】，怎么办？");
		      return;
	      }
        }
    }
    
    if(isFindItem){
		lastRecourceText = tmpResourceName;
        app.dlog("找到资源，请阅读："+tmpResourceName);
  	    var flag=false;
		if(resourceItem)
		{
		   flag=commons.boundsClick(resourceItem);
		   
		   if(!flag && app.compareVersion()<0)
		   {
		      flag=commons.clickText(tmpResourceName);
		   }
	  
		}
	   
  	    if(flag){
		  app.dlog("找到资源，已点击进入");
        }
		else{
		  app.dlog("找到资源，点击未进入");
		  sleep(5000);
    	}
		
    }else{
        toast("20次滑动没有找到资源，请检查!");
	    exit();
    }

	
}

function readNews(){
	var seconds=10+random(1,9);
	app.dlog("阅读文章时间="+seconds+"秒");
 	for(var i = 0 ;i < seconds ;i++)
	{
        sleep(1000);
    }
}





