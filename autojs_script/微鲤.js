const commons = require('common.js');
const templates = require('template.js');


templates.init({
    appName:"微鲤",
    indexFlagText:"发布",
    timeAwardText:"领红包",
});

templates.run({
    //获取首页按钮
    getIndexBtnItem:function(){
        return id("rl_bottom_1").findOnce();
    },
    //签到
    signIn:function(){
        commons.UIClick("rl_bottom_4");
        sleep(1000);
        commons.UIClick("ll_not_sign");
        sleep(1000);
		commons.UITextClick("立即签到");
        sleep(1000);
		back();
        sleep(1000);
        commons.UIClick("rl_bottom_1");
    },
    //找出新闻的条目
    findNewsItem:function(){
        toast("找出新闻条目");
        //领取宝藏
        commons.UIClick("text_ok");
        commons.UIClick("bt_ok");

		/*
        var newsItem = id("tv_title").findOnce(1);
        //判断是否是广告
        if(newsItem){
            newsItem = newsItem.parent();
            var adFlag = newsItem.child(1);
            if(adFlag && adFlag.text() == "广告"){
                newsItem = null;
            }
        }
        return newsItem;
		*/
		var newsItem=null;
		var recyclerView = className("android.support.v7.widget.RecyclerView").findOnce();
        if(!recyclerView)return null;
    	var recyChildCount = recyclerView.childCount();
        for(var  i=0;i<recyChildCount;i++){  //找出所有子条目
     		var childLayout  = recyclerView.child(i);   
			if(!childLayout)continue;
			var newsItem = commons.findParentOfTextWiew(childLayout);
			if(newsItem)break;
        }
		return newsItem;
		
    },
    //时段奖励之后执行
    doingAfterTimeAward:function(){
        back();
    },
    //阅读页面是否应该返回
    isShouldBack:function(){

        //领取宝藏
        commons.UIClick("text_ok");
        commons.UIClick("bt_ok");

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
