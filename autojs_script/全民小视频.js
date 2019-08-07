const commons    = require('common.js');
const templates  = require('template.js');
const runAppName = "全民小视频"; 
const runAppName1= "全民小视频"; 
const runPkg      ="com.baidu.minivideo";

templates.init({
    appName:runAppName,
	runMode:"视频",
    indexFlagText:"首页",
});

templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
		var indexText=text("首页").findOnce(); 
        if(indexText)indexText=indexText.parent();
		return indexText;
	},
	
	//获取首页标志
    findIndexPage:function(){
      return findIndex();
    },
	
	
    //签到
    signIn:function(){ //刷宝签到改版以后是用android.webkit.WebView，暂时不能签
        toast("进入任务签到");
		//app.listNode(className("android.widget.FrameLayout").findOnce(),0);
		if(text("去赚钱").findOnce())
           click("去赚钱");        
	   
    },
    //找出视频
    findVideoItem:function(){  
    	var rootNode = className("android.support.v4.view.ViewPager").findOnce();
		var testNode = className("android.widget.RelativeLayout").findOnce();
		var videoItem = app.findNodeById(testNode,"com.baidu.minivideo:id/index_text_title");
		return videoItem;
    
	},
	
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
       //var btnView  =  id("btn_view").findOnce();
	   //if(btnView)btnView.click();
	   
    },

    //阅读页面是否应该返回
    isShouldBack:function(){
       var closeFlag= id("imgClose").findOnce();
       if(closeFlag){
          closeFlag.click();
	   }
	   return false;
    },
	popWindow:function(){
	   var youthTip = text("青少年模式").findOnce();
	   if(youthTip){
		  click("我知道了"); 
	   }
	   
	
	}
	
});

function findIndex(){

    return text("首页").findOnce();	
}


