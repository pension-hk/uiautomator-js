const commons    = require('common.js');
const templates  = require('template.js');
const runAppName ="东方头条"; 
const runPkg      ="";

templates.init({
    appName:runAppName,
	indexBtnText:"新闻",
    indexFlagText:"发布",	
});

//pop："您有新的时段奖励可以领取，请及时领取" ==》立即领取 x:id=hi,点立即领取==>时段奖励领取成功 x:id=hi 和【立即查看】
//news：恭喜你获得 & 浏览广告赢更多金币,其父类才可以点，点进去=》是视频广告，等30秒后检查：com.songheng.eastnews:id/tt_video_ad_close
//要文推送：“忽略” 和“立即查看”，点“立即查看”==》class：android.webkit.WebView
//视频按钮=》
//   找文本TextView类：android.widget.TextView，其父类是可以点击的，点击后进入播放，可查类：android.support.v4.widget.SlidingPaneLayout。只能back（）；
//   还有跳入类：android.webkit.WebView，只能立即back。          
templates.run({
    
    //获取首页按钮
    getIndexBtnItem:function(){
	    return findIndex();		
    },
		//获取首页标志
    findIndexPage:function(){
      return findIndex();
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
		var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();//fu,go
	    var newsItem = commons.findParentOfTextWiew(rootNode);
		if(!newsItem)
		{
		   popWindowProcess();
		}
		return newsItem;
		
    },
	
	findVideoItem:function(){
		
		var videoItem=null;
		/*
		var rootNode= className("android.support.v7.widget.RecyclerView").findOnce();
        videoItem  = app.findParentNode(rootNode);//app.findNodeByClass(rootNode,"android.widget.TextView"); 
        return videoItem;
		*/
		videoItem=className("android.support.v4.view.ViewPager")
            .className("android.support.v7.widget.RecyclerView")
            .className("LinearLayout").findOnce();
		if(videoItem){
           var child=videoItem.child(0);
		   if(child)txt=child.text();
		   toast("txt="+txt);
		   
		}
        else
           toast("videoItem=null");			
			
	    return videoItem;   		
    },
	
	
	//时段奖励之后执行
    doingAfterTimeAward:function(){
    	
		back();
    },
    //跳到视频页面：
	jumpToVideo:function(){
	   /*
	   var videoId  = text("视频").findOnce();
	   if(!videoId)return false;
	   videoId=videoId.parent();
	   if(!videoId)return false;
	   //toast("找到视频父类："+videoId.className());
	   if(!videoId.click()  && !click("视频"))return false;
       var tuijieW=text("推荐").findOnce();  	 
       if(!tuijieW)return false;
       if(!tuijieW.click() && !click("推荐"))return false;	   
	   return true;
	   */
	   var videoId  = text("视频").findOnce();
	   if(!videoId)return false;
	   if(!click("视频")) return false;
	   sleep(1000);
	   var tuijieW=text("推荐").findOnce();  	 
       if(!tuijieW){
		  toast("没找到推荐");
		  return false;
	   }
                
	   if(!click("推荐")){
          toast("点击推荐失败");
		  return false;
	   }
       toast("点击推荐成功");
       return true;
	   
	 	   
    },
    //阅读页面是否应该返回
    isShouldBack:function(){
		
		if(findIndex()) return true;
	  
    	var fl=text("忽略").findOnce();
        if(fl){
            fl.click();
        }
		fl=text("禁止").findOnce();
	    if(fl){
            fl.click();
			return  true;
        }
	    fl=text("立即下载").findOnce();
	    if(fl){
       	   return  true;
        }
		fl=id("tt_video_ad_close").findOnce();
		if(fl){
            fl.click();
			return  true;
        }
	    
		
		var coinDouble=id("ax2").findOnce();//金币翻倍奖励
		if(coinDouble){
		   coinDouble.click();
		   //com.songheng.eastnews:id/tt_video_reward_container
		   //com.songheng.eastnews:id/tt_video_ad_close
		   sleep(1000);
		   waitPlayAd();
		   
		}
	    var videoAd = id("tt_video_ad_close").findOnce();
        if(videoAd){
            videoAd.click();
        }
		
	
        return false;
    },
	popWindow:function(){
	 
        //add for 东方头条：
		adFlag = id("aa3").findOnce();
        if(adFlag){
           back();
           sleep(500);
        }
	    adFlag = id("ab0").findOnce();
        if(adFlag){
           back();
		   sleep(500);
        }
		
		//关闭微信提现提示窗
        adFlag = id("a_y").findOnce();//"a_y";//提现到微信ID
        if(adFlag){
            back();
			sleep(500);
        }
      
        //要文推送
        adFlag = text("立即查看").findOnce();
        if(adFlag){
            if(adFlag.click()){
               sleep(2000);
			   back();
			   sleep(500);
			}
 	    }
		/*
	    adFlag = text("忽略").findOnce();
        if(adFlag){
            adFlag.click();
        }
		*/
       
        //处理时段奖励提醒
        var timeAward = text("立即领取").findOnce(); //"立即领取";//时段奖励领取提醒
        if(timeAward){
            back();
			sleep(500);
         }
        //处理回退提示
        var backTip = text("继续赚钱").findOnce();
        if(backTip){
            backTip.click();
        }
		
		var videoAd = id("tt_video_ad_close").findOnce();
        if(videoAd){
            videoAd.click();
        }
	    var coinTip = id("ax3").findOnce(); //立即领取 金豆奖励提醒
		if(coinTip)coinTip.click();
	
    }
});


function popWindowProcess()
{
		adFlag = id("aa3").findOnce();
        if(adFlag){
           back();
           sleep(500);
        }
	    adFlag = id("ab0").findOnce();
        if(adFlag){
           back();
		   sleep(500);
        }
		
		//关闭微信提现提示窗
        adFlag = id("a_y").findOnce();//"a_y";//提现到微信ID
        if(adFlag){
            back();
			sleep(500);
        }
      
        //关闭要闻推送
        adFlag = text("忽略").findOnce();
        if(adFlag){
            adFlag.click();
        }
       
        //处理时段奖励提醒
        var timeAward = text("立即领取").findOnce(); //"立即领取";//时段奖励领取提醒
        if(timeAward){
            back();
			sleep(500);
         }
        //处理回退提示
        var backTip = text("继续赚钱").findOnce();
        if(backTip){
            backTip.click();
        }
		
		var videoAd = id("tt_video_ad_close").findOnce();
        if(videoAd){
            videoAd.click();
        }
	    var coinTip = id("ax3").findOnce(); //立即领取
		if(coinTip)coinTip.click();
		
		//升级处理：
		var upgradeP = text("立即安装").findOnce(); //立即安装
		if(upgradeP){
		   back();
		   sleep(1000);
		}
		//东方头条 无响应。是否将其关闭？
		var closeApp = text("关闭应用").findOnce();
		if(closeApp){
			if(!closeApp.click()){
			   click("关闭应用");
			}
		}
}

function findIndex(){

    var textW=text("新闻").findOnce(); 
	if(!textW)textW=text("刷新").findOnce();
    if(textW)textW=textW.parent();
    return textW;	
}




function waitPlayAd()
{         //com.songheng.eastnews:id/tt_video_reward_container
		   //com.songheng.eastnews:id/tt_video_ad_close
		 var  currentClass=className("android.webkit.WebView").findOnce();
		 var waitCount = 0;
		 while(!currentClass  && waitCount<30)
		 {
			waitCount++; 
			currentClass=className("android.webkit.WebView").findOnce(); 
			sleep(1000);
		 }
		 waitCount = 0;
		 while(currentClass  && waitCount<30)
		 {
			waitCount++; 
			var adClose = id("tt_video_ad_close").findOnce();
			if(adClose)
			{
			   adClose.click();
			   break;
			}
			currentClass=className("android.webkit.WebView").findOnce(); 
			sleep(1000);
		
		 }
	
	
}


