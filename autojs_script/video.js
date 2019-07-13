const utils = require('./common.js');

var template = {};

/**
 * 初始化参数
 */
var initParam = {
    appName:"",//应用名称
    lastNewsText:"",//上一次新闻标题

    totalNewsReaded : 0,//已经阅读的新闻条数
    totalNewsOneTime : 50,//一次性阅读多少条新闻
    loopTimeToFindNews : 20,//找了多少次新闻找不到会退出

    indexBtnText: "首页", //其他页面挑到首页的按钮文字，重要！
	indexBtnText1: "刷新", //其他页面挑到首页的按钮文字，重要！	
    indexFlagText : "刷新",//首页特有的标志文字，重要！
    indexFlagText1 : "扫一扫",//首页特有的标志文字，重要！
    indexFlagText2 : "搜索你感兴趣的内容",//首页特有的标志文字，重要！
    timeAwardText : "领取",//时段奖励关键字
}
template.init = function(param){
    Object.assign(initParam, param);
}

/**
 * 运行
 * 需要的方法
 * 1、签到：signIn
 * 2、寻找一条新闻条目：findVideoItem
 */
template.run = function(fun){
    /**
     * 启动
     */
    utils.wakeUp(); 
	
	if(template.downloadApp(fun.download))
	{
		exit();
		
	}
	
    
	if(!utils.launch(initParam.appName))
	{
	   template.launch(fun.getAppName);
	}

    /**
     * 自动更新
     */
    template.autoUpdate(fun);

    /**
     * 回归首页的位置
     */
    template.jumpToIndex(fun.getIndexBtnItem);
  
		
    /**
     * 签到
     */
    
    if(fun.signIn != null){
        fun.signIn();
        
    }
    
    toast("签到执行完成");

    /**
     * 看视频流程
     */
     
    while(true){
        //领取时段奖励
        //template.getTimeAward(fun.doingAfterTimeAward);
        //找到一段视频
        template.getOneVideo(fun.findVideoItem);
        //看视频30s
        template.viewVideo(30,fun.isShouldBack);
	    
		template.jumpToIndex(fun.getIndexBtnItem);
   	
        
    }
    
    
}

template.autoUpdate = function(fun){
    var updateFlag = false;
    var updateBtn;
    if(text("安全升级").findOnce()){
        updateFlag = true;
        updateBtn = text("安全升级").findOnce();
    }
    if(text("立即升级").findOnce()){
        updateFlag = true;
        updateBtn = text("立即升级").findOnce();
    }
    if(text("立即更新").findOnce()){
        updateFlag = true;
        updateBtn = text("立即更新").findOnce();
    }
    if(text("升级").findOnce()){
        updateFlag = true;
        updateBtn = text("升级").findOnce();
    }

    if(updateFlag){
        updateBtn.click();
    }else{
        return;
    }

    //循环找安装，有可能安装还不能用
    var installFlag = false;
    while(!installFlag){
        sleep(1000);
        var uiele = text("安装").findOnce();
        toast("开始找安装");
        if(uiele){
            uiele.click();
            sleep(1000);
            uiele = text("安装").findOnce();
            if(!uiele){
                installFlag = true;
            }
        }
    }
    //安装完成
    var installFinishFlag = false;
    while(!installFinishFlag){
        sleep(1000);
        var uiele = text("完成").findOnce();
        if(uiele){
            uiele.click();
            installFinishFlag = true;
        }
    } 

    //重新运行
    template.run(fun);
}


template.launch=function(getAppName)
{
    if(getAppName == null){ 
       return  false;
    }else{
      return utils.launch(getAppName(initParam.appName));
    }
	
}


/**
 * 跳转到首页
 * 1、返回和首页标识一起判断
 */
template.jumpToIndex = function(getIndexBtnItem){

    //var indexFlag = text(initParam.indexFlagText).findOnce();
	//if(!indexFlag)return;
	click(initParam.indexFlagText);
		
}

/**
 * 获取时段奖励
 */
template.getTimeAward = function(doingAfterTimeAward){
    if(!utils.UITextBoundsClick(initParam.timeAwardText))return;
    //判断是否有提示
    if(doingAfterTimeAward != null){
        doingAfterTimeAward();
    }
}

/**
 * 获取一条新闻
 */
template.getOneVideo = function(findVideoItem){
    toast("开始获取视频资源");
 
   
    var isFindVideo = false;//是否找到视频
    var videoItem;         
    initParam.loopTimeToFindNews = 0;//循环次数
    while((!isFindVideo)  && initParam.loopTimeToFindNews < 3){
        initParam.loopTimeToFindNews++;
      
        videoItem = findVideoItem();
        if(!videoItem){
						
            isFindVideo = true;
        }
		else
		{ //主页视频空空如也
          //进入关注页面：
          //utils.UITextClick("关注");
		  //sleep(1000);
		}
        
    }

    //找到视频，点击阅读
    if(isFindVideo){
        //toast("找到视频，点击阅读");
       
    }else{
        toast("20次滑动没有找到新闻，请检查新闻ID");
        exit();
    }
}

//看视频
template.viewVideo = function(seconds,isShouldBack){
    //看视频
    for(var i = 0 ;i < seconds ;i++){
       
        //判断是否直接返回
        var shouldBack = false;
        if(isShouldBack != null){
            shouldBack = isShouldBack(); //处理弹窗之类的
        }
        if(shouldBack){
            return;
        }
	    sleep(1000);
		if(i==15)
		{
	      // 点关注:
          var idAttention= id("attention").findOnce();
          if(idAttention)
	      {
	         idAttention.click();
	      }
		  utils.UIClick("praise"); //点赞
      
		}
    }
   
  	
	
}

template.downloadApp=function(download){
	
	if(download==null)return false;
	return download(initParam.appName);	
    
}


module.exports = template;