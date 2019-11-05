const commons          = require('common.js');
const templates        = require('template.js');
const runAppName       ="中青看点"; 
const runPkg           ="cn.youth.news";
const videoMode        = 1;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）
const smallVideoMode   = 2;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）
const indexBtn         ="a6_";//"a3u";//"首页"
const indexBtn1        ="a6_";//"a0s";//"刷新"
const indexText        ="美文";
const indexText1       ="要闻";


templates.init({
    appName:runAppName,
	packageName:runPkg,
    runVideoMode:videoMode,
	runSmallVideoMode:smallVideoMode,		
  	indexBtnText:indexBtn,
	indexBtnText1:indexBtn1,
	indexFlagText:indexText,
	indexFlagText1:indexText1,
	timeAwardText:"领取"
});


templates.run({
	checkLogin:function(){
        return isLogin(); 
	},   
    login:function(){
        app.dlog("login......");
        commons.waitInviteCode(runAppName);
	    loginDone();
	    fillInviteCode(app.getPrefString(runAppName));
	    app.dlog("登陆完成");

	},
   
    //签到
    signIn:function(){
        jumpToTaskCenter();
		//点击签到领红包
		app.dlog("点击签到领红包");
		commons.clickText("签到");	   
		popWindowProcess();
		//app.dlog("返回我的");
        //back();
		//sleep(3000);
		//popWindowProcess();
		//clickIndex();
		
	        
    },
    //找出新闻的条目
    findNewsItem:function(){
      	app.dlog("找出新闻的条目");
		var newsItem =null;
   	    var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	    //var rootNode= className("android.widget.FrameLayout").findOnce();
    	//app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		     newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,-1);
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,-1);
		return newsItem;
    },	
	findVideoItem:function(){
		var videoItem=null;
		var rootNode= className("android.widget.FrameLayout").findOnce();
        app.findNodeTest(rootNode,0,0);
		videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,14);
	    //return videoItem;
        
	    
		//app.findNodeTest(rootNode,0,0);
		//videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","a25"); //广告
		//videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","a7r");
		//if(!videoItem)videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","a4h");
		//if(!videoItem)app.findNodeTest(rootNode,0,0);
		//videoItem=app.findNodeByClass(rootNode,"android.widget.TextView");
		if(videoItem){
		   var count=videoItem.childCount();
           for(var i=0;i<count;i++){		   
		      var childNode=videoItem.child(i);
              if(!childNode)continue;
              var textName= childNode.text();
              app.dlog("i="+i+" textName="+textName);
			  if(textName && textName.indexOf("广告")>=0){
				  videoItem=null;
                  break;				  
			  }				  
		   }
		}
		//else app.findNodeTest(rootNode,0,0);
			
		
		return videoItem;
    	
    },
    getVideoTitle:function(videoItem){
        return videoItem.child(1).text();
	},		
	//跳到视频页面：
	jumpToVideo:function(){
	   app.dlog("jumpToVideo"); 
	   return  clickVideoIndex();
    },
	

	//时段奖励之后执行
    doingAfterTimeAward:function(){
	    pushNewsPop();
	},
	
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
		if(viewMode=="video")
		{
		   return false;	
		}
		commons.clickText("查看全文，奖励更多");
       
		if(text("搜索").findOnce())return true; //带有搜索字样的页面，直接退出
		
		commons.clickText("查看详情");
        return false;
    },
	doTask1:function(){
        gotoTask1();		
	},
	doTask2:function(){
        gotoTask2();		
	},
	doTask3:function(){
        gotoTask3();		
	},
    doTask4:function(){
        gotoTask4();		
	},
	doTask5:function(){
        gotoTask5();		
	},
	checkIsAppPage:function()
	{
		return isAppPage();  //如果是，不要back();
	},
	findIndexPage:function()
	{
		return findIndex();
	},
	clickIndexPage:function()
	{
		return clickIndex();
	},
	//news  video：
	findVideoIndexPage:function()
	{
		return findVideoIndex();
	},
	checkIsAppVideoPage:function()
	{
		return isAppVideoPage();  //如果是，不要back();
	},
	clickVideoIndexPage:function()
	{
		return clickVideoIndex();
	},
	
	popWindow:function(){
		
		popWindowProcess();
	},
	
	download:function(){
	    commons.yingyongbao(runAppName);	
	}
});


function popWindowProcess()
{
	commons.clickText("下次再说");//更新提示处理
	var adFlag=id("iv_activity").findOnce();
    if(adFlag)
	{
        back();
        sleep(500);
    }
		
    adFlag=id("tt_video_ad_close").findOnce();
    if(adFlag){
       adFlag.click();
    }
	    
	adFlag=id("im").findOnce();
    if(adFlag){
       adFlag.click();
	}
		
	if(pushNewsPop())
	{
   	  back();
      sleep(1000);
		
	}		
	commons.clickText("off"); 
	   	
    var clickFlag=id("jp").findOnce();
	if(clickFlag)clickFlag.click();
		
	if(commons.text("青豆奖励")&&commons.text("点我继续领青豆")){
	   if(commons.clickText("点我继续领青豆")){
		  commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close_layout");
		  sleep(2000);
	   }
	}
		
    if(commons.text("青豆奖励")&&commons.text("点我下载")){
		    app.dlog("青豆奖励"+"& 点我下载");
    		if(!commons.clickClassName("android.widget.ImageView")){ //id="lz";
			   clickFlag=id("lz").findOnce();
	 	       if(clickFlag)clickFlag.click();
			}
	}
	if(commons.text("青豆奖励")
		    && commons.text("查看详情"))
	{
		    app.dlog("青豆奖励"+"& 查看详情");
            if(!commons.clickClassName("android.widget.ImageView")){;//pop  id="kn"
			   clickFlag=id("kn").findOnce();
	 	       if(clickFlag)clickFlag.click();
			}
	}
		
	commons.clickText("我知道了");
		
	commons.clickText("不感兴趣");
	
		
}

function jumpToTaskCenter()
{
	popWindowProcess();
	app.dlog("jumpToTaskCenter......");
	
	if(!commons.jumpToById(id("a_1").findOnce())){
	    app.dlog("进入【我的】失败");
		return;
	}
	
	app.dlog("已进入【我的】");
	sleep(1000);
	popWindowProcess();
    app.dlog("进入任务中心......");
    if(!commons.clickText("任务中心")){
		app.dlog("进入任务中心失败");
	}
	else
    {
	   app.dlog("进入任务中心成功");
	   sleep(5000);
    }
	
}


function findIndex(){
	var flag=false;
    var indexBtNode    =id(indexBtn).findOnce();
	var indexBtn1Node  =id(indexBtn1).findOnce();
    var indexTextNode  =text(indexText).findOnce();
	var indexText1Node =text(indexText1).findOnce();
	if((indexBtNode || indexBtn1Node || text("首页").findOnce()|| text("刷新").findOnce())
		&& (indexTextNode||indexText1Node))flag=true;
	else flag=false;
    return flag;
}

function isAppPage(){
    var flag=false;
    var indexBtNode    =id(indexBtn).findOnce();
	var indexBtn1Node  =id(indexBtn1).findOnce();
	if(indexBtNode || indexBtn1Node) flag=true;
    return flag;
}


function clickIndex(){
	var flag=false;
	if(commons.idClick(indexBtn) || commons.idClick(indexBtn1))return true 
	else return false;
}

function findVideoIndex(){
	var flag=false;
    var indexBtNode    =id("a_6").findOnce();//id("a7p").findOnce();
	var indexBtn1Node  =id("a_6").findOnce();
    var indexTextNode  =text("搞笑").findOnce();
	var indexText1Node =text("广场舞").findOnce();
	if((indexBtNode || indexBtn1Node || text("视频").findOnce())
		&& (indexTextNode||indexText1Node))flag=true;
	else flag=false;
    return flag;
}

function isAppVideoPage(){
    var flag=false;
    var indexBtNode    =id("a_6").findOnce();//id("a7p").findOnce()||id("a4f").findOnce();
	var indexBtn1Node  =id("a_6").findOnce();
	if(indexBtNode || indexBtn1Node || text("视频").findOnce())flag=true;
	else flag=false;
    return flag;
}


function clickVideoIndex(){
    if(!commons.clickText("视频") 
	    && !commons.jumpToById(id("a_6").findOnce()))return false;
	else  return true;
	
}

function isLogin()
{
   var flag=true;	
   //flag=commons.text("未登录");
   if(commons.jumpToById(id("a_1").findOnce()) 
	   && commons.waitText("任务中心",0)
       &&commons.text("登录领红包")){
      flag=false;     
   }	   
   app.dlog("isLogin()="+flag);
   return flag;	
}

function loginDone()
{   
	app.dlog("loginDone():没有进入【我的】");
	
	//if(!commons.clickText("未登录"))return;
    if(!commons.jumpToById(id("a_1").findOnce())){
		app.dlog("loginDone():没有进入【我的】");
		return;
	}
	if(commons.waitText("任务中心",0) && !commons.clickText("登录领红包"))
	{
	   exit();
	   return;
	}
	//app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	commons.waitText("微信一键登录",0);
	if(!commons.clickText("微信一键登录")){
	   exit();
       return;	   
	}
    wechatLogin(); 	
   
}

function wechatLogin(){
	app.dlog("wechatLogin()......");
	/*
	commons.waitText("同意",0);
	if(!commons.clickText("同意")){
	   exit();
       return;	   
	}
	*/
}

function  fillInviteCode(inviteCode)
{
	if(!inviteCode)return;
	app.dlog("fillInviteCode：inviteCode="+inviteCode);
	
	

}

function gotoTask1(){
   app.dlog("做任务1...");  
   //jumpToTaskCenter();
   if(!commons.text("任务中心")){
       //app.dlog("做任务1，不在任务中心，返回");  
       back();
       clickIndex();
	   return;	  
   }
   var coinItem =app.findNodeByText(className("android.widget.FrameLayout").findOnce(),"看视频领青豆");
   if(coinItem && !commons.text("剩0次"))
   {
	  //app.dlog("做任务1，进入了【看视频领青豆】");  
	  //var waitCount=0;
	  //while(!commons.text("剩0次")&&waitCount<20)
      for(var i=10;i>0;i--)
	  {
        if(commons.clickText("剩"+i+"次")){
		   commons.waitPlayVideoAd("android.webkit.WebView","tt_video_close"); 
           popWindowProcess(); 		   
		}
		else
		{
		   sleep(2000);
		   back();
		   popWindowProcess(); 		   
		}
	       	
      }	
      
   }
    

   if(commons.text("大转盘") && commons.clickText("大转盘")
	   &&commons.waitText("自动抽奖：",1))
   {
	  app.dlog("做任务1，进入了【大转盘】"); 
		
	  while(!commons.text("剩余次数：0次"))
	  {
          var boxNode=app.findNodeById(className("android.widget.FrameLayout").findOnce(),"box",1);
          if(boxNode && commons.boundsClick(boxNode))
	      {
	          app.dlog("做任务1，进入了【大转盘】点了box成功"); 
			  sleep(15000)
		  }
		  if(commons.text("关闭"))
		  {
			 commons.clickText("关闭");
		  }
	      if(commons.text("继续抽奖"))
	      {
			 commons.clickText("继续抽奖")
			 sleep(15000)
		  }
		  sleep(2000);
         
	  }	
      app.dlog("没有大转盘任务");
      back();	  
   }
   
   if(commons.text("关闭"))
   	 commons.clickText("关闭");
  
   if(commons.text("大转盘"))back();
   
   if(commons.text("任务中心")){
   
      if(commons.jumpToItemByText("android.widget.FrameLayout","累计阅读60分钟",10)
		 && commons.clickText("立即阅读") 
	  )
	  {
         commons.waitText("阅读收益");
         if(commons.jumpToItemByText("android.widget.FrameLayout","阅读5分钟",1)
		    && commons.clickText("点击领取")
		    &&commons.waitText("点我继续领青豆",0)&&commons.clickText("点我继续领青豆")  
	     )    
		 {
			commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close");
		    popWindowProcess();
		 }
		 if(commons.jumpToItemByText("android.widget.FrameLayout","阅读30分钟",1)
		    && commons.clickText("点击领取")
		    &&commons.waitText("点我继续领青豆",0)&&commons.clickText("点我继续领青豆")  
	     )    
		 {
			commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close");
		    popWindowProcess();
		 }
		 if(commons.jumpToItemByText("android.widget.FrameLayout","阅读60分钟",1)
		    && commons.clickText("点击领取")
		    &&commons.waitText("点我继续领青豆",0)&&commons.clickText("点我继续领青豆")  
	     )    
		 {
			commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close");
		    popWindowProcess();
		
		 }
		 back();

	  }		  
	  if(commons.text("阅读收益"))back();
   }

   if(commons.text("任务中心"))back();
   if(!isAppPage()){
	  popWindowProcess();
   }
   if(!isAppPage())back();
	   
   clickIndex();
   app.dlog("退出做任务1,是否app主页"+isAppPage());
   
	   
}


function gotoTask2(){
   app.dlog("做任务2...");  
}

function gotoTask3(){
   app.dlog("做任务3...");  
	
}
function gotoTask4(){
   app.dlog("做任务4...");  
	
}
function gotoTask5(){
   app.dlog("做任务5...");  
  	
}




//新闻弹窗处理：
function pushNewsPop(){
	app.dlog("要文推荐 弹窗");
	if(commons.text("要文推荐") && commons.text("要文推荐")){
	    if(!commons.clickText("查看详情"))return false;
		commons.waitPlayVideoAd("android.webkit.WebView","tt_video_ad_close");
	    return true
	}
	return false;	   
}


function findParentOfImagView(node)
{
    return node.child(4);	
 	
}


