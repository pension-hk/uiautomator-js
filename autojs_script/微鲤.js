const commons = require('common.js');
const templates = require('template.js');
const runAppName ="微鲤"; 
const runPkg     ="cn.weli.story";

const indexBtn    ="头条"
const indexBtn1    =null;
const indexText   ="美食";
const indexText1  =null;


templates.init({
    appName:runAppName,
	packageName:runPkg,
	indexBtnText:indexBtn,
	indexBtnText1:indexBtn1,
	indexFlagText:indexText,
	indexFlagText1:indexText1,	
    timeAwardText:"领取时段奖励",
});


templates.run({
    //获取首页按钮
    getIndexBtnItem:function(){
        return id("rl_bottom_1").findOnce();
    },

    //签到
    signIn:function(){
        
		app.dlog("签到");
		if(!commons.idClick("rl_bottom_4"))
		{
           app.dlog("点我的失败");
		   return;
		}			
        if(!commons.idClick("ll_not_sign"))//签到
		{
           app.dlog("点签到失败");
		   return;
		}
        var waitCount = 0;
		var classN=className("android.webkit.WebView").findOnce();
        while(!classN && waitCount<15){
           waitCount++;
		   classN=className("android.webkit.WebView").findOnce();
		   sleep(1000);
		}			
        
		app.dlog("签到界面waitCount="+waitCount);
	    sleep(5000);
		if(classN){
           app.dlog("点立即签到");
		   var flag=commons.clickWebViewElement("android.widget.FrameLayout","android.widget.Button","立即签到")
   	       //desc("立即签到").findOnce();//click("立即签到");
		   if(flag){
			  app.dlog("立即签到id=true");
		   }
		   else
			  app.dlog("立即签到id=false");
			   
		}
	   
        back();
     	sleep(1000);
        //commons.idClick("rl_bottom_1");
		//领红包：
		if(jumpToChat()){
           app.dlog("点聊一聊界面成功");
		   getOneGroup();
		   getOneRedPack();
		   backToChat();
	    }
		commons.idClick("rl_bottom_1");
		
    },
    //找出新闻的条目
    findNewsItem:function(){
        //领取宝藏
        commons.UIClick("text_ok");
        commons.UIClick("bt_ok");
		app.dlog("找出新闻条目");
		var newsItem =null;
   	    var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	    //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		     newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,-1);
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,3);
		return newsItem;

	
		
    },
	
	findVideoItem:function(){
		var videoItem=null;
		var rootNode= className("android.support.v7.widget.RecyclerView").findOnce();
        app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		    videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,2);
		else videoItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,2);
	    return videoItem;
             		
    },
	
	getVideoTitle:function(videoItem){

        return videoItem.child(2).text();
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
	
	//跳到视频页面：
	jumpToVideo:function(){
	   var videoId  = id("rl_bottom_2").findOnce();
	   if(!videoId)return false;
	   if(!videoId.click())
	      return click("视频");
	   return true;
    },
    //阅读页面是否应该返回
    isShouldBack:function(){
	  
		
	    //领取宝藏
        commons.UIClick("text_ok");
        
		commons.UIClick("bt_ok");      //如阅读奖励提醒，点知道了
	    
		//阅读中
		click("展开查看全文");
		//commons.clickWebViewText("android.widget.FrameLayout","展开查看全文")
	
		
		
        return false;
    },
    findIndexPage:function()
	{
		return findIndex();
	},
	clickIndexPage:function()
	{
		return clickIndex();
	},

	
	popWindow:function(){
	    popWindowProcess();
	
	  
    },
	waitRefresh:function(){
       var waitCount=0;
       while(waitCount<10)
	   {
	 	   waitCount++;
		   if(text("刷新中").findOnce())break;
		   sleep(1000);
	   }
	   var textRef=text("刷新中").findOnce();
	   waitCount=0;
	   while(textRef && waitCount<10)
	   {
	       waitCount++;
		   textRef=text("刷新中").findOnce();
		   sleep(1000);
	   }
	    app.dlog("刷新中退出waitCount="+waitCount);
	  
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
	var indexW  = id("rl_bottom_1").findOnce();
	var indexW1 = text(indexBtn).findOnce()||text(indexBtn1).findOnce()||text(indexText).findOnce()||text(indexText1).findOnce();
	return indexW && indexW1;
}

function clickIndex(){
	var flag=false;
	var clickW=id("rl_bottom_1").findOnce();
    if(clickW)
	{  
       flag=clickW.click();
	   if(!flag && indexBtn)
		  flag=click(indexBtn);	
	   if(!flag && indexBtn1)
		  flag=click(indexBtn1);	
	   
	}
    return flag;	
}


function  findTextItem(textContent)
{
	var rootNode = className("android.widget.FrameLayout").findOnce();
	//app.findNodeTest(rootNode,0,0);
 	var resultItem =app.findNodeByClassByText(rootNode,"android.widget.TextView",textContent,0,0,-1);
   	return  resultItem;
}



function  jumpToChat(){
	if(commons.idClick("rl_bottom_0"))
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
    var groupItem;    //群条目
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
				//app.dlog("i="+i+" text="+child.text());
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
	
    back();
	sleep(1000);
	back();
	sleep(5000);
			
	
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

function popWindowProcess()
{
	var adFlag=id("iv_activity").findOnce();
    if(adFlag){
        back();
        sleep(500);
    }
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

function loginDone(){
	 var myBtn = id("rl_bottom_4").findOnce();//我的
	  if(myBtn){
		 myBtn.click();
	     sleep(2000);
	  }
     
	  toast("登陆领红包");       	  
	  var loginBtn=loginBtn=id("et_login").findOnce();//("立即赚钱").findOnce();
	  if(loginBtn)
	  {
		 loginBtn.click();
		 sleep(2000);
	  } 	 
      wechatLogin();
	  
	
}

function wechatLogin(){
	 //微信一键登陆：
	 var wechatLogin = id("login_0").findOnce();//text("微信一键登陆").findOnce();
	 if(!wechatLogin)return;
	 wechatLogin.click();
	 sleep(2000); 
	 var currentClass=className("android.widget.ScrollView").findOnce();
	 var waitCount = 0;
	 while(!currentClass  && waitCount<20)
	 {
		waitCount++; 
		currentClass=className("android.widget.ScrollView").findOnce(); 
		sleep(1000);
	 }
		 
	 var agreeBtn  =  text("同意").findOnce();
	 if(!agreeBtn)agreeBtn=id("eb8").findOnce();
	 if(agreeBtn)agreeBtn.click();
		 
	 waitCount = 0;		
     while(currentClass && waitCount<30)
	 {
		 waitCount++; 
		 currentClass=className("android.widget.ScrollView").findOnce(); 
		 sleep(1000);
	 }
	 toast("登陆退出,waitCount="+waitCount);
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
	  


function downloadProcess(appName)
{  
	commons.yingyongbao(appName);	
}
