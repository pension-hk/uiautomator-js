const utils = require('./common.js');

var template = {};

/**
 * 初始化参数
 */
var initParam = {
    appName:"",     //应用名称
	appAlias:null,
	packageName:null,
	runMode:"新闻", //运行模式：新闻,全民小视频（九宫格模式），追看视频（竖向列表模式），刷宝（单列模式）
 	runVideoMode:0, //0=全民小视频（九宫格模式）,1=追看视频（竖向列表模式）/波波视频；2 刷宝模式
	runSmallVideoMode:0, //0=全民小视频（九宫格模式）,1=追看视频（竖向列表模式）/波波视频；2 刷宝模式
	taskMode:    0, //0==新闻,1==视频,2==小视频
	lastNewsText:"",//上一次新闻标题
    totalNewsReaded : 0,//已经阅读的新闻条数
    totalNewsOneTime : 50,//一次性阅读多少条新闻
    loopTimeToFindNews : 20,//找了多少次新闻找不到会退出
    indexBtnText: "首页", //其他页面跳到首页的按钮文字，重要！
	indexBtnText1: "刷新", //其他页面挑到首页的按钮文字，重要！	
    indexFlagText : "发布",//首页特有的标志文字，重要！
    indexFlagText1 : "扫一扫",//首页特有的标志文字，重要！
    timeAwardText : "领取",//时段奖励关键字
    androidVersion:-1
}

template.init = function(param){
   Object.assign(initParam, param);
	
}

template.run = function(fun){
    androidVersion=app.compareVersion();
	/**
     * 启动
     */
    utils.wakeUp(); 
	toast(initParam.appName+"等待启动......");
	var pkg=app.getPrefString("currentPackage");
	if(pkg)
	{
	  utils.clearMem(pkg);
	}
  
	var launched=app.launchApp(initParam.appName);
 	if(!launched && initParam.appAlias)launched=app.launchApp(initParam.appAlias);
    if(!launched)
    {
		app.dlog(initParam.appName+"启动失败，检查是否安装");
        var appPackage=app.getPackageName(initParam.appName);
		if(!appPackage  && initParam.appAlias)appPackage=app.getPackageName(initParam.appAlias);			
        if(!appPackage)appPackage=initParam.packageName;
		app.dlog(initParam.appName+"包名="+appPackage);
    	
		if(app.isAppInstalled(appPackage)){
			if(!app.launchPackage(initParam.packageName)){
    	       app.dlog(initParam.appName+"有安装,但启动失败");
				exit();
			    return;
			}
			else
			    app.dlog(initParam.appName+"有安装,但启动失败，重新启动成功");
		
		}
		else
		{
		   app.dlog(initParam.appName+"没有安装");
    	   if(fun.download){
		     fun.download();
		     template.procPopWindow(fun);
		     template.login(fun);
		   }
 		   else{
		     app.dlog(initParam.appName+"缺少downlaod()");
    	     exit();
		  }
		}
    }
    app.dlog(initParam.appName+"启动中......");
	if(initParam.packageName)
	   waitForPackage(initParam.packageName);
	
	app.dlog("【"+initParam.appName+"】启动成功!");
	app.setPrefString("currentPackage",initParam.packageName);

	if(!fun.findIndexPage() && !fun.checkIsAppPage())
	       sleep(5000);
	
	template.jumpToIndex(fun);
 	
	app.dlog("【"+initParam.appName+"】到达首页，测试是否登陆......");
	if(fun.checkLogin && !fun.checkLogin()){
	    app.dlog("【"+initParam.appName+"】没有登陆");
		template.login(fun);	
	}
	else{
	    app.dlog("【"+initParam.appName+"】已经登陆");
	}
	
	
	/**
     * 自动更新
     */
    //template.autoUpdate(fun);
	
    
	/**
     * 回归首页的位置
     */
    template.jumpToIndex(fun);
   		
	
	/**
     * 签到
     */
    
    if(fun.signIn)fun.signIn();
    if(fun.doTask1)fun.doTask1();
    if(fun.doTask5)fun.doTask5();
  
	if(initParam.runMode=="新闻")
    {   
   	    var run_task_mode=random(1,4);
		//run_task_mode=2;
	    switch(run_task_mode)
		{
			case 1:
				 app.dlog("任务模式：1,看新闻");
				 template.newsLoop(fun);
				 break;
			case 2:
				 app.dlog("任务模式：2,看新闻");
				 if(fun.findVideoItem)template.newsVideoLoop(fun); 
    	         else
		         template.newsLoop(fun); 
    			 break;
		    case 3:
				 app.dlog("任务模式：3,看新闻");	
		         template.newsLoop(fun); 
    			 break;
			case 4:
				 app.dlog("任务模式：4,看新闻里的小视频");
				 if(fun.jumpToSmallVideo)template.smallVideoLoop(fun); 
      	         else
		         template.newsLoop(fun); 
    			 break;
				 
		    default:
				 app.dlog("任务模式：缺省,看新闻");	
		         template.newsLoop(fun); 
    			 break;
		}				
    }
	else
	{
	    template.videoLoop(fun);
	}
	
}



template.newsLoop=function(fun)
{
	
	if(fun.getNovel)
	{
	   template.novelLoop(fun);
	   return;
	}
	
	/**
    * 新闻阅读流程
    */
    app.dlog("新闻阅读流程");    
	while(true)
	{
	   if(!fun.findNewsItem){
	       break;
	   }
	   template.getTimeAward(fun);
	   template.getOneNews(fun);
       template.readNews(60,fun);
	   template.backToIndex(fun);	
	}
	exit();
}


template.novelLoop=function(fun)
{
    app.dlog("小说阅读流程");    
	fun.getNovel();
 	while(true)
	{
	   template.readNovel(fun);
	}
}



template.newsVideoLoop=function(fun)
{
	app.dlog("阅读类看视频");
	var seconds=30; 
	switch(initParam.runVideoMode)
	{
		 case  0://九宫格模式 （全民视频）
        	   template.jumpToVideoIndex(fun);
	           seconds=30; 
		       if(initParam.appName=="趣头条"){
		          seconds=60;		
	           }
			  break;
          case  1://横排单列模式（追看视频/波波视频）
                template.jumpToVideoIndex(fun);
	            seconds=30; 
		        if(initParam.appName=="趣头条")
				{
		            seconds=60;		
	            }
		      break;
          case	2: //刷宝模式
		      seconds=30;
              fun.jumpToVideo();
	       	  break;
          default:
			  break;
	}
	while(true)
	{
	   //template.getTimeAward(fun);
       switch(initParam.runVideoMode){
		  case  0://九宫格模式 （全民视频）
		       //找到一条视频：
    	      template.getOneVideo(fun);
			  break;
          case  1://横排单列模式（追看视频/波波视频）
    	      template.getOneVideo(fun);
       	      break;
          case	2: //刷宝模式
		      seconds=30;
           	  break;
          default:
			  break;
			  
 		  
	    }
	    //app.dlog("阅读类看视频:app="+initParam.appName+" 看秒数="+seconds);
	    template.viewVideo(seconds,fun);
    	template.backToVideoIndex(fun);  
	  
	}
}

 /**
  * 看视频流程
  */
template.videoLoop=function(fun)
{
	app.dlog("看视频");
	var seconds=60;
	while(true)
	{
	    /*
		template.getTimeAward(fun);
		
   	    if(initParam.appName=="波波视频"||initParam.appName=="追看视频"){
		   template.getOneVideo(fun);
		   template.viewVideo(60,fun); //6x10		
		}
		else 
	    /*		
		if(initParam.appName=="快手极速版")
		{
		   template.findOneVideo(fun);
           template.viewVideo1(300,fun);
	    }
        
        else
		*/
		/*
		{
            //刷宝模式：
            template.findOneVideo(fun);
            //看视频 15 x20 = 300
      	    template.viewVideo(150,fun);
	    } 
		app.dlog("视频看完了，返回主页");
		template.jumpToIndex(fun);
		*/
		//template.getTimeAward(fun);
		switch(initParam.runVideoMode){
		     case 0://九宫格模式 （全民视频）
        	    template.getOneVideo(fun);
				seconds=150;
	            break;
             case  1://横排单列模式（追看视频/波波视频）
    	        template.getOneVideo(fun);
		        seconds=60;
	    		break;  			 
			 case 2://刷宝模式：
                template.findOneVideo(fun);
                //看视频 15 x20 = 300
      	        seconds=150;
				break;
			 default:
                template.findOneVideo(fun);
				seconds=150;
				break;			 
		}
		
      	template.viewVideo(seconds,fun);
		app.dlog("视频看完了，返回主页");
		template.jumpToIndex(fun);
		
 	}
}


template.smallVideoLoop=function(fun)
{
	toast("阅读类看小视频");
	while(true)
	{
    
	    if(!template.jumpToSmallVideoIndex(fun))
		{
		   exit();
		}
	    //找到一条视频：
    	//template.getOneVideo(fun);
        var seconds=150; 
		template.viewSmallVideo(seconds,fun);
    	//template.backToVideoIndex(fun);  
	}
}


template.login=function(fun)
{
    var waitCount=0;
	app.dlog("template.login......");
	while(!fun.findIndexPage() && waitCount<20)
    {
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
 		 if(!fun.findIndexPage())
	     { 	 
            var flag=fun.clickIndexPage();            	
   	        if(!flag)
			{ 
         	  var curPkg = currentPackage();
			  if(curPkg ==runPkg || curPkg == "com.android.packageinstaller"){
			      app.dlog("curPkg="+curPkg+" back()");
			      back();
         	  }
			  else
			  {  
			       app.dlog("curPkg="+curPkg+" lunch()");
	        	   var launched=app.launchApp(initParam.appName);
 	               if(!launched && initParam.appAlias)launched=app.launchApp(initParam.appAlias);
   			       if(launched  && initParam.packageName)
	                    waitForPackage(initParam.packageName);
			  }
			}
		 }
		 sleep(1000);
    }	
	app.dlog("template.login:已经在首页"); 
	fun.login();
   
}

template.clickIndexPage = function(fun){
	app.dlog("点击新闻首页标识性文字");  
	return fun.clickIndexPage();
}

template.ucMobile=function()
{
  utils.ucMobile();	
	
}

template.procPopWindow = function(fun)
{
	if(fun.popWindow)
    {
	   fun.popWindow();
	}
}




template.backProcess=function(fun,flag){
	//执行返回
	//回退前检查目前运行的APP状况
    var currentPkg=currentPackage();
    app.dlog("backProcess,当前页面="+currentPkg+" 是否当前App主页："+flag);
	if(flag)return;
    if(currentPkg==="org.yuyang.automake"||currentPkg.indexOf("launcher")>=0||currentPkg.indexOf("home")>=0)
    {
	   var launched=app.launchPackage(initParam.packageName);
       if(!launched)
	   {
           exit();
		   return;
       }
	   if(initParam.packageName)
	      waitForPackage(initParam.packageName);
	   currentPkg=currentPackage();
	  
    }
    if(initParam.packageName && currentPkg != initParam.packageName)
	{   
	   app.dlog("当前页面="+currentPkg+"非运行页面："+initParam.packageName+",回退2次");
	   back();
	   sleep(500);
	   back();
    }
    else
    {
	    app.dlog("当前页面="+currentPkg+",回退1次");
		back();
		sleep(100);
		//这里有问题
		if(utils.isWebViewPage()&&initParam.runMode=="新闻")
		{
	      app.dlog("当前页是Webview网页，点左边的X或返回");
	 	  utils.clickLeftXByWebView();
		}	
    }
    
	app.dlog("退出backProcess");
    
}
		
template.backVideoProcess=function(fun){
    template.backProcess(fun,fun.checkIsAppVideoPage());
}

/**
 * 跳转到首页
 * 返回和首页标识一起判断
 */
template.jumpToIndex = function(fun){

    app.dlog("跳转到首页......");  
	var waitCount  =  0;
    var indexFlag = fun.findIndexPage();
	while(!indexFlag && waitCount<10){
		waitCount++;
		template.ucMobile();
		template.procPopWindow(fun);
	    var flag = fun.clickIndexPage();
	    if(!flag)template.backProcess(fun,fun.checkIsAppPage());
	    indexFlag = fun.findIndexPage();
		if(!indexFlag)sleep(1000);
		
	}
    app.dlog("已经到首页? indexFlag="+indexFlag);  
	if(waitCount>=10){
	   app.dlog("找首页时，没有发现首页,连续返回10次都不起作用,退出");
       exit(); 
    }
	
}


template.backToIndex = function(fun) {
		 
	var runPkgName  = initParam.packageName;//getPackageName(initParam.appName);
	var waitCount  =  0;
    var indexFlag = fun.findIndexPage();
	while(!indexFlag && waitCount<10 ){
	    app.dlog("backToIndex:back()");
		waitCount++;
		template.ucMobile();
		template.procPopWindow(fun);
	    template.backProcess(fun,fun.checkIsAppPage());
		indexFlag = fun.findIndexPage();
    	app.dlog("backToIndex:indexFlag="+indexFlag);
		if(!indexFlag){
		  //template.clickIndexPage(fun);
		  fun.clickIndexPage();
		  sleep(1000);
		  indexFlag = fun.findIndexPage();
		}     
	
    }
	
	
}

template.backToVideoIndex = function(fun) {
		 
	var runPkgName  = initParam.packageName;//getPackageName(initParam.appName);
	var waitCount  =  0;
    var indexFlag = fun.findVideoIndexPage();
	while(!indexFlag && waitCount<10 ){
	    app.dlog("backToVideoIndex:back()");
		waitCount++;
		template.ucMobile();
		template.procPopWindow(fun);
	    template.backVideoProcess(fun);
		indexFlag = fun.findVideoIndexPage();
    	app.dlog("backToVideoIndex:indexFlag="+indexFlag);
		if(!indexFlag){
		  fun.clickVideoIndexPage();
		  sleep(1000);
		  indexFlag = fun.findVideoIndexPage();
		}     
	
    }
	
	
}



template.jumpToVideoIndex=function(fun)
{
	app.dlog("jumpToVideoIndex");
    if(fun.jumpToVideo){
        return fun.jumpToVideo();
    }
	return  false;

}

template.jumpToSmallVideoIndex=function(fun)
{
	app.dlog("阅读类看小视频：jumpToSmallVideoIndex");
    if(fun.jumpToSmallVideo){
        return fun.jumpToSmallVideo();
    }
	return  false;

}

		



/**
 * 获取时段奖励
 */
template.getTimeAward = function(fun){
   
    app.dlog("获取时段奖励......");
    if(!utils.clickTextNoTimeOut(initParam.timeAwardText))
	{
	    app.dlog("没有发现时段奖励");
        return;
	}
	sleep(5000);
	
	//判断是否有提示
    if(fun.doingAfterTimeAward != null){
        fun.doingAfterTimeAward();
    }
	var flag=fun.findIndexPage();
	app.dlog("时段奖励退出，需要跳回主页：flag="+flag);
	if(!flag)
	   template.jumpToIndex(fun);    
	
}

/**
 * 获取一条新闻
 */
template.getOneNews = function(fun){
  
	app.dlog("开始获取新闻资源");
    //阅读超过50条，刷新页面
    if(initParam.totalNewsReaded > initParam.totalNewsOneTime){
        initParam.totalNewsReaded = 0;
     	app.dlog("阅读超过50条，刷新页面");
		template.clickIndexPage(fun);
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
   	    initParam.loopTimeToFindNews++;
     	//进行下翻
    	swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
		sleep(3000);
	    //新闻条目
        newsItem = fun.findNewsItem();
        if(newsItem){
			var newsText =null;
			if(fun.getNewsTitle)newsText=fun.getNewsTitle(newsItem);
            else
			{
		        var textItem = newsItem.child(0);  
			    if(textItem)
			      newsText=textItem.text();
			}
            if(newsText)
			{
				var canDo=random(1,2);
		        var tmpNewsItem=app.findNodeByText(newsItem,"置顶");
			    if(!tmpNewsItem){
				   tmpNewsItem=app.findNodeByText(newsItem,"广告");
			       if(tmpNewsItem){
                      if(random(1,2)==1)tmpNewsItem=null;
				   }					   
				}
				if(!tmpNewsItem)isFindNews = true;
		    }
			else
			{
				toast("找到新闻,但无标题");
         	}			
			
        }
		else
		{
		 	if(isFindNews)isFindNews=false;
			app.dlog("没找到新闻");  
		}
		if(!fun.findIndexPage())template.jumpToIndex(fun);
			sleep(3000);
	
    }
    
    //找到新闻，点击阅读
    if(isFindNews)
	{
        initParam.lastNewsText = newsText;
        app.dlog("找到新闻，请阅读："+newsText);
    	initParam.totalNewsReaded++;
		var flag=true;
		if(!newsItem)flag=false;
        else
        if(!newsItem.click())
		{
             app.dlog("点击条目失败");
		     if(click(newsText))
			 {
                app.dlog("点击条目失败,改点条目文本：【"+newsText+"】成功");
		 	 }				 
             else			
		     if(utils.boundsClick(newsItem))
			 {
			     app.dlog("点击条目失败,改点条目文本：【"+newsText+"】失败，改点条目坐标成功");
		 	 
			 }
             else			 
		     {
			 	flag=false;
			    app.dlog("click item bounds fail");
		     }
		}
		/*
		if(newsItem){
	       if(!newsItem.click())
		   {
		     app.dlog("点击条目失败");
		     if(click(newsText))
			 {
                app.dlog("点击条目失败,改点条目文本：【"+newsText+"】成功");
		 	 }				 
             else			
		     if(utils.boundsClick(newsItem))
			 {
			     app.dlog("点击条目失败,改点条目文本：【"+newsText+"】失败，改点条目坐标成功");
		 	 
			 }
             else			 
		     {
			 	flag=false;
			    app.dlog("click item bounds fail");
		     }
		   }
		   else{
			  app.dlog("点击新闻条目成功");
		   }
		   
		}
		else flag=false;
		*/
		
		if(flag){
		  app.dlog("找到新闻，已点击进入");
   	    }
		else{
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
template.readNews = function(seconds,fun){
  
    var viewMode="news";
	//滑动阅读新闻
	app.dlog("滑动阅读新闻");
    for(var i = 0 ;i < seconds/10 ;i++)
	{
     	   app.dlog("检测新闻/视频");
		   //是否腾讯微视：
		   var classN=className("android.support.v7.widget.RecyclerView").findOnce();
		   if(classN && classN.className().indexOf("android.support.v7.widget.RecyclerView")>=0){
		      var idN = classN.id();
		      if(idN && idN.indexOf("com.tencent.weishi")>=0){
			     app.dlog("000 新闻条目是视频资源,阅读中......");
				 utils.swapeToReadVideo();
		      }
		      else{
			     app.dlog("000 新闻资源,阅读中......");
				 utils.swapeToRead();
		      }
           }
		   else{
		      //classN=className("android.webkit.WebView").findOnce();
		      //if(classN && classN.className().indexOf("android.webkit.WebView")>=0)
			  //{
			  //   app.dlog("111 新闻资源,阅读中......");
				 utils.swapeToRead();
		      //}
		      //else{  
		      //   app.dlog("111 新闻条目是视频资源,阅读中......");
			  //	 utils.swapeToReadVideo();
			  //}
		   }
	 	
		//判断是否直接返回
    	var shouldBack = false;
        if(fun.isShouldBack != null){
            shouldBack = fun.isShouldBack(viewMode);
        }
	    app.dlog("是否直接返回：shouldBack="+shouldBack);
  	 	if(shouldBack)return;
		
	
		
    }
    app.dlog("已完成阅读新闻");

}


template.readNovel = function(fun){
  
    var viewMode="news";
	//滑动阅读新闻
	app.dlog("滑动阅读小说");
    for(var i = 0 ;i < 10 ;i++)
	{
      	utils.swapeToRead();
		sleep(10000);
		var	curPkg = currentPackage();
		if(curPkg==="com.android.packageinstaller")
		{
			if(utils.text("禁止"))
			     back();
	        utils.clickText("取消");		 
		 	return;
		}
		else
		if(curPkg.indexOf("launcher")>=0)
		{
			return; 
		}
      
		//判断是否直接返回
    	var shouldBack = false;
        if(fun.isShouldBack != null){
            shouldBack = fun.isShouldBack(viewMode);
        }
	    app.dlog("是否直接返回：shouldBack="+shouldBack);
  	 	if(shouldBack)return;
		
	
		
    }
    app.dlog("已完成阅读新闻");

}


/**
 * 获取一个视频
 */
template.getOneVideo = function(fun){
    
	app.dlog("获取一个视频");
    var isFindVideo = false;
	var videoText = "";
    var videoItem;
    initParam.loopTimeToFindNews = 0;
    while((!isFindVideo || initParam.lastNewsText === videoText)  && initParam.loopTimeToFindNews < 20){
        //app.dlog("swipe get video:isFindVideo="+isFindVideo + " lastNewsText="+initParam.lastNewsText+" videoText="+videoText);
		initParam.loopTimeToFindNews++;
        app.dlog("swipe......");  //波波视频有时滑不动？
		swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
 		sleep(1000);
	    //视频条目
        videoItem = fun.findVideoItem();
        if(videoItem){
			if(fun.getVideoTitle)
	          videoText = fun.getVideoTitle(videoItem);
	        else
			  videoText =videoItem.child(0).text();
			app.dlog("找到视频："+videoText);
			isFindVideo = true;
			
		}
		else
		{
			if(isFindVideo)isFindVideo=false;
			app.dlog("没有找到视频条目,isFindVideo="+isFindVideo);
			var currentPkgName=currentPackage();
            if(currentPkgName=="com.UCMobile")
	        {
			   //toast("处理打开的："+currentPkgName);
               var  exitText =  text("退出").findOnce();
               if(exitText)exitText.click();
               else
		       {
			     back();
                 sleep(1000);
		       }		   
	        }
			else
			{
			   if(!fun.findVideoIndexPage()&&className("android.webkit.WebView").findOnce())
			   {
				  utils.clickClassName("android.widget.ImageView");    
			   }
			
			}
			sleep(3000);
	
		}
		app.dlog("查找视频结果："+videoText+" isFindVideo="+isFindVideo);
		if(!fun.findVideoIndexPage())
		{
		   template.jumpToVideoIndex(fun);	
		   sleep(3000);
		}
    }
   
    //找到视频，点击阅读
    if(isFindVideo){
		app.dlog("找到视频，点击阅读");
	    initParam.lastNewsText = videoText;
      	initParam.totalNewsReaded++;
		/*
		if(videoItem && !videoItem.click())
		{
		  utils.clickText(videoText);
    	}
		*/
		var flag=true;
		if(!videoItem)flag=false;
        else
        if(!videoItem.click())
		{
             app.dlog("点击视频条目失败");
		     if(click(videoText))
			 {
                app.dlog("点击视频条目失败,改点视频条目文本：【"+videoText+"】成功");
		 	 }				 
             else			
		     if(utils.boundsClick(videoItem))
			 {
			     app.dlog("点击视频条目失败,改点视频条目文本：【"+videoText+"】失败，改点视频条目坐标成功");
		 	 
			 }
             else			 
		     {
			 	flag=false;
			    app.dlog("点击视频条目坐标失败");
		     }
		}
	
		
		
    }else{
        app.dlog("20次滑动没有找到视频，请检查视频ID");
	    exit();
    }
}


/**
 * 获取一个视频：
 */
template.findOneVideo = function(fun){
    toast("findOneVideo开始获取视频资源");
    var isFindVideo = false;//是否找到视频
    var videoItem=null;         
    initParam.loopTimeToFindNews = 0;//循环次数
    while((!isFindVideo)  && initParam.loopTimeToFindNews < 20){
        initParam.loopTimeToFindNews++;
		if(fun.swipeFindVideo){
		  swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
 		  sleep(1000);
        }
		videoItem = fun.findVideoItem();
        if(videoItem){
	        isFindVideo = true;
        }
		else
		{ 
		  sleep(3000);
		}
        
    }

    //找到视频，点击阅读
    if(isFindVideo){
        //toast("找到视频，点击阅读");
		//click("首页");
       
    }else{
        toast("20次滑动没有找到视频，请检查ID");
        exit();
    }
}


//看视频
template.viewVideo = function(seconds,fun){
    var viewMode="video";
 	app.dlog("viewVideo");
    for(var i = 0 ;i < seconds/10 ;i++){
    	if(initParam.runVideoMode==2)
		{  //刷宝,快手极速版
	        sleep(18000);
			utils.swapeToReadVideo();
		}
		else
		{
            app.dlog("view video i="+i);	
            if(!fun.findVideoIndexPage()){
               sleep(8000);
			   utils.swapeToReadVideo();
            }				  
			else
			sleep(10000);
		}	
		
	    /*
		switch(initParam.runVideoMode){
		     case 0://九宫格模式 （全民视频）
                break;
             case  1://横排单列模式（追看视频/波波视频）
    			break;  			 
			 case 2://刷宝模式：
        		sleep(18000);
			    utils.swapeToReadVideo();
				break;
			 default:
        		break;			 
		}
		*/		
		
        //判断是否直接返回
	    var shouldBack = false;
        if(fun.isShouldBack != null){
            shouldBack = fun.isShouldBack(viewMode); //处理弹窗之类的
        }
        if(shouldBack){
       	     return;
        }
		
		
		
    }
	app.dlog("viewVideo exit");
	
	
}


template.viewSmallVideo = function(seconds,fun){
    var viewMode="video";
 	app.dlog("viewSmallVideo");
    for(var i = 0 ;i < seconds/10 ;i++){
		if(initParam.runSmallVideoMode==2){
		   sleep(18000);
		   utils.swapeToReadVideo(); 
		}
		else
	    {
           app.dlog("view video i="+i);	
           if(!fun.findVideoIndexPage()){
              sleep(8000);
			  utils.swapeToReadVideo();
           }				  
		   else
			 sleep(10000);
		}		  
        //判断是否直接返回
	    var shouldBack = false;
        if(fun.isShouldBack != null){
            shouldBack = fun.isShouldBack(viewMode); //处理弹窗之类的
        }
        if(shouldBack){
       	     return;
        }
		
    }
	app.dlog("viewSmallVideo exit");
	
	
}



template.downloadApp=function(download){
	if(download==null){
	  return false;
	}
	return download(initParam.appName);

}
module.exports = template;