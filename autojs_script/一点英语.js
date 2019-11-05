const commons       = require('common.js');

const readName      ="一点英语"; 

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
	 	app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
		//commons.jumpToWechatMyCllection();
		//commons.getResourceItem(readName);
	    break;
	 	
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




