const commons = require('common.js');
const templates = require('template.js');
const runAppName ="中青看点"; 
const runPkg     ="cn.youth.news";


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
      	app.dlog("找出新闻的条目");
		var newsItem =null;
   	    var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	    //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		     newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,-1);
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,-1);
		if(!newsItem && !findIndex()) backToIndex();
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
		if(text("搜索").findOnce())return true; //带有搜索字样的页面，直接退出
		//推送处理：
        var viewText=text("查看详情").findOnce(); 
        if(viewText){
			click(立即查看); 
		}

        var webView=className("android.webkit.WebView").findOnce();
		
		click("查看全文，奖励更多");
		
		

        return false;
    },
	
	popWindow:function(){
		
		popWindowProcess();
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

function popWindowProcess()
{
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

}

function findIndex(){
   return text("美文").findOnce(); 
}

function ucMobile(){
    var currentPkgName=currentPackage();
    if(currentPkgName=="com.UCMobile")
    {
	   app.dlog("处理打开的："+currentPkgName);
       while(currentPkgName=="com.UCMobile")
	   {
		   var  exitText =  text("退出").findOnce();
           if(exitText){
		        if(!exitText.click())click("退出");
		   }
           else
		   {
			     back();
                 sleep(1000);
		   }
		   currentPkgName=currentPackage();
	    }		   
	}	
	
}


function  backToIndex()
{
    /*
	var currentPkgName=currentPackage();
    if(currentPkgName=="com.UCMobile")
	{
	     toast("处理打开的："+currentPkgName);
         var  exitText =  text("退出").findOnce();
         if(exitText)exitText.click();
         else
		 {
			back();
            sleep(1000);
		 }		   
	}
    */
	ucMobile();
    popWindowProcess();
     	
	if(!findIndex())
	{
	   //toast("发现webview界面，回退");
       back();
       sleep(1000);  	
	}
	
}




function downloadProcess(appName)
{  
	commons.yingyongbao(appName);
    
}

function findParentOfImagView(node)
{
    return node.child(4);	
 	
}


