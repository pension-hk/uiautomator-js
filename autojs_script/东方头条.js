const commons = require('common.js');
const templates = require('template.js');


templates.init({
    appName:"东方头条",
	indexBtnText:"新闻",
    indexFlagText:"发布",	
});


templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
		var textW=text("新闻").findOnce(); 
		if(!textW)textW=text("刷新").findOnce();
        if(textW)return textW.parent(); 
    },
	
    //签到
    signIn:function(){
   	    //签到
        commons.UITextClick("去签到");
        sleep(2000);
        //删除弹出界面
        
        //返回主页面
        
        sleep(5000);
        //回到新闻
     	var textW=text("新闻").findOnce(); 
		if(!textW)textW=text("刷新").findOnce();
        if(textW)textW=textW.parent(); 
 		if(textW)textW.click();
        
    },
    //找出新闻的条目
    findNewsItem:function(){
		var newsItem=null;
		var recyclerView = className("android.support.v7.widget.RecyclerView").findOnce();//fu,go
        if(!recyclerView)return null;
    	var recyChildCount = recyclerView.childCount();

        for(var  i=0;i<recyChildCount;i++){  //找出所有子条目
            var LinaearLayout  = recyclerView.child(i);    //LinaearLayout
			if(!LinaearLayout)continue;
		    var childCount=LinaearLayout.childCount();
			//toast("发现类："+ LinaearLayout.className()+"有子条目："+childCount);			
			for(var j=0;j<childCount;j++)
			{
			    var textChild = LinaearLayout.child(j);    //TextView
                if(!textChild)continue;
				//判断是否有新闻：
				var textString = textChild.text();
				if(!textString){
					continue;
				}
					
				//if(textString.indexOf("阅读")>=0 || textString.indexOf("播放")>=0){
				//   newsItem=LinaearLayout;
				//   break;
				//}
                newsItem=LinaearLayout;
				break;
			
          
			}
		    if(newsItem)break; 
		}	
        if(newsItem)
        {
           if(findFilt(newsItem,"置顶"))newsItem=null;
           else if(findContainFilt(newsItem,"广告"))newsItem=null;
			   
		}	
	    return newsItem;
		
    },
	//时段奖励之后执行
    doingAfterTimeAward:function(){
        back();
    },

    //阅读页面是否应该返回
    isShouldBack:function(){
    	var fl=text("忽略").findOnce();
        if(fl){
            fl.click();
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

function findFilt(obj,flag){
         //toast("input class="+obj.className());
         for(var i=0;i<obj.childCount();i++){
            var child=obj.child(i);
            if(child===null)continue;
            var tx=child.text();
            //toast("text="+tx);
            if(tx===flag)return true;
            if(findFilt(child,flag))return true;
         } 
         return false;
}
function findContainFilt(obj,flag)
{  
         for(var i=0;i<obj.childCount();i++){
             var child=obj.child(i);
             if(child===null)continue;
             var tx=child.text();
             //toast("findContainFilt:text="+tx);
             if(tx.indexOf(flag)>=0)return true;
              //if(findContainFilt(child,flag))return true;
             if(findContainFilt(child,flag))return true;
   
         } 
         return false;
}


function downloadProcess(appName)
{  
	
	
	commons.yingyongbao(appName);
	commons.install(appName);
    //app 打开成功
	
    
}

