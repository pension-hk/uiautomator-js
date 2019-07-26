const commons    = require('common.js');
const templates  = require('video.js');
const runAppName = "刷宝"; 
const runAppName1 = "刷宝短视频"; 


templates.init({
    appName:runAppName,
    indexFlagText:"首页",
});

templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
		
        return text("首页").findOnce();
    },
	
    //签到
    signIn:function(){
        toast("进入任务签到");
		//进入任务 
        var taskFlag=text("任务").findOnce();
        if(!taskFlag)return;
        click("任务");
        sleep(2000);
        //去掉广告
		var waitCunt=0;
		var animationView=id("imgClose").findOnce();
        while(!animationView && waitCunt<10){
              waitCunt++;
			  animationView=id("imgClose").findOnce();
			  sleep(1000);
        }
        if(animationView)animationView.click();
		sleep(1000);
        //点击签到领红包
    	var waitCunt=0;
	    var signAtonce=text("立即签到").findOnce();
		while(!signAtonce && waitCunt<10)
		{
			waitCunt++;
			signAtonce=text("立即签到").findOnce();
			if(!signAtonce)//commons.UITextClick("立即签到");
			{
			  var continueEarn=text("继续赚元宝").findOnce();
	          if(continueEarn)break;
			}
			else
			{
			  commons.UITextClick("立即签到");
              break;			  
			}
			sleep(1000); 
			
		}
	    //删除弹出界面
        //寻找“恭喜您获得”
		//var findWelcome=text("恭喜您获得").findOnce();
		animationView=id("imgClose").findOnce();
        if(animationView)animationView.click();
        sleep(500);
		
		//com.jm.video:id/tt_video_reward_container
		//com.jm.video:id/tt_video_ad_close
		
		//开箱领元宝
		//commons.UITextClick("开箱领元宝");
	    //sleep(1000);	
       
        //返回主页面
        click("首页");
        
    },
    //找出视频
    findVideoItem:function(){  
        //检查首页是否注焦：
		if(!text("首页").findOnce()){  //比如，东方头条推送弹窗
		   back();
		   sleep(200);
		}
     	var videoItem = text("空空如也").findOnce();
	    return videoItem;
    },
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
       var btnView  =  id("btn_view").findOnce();
	   if(btnView)btnView.click();
	   
    },


	
    //阅读页面是否应该返回
    isShouldBack:function(){
       var closeFlag= id("imgClose").findOnce();
       if(closeFlag){
          closeFlag.click();
	   }
	   return false;
    },
	getAppName:function(appName){
       return appName+"短视频";
    },
	
	download:function(appName){
		
		var appPackage=app.getPackageName(appName);
		if(!appPackage)appPackage=app.getPackageName(appName+"短视频");			
        if(!app.isAppInstalled(appPackage)){
            //toast(appName+"没有安装");
            downloadProcess(appName);
			return true;
        }
        else{
           //toast("appName="+appName+"已经安装");
		   return false;	
        }		
	}
});


function downloadProcess(appName)
{  
   
	//commons.yingyongbao(appName);
    //commons.install(appName);
   
    
}

