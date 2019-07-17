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
        var myFlag=id("tv_user_tab").findOnce();
        if(myFlag)myFlag=myFlag.parent();
        if(!myFlag)return;
		myFlag.click();
        sleep(2000);
        //去掉广告
        var animationView=id("animationView").findOnce();
        if(animationView)animationView.click();
        
        sleep(500);
        //进入任务中心
        var taskCenter = text("任务中心").findOnce();
        if(taskCenter)taskCenter=taskCenter.parent();
        if(taskCenter)taskCenter.click();
        sleep(5000);
        
        //点击签到领红包
		toast("点击签到领红包");
        if(commons.textClick("立即签到")){
           
		   sleep(1000);
           //删除弹出界面
           commons.UIClick("iv_close");  
        
        }
		//返回主页面
        back();
		sleep(1000);
        back();
        sleep(1000);
	   
		//回到新闻
        commons.UIClick("tv_home_tab");
        
        
    },
    //找出新闻的条目
    findNewsItem:function(){
		var newsItem=null;
		var recyclerView = className("android.support.v7.widget.RecyclerView").findOnce();
        if(!recyclerView) return null;
    	var recyChildCount = recyclerView.childCount();
        for(var  i=0;i<recyChildCount;i++){  //找出所有子条目
     		var childLayout  = recyclerView.child(i);   
			if(!childLayout)continue;
			var newsItem = commons.findParentOfTextWiew(childLayout);
			if(newsItem)break;
        }
	    
		if(!newsItem){
           
    	    //检查是否有弹窗：
            var awardPop= text("青豆奖励").findOnce();
            if(awardPop){
				back();
			}			
 		}	
		
	    return newsItem;
		
		/* ver 1.5.1:
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
		else
		{  
     	//检查是否有弹窗：
            var awardPop= text("青豆奖励").findOnce();
            if(awardPop){
				back();
			}			
  


		}		
        return newsItem;
		*/
		
    },	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
        back();
		sleep(100);
		//检查是否有弹窗：
        var awardPop= text("青豆奖励").findOnce();
        if(awardPop){
		   commons.UIClick("jp");  //x
		}
					
  	
    },
    //阅读页面是否应该返回
    isShouldBack:function(){
		return false;
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
	//commons.yingyongbao(appName);
    //commons.install(appName);
    //app 打开成功
    
}

