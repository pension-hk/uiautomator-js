const commons = require('common.js');
const templates = require('template.js');
const runAppName = "趣头条";

templates.init({
    appName:runAppName
});

templates.run({
    //签到
    signIn:function(){
		var  textTask=text("任务").findOnce();
		if(!textTask){
		  var textToSign=text("去签到").findOnce();
  	      if(textToSign)textToSign.click();
          sleep(2000);
		  var  textSignTip=text("开启提醒").findOnce();
		  if(textSignTip)textSignTip.click();
		  sleep(2000);
		  var textAllAllow=text("始终允许").findOnce();
		  if(textAllAllow)textAllAllow.click();
		}
		
    },
    //找出新闻的条目
    findNewsItem:function(){
    	/*
		var newsItem = className("android.support.v4.view.ViewPager").className("LinearLayout").findOnce();
        //判断是否是广告
        if(newsItem && newsItem.childCount() > 0){
            var adFlag = newsItem.child(1);
            if(adFlag && adFlag.text() == "广告"){
                newsItem = null;
            }
        }
		*/
	    var newsItem=null;
		var recyclerView = className("android.support.v7.widget.RecyclerView").findOnce();//fu,go
        if(!recyclerView)return null;
    	var recyChildCount = recyclerView.childCount();
        for(var  i=0;i<recyChildCount;i++){  //找出所有子条目
     		var childLayout  = recyclerView.child(i);   
			if(!childLayout)continue;
			var newsItem = commons.findParentOfTextWiew(childLayout);
			if(newsItem)break;
        }
		
		
	    if(newsItem){
           var idAllow = id("permission_allow_button").findOnce(); //始终允许
		   if(idAllow){
			   idAllow.click();
		   }
		}		
	    return newsItem;
    },
    //阅读页面是否应该返回
    isShouldBack:function(){
	    //图集直接返回
        var imgItem = className("android.support.v4.view.ViewPager").className("ImageView").findOnce();
        if(imgItem){
            return true;
        }
		var idTg = id("tg").findOnce();
		if(idTg)idTg.click();

		
		return false;
    },
	popWindow:function(){
	    var adFlag=id("iv_activity").findOnce();
        if(adFlag){
           back();
           sleep(500);
        }
	  
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
