const commons    = require('common.js');
const templates  = require('template.js');
const runAppName = "全民小视频"; 
const runPkg      ="com.baidu.minivideo";
const videoMode   = 0;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）
const indexBtn    ="首页"
const indexBtn1    =null;
const indexText   ="直播";
const indexText1  ="发现";


templates.init({
    appName:runAppName,
	packageName:runPkg,
	runMode:"视频",
	runVideoMode:videoMode,
	indexBtnText:indexBtn,
    indexBtnText:indexBtn1,
    indexFlagText:indexText,
	indexFlagText1:indexText1
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
		
		app.dlog("signIn");
	    var idF=id("view_index_top_inner_container").findOnce();
		if(!idF){
			return;
		}
		idF=idF.child(0);
		if(!idF)
		{
	      return;
		}
		if(!idF.click()){
		  return;
		}
		var waitCount  =   0;
		var cashW=text("领现金").findOnce();
		while(!cashW && waitCount<15){
			waitCount++;
			cashW=text("领现金").findOnce();
			if(!cashW)sleep(1000);
		}
		app.dlog("到了领现金");
		waitCount=0;
		var flag=false;
		while(!flag && waitCount<15){
		   waitCount++;
		   flag=commons.clickWebViewText("android.widget.FrameLayout","点我得钻石");
		   if(!flag)
		   {
			  if(text("今日次数已用完").findOnce()){
		          break;
		      }
		      sleep(1000);
		   }
		}
		if(flag){
			
		}
		
		back();
		sleep(1000);
		
    },
    //找出视频
    findVideoItem:function(){  
        var videoItem=null;
		var rootNode= className("android.widget.FrameLayout").findOnce();
        //app.findNodeTest(rootNode,0,0);
		videoItem=app.findNodeByClassById(rootNode,"android.widget.TextView","index_text_title");
        /*
		if(videoItem)
		{
		   var childNode= videoItem.child(0);
		    if(childNode){  
			   var textN= childNode.text();
			   app.dlog("text="+textN);
			   if(textN  && !childNode.click()){
		           commons.UITextBoundsClick(textN);
			   }				  
			}
		}
		*/
		return videoItem;
      
    },

	//时段奖励之后执行
    doingAfterTimeAward:function(){
    
	   
    },
	
	
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
       return false;
    },
	findIndexPage:function()
	{
		return findIndex();
	},
    checkIsAppPage:function()
	{
		return isAppPage();  //如果是，不要back();
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
	
    }

});

function popWindowProcess()
{
	 var popW=desc("谢谢观看").findOnce();
	 if(popW)click("我知道了");
}


function findIndex(){
	var flag=false;
    var indexBtNode    =text(indexBtn).findOnce();
	var indexBtn1Node  =text(indexBtn1).findOnce();
    var indexTextNode  =text(indexText).findOnce();
	var indexText1Node =text(indexText1).findOnce();
	if((indexBtNode || indexBtn1Node) && (indexTextNode||indexText1Node))flag=true;
	else flag=false;
    return flag;
}

function isAppPage(){
    var flag=false;
    var indexBtNode    =text(indexBtn).findOnce();
	var indexBtn1Node  =text(indexBtn1).findOnce();
	if(indexBtNode || indexBtn1Node)flag=true;
	else flag=false;
    return flag;
}



function clickIndex(){
	
	var flag=false;
	var textW=text(indexBtn).findOnce();
    if(textW)textW=textW.parent();
    if(textW)
	{  
       flag=textW.click();
	   if(!flag)
		  flag=click(indexBtn);	
	}
	else{
	   if(indexBtn1){	
	      textW=text(indexBtn1).findOnce();
          if(textW)textW=textW.parent();
          if(textW)
	      {  
            flag=textW.click();
	        if(!flag)
		      flag=click(indexBtn1);	
	      }
	   }
	}
    return flag;
 
}





function isLogin()
{
	return true;    	
}


function loginDone()
{
     	

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

