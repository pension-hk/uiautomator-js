const commons = require('common.js');
const templates = require('template.js');


templates.init({
    appName:"中青看点",
    indexFlagText:"美文",
});

templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
        return id("tv_home_tab").findOnce();
    },
	
    //签到
    signIn:function(){
        //进入我的
        //click(1079,1919);
        var myFlag=id("tv_user_tab").findOnce();
        if(myFlag)myFlag=myFlag.parent();
        if(myFlag)myFlag.click();
        sleep(2000);
        //去掉广告
        var animationView=id("animationView").findOnce();
        if(animationView)animationView.click();
        
        sleep(500);
        //进入任务中心
        var taskCenter = text("任务中心").findOnce();
        if(taskCenter){
            commons.boundsClick(taskCenter);
            sleep(5000);
        }
        //点击签到领红包
        commons.UITextClick("立即签到");
        sleep(1000);
        //删除弹出界面
        
        
        //返回主页面
        back();
        back();
        sleep(1000);
        //回到新闻
        //click(1,1919);
        commons.UIClick("tv_home_tab");
        
        
    },
    //找出新闻的条目
    findNewsItem:function(){
        var newsItem = id("tv_read_count").findOnce(1);
        //toast("read count="+newsItem.text());
        
        //判断是否是广告
        if(newsItem){
            
            newsItem = newsItem.parent();
            var adFlag = newsItem.child(1);
            if(adFlag && adFlag.text() == "广告"){
                newsItem = null;
            }
            
            
            
        }
   
        return newsItem;
    },
    //阅读页面是否应该返回
    isShouldBack:function(){
        //不存在奖励，直接退出
        if(!id("news_income_container").findOnce()){
            return true;
        }

        //存在下载安装
        if(id("button2").findOnce()){
            id("button2").findOnce().click();
            return true;
        }

        return false;
    },
	download:function(appName){
		
		var appPackage=app.getPackageName(appName);
        if(!app.isAppInstalled(appPackage)){
            toast(appName+"没有安装");
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
	commons.yingyongbao(appName);
    commons.install(appName);
    //app 打开成功
    
}

