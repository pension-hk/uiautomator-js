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
	indexFlagText1:indexText1
});

templates.run({
    
 	//签到
    signIn:function(){

		
    },
    //找出视频
    findVideoItem:function(){  
        var videoItem=null;
		var rootNode= className("android.widget.FrameLayout").findOnce();
        //app.findNodeTest(rootNode,0,0);
		if(text(indexText).findOnce()){
		  videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","x6",0,0);
          if(videoItem){
		      var count  =  videoItem.childCount();
		      for(var i=0;i<count;i++){
			    var childNode= videoItem.child(i);
			    if(childNode==null)continue;  
			    var textN= childNode.text();
			    app.dlog("index="+i+" text="+textN);
				if(textN){
                   commons.UITextBoundsClick(textN);
			    }				  
			  
		      }

		  }
		}
		else
		{
		   videoItem=text("说点什么...").findOnce();
		
		}
		return videoItem;
        
		/* 
	     var videoItem= className("android.widget.FrameLayout").findOnce();
    	app.findNodeTest(videoItem,0,0);
		app.printCurrentViewPageInfo();
		if(videoItem)videoItem.click();
		return videoItem;
        */ 
    },
	getVideoTitle:function(videoItem){

        return videoItem.child(3).text();
	},

	//时段奖励之后执行
    doingAfterTimeAward:function(){
    
	   
    },


	
    //阅读页面是否应该返回
    isShouldBack:function(){
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
	
    }

});

function popWindowProcess()
{
	 var popW=desc("谢谢观看").findOnce();
	 if(popW)click("我知道了");
}




function findIndex(){
	if(text("视频").findOnce()||text("影视圈").findOnce()||text("红包").findOnce())return true;
    else
         return false		
}

function clickIndex(){
	
	var flag=false;
    var clickW=text("视频").findOnce();
	if(clickW && clickW.parent()){ 
	  flag=clickW.parent().click();
	  if(!flag)flag=click("视频");
	}
 	return flag;
 
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
			back();   
			sleep(1000);
			var curPkg = currentPackage();
			toast("curPkg="+curPkg);
			if(curPkg != runPkg)
			{
				if(!app.launchApp(runAppName))
					app.launchApp(runAppName1);
			}
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
		 
		 uiele = text("去授权").findOnce();
         if(uiele){
            uiele.click();
            sleep(2000);
         }
		 if(findIndex())
	     {
			waitFlag=false;
			break;
			
	     }
	     else{ 	 
            back();
            sleep(1000);			
		 	var curPkg = currentPackage();
			toast("curPkg="+curPkg);
			if(curPkg != runPkg)
			{
				if(!app.launchApp(runAppName))
					app.launchApp(runAppName1);
			}
		 }
	  }	
	  toast("登陆：app 启动成功");
}

function loginDone()
{
	  var indexBrn = text("我").findOnce();
	  if(indexBrn)
	  {
	  	click("我");
	  }
	  sleep(1000);
	  
	  var loginTip=text("请输入手机号").findOnce();
	  var waitCount = 0;
	  while(!loginTip  && waitCount<20)
	  {
		 waitCount++; 
		 loginTip=text("请输入手机号").findOnce(); 
		 sleep(1000);
	  }
	  var loginWechat=id("login_weixin").findOnce();
	  if(!loginWechat)return;
	  loginWechat.click();
	  sleep(2000);
	  wechatLogin();
	  
}

function wechatLogin(){
	 //微信一键登陆：
	 var pkg="com.tencent.mm";
	 var classTarget="android.widget.ScrollView";
	 var currentPkg= currentPackage();
	 if(currentPkg !=  pkg){
	     toast("非微信登陆界面");
		 return;
	 }
	 toast("点击微信登陆后,当前包名="+currentPkg);
	 
	 var rootNode = className("android.widget.LinearLayout").findOnce();
	                      
	 var classN=app.findSelfOfClass(rootNode,"android.widget.ScrollView");
	 toast("点击微信登陆后,classN 0="+(classN==null)?"null":classN.className());
	 var waitCount = 0;
	 while(!classN  && waitCount<20)
	 {
		waitCount++; 
		classN=app.findSelfOfClass(rootNode,"android.widget.ScrollView"); 
		sleep(1000);
	 }
	 toast("点击微信登陆后,classN 1="+(classN==null)?"null":classN.className());
	
	 waitCount = 0;		
	 while(classN && waitCount<20)
	 {
		 waitCount++; 
		 var agreeBtn  =  text("同意").findOnce();
	     if(!agreeBtn)agreeBtn=id("eb8").findOnce();
	     if(!agreeBtn)agreeBtn=text("确认登陆").findOnce();
	     if(!agreeBtn)agreeBtn=id("c1u").findOnce();
	     if(agreeBtn)agreeBtn.click();
		 classN=app.findSelfOfClass(rootNode,"android.widget.ScrollView"); 
		 sleep(1000);
	 }
	 toast("点击微信登陆后,classN 2="+(classN==null)?"null":classN.className());
	
	 toast("登陆退出,waitCount="+waitCount);
}

	  


function  fillInviteCode(inviteCode)
{
		 
	     //填邀请码：
	     toast("填邀请码，先到我的");
         waitIndex();
		 //进我的：
		 var indexBrn = text("我").findOnce();
	     if(indexBrn)
	     {
	  	    click("我");
	     }
	     sleep(2000);

		 
		 
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

