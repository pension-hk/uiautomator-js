const commons       = require('common.js');

const readName      ="66阅读"; 

const runAppName    ="微信"; 
const runPkg        ="com.tencent.mm";

const indexBtn      ="微信";
const indexText     ="当前所在页面,66阅读";



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
		commons.getResourceItem(readName);
	    if(commons.text(currentIndexPage) && commons.findText("马上阅读赚钱"))
		{
		   app.dlog(readName+"位于："+currentIndexPage+"&马上阅读赚钱");
		   if(commons.clickText("马上阅读赚钱")){
		      app.dlog(readName+"已退出马上阅读赚钱");
			  sleep(5000);
		   }
		   
	 	}
        if(commons.text("阅读文章") 
			&& commons.findText("开始阅读"))
		{
		   app.dlog(readName+"位于："+currentIndexPage+"阅读文章&开始阅读");
    	   if(commons.clickText("开始阅读")){		  
		      app.dlog(readName+"已点开始阅读");
		   }
									  
	 	}
		if(commons.text(currentIndexPage) && commons.findText("停止阅读"))
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
		if(commons.findText("文章更新中")||commons.findText("长按识别二维码，关注公众号不失联"))
		{
		   app.dlog(readName+"位于："+currentIndexPage+"&文章更新中,退出本资源");
		   commons.backtoWechatMyCollection();
		   app.dlog("返回微信界面");
		   back();
		   sleep(1000);
		   break; 
		}
	    if((commons.text("返回")  && commons.text("更多") && commons.isWebViewPage())
				   && !commons.findText("马上阅读赚钱")
			       && !commons.findText("开始阅读")
				   && !commons.findText("停止阅读")
		)
		{
		    app.dlog("不知在什么界面，返回");
		    readNews();			
  	        back();
		}
		//else
		//	app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	
	 	
	}
    back();
	sleep(1000);
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




