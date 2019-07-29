const commons    = require('common.js');
const templates  = require('template.js');
const runAppName ="东方头条"; 

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

	//登陆：
    login:function(){
      toast("登陆......");       	  
      var inviteCode  =  commons.getNewsReffer(runAppName); 
      //reffer_code  =  commons.getVideoReffer("刷宝"); 
      waitAppSuccess();
	  loginDone();
	  fillInviteCode(inviteCode);
	  toast("登陆完成");
	  
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
		/*
		//升级处理：
		var upgradeP = id("xk").findOnce(); //立即安装
		if(upgradeP)upgradeP.click();
		*/
}

function findIndex(){

    var textW=text("新闻").findOnce(); 
	if(!textW)textW=text("刷新").findOnce();
    if(textW)textW=textW.parent();
    return textW;	
}


function waitIndex()
{
	var waitCount=0;
	var waitFlag=true;
	while(waitFlag  && waitCount<20){
		 waitCount++;
		 if(findIndex())
		 {
			waitFlag=false;
			break;
		 }
		 else
		 {
			var curPkg= currentPackage();
			toast("curPkg="+curPkg);
			back();   
			sleep(1000);
		 }
	}	 
  
    toast("退出waitIndex()，waitCount="+waitCount+"  waitFlag="+waitFlag);
	if(waitFlag||waitCount>=20)
		return   false;
	else
		return true;
	
}

function  waitAppSuccess()
{
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
	        back();   //条件是当前运行的是自己
			sleep(1000);
		 
		 }
	  }	
	  toast("登陆：app 启动成功");
}
function loginDone()
{
	  /*
	  var myBtn = text("我的").findOnce();
	  if(myBtn){
		myBtn.click();
        sleep(1000);
		if(!text("我的").findOnce())
		{
			back(); //前提是当前运行的是自己
			sleep(1000);
		}
		
	  }
	  */
	  var waitCount=0;
	  var myBtn = text("我的").findOnce();
	  while(!myBtn  && waitCount<20){
		 waitCount++;
		 myBtn = text("我的").findOnce();
		 if(!myBtn)
		 {
			var curPkg= currentPackage();
			toast("curPkg="+curPkg);
			back();   
			sleep(1000);
		 }
		 
	  }	 
      if(myBtn)
		myBtn.click();
      sleep(2000);  
	  
	  
	  toast("点击登陆"); 
      if(!commons.idClick("a80")){
		toast("点击登陆失败");  
	  }
	  
	  sleep(1000);
	  
	  wechatLoginByhand();
	  
}

function wechatLoginByhand(){ //手动登陆
	 //微信一键登陆：
	  var currentClass=className("android.webkit.WebView").findOnce();
	  var waitCount = 0;
	  while(!currentClass  && waitCount<20)
	  {
		 waitCount++; 
		 currentClass=className("android.webkit.WebView").findOnce(); 
		 sleep(1000);
	  }
	  waitCount = 0;		
	  while(currentClass && waitCount<30)
	  {
		 waitCount++; 
		 currentClass=className("android.webkit.WebView").findOnce(); 
		 sleep(5000);
		 toast("请手动点击手机图标登陆,然后填手机号与验证码，或者点微信登陆");
	  }
	  toast("登陆退出,waitCount="+waitCount);
	  sleep(2000);
	
	
}



function  fillInviteCode(inviteCode)
{
		 
	  //填邀请码：
	  toast("填邀请码，先到我的");
      waitIndex();
		 
		 var inviteBtn = text("填邀请码").findOnce();
		 if(!inviteBtn)return;
		 if(!inviteBtn.click())
		 {
            click("填邀请码");
		 }
         sleep(2000);
		 //android.webkit.WebView
		 currentClass=className("android.webkit.WebView").findOnce();
		 var waitCount = 0;
		 while(!currentClass  && waitCount<20)
		 {
			waitCount++; 
			currentClass=className("android.webkit.WebView").findOnce(); 
			sleep(5000);
		 }
	     waitCount = 0;		
		 while(currentClass && waitCount<20)
		 {
			waitCount++; 
			currentClass=className("android.webkit.WebView").findOnce(); 
			sleep(5000);
			toast("请手动填入邀请码：【 "+inviteCode+" 】，然后点提交");
		 }
	

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

function downloadProcess(appName)
{  
	commons.yingyongbao(appName);
}

