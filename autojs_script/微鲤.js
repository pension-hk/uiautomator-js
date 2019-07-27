const commons = require('common.js');
const templates = require('template.js');
const runAppName ="微鲤"; 


templates.init({
    appName:runAppName,
    indexFlagText:"发布",
    timeAwardText:"领红包",
});

templates.run({
    //获取首页按钮
    getIndexBtnItem:function(){
        return id("rl_bottom_1").findOnce();
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
        commons.UIClick("rl_bottom_4");
        sleep(1000);
        commons.UIClick("ll_not_sign");
        sleep(1000);
		commons.UITextClick("立即签到");
        sleep(1000);
		back();
        sleep(1000);
        commons.UIClick("rl_bottom_1");
    },
    //找出新闻的条目
    findNewsItem:function(){
        toast("找出新闻条目");
        //领取宝藏
        commons.UIClick("text_ok");
        commons.UIClick("bt_ok");
		var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();//fu,go
	    var newsItem = commons.findParentOfTextWiew(rootNode);
		return newsItem;
		
    },
    //时段奖励之后执行
    doingAfterTimeAward:function(){
        back();
    },
    //阅读页面是否应该返回
    isShouldBack:function(){
	    if(findIndex())return true;
	
        //领取宝藏
        commons.UIClick("text_ok");
        commons.UIClick("bt_ok");      //如阅读奖励提醒，点知道了

        return false;
    },
	popWindow:function(){
	    var adFlag=id("iv_activity").findOnce();
        if(adFlag){
           back();
           sleep(500);
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
   return text("美食").findOnce(); 
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
