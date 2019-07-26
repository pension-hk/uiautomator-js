const commons = require('common.js');
const templates = require('template.js');
const runAppName ="中青看点"; 


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

	//登陆：
    login:function(){
      toast("登陆......");       	  
      var inviteCode  =  commons.getNewsReffer(runAppName); 
      //reffer_code  =  commons.getVideoReffer("刷宝"); 

	  toast("登陆:等待启动......");
	  var waitCount=0;
	  var waitFlag=true;
	  while(waitFlag  && waitCount<20){
		 waitCount++;
	     if(findIndex())
	     {
			waitFlag=false;
			break;
			
	     }
		 var uiele = text("允许").findOnce();
         if(uiele){
            uiele.click();
            sleep(2000);
         }
         uiele = text("始终允许").findOnce();
         if(uiele){
            uiele.click();
            sleep(2000);
         }
		 //再次检查是否到首页
		 if(findIndex())
	     {
			waitFlag=false;
	     }
		 else
		 {
	        back();
			sleep(1000);
		 
		 }
	  }
      toast("登陆：app 启动成功");
	

       	
	  var myBtn = id("a4a").findOnce();//未登录
	  if(myBtn){
		 myBtn=myBtn.parent(); 
		 if(myBtn)
			 myBtn.click();
	     sleep(2000);
	  }

	  
	  toast("登陆领红包");       	  
	  var loginBtn=id("a46").findOnce();//登陆领红包
	  if(!loginBtn)loginBtn=id("a37").findOnce();//("立即赚钱").findOnce();
	  if(loginBtn){
		 loginBtn.click();
		 sleep(1000);
		 
		 //微信一键登陆：
		 var wechatLogin = id("z7").findOnce();//text("微信一键登陆").findOnce();
		 if(wechatLogin){
			 var txt=wechatLogin.child(0);
			 if(txt)txt=txt.text();
			 toast("一键："+txt);
			 wechatLogin.click();
		 }
		 sleep(2000);  
		 toast("登陆完成");
	  }
	  
	  
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
		/*
		var newsItem=null;
		var recyclerView = className("android.support.v7.widget.RecyclerView").findOnce();
        if(!recyclerView) return null;
    	var recyChildCount = recyclerView.childCount();
        for(var  i=0;i<recyChildCount;i++){  //找出所有子条目
     		var childLayout  = recyclerView.child(i);   
			if(!childLayout)continue;
			newsItem = commons.findParentOfTextWiew(childLayout);
			if(newsItem)break;
        }
		*/
		var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	    var newsItem = commons.findParentOfTextWiew(rootNode);
	    
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
		   adFlag.click();  
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


