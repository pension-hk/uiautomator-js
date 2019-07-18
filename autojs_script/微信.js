const commons = require('common.js');
const templates = require('template.js');
const runAppName ="微信"; 

templates.init({
    appName:runAppName,
    indexFlagText:"发现",
});

templates.run({
    //获取首页按钮
    getIndexBtnItem:function(){
		var indexPage=text(indexFlagText).findOnce();
		if(indexPage){
		   click(indexFlagText);
		   return text("朋友圈").findOnce();  
		}
        return null;
    
	},
    //找出新闻的条目
    findNewsItem:function(){
        toast("找出新闻条目");
        //领取宝藏
     	var newsItem=null;
		var recyclerView = className("android.widget.ListView").findOnce();
        if(!recyclerView)return null;
    	var recyChildCount = recyclerView.childCount();
        for(var  i=0;i<recyChildCount;i++){  //找出所有子条目
     		var childLayout  = recyclerView.child(i);   
			if(!childLayout)continue;
			var newsItem = findParentOfTextWiew(childLayout);
			if(newsItem)break;
        }
		return newsItem;
		
    },
    
	//阅读页面是否应该返回
    isShouldBack:function(){
        return false;
    },
	
	popWindow:function(){
	  
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


function findParentOfTextWiew(node)
{
	
	
	
}