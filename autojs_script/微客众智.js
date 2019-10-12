const commons       = require('common.js');

const readName      ="微客众智"; 

const runAppName    ="微信"; 
const runPkg        ="com.tencent.mm";

const indexBtn      ="微信";
const indexText     ="当前所在页面,任务大厅";



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


    commons.wakeUp(); 
	var launched=app.launchApp(appName);
    if(!launched)
    {
       exit();
    }
    app.dlog(appName+"启动中......");
	waitForPackage(runPkg);
	app.dlog(appName+"启动成功");
	commons.wechatLogin();
	
	while(currentPackage()==runPkg)
	{   
    	app.dlog(appName+"/"+readName+"......");
	 	//app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
		commons.jumpToWechatMyCllection();
		commons.getResourceItem("任务大厅");
	    		
        if(commons.text("任务大厅") && commons.findText("会员中心"))
		{
		   app.dlog(readName+"位于："+currentIndexPage+"&会员中心");
		   if(commons.clickText("会员中心")){
		      app.dlog(readName+"已点击会员中心");
			  sleep(5000);
		   }
		   
	 	}
        		
        if(commons.text("用户信息") 
			 && commons.findText("阅读")
	         && commons.findText("会员")
		)
		{
		   app.dlog(readName+"位于："+"用户信息"+"&阅读&会员");
		   if(commons.clickText("阅读")){
		      app.dlog(readName+"已点击阅读");
			  sleep(5000);
		   }
		   
	 	}
		
        if(commons.text("阅读文章") 
		   &&commons.findText("阅读")
		   &&commons.findText("会员")
	       && commons.findText("开始阅读")
		 
		)
		{
		   app.dlog(readName+"位于："+currentIndexPage+"阅读文章&开始阅读");
    	   if(commons.clickText("开始阅读")){		  
		      app.dlog(readName+"已点击开始阅读");
			  sleep(5000);			  
			  readNews();			
    	      back();
		   }
									  
	 	}
		
		if(commons.text("阅读文章") && commons.findText("停止阅读"))
		{
		    app.dlog(readName+"位于：停止阅读");
	    	var waitCount=0;
			while(commons.findText("停止阅读") && waitCount<10){
			   waitCount++;
			   if(!commons.findText("停止阅读"))break;
			   else sleep(1000);
			   app.dlog(readName+"位于：停止阅读 waitCount="+waitCount);
	     	}
		    readNews();			
    	    back();
		}
		else
		if(commons.text("阅读文章")
		   &&commons.findText("阅读")
		   &&commons.findText("会员")
	       && !commons.findText("开始阅读")
		   && !commons.findText("停止阅读")
	
		)
		{
		   app.dlog(readName+"位于："+"阅读文章&阅读&会员&留言&劳逸结合...,退出本资源");
		   commons.backtoWechatMyCollection();
		   app.dlog("退出"+readName+"成功！");
		   exit();
		   break; 
		}
		else
		if(commons.text("阅读文章")
		   &&commons.findText("阅读")
		   &&commons.findText("会员")
	       && commons.findText("今日任务已完成")
		)
		{
		   app.dlog(readName+"位于："+"阅读文章&阅读&会员&留言&今日任务已完成...,退出本资源");
		   commons.backtoWechatMyCollection();
		   app.dlog("退出"+readName+"成功！");
		   exit();
		   break; 
		}
	    else
		if((commons.text("返回")  && commons.text("更多") && commons.isWebViewPage())
			 	   && !commons.text("任务大厅")
			       && !commons.text("阅读文章")
			       && !commons.text("用户信息")
			       //&& !commons.findText("阅读")
			       //&& !commons.findText("会员")
		)
		{
		    app.dlog("不知在什么界面，返回");
		    readNews();			
  	        back();
		}
		//else
		//	app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	
	 	
	}
    app.dlog("退出"+readName+"！！！");
	exit();





function getResourceItem()
{
	
}

function readNews(){
	var seconds=10+random(1,9);
	app.dlog("阅读文章时间="+seconds+"秒");
 	for(var i = 0 ;i < seconds ;i++)
	{
        sleep(1000);
    }
}




