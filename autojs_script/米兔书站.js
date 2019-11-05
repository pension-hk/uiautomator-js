const commons       = require('common.js');

const readName      ="米兔书站"; 

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
		commons.jumpToAppletIndex();
		commons.getResourceItem(readName);
	    if(commons.text("首页")&&commons.findText("男生"))
		{
		   app.dlog("现在处于：首页");
		   commons.clickText("书架");
		   commons.waitText("详情",1);
	 	}
	    if(commons.findText("书架") && !commons.findText("男生"))
		{
		   app.dlog("现在处于：书架");
		   if(confirm("请对感兴趣的书点【详情。点【确定】实行")){
			   sleep(5000);
		   }
	 	      
	 	}
	    if(commons.findText("书籍详情") && commons.findText("开始阅读"))
		{
		   sleep(5000);
		   app.dlog("现在处于：书籍详情");
		   if(commons.findText("书籍详情") && commons.findText("开始阅读"))
		       commons.clickText("开始阅读");
	 	}
	    if(commons.findText("目录") && commons.findText("返回首页"))
		{
		   app.dlog("现在处于：阅读页面");
		   while(commons.findText("目录") && commons.findText("返回首页"))
		   {
			 app.dlog("现在处于：阅读......");
	 	     if(commons.findText("下一章"))
 		     {
			    sleep(3000);
		        if(commons.clickText("下一章"))
				   sleep(5000);  	
		     }
			 if(app.compareVersion()>=0)
             {
                commons.swapeToRead();
	
			 }		
			 			 
		   
		   }
		
		}
		
    	
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




