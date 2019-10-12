const commons    = require('common.js');
const templates  = require('template.js');
const runAppName = "火山极速版"; 
const runPkg      ="com.ss.android.ugc.livelite";
const indexBtn    ="视频"
const indexBtn1    =null;
const indexText   ="影视圈";
const indexText1  ="红包";


templates.init({
    appName:runAppName,
	packageName:runPkg,
	runMode:"视频",
	indexBtnText:indexBtn,
    indexBtnText:indexBtn1,
    indexFlagText:indexText,
	indexFlagText1:indexText1,
	
});

templates.run({
    checkLogin:function(){
        return isLogin(); 
	},   
    login:function(){
     app.dlog("login......");
        var inviteCode  =  app.getPrefString(runAppName+"_inviteCode"); 
        app.dlog("inviteCode="+inviteCode);
        if(!inviteCode){
           if(!confirm("请问朋友要邀请码，再点【确定】"))
		   {
              exit();
		   }
		   inviteCode = rawInput("请输入邀请码");
		   if(inviteCode =="")
		   {
			  app.dlog("输入的邀请码为空");
			  exit(); 
		   }
		   app.dlog("输入的邀请码="+inviteCode);
		   app.setPrefString(runAppName+"_inviteCode",inviteCode);
		  
		}
	    loginDone();
	    fillInviteCode(inviteCode);
	    app.dlog("登陆完成");

	},
 	//签到
    signIn:function(){
	   app.dlog("签到......");	
       if(!commons.clickText("红包"))return;
       sleep(5000); 
	   //app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
       popWindowProcess();
	   commons.clickClassName("android.view.View");	
       if(commons.clickText("签到")){
		  app.dlog("签到成功");  
       }
	   else 
		  app.dlog("签到失败");  
     
	   //app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	   if(!commons.clickText("开宝箱得金币")){
		   app.dlog("签到：没有发现开宝箱得金币");  
    	   return;
	   }
	   app.dlog("进入开宝箱得金币"); 
       sleep(5000);	   
   
       popWindowProcess();
   
	   if(commons.clickText("看视频 领100金币")
		  ||commons.clickText("看视频 领双倍金币") 
		 )
	   {
		  
		  app.dlog("进入看视频 领......");  
          commons.waitPlayVideoAdByText("关闭广告");
		  sleep(5000);
	   }
	   else app.dlog("签到：没有进入看视频 领100金币");
	   
	   
	   clickIndex();
		
    },
    //找出视频
    findVideoItem:function(){
        var videoItem=null;
		var rootNode= className("android.widget.FrameLayout").findOnce();
		//app.findNodeTest(rootNode,0,0);
		videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","yc",0,0);
    	if(!videoItem)videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","x6",0,0);
        if(!videoItem)videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","o4",0,0);
        if(videoItem){
			  //var classBar=className("android.widget.ProgressBar").findOnce();
              //if(classBar)classBar.scrollDown();
              var count  =  videoItem.childCount();
		      for(var i=0;i<count;i++){
			    var childNode= videoItem.child(i);
			    if(childNode==null)continue;  
			    var textN= childNode.text();
				var idN=childNode.id();
			    app.dlog("index="+i+" text="+textN+" id="+idN);
				if(textN && (idN.indexOf("x6")>=0||idN.indexOf("o4")>=0||idN.indexOf("yc")>=0)){
                    app.dlog("查看是否有弹窗");
					if(commons.findText("看视频赚钱技巧")){
		                back();
		                sleep(1000);
	                }
					else
					   app.dlog("没有弹窗");
						
	   		        commons.clickText(textN);
			    }				  
			  
		      }

		}
		return videoItem;
    },
	getVideoTitle:function(videoItem){

        return videoItem.child(3).text();
	},

	//时段奖励之后执行
    doingAfterTimeAward:function(){
    	   
     
    },
	
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
	   if(findIndex())return true;	
	   commons.clickText("点击领取");	
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
	checkIsAppVideoPage:function()
	{
		return isAppPage();  //如果是，不要back();
	},
	findVideoIndexPage:function()
	{
		return findIndex();
	},
	clickVideoIndexPage:function()
	{
		return clickIndex();
	},
	popWindow:function(){
	  popWindowProcess();
	
    },
	download:function(){
	   commons.yingyongbao(runAppName);
    }

});


function gotoTask1(){
   app.dlog("做任务1...");  
   if(!commons.clickText("红包")){
       popWindowProcess();
 	   clickIndex();
       return;
   }
   sleep(2000);
   popWindowProcess();
   
   //app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
   app.dlog("进入看视频赚海量金币......");  
   if(jumpToEarnCoinByViewVideo())
   {
	  app.dlog("已进入看视频赚海量金币");  
      var waitCount=0;
	  while(waitCount<20)
	  {
	    waitCount++;
	    popWindowProcess();
 		//app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	    if(commons.clickText("领100金币"))
	    {
		    app.dlog("进入领100金币");  
            commons.waitPlayVideoAdByText("关闭广告");
	        sleep(5000);       		
	    }
        else break;
			
	  }
	  app.dlog("退出看视频赚海量金币");  
     
   }
   else
   {
	  app.dlog("不能进入看视频赚海量金币"); 
    
   }	   
 
   clickIndex();
  
   
       


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



function popWindowProcess()
{
	 //app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	 
	 var popW=desc("谢谢观看").findOnce();
	 if(popW)commons.clickText("我知道了");
	
     if(commons.clickText("打开推送")){
		 
		 back();
		 sleep(1000);
	 }
	 if(commons.findText("看视频赚钱技巧")){
		 back();
		 sleep(1000);
	 }
	 
     commons.clickText("好的");
	 commons.clickText("以后再说");
	 commons.clickText("javascript:;"); //立即领取的X //text=图片，可点
	 if(commons.text("今日看视频总收益:")){
		 back();
		 sleep(200);
	 }		 
		  
}


function findIndex(){
	//app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	var flag=false;
    var indexBtNode    =text(indexBtn).findOnce();
	var indexBtn1Node  =text(indexBtn1).findOnce();
    var indexTextNode  =text(indexText).findOnce();
	var indexText1Node =text(indexText1).findOnce();
	if(indexBtNode || indexBtn1Node || indexTextNode||indexText1Node)flag=true;
	else flag=false;
    return flag;
}

function isAppPage(){
    return findIndex();
}



function clickIndex(){
	return commons.clickText("视频");
}

function jumpToEarnCoinByViewVideo()
{
	return commons.jumpToItemByText("android.widget.FrameLayout","看视频赚海量金币",10);
}

function checkVideoValid()
{
	//app.findTextNode(className("android.widget.FrameLayout").findOnce(),"累计观看视频30分钟");
	var waitCount=0;
    var descViewVideo=desc("累计观看视频30分钟").findOnce();
	while(!descViewVideo && waitCount<5){
        waitCount++;
        if(!descViewVideo)
		{
		   swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
		   sleep(1000);
		   descViewVideo=desc("累计观看视频30分钟").findOnce();
    	}
	}		
    if(waitCount>=5)return false;
	if(!descViewVideo)return false;
	
	var parentF=descViewVideo.parent();
    if(!parentF)return false;
    var flag=false;
	for(var  i=0;i<parentF.childCount();i++){
       var chlidNode  = parentF.child(i);
       if(!chlidNode)continue;	   
       var childText= chlidNode.text();
	   if(childText&&childText==="已完成"){
	     flag=true;
		 break;
	   }
	}		
	return flag;
}

function isLogin()
{
	if(commons.text("注册/登录"))return false;
	commons.clickText("红包");
	commons.waitText("现金余额",0);
	return !commons.text("登录查看余额");    	
}


function loginDone()
{
	if(commons.text("注册/登录")){
       commons.clickText("注册/登录"); 
 	}
	else{
	   commons.clickText("红包");  
	   if(!commons.text("登录查看余额"))
          commons.waitText("登录查看余额",0);
	   commons.clickText("登录查看余额"); 
 	}
	if(!commons.text("微信登录"))
       commons.waitText("微信登录",0);
	if(!commons.clickText("微信登录"))
	{
	   exit();
	}
	wechatLogin(); 	

}

function wechatLogin(){
	app.dlog("wechatLogin()......");
	if(!commons.text("同意"))
	   commons.waitText("同意",0);
	commons.clickText("同意");
    if(commons.text("登陆微信")){
	   app.dlog("微信没有登录，请登陆后再操作");
	   exit();	
	}
}

function  fillInviteCode(inviteCode)
{
	app.dlog("fillInviteCode()......");
	if(!inviteCode)return;
    app.dlog("fillInviteCode():inviteCode="+inviteCode);
	commons.clickText("红包");
	sleep(3000);
	//app.findNodeTest(className("android.widget.FrameLayout").findOnce(),0,0);
	commons.clickText("输入邀请码");
	sleep(3000);
    if(!commons.findText("马上提交")){
	   commons.waitText("马上提交",1);
	   if(!commons.findText("马上提交"))
	   {
         if(!confirm("需要手动点【输入邀请码】。请点【确定】后，点【输入邀请码】")){
    	    app.dlog("取消了手动点【输入邀请码】");
		    return;
	     }
         else{
    	    app.dlog("手动点了【输入邀请码】");
		    sleep(10000);   
		 }     
			   
	   }	   
	}
    app.dlog("已进入马上提交页面");
	var inEdit=app.findTextNodeOf(className("android.widget.FrameLayout").findOnce(),"输入好友的邀请码");    
  	if(!inEdit)
	{
	    for(var i=0;i<5;i++){
           sleep(1000); 
           inEdit=app.findTextNodeOf(className("android.widget.FrameLayout").findOnce(),"输入好友的邀请码");
		   if(inEdit)
		   {
			 break; 	
		   }
	    } 		  
	}
	if(!inEdit)
	{
		app.dlog("点了【输入邀请码】后，没有找到输入邀请码");
	    return;
	}
    inEdit.setText(inviteCode);
	app.dlog("已点输入邀请码,进入马上提交页面");
	sleep(1000);
	commons.clickText("马上提交");
	sleep(3000);
	if(!commons.findText("马上提交"))
	{
	   app.dlog("点了【马上提交】后，成功");
	   return;	 
	}	 
		 
	if(!confirm("需要手动点【马上提交】。请点【确定】后，点【马上提交】")){
    	    app.dlog("取消了手动点【马上提交】");
		    return;
	}
    else
	{
    	app.dlog("手动点了【马上提交】");
		sleep(10000);
	}
	
    app.dlog("退出填输入邀请码");
	

}
