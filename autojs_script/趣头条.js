const commons = require('common.js');
const templates = require('template.js');
const runAppName = "趣头条";

templates.init({
    appName:runAppName
});

templates.run({
	
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
	  //loginDone();
	  //fillInviteCode(inviteCode);
	  toast("登陆完成");
	  
	},
    
    //签到
    signIn:function(){
		var  textTask=text("任务").findOnce();
		if(!textTask){
		  var textToSign=text("去签到").findOnce();
  	      if(textToSign)textToSign.click();
          sleep(2000);
		  var  textSignTip=text("开启提醒").findOnce();
		  if(textSignTip)textSignTip.click();
		  sleep(2000);
		  var textAllAllow=text("始终允许").findOnce();
		  if(textAllAllow)textAllAllow.click();
		}
		
    },
    //找出新闻的条目
    findNewsItem:function(){
        /*
  	    var newsItem=null;
		var recyclerView = className("android.support.v7.widget.RecyclerView").findOnce();//fu,go
        if(!recyclerView)return null;
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
           var idAllow = id("permission_allow_button").findOnce(); //始终允许
		   if(idAllow){
			   idAllow.click();
		   }
		}		
	    return newsItem;
    },
    //阅读页面是否应该返回
    isShouldBack:function(){
	    //图集直接返回
        var imgItem = className("android.support.v4.view.ViewPager").className("ImageView").findOnce();
        if(imgItem){
            return true;
        }
		var idTg = id("tg").findOnce();
		if(idTg)idTg.click();
        //请完成验证，。。。
		//向右滑动滑块填充拼图
		if(desc("向右滑动滑块填充拼图").findOnce())
		{
		   toast("趣头条阅读新闻需滑块验证"); 
		  
		}
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
	  //弹窗 id：aam=打开得18元  ；id：aan=先去逛逛
	  //点aam,得到：
	  //微信登陆：com.jifen.qukan:id/b1u，点b1u，得到【微信一键登陆】：com.jifen.qukan:id/b73，点b73，得到  同意：com.tencent.mm:id/eb8
	  //点同意，得到：请输入手机确认安全：请输入11位手机号码com.jifen.qukan:id/jq
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
		 //弹窗 id：aam=打开得18元  ；id：aan=先去逛逛
	     if(id("aam").findOnce()||text("先去逛逛").findOnce())
		 {
            commons.UIClick("aam");
			sleep(2000);
			commons.UIClick("blu");  //微信登陆
			sleep(2000);
			waitFlag=false;
			break;
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
	  toast("登陆：app 启动成功,waitCount="+waitCount+" waitFlag="+waitFlag);
}

function loginDone(){
	 
      wechatLogin();
	  
	
}

function wechatLogin(){
	 //微信一键登陆：
	 var wechatLogin = id("b73").findOnce();//text("微信一键登陆").findOnce();
	 if(!wechatLogin)return;
	 wechatLogin.click();
	 sleep(2000); 
	 var textPhone=text("请输入手机号码").findOnce();
	 var waitCount = 0;
	 while(!textPhone  && waitCount<5)
	 {
		waitCount++; 
		textPhone=text("请输入手机号码").findOnce(); 
		//toast("请输入手机号码");
		sleep(1000);
	 }
	 waitCount=0;
	 while(textPhone  && waitCount<20)
	 {
		waitCount++; 
		var phoneNumber=text("请输入11位手机号码").findOnce();
		if(phoneNumber)phoneNumber=phoneNumber.text();
		if(phoneNumber.length==11){
	       commons.UIClick("h3"); //获取短信验证码
           sleep(1000);
		}
		textPhone=text("请输入手机号码").findOnce(); 
		sleep(2000);
	 }
     
	 //请输入短信验证码：
	 waitCount=0;
	 //调试到这
	 
	 
	 
	
	 var agreeBtn  =  text("同意").findOnce();
	 if(!agreeBtn)agreeBtn=id("eb8").findOnce();
	 if(!agreeBtn)return;
	 agreeBtn.click();
		 
	 waitCount = 0;		
     while(currentClass && waitCount<30)
	 {
		 waitCount++; 
		 currentClass=className("android.widget.ScrollView").findOnce(); 
		 sleep(1000);
	 }
	 toast("登陆退出,waitCount="+waitCount); 
	 sleep(2000);
	
}

function  fillInviteCode(inviteCode)
{
	  var runPkg=getPackageName(runAppName);
	  toast("填邀请码");
	  inviteCode="123456";
	  if(!inviteCode)return;
   
      toast("等待首页");
	   
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
  
      toast("退出等待首页，waitCount="+waitCount+"  waitFlag="+waitFlag);
	
      commons.UITextBoundsClick("我的");
	  sleep(2000);
	 
      toast("上翻找输入邀请码");
	  var waitCount = 0;//循环次数
      var inviteBtn = text("输入邀请码").findOnce();//输入邀请码
	  while(!inviteBtn  && waitCount < 20){
        waitCount++;
        //进行下翻
        
		swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
     	sleep(1000);
        inviteBtn = text("输入邀请码").findOnce();
	  
	  } 
	  toast("退出上翻找，waitCount="+waitCount);
	  
	  if(!inviteBtn ||  waitCount>=20)return;
	  if(!inviteBtn.click()){
	     toast("点击失败，再点父类");
	     inviteBtn=inviteBtn.parent();
	  }
      if(!inviteBtn){
		toast("找不到父类");
	    return;
	  }
	  if(!inviteBtn.click())
	  {
		 click("输入邀请码"); 
	  }
	  
	  sleep(1000);
      var fillInvite=text("填写邀请码").findOnce();  
	  if(!fillInvite) {
		  toast("找不到填写邀请码");
		  return;
	  }
      toast("输入邀请码:");
	  
	  var inputInvite = id("et_input").findOnce();
	  if(!inputInvite)return;
	  inputInvite.click();
	  sleep(1000);
	  inputInvite.setText(inviteCode);
	  sleep(1000);
	  commons.UIClick("iv_done");//领取
	  sleep(2000);
      
	  var btOk = id("view_get").findOnce();//提交邀请码	
	  if(btOk)btOk.click();
	

}	

function downloadProcess(appName)
{  
	commons.yingyongbao(appName);
    
}
