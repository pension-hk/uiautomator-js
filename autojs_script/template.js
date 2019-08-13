const utils = require('./common.js');

var template = {};

/**
 * 初始化参数
 */
var initParam = {
    appName:"",//应用名称
	runMode:"新闻", //运行模式：新闻,全民小视频（九宫格模式），追看视频（竖向列表模式），刷宝（单列模式）
 	taskMode:    0,    //0==新闻,1==视频,2==小视频
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
	
	var launched=app.launchApp(initParam.appName);
    if(!launched)launched=template.launch(fun.getAppName);
    if(!launched)
    {
       exit();
    }
    toast("等待启动......");
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
	toast("启动成功!");
    sleep(5000);
    
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
  
	if(initParam.runMode=="新闻")
    {   
    	template.newsLoop(fun); 
    	/*		 
	    switch(utils.getRandom(0,3))
		{
			case 0:
				 toast("任务模式：0");
				 template.newsLoop(fun);
				 break;
			case 1:
				 template.videoLoop(fun);  
				 break;
		    case 2:
				 template.shortVideoLoop(fun);
				 break;
		    default:
				 template.newsLoop(fun);
				 break;
		}				
         */

	}
	else
	{
	     /**
          * 看视频流程
         */
     
         while(true){
             template.getTimeAward(fun.doingAfterTimeAward);
         	 if(initParam.appName=="全民小视频"){
			    template.getOneVideo(fun.findVideoItem);
		        template.viewVideo(300,fun.isShouldBack);  //每个主题看5分钟
	     
			 }
             else{
                //刷宝模式：
                template.findOneVideo(fun.findVideoItem);
                //看视频30s
                template.viewVideo(300,fun.isShouldBack);
			 } 
		     template.jumpToIndex(fun.getIndexBtnItem,fun.popWindow);
         }	
	
	}
	
}

template.newsLoop=function(fun)
{
	/**
    * 新闻阅读流程
    */
        
	while(true)
	{
	   if(!fun.findNewsItem){
	       break;
	   }
	   
	   template.getTimeAward(fun.doingAfterTimeAward);
   	   template.getOneNews(fun.findNewsItem,fun.getIndexBtnItem,fun.popWindow,fun.preProcess);
       if(app.compareVersion()>=0)
          template.readNews(60,fun.isShouldBack);
	   else
	      template.readNews(30,fun.isShouldBack);
	   template.backToIndex(initParam.indexFlagText,initParam.indexFlagText1,initParam.indexFlagText2,fun.popWindow);	
	}
	exit();
}

template.videoLoop=function(fun)
{
	toast("阅读新闻：看视频");
	while(true)
	{
	   //领取时段奖励
       template.getTimeAward(fun.doingAfterTimeAward);
       if(template.jumpToVideoIndex(fun.jumpToVideo))
	   {
		  //找到一条视频：
          template.getOneVideo(fun.findVideoItem,fun.getIndexBtnItem);
          //看视频30s
          template.viewVideo(30,fun.isShouldBack);
          template.backToIndex(initParam.indexFlagText,initParam.indexFlagText1,initParam.indexFlagText2);
	        
	   }
	   else
	   {
         toast("找不到视频入口，退出");  
		 exit(); 
	   }		   
	   
	   /*
	   //找到一段视频
	   if(initParam.appName=="全民小视频"){
		  template.getOneVideo(fun.findVideoItem);
		  template.viewVideo(300,fun.isShouldBack);  //每个主题看5分钟
	     
	   }
       else{ //刷宝（单列模式）
          template.findOneVideo(fun.findVideoItem);
          //看视频30s
          template.viewVideo(30,fun.isShouldBack);
	   } 
	   template.jumpToIndex(fun.getIndexBtnItem,fun.popWindow);
       */

	}
}

template.shortVideoLoop=function(fun)
{
	toast("阅读新闻：看小视频");
	while(true)
	{
	   //领取时段奖励
       template.getTimeAward(fun.doingAfterTimeAward);
	   exit();
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

    toast("跳转到首页......");  
	var waitCount  =  0;
	if(initParam.runMode=="视频")
	{
         var indexFlag = text(initParam.indexFlagText).findOnce();
	     while(!indexFlag){
              if(popWindow  != null  )
		      {
		         popWindow();
		      }
	          //点击首页标识性文字
              toast("点击视频首页标识性文字");  
	          var flag = false;
              var indexPage =getIndexBtnItem();
	          if(indexPage){
                  flag = indexPage.click(); 
				  if(flag)flag=click(indexFlagText);
              } 
	    
              //执行返回
              if(!flag){
                 toast("找首页时，没有发现首页,back()");
                 //回退前检查目前运行的APP状况
		         var currentPkg=currentPackage();
		         if(currentPkg==="org.yuyang.automake")
		         {
			        var launched=app.launchApp(initParam.appName);
                    if(!launched)launched=template.launch(fun.getAppName);
                    if(!launched)
	                {
                       exit();
                    }
                 }
                 else     		   
		            back();
              }
			  
              sleep(1000);
	          //重新取flag
              indexFlag = text(initParam.indexFlagText).findOnce();  
	  
          }
		  return;
	}
	else
	{
	
       var indexFlag = text(initParam.indexFlagText).findOnce();
	   if(!indexFlag)indexFlag = text(initParam.indexFlagText1).findOnce();
	   if(!indexFlag)indexFlag = text(initParam.indexFlagText2).findOnce();
     
	   while(!indexFlag && waitCount<5){
		   waitCount++;
           if(popWindow  != null  )
		   {
		      popWindow();
		   }
	       toast("点击新闻首页标识性文字");  
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
              //回退前检查目前运行的APP状况
		      var currentPkg=currentPackage();
		      if(currentPkg==="org.yuyang.automake")
		      {
			      var launched=app.launchApp(initParam.appName);
                  if(!launched)launched=template.launch(fun.getAppName);
                  if(!launched)
	              {
                      exit();
                  }
                  else
                      continue;				   
              }
              else     		   
		        back();
           }
        
           sleep(1000);
		
           //重新取flag
           indexFlag = text(initParam.indexFlagText).findOnce();  
		   if(!indexFlag)indexFlag = text(initParam.indexFlagText1).findOnce(); 
	       if(!indexFlag)indexFlag = text(initParam.indexFlagText2).findOnce();
       }
	
	   //toast("找首页时，waitCount="+waitCount);
       toast("已经到首页");  
	  
	   if(waitCount>=5){
	      toast("找首页时，没有发现首页,连续返回5次都不起作用,退出!");
          exit(); 
       }
	}
}


template.backToIndex = function(indexFlagText,indexFlagText1,indexFlagText2,popWindow) {
    
	var runPkgName  = getPackageName(initParam.appName);	
	var loop = 0;
	var indexBtn = text(indexFlagText).findOnce();          //发布
	if(!indexBtn)indexBtn=text(indexFlagText1).findOnce();  //扫一扫
	if(!indexBtn)indexBtn=text(indexFlagText2).findOnce();  //搜索你感兴趣的内容
   
    while(!indexBtn && loop<20 ){
	    app.dlog("backToIndex:back()");
		var currentPkgName=currentPackage();
		if(runPkgName  != null  && currentPkgName !=  runPkgName)
		{
		   app.dlog("当前包不是运行包:"+currentPkgName+"，重启它");
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
	app.dlog("jumpToVideoIndex");
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
	   	
	   if(text(initParam.timeAwardText).findOnce())
	   {
		 var clickFlag=click(initParam.timeAwardText);   
	     if(!clickFlag && app.compareVersion()>=0){
            clickFlag=utils.UITextBoundsClick(initParam.timeAwardText);
		 }
         if(clickFlag)
		 {
            sleep(5000);  
		 }			 
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
template.getOneNews = function(findNewsItem,getIndexBtnItem,popWindow,preProcess){
  
	app.dlog("开始获取新闻资源");
    //阅读超过50条，刷新页面
    if(initParam.totalNewsReaded > initParam.totalNewsOneTime){
        initParam.totalNewsReaded = 0;
     	app.dlog("阅读超过50条，刷新页面");
		var indexPage =getIndexBtnItem();
	    if(indexPage)
		{
		  app.dlog("刷新页面");	
          flag = indexPage.click(); 
        }
	    sleep(2000);
    }
    
	
    //上滑找新闻
    var isFindNews = false;//是否找到新闻
    var newsText = "";//新闻标题
    var newsItem;//新闻条目
    initParam.loopTimeToFindNews = 0;//循环次数
    while((!isFindNews || initParam.lastNewsText === newsText)  
		  && initParam.loopTimeToFindNews < 20)
    {
    	//toast("获取新闻：isFindNews="+isFindNews+" lastNewsText="+initParam.lastNewsText+" newsText="+newsText);
	 	initParam.loopTimeToFindNews++;
     	//进行下翻
        if(app.compareVersion()>=0)
		{
		   swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
		   sleep(3000);
		}
    	else{
	      app.dlog("点击刷新......");
		  var clickFlag=click(initParam.indexBtnText);
		  if(!clickFlag)clickFlag=click(initParam.indexBtnText1);
		  if(clickFlag)
		  {
    	     app.dlog("等待刷新......");
			 var  waitCount=0;
			 var textFlag=text("刷新中…").findOnce(); //刷新中…
			 while(!textFlag && waitCount<30){
				 waitCount++;
				 textFlag=text("刷新中…").findOnce();
				 sleep(1000);
			 }
	   	     app.dlog("刷新退出：textFlag="+textFlag+" waitCount="+waitCount);
			 while(textFlag && waitCount<10){
				 waitCount++;
				 textFlag=text("刷新中…").findOnce();
				 sleep(1000);
			 }
			 
			 sleep(5000);
		 	
		  }
	    }
    	
        //新闻条目
        newsItem = findNewsItem();
        if(newsItem){
            var textItem = newsItem.child(0);
			if(textItem)
			{
			  var newsText = textItem.text();
			  if(newsText)
			  {
		         if(newsText.indexOf("刷新")<0){
				    var tmpNewsItem=app.findNodeByText(newsItem,"置顶");
			        if(!tmpNewsItem)tmpNewsItem=app.findNodeByText(newsItem,"广告");
			        if(!tmpNewsItem)isFindNews = true;
				 }
				 else{
				      toast("找到标题："+newsText+"，但不是新闻");
             	 }
			 
			  }
			  else
			  {
				  toast("找到新闻,但无标题");
         	  }
		    }
			
			
        }
		else
		{
			/*
			//toast("没找到新闻");
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
			if(className("android.webkit.WebView").findOnce())
			{
			    //toast("发现webview界面，回退");
      		    back();
                sleep(1000);  	
			}
			if(popWindow !=null )popWindow();
		    */   
			
		}
    }
    
    //找到新闻，点击阅读
    if(isFindNews)
	{
        initParam.lastNewsText = newsText;
        app.dlog("找到新闻，请阅读："+newsText);
    	initParam.totalNewsReaded++;
	 	var clickFlag = newsItem.click();
		if(!clickFlag)clickFlag=click(newsText);
		if(clickFlag)
		{
		  app.dlog("找到新闻，已点击进入");
      	  if(preProcess)preProcess(newsText);//阅读前预处理，如打开网页里阅读更多
    	}
		else
		{
		  app.dlog("找到新闻，点击未进入");
    	}
    }
	else
	{
        app.dlog("20次滑动没有找到新闻，请检查新闻ID");
	    exit();
    }
	//sleep(2000);
	app.dlog("退出获取新闻资源");
}



//阅读新闻
template.readNews = function(seconds,isShouldBack){
  
	//滑动阅读新闻
	app.dlog("滑动阅读新闻");
    for(var i = 0 ;i < seconds/10 ;i++){
       if(app.compareVersion()>=0)
		{
		   //是否腾讯微视：
		   var classN=className("android.support.v7.widget.RecyclerView").findOnce();
		   if(classN && classN.className().indexOf("android.support.v7.widget.RecyclerView")>=0){
		      var id = classN.id();
		      if(id.indexOf("com.tencent.weishi")>=0){
			     app.dlog("000 新闻条目是视频资源,阅读中......");
				 utils.swapeToReadVideo();
		      }
		      else{
			     app.dlog("000 新闻资源,阅读中......");
				 utils.swapeToRead();
		      }
           }
		   else{
		      classN=className("android.webkit.WebView").findOnce();
		      if(classN && classN.className().indexOf("android.webkit.WebView")>=0)
			  {
			     app.dlog("111 新闻资源,阅读中......");
				 utils.swapeToRead();
		      }
		      else{  
		         app.dlog("111 新闻条目是视频资源,阅读中......");
				 utils.swapeToReadVideo();
			  }
		   }
		   
		  
        }
		else  
		{
			sleep(10000);
		}
        
		//判断是否直接返回
        var shouldBack = false;
        if(isShouldBack != null){
            shouldBack = isShouldBack();
        }
        
		app.dlog("是否直接返回：shouldBack="+shouldBack);
  	 	if(shouldBack){
            return;
        }
 		
    }
    app.dlog("已完成阅读新闻");

}

/**
 * 获取一个视频
 */
template.getOneVideo = function(findVideoItem,getIndexBtnItem){
    
	toast("获取一个视频");
    
    //上滑找新闻
    var isFindVideo = false;//是否找到视频
	var videoText = "";//视频标题
    var videoItem;//视频条目
    initParam.loopTimeToFindNews = 0;//循环次数
    while((!isFindVideo || initParam.lastNewsText === videoText)  && initParam.loopTimeToFindNews < 20){
        //找视频次数+1
        initParam.loopTimeToFindNews++;
        //进行下翻
		if(app.compareVersion()>=0){
         swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
 		 sleep(1000);
		}
		else
		  sleep(2000);	
       
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
        toast("找到视频，请观看:"+videoText);
     	initParam.totalNewsReaded++;
	    click(videoText);
	
    }else{
        toast("20次滑动没有找到视频，请检查视频ID");
	    exit();
    }
}


/**
 * 获取一个视频：
 */
template.findOneVideo = function(findVideoItem){
    toast("findOneVideo开始获取视频资源");
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
        toast("找到视频，点击阅读");
		click("首页");
       
    }else{
        toast("20次滑动没有找到新闻，请检查新闻ID");
        exit();
    }
}


//看视频
template.viewVideo = function(seconds,isShouldBack){
    
	app.dlog("viewVideo");
	if(app.compareVersion()<0)
	   seconds=30;      //6.0每个视频主题看30秒
	
    for(var i = 0 ;i < seconds/10 ;i++){
       	
		if(app.compareVersion()>=0)
		   utils.swapeToReadVideo();
        else  
		{
			sleep(10000);
		}
        //判断是否直接返回
        var shouldBack = false;
        if(isShouldBack != null){
            shouldBack = isShouldBack(); //处理弹窗之类的
        }
        if(shouldBack){
            return;
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