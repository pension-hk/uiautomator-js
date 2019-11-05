const commons = require('common.js');
const templates = require('template.js');
const runAppName ="微鲤"; 
const runAppName1 ="微鲤看看"; 
const runPkg     ="cn.weli.story";
const videoMode   = 1;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）
const smallVideoMode   = 2;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）

const indexBtn    ="首页"
const indexBtn1    ="头条";
const indexText   ="问答";
const indexText1  ="搜八卦趣事";


templates.init({
    appName:runAppName,
    appAlias:runAppName1,
	packageName:runPkg,
    runVideoMode:videoMode,
	runSmallVideoMode:smallVideoMode,
	indexBtnText:indexBtn,
	indexBtnText1:indexBtn1,
	indexFlagText:indexText,
	indexFlagText1:indexText1,	
    timeAwardText:"领取时段奖励",
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
    //签到  //cn.weli.story:id/iv_group_redPacket  ==要发红包的id
    signIn:function(){
   	    app.dlog("签到");
		if(commons.idClick("rl_bottom_4")//我的
		   && commons.waitText("提现兑换",0))
	    {
	      if(commons.idClick("ll_not_sign"))//签到
		  {
	   	    back();
     	    sleep(1000);
		  }
		  else
          if(commons.waitText("领取时段奖励",0)&&commons.clickText("领取时段奖励"))
		  {
		     sleep(5000);
	         back();
     	     sleep(1000);
		  }
		}		
	    //领红包：
		getGroupRedPackage();
		clickIndex();
		
    },
    //找出新闻的条目
    findNewsItem:function(){
        app.dlog("找出新闻条目......");
		var newsItem =null;
   	    //var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
		var rootNode=id("layout").findOnce();
		//var rootNode = className("android.widget.RelativeLayout").findOnce();
		//app.findNodeTest(rootNode,0,0);
		//newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,-1);
		//var rootNode= className("android.widget.FrameLayout").findOnce();
    	newsItem=app.findNodeByClassById(rootNode,"android.widget.TextView","tv_title");
	 	if(newsItem){
		   for(var i=0;i<newsItem.childCount();i++){ 
               var childNode= newsItem.child(i);
               if(!childNode)continue;
               var childText=childNode.text();
               var childId= childNode.id();
               app.dlog("text="+childText+" childId="+childId);    			   
		   }			   
			
		}
		//else app.findNodeTest(rootNode,0,0); 
		
		return newsItem;

	
		
    },
	/*
	getNewsTitle:function(newsItem){

        return newsItem.child(1).text();
	},
	*/
	findVideoItem:function(){
		var videoItem=null;
		var rootNode= className("android.widget.FrameLayout").findOnce();
        videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","tv_title");
	    if(!videoItem)app.findNodeTest(rootNode,0,0);  	
		return videoItem;
    	
		     		
    },
	
	getVideoTitle:function(videoItem){
	    if(videoItem&&videoItem.childCount()>1){
		   if(videoItem.child(2))
              return videoItem.child(2).text();
	       else return null;
		}
		else return null;
	},		

	//跳到视频页面：
	jumpToVideo:function(){
	   return clickVideoIndex();
    },

    //时段奖励之后执行
    doingAfterTimeAward:function(){
		app.dlog("doingAfterTimeAward");
        /*
	    if(jumpToChat()){
           app.dlog("点聊一聊界面成功");
		   getOneGroup();
		   getOneRedPack();
		   backToChat();
	    }
		*/
    },
	
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
		if(viewMode=="video"){
		   return false;		
		}
		
		if(commons.text("按住说话"))
			commons.clickText("看一看")
		
	    //领取宝藏
        commons.UIClick("text_ok");
        
		commons.UIClick("bt_ok");      //如阅读奖励提醒，点知道了
	    commons.clickText("知道了");
	    commons.clickText("收下啦");
	    if(commons.text("继续阅读"))commons.clickText("继续阅读"); 
	    if(commons.text("继续观看"))commons.clickText("继续观看"); 
	    
		if(commons.text("领红包")&&commons.clickText("领红包"))
               back(); 			
	
	
		//阅读中
	    commons.clickText("展开查看全文");
		
		
	
     	if(currentPackage()==="com.android.packageinstaller" 
		   && commons.clickText("取消")){
        	return  true;
    	}
		
        return false;
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
    
	checkIsAppVideoPage:function()
	{
		return isAppVideoPage();  //如果是，不要back();
	},

	
    findVideoIndexPage:function()
	{
		return findVideoIndex();
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

function findIndex(){
	var flag=false;
    var indexBtNode    =id("rl_bottom_0").findOnce(); //首页
	var indexBtn1Node  =null;
    var indexTextNode  =text(indexText).findOnce();
	var indexText1Node =text(indexText1).findOnce();
	if((indexBtNode || indexBtn1Node) && (indexTextNode||indexText1Node))flag=true;
	else flag=false;
    return flag;
}

function isAppPage(){
    var flag=false;
    var indexBtNode    =id("rl_bottom_0").findOnce();
	var indexBtn1Node  =null;
	if(indexBtNode)flag=true;
	else flag=false;
    return flag;
   
}


function clickIndex(){
	var flag=false;
    var flag=commons.idClick("rl_bottom_0");
    if(flag)commons.waitText(indexText1,0);
    return flag;	
}

function findVideoIndex(){
	var flag=false;
    var indexBtNode    =id("rl_bottom_1").findOnce();
	var indexBtn1Node  =null;
    var indexTextNode  =text("新鲜事").findOnce();
	var indexText1Node =text("小品").findOnce();
	if((indexBtNode || indexBtn1Node) && (indexTextNode||indexText1Node))flag=true;
	else flag=false;
    return flag;
}

function isAppVideoPage(){
    var flag=false;
    var indexBtNode    =id("rl_bottom_0").findOnce();
	var indexBtn1Node  =id("rl_bottom_1").findOnce();
	if(indexBtNode || indexBtn1Node)flag=true;
	else flag=false;
    return flag;
   
}


function clickVideoIndex(){
   app.dlog("clickVideoIndex()......"); 
   var flag=commons.idClick("rl_bottom_1");
   if(flag)sleep(3000);
   return flag;
  
}


function findChatIndex()
{
	var flag=false;
    var indexBtNode    =id("rl_bottom_2").findOnce();
	var indexBtn1Node  =null;
    var indexTextNode  =text("聊一聊").findOnce();
	var indexText1Node =null;
	if((indexBtNode || indexBtn1Node) && (indexTextNode||indexText1Node))flag=true;
	else flag=false;
    return flag;
	
}



function  findTextItem(textContent)
{
	var rootNode = className("android.widget.FrameLayout").findOnce();
	//app.findNodeTest(rootNode,0,0);
 	var resultItem =app.findNodeByClassByText(rootNode,"android.widget.TextView",textContent,0);
   	return  resultItem;
}

function getGroupRedPackage()
{
	if(jumpToChat()){
       app.dlog("点聊一聊界面成功");
	   getOneGroup();
	   getOneRedPack();
	   publishRedPackage();
	   backToChat();
	}
}

function publishRedPackage()
{
	app.dlog("发红包检查...");
	var idF=id("iv_group_redPacket").findOnce();
	if(idF  && idF.click()){
	    app.dlog("发红包成功");
		sleep(3000);
		getOneRedPack();
	}
	else{
		app.dlog("发红包失败");
	}	
}


function  jumpToChat(){
	if(commons.idClick("rl_bottom_2"))
	{
       sleep(3000);
	   return true;
	}
    else{
      return false;
    }		
}

function  getOneGroup(){
	//上滑找群
    app.dlog("上滑找群...");
	var isFindGroup = false;//是否找到群
    var groupTitle = "";//群名称
    var groupItem=null;    //群条目
    var loopTimeToFind = 0;//循环次数
	var lastGroupTitle=null;
    while((!isFindGroup || lastGroupTitle === groupTitle)  
		  && loopTimeToFind < 5)
    {
   	    loopTimeToFind++;
     	//进行下翻
        if(app.compareVersion()>=0)
		{
		   swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
		   sleep(3000);
		}
    	else{
		   jumpToChat();	
	    }
        //群条目
	    groupItem = findTextItem("红包");
        if(groupItem){
			var groupTitle =null;
			var count =groupItem.childCount();
			for(var i=0;i<count;i++){
			  var childItem= groupItem.child(i);
			  if(childItem)childItem=childItem.child(0);
			  if(childItem)childItem=childItem.child(0);
			  if(childItem)
			  {
				//app.dlog("i="+i+" text="+childItem.text());
			    groupTitle=childItem.text();
			  }
			}
		    if(groupTitle)
			{
		      isFindGroup = true;
		    }
			else
			{
				app.dlog("找到群,但无名称");
         	}			
			
        }
		else
		{
		 	if(isFindGroup)isFindGroup=false;
			app.dlog("没找到群");  
		}
    }
   
    //找到红包群，点击进入
    if(isFindGroup)
	{
        lastGroupText = groupTitle;
        app.dlog("找到群："+groupTitle);
    	var flag=true;
		if(groupItem){
	       if(!groupItem.click())
		   {
		     app.dlog("click play item fail");
		     if(!click("红包"))
		     {
			    app.dlog("click play text fail");
		        if(app.compareVersion()>=0){
                  var bounds = groupItem.bounds();
                  if(bounds && bounds.centerX()>=0 && bounds.centerY()>=0){
			        if(click(bounds.centerX(),bounds.centerY())){
                   	   app.dlog("click play text bounds success:x="+bounds.centerX()+" y="+bounds.centerY());
		    		   sleep(1000);
				    }
				    else
				    {
			            app.dlog("click play text bounds fail");
		    		    flag=false;
				    }
			      }
			      else{
				        app.dlog("click play bounds fail");
		    	        flag=false;
			      }
			    }
			    else 
			    {
				   flag=false; //6.0
				   app.dlog("6.0以下不能点坐标");
		        }
		     }
			 else
			 { 
			   app.dlog("click play text success");
		     }
		   }
		   else{
			  app.dlog("click play item success");
		   }
		   
		}
		else flag=false;
	    if(flag){
		  app.dlog("找到群，已点击进入");
		  //cn.weli.story:id/iv_group_redPacket  ==要发红包的id
		  var idRedP=id("iv_group_redPacket").findOnce();
		  if(idRedP && idRedP.click()){
		     app.dlog("找到群，进入发现可以发红包，发！");
		     sleep(5000);
		  }
		  
        }
		else{
		  app.dlog("找到群，点击未进入");
    	}
	     
	}
	else
	{
        app.dlog("5次滑动没有找到群，请检查");
	}
	//sleep(2000);
	app.dlog("退出获取群");	   
}

function  getOneRedPack(){
	//上滑找红包
    app.dlog("上滑红包...");
	var isFindRed = false;//是否找到红包
    var redItem;    //红包条目
    var loopTimeToFind = 0;//循环次数
    while((!isFindRed)  
		  && loopTimeToFind < 3)
    {
   	    loopTimeToFind++;
     	//进行下翻
        if(app.compareVersion()>=0)
		{
		   swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
		   sleep(2000);
		}
    	else{
	       sleep(3000);    
	    }
        
        //红包条目
        //redItem = findTextItem("来领我的亲情红包");
        redItem = findTextItem("点击领取");
        if(redItem){
			app.dlog("有亲情红包"); 
            var count=redItem.childCount();
			for(var i=0;i<count;i++){
				var child=redItem.child(i);
				if(child)app.dlog("text="+child.text());
			}
			
		    var textItem = app.findNodeByText(redItem,"点击领取");    
			if(textItem){
			  app.dlog("有点击领取");
		      isFindRed = true;
		 	}
		    else {
				app.dlog("没有发现有点击领取");
				textItem = app.findNodeByText(redItem,"已领取");
				if(textItem)app.dlog("发现有已领取");
			}
        }
		else
		{
		 	if(isFindRed)isFindRed=false;
			app.dlog("没找到有效红包");  
		}
    }
   
    //找到红包，点击领取
    if(isFindRed)
	{
        app.dlog("找到红包了");
    	var flag=true;
		if(redItem){
	       if(!redItem.click())
		   {
		     app.dlog("click play item fail");
		     if(!click("点击领取"))
		     {
			    app.dlog("click play text fail");
		        if(app.compareVersion()>=0){
                  var bounds = redItem.bounds();
                  if(bounds && bounds.centerX()>=0 && bounds.centerY()>=0){
			        if(click(bounds.centerX(),bounds.centerY())){
                   	   app.dlog("click play text bounds success:x="+bounds.centerX()+" y="+bounds.centerY());
		    		   sleep(1000);
				    }
				    else
				    {
			            app.dlog("click play text bounds fail");
		    		    flag=false;
				    }
			      }
			      else{
				        app.dlog("click play bounds fail");
		    	        flag=false;
			      }
			    }
			    else 
			    {
				   flag=false; //6.0
				   app.dlog("6.0以下不能点坐标");
		        }
		     }
			 else
			 { 
			   app.dlog("click play text success");
		     }
		   }
		   else{
			  app.dlog("click play item success");
		   }
		   
		}
		else flag=false;
	    if(flag){
		  app.dlog("找到红包，已点击进入");
        }
		else{
		  app.dlog("找到红包，点击未进入");
    	}
	     
	}
	else
	{
        app.dlog("5次滑动没有找到红包，请检查");
	}
	sleep(2000);
	app.dlog("退出获取红包");	   
}


function backToChat(){
	
	var waitCount=0;
	var chatIndex=findChatIndex();
	while(!chatIndex && waitCount<5){
       waitCount++;
	   chatIndex=findChatIndex();
	   if(!chatIndex){
	      back();
	      sleep(1000);
	   }
	}
}


function popWindowProcess()
{
	var adFlag=id("iv_activity").findOnce();
    if(adFlag){
        back();
        sleep(500);
    }
	if(commons.text("试试免费发")){
	    back();
        sleep(500);
    }
	if(commons.text("马上升级")){
	    back();
        sleep(500);
    }
	if(commons.text("继续阅读")){
	    back();
        sleep(500);
    }
}


function isLogin()
{
	var myBtn = id("rl_bottom_4").findOnce();//我的
	var flag=false;
	if(myBtn){
		 flag=myBtn.click();
	}
    if(!flag){
	  exit();
	  return; 
	}
	//app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	sleep(2000);
	flag=commons.text("立即赚钱");
	app.dlog("isLogin()="+flag);
	return !flag;	
}


function loginDone()
{
	 var myBtn = id("rl_bottom_4").findOnce();//我的
	 var flag=false;
	 if(myBtn){
		 flag=myBtn.click();
	 }
     if(!flag){
		exit();
		return; 
	 }
	 commons.waitText("立即赚钱",0);
	 if(!commons.clickText("立即赚钱"))
	 {
        exit();
        return;		
	 }		 
	 
	 /* 	 
     commons.waitText("微信一键登录",0);
	 if(!commons.clickText("微信一键登录"))
	 {
        exit();
        return;		
	 }
	 */
	 var weLogin = id("login_0").findOnce();//text("微信一键登陆").findOnce();
	 if(!weLogin){
		exit(); 
		return;
	 }
	 if(!weLogin.click())
	 {
		exit(); 
		return;
	 }
	 
	 wechatLogin();
	  
	
}

function wechatLogin(){
	 commons.waitText("同意",1);
	 if(!commons.clickText("同意"))
	 {
        exit();
        return;		
	 }
}


function  fillInviteCode(inviteCode)
{
	  if(!inviteCode)return;
	  //填邀请码：
	  var inviteBtn = id("et_input").findOnce();//输入邀请码
	  if(inviteBtn){
	     if(inviteBtn.click())
		 {
			sleep(1000);
			inviteBtn.setText(inviteCode);
			sleep(1000);
			commons.UIClick("iv_done");//领取
			sleep(2000);
		 }
	  }
      var btOk = id("bt_ok").findOnce();//确定 	
	  if(btOk)btOk.click();
	

}	
	  

