const utils = require('./common.js');

var template = {};

/**
 * 初始化参数
 */
var initParam = {
    appName:"",//应用名称
	runMode:"新闻", //运行模式，新闻，视频，小视频。。。。。。
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
 * 2、寻找一条新闻条目：findNewsItem
 */
template.run = function(fun){
    /**
     * 启动
     */
    utils.wakeUp(); 
	
	if(template.downloadApp(fun.download))
	{
	   template.loginApp(fun.login);
	   //exit();
    }
	else{
       var launched=app.launchApp(initParam.appName);
       if(!launched)launched=template.launch(fun.getAppName);
       if(!launched)
	   {
          exit();
       }
       toast("等待app 启动......");
	   var waitCount=0;
	   var waitFlag=true;
	   while(waitFlag  && waitCount<15){
	      waitCount++;
	      if(fun.findIndexPage != null && fun.findIndexPage())
	      {
			   waitFlag=false;
	      }
	      else
	           sleep(1000);
	    }
	}
    toast("app 启动成功");
    if(app.getWaitLogin(initParam.appName))
	
    /**
     * 自动更新
     */
    template.autoUpdate(fun);

    /**
     * 回归首页的位置
     */
    template.jumpToIndex(fun.getIndexBtnItem,fun.popWindow);
  	
    /**
     * 签到
     */
    
    if(fun.signIn != null){
        fun.signIn();
        
    }
    
    //toast("签到执行完成");

	if(initParam.runMode=="新闻")
    {   
         /**
         * 新闻阅读流程
         */
     
        while(true){
	    
            //领取时段奖励
            template.getTimeAward(fun.doingAfterTimeAward);
        
		    //找到一条新闻
            template.getOneNews(fun.findNewsItem,fun.getIndexBtnItem,fun.popWindow);
            //阅读新闻60s
            template.readNews(60,fun.isShouldBack);
            //返回新闻列表
            template.backToIndex(initParam.indexFlagText,initParam.indexFlagText1,initParam.indexFlagText2,fun.popWindow);
		    
			/*
		    //
		    if(template.jumpToVideoIndex(fun.jumpToVideo)){
		      	sleep(1000);
		        //找到一条视频：
                template.getOneVideo(fun.findVideoItem,fun.getIndexBtnItem);
                //看视频60s
                //template.viewVideo(60,fun.isShouldBack);
                //template.backToIndex(initParam.indexFlagText,initParam.indexFlagText1,initParam.indexFlagText2);
	            sleep(10000);  
		    }
		    */
		
        }//while(true){
	}
	else
	{
	     /**
          * 看视频流程
         */
     
         while(true){
            //领取时段奖励
             template.getTimeAward(fun.doingAfterTimeAward);
            //找到一段视频
			 if(initParam.appName=="追看视频")
			    template.getOneVideo(fun.findVideoItem);
             else
                template.findOneVideo(fun.findVideoItem);
             //看视频30s
             template.viewVideo(60,fun.isShouldBack);
	    
		     template.jumpToIndex(fun.getIndexBtnItem,fun.popWindow);
         }	
	
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
      
      return app.launchApp(getAppName(initParam.appName)); //获取app的另外名称
    
    }
	
}

template.loginApp=function(login)
{
    
    if(login == null){ 
       return  false;
    }else{
       return login();
    }


}


/**
 * 跳转到首页
 * 1、返回和首页标识一起判断
 */
template.jumpToIndex = function(getIndexBtnItem,popWindow){

    //toast("jumpToIndex......");  
	if(initParam.runMode=="视频")
	{
         var indexFlag = text(initParam.indexFlagText).findOnce();
	     while(!indexFlag){
              if(popWindow  != null  )
		      {
		         popWindow();
		      }
	          //点击首页标识性文字
              var flag = false;
              var indexPage =getIndexBtnItem();
	          if(indexPage){
                  flag = indexPage.click(); 
              } 
	    
              //执行返回
              if(!flag){
                 toast("找首页时，没有发现首页,back()");
                 back();
              }
              sleep(1000);
	          //重新取flag
              indexFlag = text(initParam.indexFlagText).findOnce();  
	  
          }
		  return;
	}
	
    var indexFlag = text(initParam.indexFlagText).findOnce();
	//add for 东方头条：
	if(!indexFlag)indexFlag = text(initParam.indexFlagText1).findOnce();
	if(!indexFlag)indexFlag = text(initParam.indexFlagText2).findOnce();
    
	while(!indexFlag){
        if(popWindow  != null  )
		{
		   popWindow();
		}
	  
        var flag = false;
        if(getIndexBtnItem == null){ 
		    flag = utils.UITextBoundsClick(initParam.indexBtnText);
        }
		else
		{
		    var indexPage =getIndexBtnItem();
	        if(indexPage){
                flag = indexPage.click(); 
            } 
		}
        
        //执行返回
        if(!flag){
           toast("找首页时，没有发现首页,back()");
           back();
        }
        
        sleep(1000);
		
        //重新取flag
        indexFlag = text(initParam.indexFlagText).findOnce();  //发布
		//add for 东方头条：
		if(!indexFlag)indexFlag = text(initParam.indexFlagText1).findOnce(); //扫一扫
	    if(!indexFlag)indexFlag = text(initParam.indexFlagText2).findOnce(); //"搜索你感兴趣的内容"
      
    }
    
}


template.backToIndex = function(indexFlagText,indexFlagText1,indexFlagText2,popWindow) {
    
	var runPkgName  = getPackageName(initParam.appName);	
	var indexBtn = false;
    var loop = 0;
    while(!indexBtn && loop<20 ){
		toast("backToIndex:back()");
        var currentPkgName=currentPackage();
		if(runPkgName  != null  && currentPkgName !=  runPkgName)
		{
		   toast("当前包不是运行包:"+currentPkgName+"，重启它");
		   utils.launch(initParam.appName);	
		   break;
		}
		
		//uc浏览器处理:		
		var  exitText =  text("退出").findOnce();
        if(exitText)exitText.click();
  	    
		if(popWindow  != null  )
		{
		   popWindow();
		}
			
        indexBtn = text(indexFlagText).findOnce();
		if(!indexBtn)indexBtn=text(indexFlagText1).findOnce();
		if(!indexBtn)indexBtn=text(indexFlagText2).findOnce();
        if(indexBtn)continue;
        
	
		back();
        sleep(2000);
		
	   
	
        //超出退出时长的，做一些特殊处理
        if(loop > 5){
			
			
            //无限返回的页面
            var isSucc = utils.textClick("关闭");
            if(!isSucc){
                utils.textBoundsClick("关闭");
            }

            //系统的安装页面
            if(!isSucc){
                utils.UITextClick("取消");
            }

            //成功关闭
            if(isSucc){
                indexBtn = true;
            }
        }
        loop++;
    }
}


template.jumpToVideoIndex=function(jumpToVideo)
{
	toast("jumpToVideoIndex");
    if(jumpToVideo != null){
        return jumpToVideo();
    }
	return  false;

}
		



/**
 * 获取时段奖励
 */
template.getTimeAward = function(doingAfterTimeAward){
    if(initParam.runMode=="新闻")
	{
	   if(!utils.UITextBoundsClick(initParam.timeAwardText)){
		    return;
	   }
	}
    else
	{
        //看看是否有奖励可领：
      
	}	
	//判断是否有提示
    if(doingAfterTimeAward != null){
        doingAfterTimeAward();
    }
}

/**
 * 获取一条新闻
 */
template.getOneNews = function(findNewsItem,getIndexBtnItem,popWindow){
    
    if(app.compareVersion<0) return;//6.0 无法看新闻
    
	toast("开始获取新闻资源");
    //阅读超过50条，刷新页面
    if(initParam.totalNewsReaded > initParam.totalNewsOneTime){
        initParam.totalNewsReaded = 0;
        //click(1,1919);
		toast("阅读超过50条，刷新页面");
		var indexPage =getIndexBtnItem();
	    if(indexPage)
		{
		  toast("刷新页面");	
          flag = indexPage.click(); 
        }
		
        sleep(2000);
    }

    //上滑找新闻
    var isFindNews = false;//是否找到新闻
    var newsText = "";//新闻标题
    var newsItem;//新闻条目
    initParam.loopTimeToFindNews = 0;//循环次数
    while((!isFindNews || initParam.lastNewsText === newsText)  && initParam.loopTimeToFindNews < 20){
        //找新闻次数+1
        initParam.loopTimeToFindNews++;
        //进行下翻
        swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
    	sleep(1000);

        //新闻条目
        newsItem = findNewsItem();
        if(newsItem){
            newsText = newsItem.child(0).text();
	     	var tmpNewsItem=app.findNodeByText(newsItem,"置顶");
			if(!tmpNewsItem)tmpNewsItem=app.findNodeByText(newsItem,"广告");
			if(!tmpNewsItem)isFindNews = true;
		
        }
		else
		{
			var currentPkgName=currentPackage();
			//toast("查找新闻发现打开了："+currentPkgName);
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
			if(popWindow !=null )popWindow();
			
		}
    }

    //找到新闻，点击阅读
    if(isFindNews){
        //toast("找到新闻，点击阅读");
        initParam.lastNewsText = newsText;
        initParam.totalNewsReaded++;
	    if(!newsItem.click())
		{
		  var bounds=newsItem.bounds();
          if(bounds){
             if( (bounds.left>=0 && bounds.right>bounds.left)&&(bounds.top>=0&&bounds.bottom>bounds.top))
		         click(bounds.centerX(),bounds.centerY()); 
          }
		}
    }else{
        toast("20次滑动没有找到新闻，请检查新闻ID");
		findNewsItem();//再给一次机会
	    exit();
    }
}



//阅读新闻
template.readNews = function(seconds,isShouldBack){

    if(app.compareVersion<0)return; //6.0不看新闻
    
	//滑动阅读新闻
    for(var i = 0 ;i < seconds/10 ;i++){
     	utils.swapeToRead();

        //判断是否直接返回
        var shouldBack = false;
        if(isShouldBack != null){
            shouldBack = isShouldBack();
        }
        if(shouldBack){
            return;
        }
	
 		
    }
}

/**
 * 获取一个视频
 */
template.getOneVideo = function(findVideoItem,getIndexBtnItem){
    toast("开始获取视频资源");
    //上滑找新闻
    var isFindVideo = false;//是否找到新闻
	var videoText = "";//视频标题
    var videoItem;//视频条目
    initParam.loopTimeToFindNews = 0;//循环次数
    while((!isFindVideo /*|| initParam.lastNewsText === videoText*/)  && initParam.loopTimeToFindNews < 20){
        //找新闻次数+1
        initParam.loopTimeToFindNews++;
        //进行下翻
        swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
 		sleep(1000);
       //视频条目
        videoItem = findVideoItem();
        if(videoItem){
	        videoText = videoItem.child(0).text();
	        isFindVideo = true;
        }
		else
		{
			
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
			
			
		}
    }

    //找到视频，点击阅读
    if(isFindVideo){
        initParam.lastNewsText = videoText;
        toast("找到视频，请观看");
     	initParam.totalNewsReaded++;
	    if(!videoItem.click())
		{
		  var bounds=videoItem.bounds();
          if(bounds){
             if( (bounds.left>=0 && bounds.right>bounds.left)&&(bounds.top>=0&&bounds.bottom>bounds.top))
		         click(bounds.centerX(),bounds.centerY()); 
          }
		}
    }else{
        toast("20次滑动没有找到视频，请检查视频ID");
	    exit();
    }
}


/**
 * 获取一个视频：
 */
template.findOneVideo = function(findVideoItem){
    toast("开始获取视频资源");
    var isFindVideo = false;//是否找到视频
    var videoItem=null;         
    initParam.loopTimeToFindNews = 0;//循环次数
    while((!isFindVideo)  && initParam.loopTimeToFindNews < 20){
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
	         //idAttention.click();
	      }
		  utils.UIClick("praise"); //点赞
      
		}
		
    }
	
}



template.downloadApp=function(download){
	if(download==null){
	  return false;
	}
	return download(initParam.appName);

}





module.exports = template;