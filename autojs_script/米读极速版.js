const commons     = require('common.js');
const templates   = require('template.js');
const runAppName  ="米读极速版"; 
const runAppName1 =null; 
const runPkg      ="com.lechuan.mdwz";
const videoMode   = 1;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）
const smallVideoMode   = 2;  //0=全民小视频（九宫格模式）,1=追看视频/波波视频（竖向列表模式ListView）；2 刷宝模式（单例）

const indexBtn    ="分类";
const indexBtn1    =null;
const indexText   ="男频";
const indexText1  ="女频";
const SETUP       ="设置"; 

templates.init({
    appName:runAppName,
	packageName:runPkg,
	runVideoMode:videoMode,
	runSmallVideoMode:smallVideoMode,
	indexBtnText:indexBtn,
	indexBtnText1:indexBtn1,
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
		
		commons.clickText("福利");
		if(commons.waitText("签到领金币",1)&&commons.clickText("签到"))
		{
		   app.dlog("签到成功");		
		}
		
		clickIndex();
        sleep(1000);
    },
    //找出新闻的条目
    getNovel:function(){
       commons.clickText("找书");
    },
	//时段奖励之后执行
    doingAfterTimeAward:function(){
   	    //if(!findIndex()) 
		//    back();
    },
   
    //阅读页面是否应该返回
    isShouldBack:function(viewMode){
		if(findIndex())return true;
		var adFlag=text("立即下载").findOnce();
	    if(adFlag){
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
	popWindow:function()
	{
	 
      popWindowProcess();
	
    },
	download:function(){
	   commons.yingyongbao(runAppName);
    }
	
});


function popWindowProcess()
{
	app.dlog("popWindowProcess()");
	if(commons.text("选择您喜欢的类型"))
	{
	   commons.clickText("男生频道");
	}

	if(commons.text("立即登录领取"))
	{
       back();  
	}
	
	app.dlog("退出popWindowProcess");	
		
}

function findIndex(){
    var indexBtNode    =commons.text(indexBtn);
	var indexBtn1Node  =false;
    var indexTextNode  =commons.text(indexText);
	var indexText1Node =commons.text(indexText1);
	var flag   =  (indexBtNode || indexBtn1Node) && (indexTextNode||indexText1Node);
	app.dlog("findIndex():flag="+flag);
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
	if(!commons.clickText(indexBtn))return false 
	else
	{
		return true;
	}
}



function isLogin()
{
	if(commons.text("立即登录领取"))return false;
	commons.clickText("我的")
	if(commons.waitText("我的钱包",0)
	   &&commons.text("登录后看小说赚金币",0)
	)
	     return false;
	else
	
	     return true;

}

function loginDone()
{
	if(commons.text("立即登录领取")){
	   commons.clickText("立即登录领取");	
	}
    else{

	   commons.clickText("我的");
       if(commons.waitText("我的钱包",0)
	      &&commons.text("登录后看小说赚金币",0)
	   )
	   {
	      commons.clickText("立即提现");	
	   }
 	}	
    if(commons.waitText("微信一键登录",0)
		&&commons.clickText("微信一键登录"))
 	       wechatLogin();
     	
}

function wechatLogin(){
	app.dlog("wechatLogin");
	if(commons.waitText("同意",0))
	{
	   commons.clickText("同意");	
	}
    
	if(commons.text("登陆微信"))
	{
	   app.dlog("微信没有登录，请登陆后再操作");
	   exit();	
	}	
	
}

function  fillInviteCode(inviteCode)
{
	if(!inviteCode)return;
    var waitCount=0;

}


