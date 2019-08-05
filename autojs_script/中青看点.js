const commons = require('common.js');
const templates = require('template.js');
const runAppName ="中青看点"; 
const runPkg     ="？？？";


templates.init({
    appName:runAppName,
    indexFlagText:"美文",
});

templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
        return id("tv_home_tab").findOnce();
    },
	//获取首页标志
    findIndexPage:function(){
      return findIndex();
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
        var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	    var newsItem = app.findParentNode(rootNode);
	 	if(!newsItem){
           //检查是否有弹窗：
            var adFlag= text("青豆奖励").findOnce();
            if(adFlag){
		       adFlag=adFlag.parent();
		       adFlag=findParentOfImagView(adFlag);
		       if(adFlag){
		         adFlag.click();
		       }
		   
		    }
       			
 		}	
	    return newsItem;
		
	
		
    },	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
		//检查是否有弹窗：
         var adFlag= text("青豆奖励").findOnce();
         if(adFlag){
		    adFlag=adFlag.parent();
		    adFlag=findParentOfImagView(adFlag);
		    if(adFlag){
		         adFlag.click();
		    }
		   
		 }
  	
    },
    //阅读页面是否应该返回
    isShouldBack:function(){
		if(findIndex())return true;
		if(text("搜索").findOnce()) //带有搜索字样的页面，直接退出
		
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
	
	popWindow:function(){
	    var adFlag=id("iv_activity").findOnce();
        if(adFlag){
           back();
           sleep(500);
        }
	    /*
	    adFlag= text("青豆奖励").findOnce();
        if(adFlag){
		   commons.UIClick("jp");  //x
		}
		*/
		adFlag= text("青豆奖励").findOnce();
        if(adFlag){
		   adFlag=adFlag.parent();
		   //var count = adFlag.childCount();
		   //toast("青豆奖励:"+" child count="+count);
		   //for(var i=0;i<count;i++)
		   //{
		 	//  var classN= adFlag.child(i);
            //  toast("className="+classN+" i="+i);  			  
			   
		   //}
		   
		   adFlag=findParentOfImagView(adFlag);
		   if(adFlag){
		     adFlag.click();
		   }
		   
		}
     	
		
		adFlag= text("查看详情").findOnce();
        if(adFlag){
		   if(!adFlag.click())
               click("查看详情"); 			   
		   sleep(5000);
		   back();
           sleep(1000); 		   
		}
		adFlag= desc("off").findOnce();
        if(adFlag){
		   adFlag.click();  
		   sleep(1000);
		   
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

function findIndex(){
   return text("美文").findOnce(); 
}

function downloadProcess(appName)
{  
	commons.yingyongbao(appName);
    
}

function findParentOfImagView(node)
{
    return node.child(4);	
 	
}


