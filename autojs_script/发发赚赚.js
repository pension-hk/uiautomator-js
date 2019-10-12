const commons       = require('common.js');

const readName      ="发发赚赚"; 

const runAppName    ="微信"; 
const runPkg        ="com.tencent.mm";

const indexBtn      ="微信";
const indexText     ="当前所在页面,阅读文章";



const appName       =runAppName;
const indexBtnText  =indexBtn;
const indexFlagText =indexText;
const timeAwardText = "领取"; 
var   totalNewsReaded=0;
var   totalNewsOneTime=20;
var   lastNewsText="";
var   loopTimeToFindNews=20;
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
		commons.getResourceItem("阅读任务入口");
	
	    if(commons.text(currentIndexPage) && commons.findText("马上阅读赚钱"))
		{
		   app.dlog(readName+"位于："+currentIndexPage+"&马上阅读赚钱");
		   if(commons.clickText("马上阅读赚钱")){
			  sleep(5000);       
		   }
		   
	 	}
	    if(commons.findText("开始阅读") && !commons.findText("复制"))
		{
		   app.dlog(readName+"位于："+currentIndexPage+"开始阅读");
    	   sleep(5000);
		   if(commons.clickText("开始阅读")){
	         app.dlog(readName+"已退出开始阅读");
		     var seconds=10+random(1,9);
		     app.dlog("阅读文章时间="+seconds+"秒");
             readNews();			
    	     back();
		   }
	 	}
		if(commons.findText("停止阅读"))
		{
		    app.dlog(readName+"位于：停止阅读");
	    	var waitCount=0;
		    while(waitCount<10){
			   waitCount++;
			   if(!commons.findText("停止阅读"))break;
			   else sleep(1000);
			   app.dlog(readName+"位于：停止阅读 waitCount="+waitCount);
	
			}
		    readNews();			
    	    back();
			
		}
		if(commons.findText("开始阅读") && commons.findText("复制"))
		{
		   app.dlog(readName+"位于："+currentIndexPage+"&开始阅读和复制,退出本资源");
		   commons.backtoWechatMyCollection();
		   app.dlog("退出"+readName+"成功！");
		   exit();
		   break; 
		}
		if((commons.text("返回")  && commons.text("更多") && commons.isWebViewPage())
			       && !commons.findText("开始阅读")
				   && !commons.findText("停止阅读")
		)
		{
		    app.dlog("不知在什么界面，返回");
		 	readNews();
		    back();
		}
	 	
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




