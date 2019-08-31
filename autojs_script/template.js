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
 	taskMode:    0,    //0==新闻,1==视频,2==小视频
	lastNewsText:"",//上一次新闻标题
    totalNewsReaded : 0,//已经阅读的新闻条数
    totalNewsOneTime : 50,//一次性阅读多少条新闻
    loopTimeToFindNews : 20,//找了多少次新闻找不到会退出
    indexBtnText: "首页", //其他页面跳到首页的按钮文字，重要！
	indexBtnText1: "刷新", //其他页面挑到首页的按钮文字，重要！	
    indexFlagText : "发布",//首页特有的标志文字，重要！
    indexFlagText1 : "扫一扫",//首页特有的标志文字，重要！
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
    var alias=initParam.appAlias !== null && initParam.appAlias !== undefined && initParam.appAlias !== '';
	if(!launched && alias)launched=app.launchApp(initParam.appAlias);
    if(!launched)
    {
       exit();
    }
    toast("等待启动......");
	var waitCount=0;
	var waitFlag=true;
	while(waitFlag  && waitCount<30){
	   waitCount++;
	   if(fun.findIndexPage())
	   {
			waitFlag=false;
	   }
	   else 
	   {
		  //if(fun.popWindow !=null )fun.popWindow(); 
	      //else 
			  sleep(1000);
	   }
	}
		
	toast("启动成功!");
    sleep(5000);
    
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
    
    if(fun.signIn != null){
        fun.signIn();
    }
  
	if(initParam.runMode=="新闻")
    {   
    	
		//if(fun.findVideoItem  != null)template.newsVideoLoop(fun); 
    	//else
		  template.newsLoop(fun); 
    		
		/*		 
	    switch(random(1,4))
		{
			case 1:
				 app.dlog("任务模式：1,看新闻");
				 template.newsLoop(fun);
				 break;
			case 2:
				 app.dlog("任务模式：2,看新闻里的视频");
				 if(fun.findVideoItem  != null)template.newsVideoLoop(fun); 
    	         else
		         template.newsLoop(fun); 
    			 break;
		    case 3:
				 app.dlog("任务模式：3,看新闻里的视频");	
		         template.newsLoop(fun); 
    			 break;
		    default:
				 app.dlog("任务模式：4,看新闻里的视频");	
				 if(fun.findVideoItem  != null)template.newsVideoLoop(fun); 
    	         else
		         template.newsLoop(fun); 
    			 break;
		}				
        */

	}
	else
	{
	    template.videoLoop(fun);
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
	   
	   template.getTimeAward(fun);
   	   template.getOneNews(fun);
       if(app.compareVersion()>=0)
          template.readNews(60,fun);
	   else
	      template.readNews(30,fun);
	   template.backToIndex(fun);	
	}
	exit();
}

template.newsVideoLoop=function(fun)
{
	toast("阅读新闻：看视频");
	while(true)
	{
	   template.getTimeAward(fun);
       if(template.jumpToVideoIndex(fun.jumpToVideo))
	   {
		  //找到一条视频：
          template.getOneVideo(fun);
          //看视频30s
          template.viewVideo(30,fun.isShouldBack);
          template.backToIndex(fun);  
	   }
	   else
	   {
         toast("找不到视频入口，退出");  
		 exit(); 
	   }		   
	
	}
}

 /**
  * 看视频流程
  */
template.videoLoop=function(fun)
{
	app.dlog("看视频");
	while(true)
	{
	    template.getTimeAward(fun);
   		if(initParam.appName=="波波视频"||initParam.appName=="追看视频"){
		   template.getOneVideo(fun);
		   template.viewVideo(60,fun.isShouldBack); //6x10		
	    }
		else 
	    /*		
		if(initParam.appName=="快手极速版")
		{
		   template.findOneVideo(fun.findVideoItem);
           template.viewVideo1(300,fun.isShouldBack);
	    }
        
        else
		*/
		{
            //刷宝模式：
            template.findOneVideo(fun.findVideoItem);
            //看视频 15 x20 = 300
            template.viewVideo(150,fun.isShouldBack);
	    } 
		app.dlog("视频看完了，返回主页");
		template.jumpToIndex(fun);
 	}
}


template.shortVideoLoop=function(fun)
{
	toast("阅读新闻：看小视频");
	while(true)
	{
	   //领取时段奖励
       template.getTimeAward(fun/*.doingAfterTimeAward*/);
	   exit();
	}

}


/*
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
*/

template.launch=function(getAppName)
{
    if(getAppName == null){ 
       return  false;
    }else{
      
      return app.launchApp(initParam.appAlias); //获取app的另外名称
    
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

template.findIndexPage = function(fun){
	/*
	var indexFlag  = text(initParam.indexBtnText).findOnce(); //有“新闻”？ 首页？
    if(!indexFlag)indexFlag = text(initParam.indexFlagText).findOnce(); //刷新
	return  indexFlag;
	*/
	return fun.findIndexPage();
}

template.clickIndexPage = function(fun){
	app.dlog("点击新闻首页标识性文字");  
	
	return fun.clickIndexPage();
	/*
	var flag = false;
    
	if(fun.getIndexBtnItem == null){ 
	   flag = utils.UITextBoundsClick(initParam.indexBtnText);
       if(!flag)flag = utils.UITextBoundsClick(initParam.indexBtnText); 
	}
    else{
	   var indexPage =fun.getIndexBtnItem();
	   if(indexPage){
          flag = indexPage.click(); 
		  if(!flag){
		     app.dlog("点击首页标识性窗口失败，改点文字");  
	   	     flag=click(initParam.indexBtnText); 
		     if(!flag)flag=click(initParam.indexFlagText);
		  }
        } 
	}
	return flag;
	*/
}

template.ucMobile=function()
{
    var currentPkgName=currentPackage();
    if(currentPkgName=="com.UCMobile")
    {
	   app.dlog("处理打开的："+currentPkgName);
       while(currentPkgName=="com.UCMobile")
	   {
		   var  exitText =  text("退出").findOnce();
           if(exitText){
		        if(!exitText.click())click("退出");
		   }
           else
		   {
			     back();
                 sleep(1000);
		   }
		   currentPkgName=currentPackage();
	    }		   
	}	
		
	
}

template.procPopWindow = function(fun)
{
	if(fun.popWindow)
    {
	   fun.popWindow();
	}
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
		var flag = template.clickIndexPage(fun);
	    //执行返回
        if(!flag){
           //回退前检查目前运行的APP状况
		   var currentPkg=currentPackage();
		   app.dlog("找首页时，没有发现首页,back(),当前页面="+currentPkg);
           if(currentPkg==="org.yuyang.automake"||currentPkg.indexOf("launcher")>=0)
		   {
			  var launched=app.launchApp(initParam.appName);
			  //var alias=initParam.appAlias !== null && initParam.appAlias !== undefined && initParam.appAlias !== '';
	          if(!launched && initParam.appAlias !=null)launched=app.launchApp(initParam.appAlias);
              if(!launched)
	          {
                 exit();
              }
           }
           else 
    	   if(initParam.packageName && currentPkg != initParam.packageName){   
		        app.dlog("当前页面="+currentPkg+"非运行页面："+initParam.packageName+",回退2次");
				back();
				sleep(200);
				back();
		   }
		   else
				back();
			   
        }
        sleep(1000);
        //重新取flag
        indexFlag = fun.findIndexPage();
		if(!indexFlag){
			back();
			sleep(1000);
		}
	    indexFlag = fun.findIndexPage();
		
	}
	//toast("找首页时，waitCount="+waitCount);
    app.dlog("已经到首页?");  
	if(waitCount>=10){
	   app.dlog("找首页时，没有发现首页,连续返回10次都不起作用,退出");
       exit(); 
    }
	
}


template.backToIndex = function(fun) {
    
	var runPkgName  = getPackageName(initParam.appName);
	if(!runPkgName &&  initParam.appAlias != null) runPkgName=getPackageName(initParam.appAlias);
	var loop = 0;
	var indexBtn = fun.findIndexPage();
    while(!indexBtn && loop<20 ){
	    app.dlog("backToIndex:back()");
		var currentPkgName=currentPackage();
		if(runPkgName  != null  && currentPkgName !=  runPkgName)
		{
		   if(currentPkgName==="org.yuyang.automake"){	
		       app.dlog("当前包:"+currentPkgName+"不是运行包:"+currentPkgName+"，重启它");
		        var launched=app.launchApp(initParam.appName);
               //var alias=initParam.appAlias !== null && initParam.appAlias !== undefined && initParam.appAlias !== '';
	           if(!launched && initParam.appAlias)launched=app.launchApp(initParam.appAlias);
		   }
		   else{
			   app.dlog("当前包:"+currentPkgName+"不是运行包:"+currentPkgName+",回退2次");
		       back();
			   sleep(100);
			   back();
			   sleep(1000);
			   
		   }
		   
   	    }
		
		//uc浏览器处理:		
		var  exitText =  text("退出").findOnce();
        if(exitText)exitText.click();
  	    if(fun.popWindow  != null  )
		{
		   fun.popWindow();
		}
			
    	//back();
        //sleep(1000);
		
	    indexBtn = fun.findIndexPage();
        if(!indexBtn){
		   back();
           sleep(1000);
		}
	    indexBtn = fun.findIndexPage();
	
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
	app.dlog("阅读新闻：jumpToVideoIndex");
    if(jumpToVideo != null){
        return jumpToVideo();
    }
	return  false;

}
		



/**
 * 获取时段奖励
 */
template.getTimeAward = function(fun){
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
	//判断是否有提示
    if(fun.doingAfterTimeAward != null){
        fun.doingAfterTimeAward();
    }
	//if(!template.findIndexPage(fun)) //add to cancel 东方头条 doingAfterTimeAward的back();
    if(!fun.findIndexPage())
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
        if(app.compareVersion()>=0)
		{
		   swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
		   sleep(3000);
		}
    	else{
	      app.dlog("点击刷新......");
		  if(template.clickIndexPage(fun)){
		     if(fun.waitRefresh)fun.waitRefresh();
		  }
		  
	    }
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
		        var tmpNewsItem=app.findNodeByText(newsItem,"置顶");
			    //if(!tmpNewsItem)tmpNewsItem=app.findNodeByText(newsItem,"广告");
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
   	        if(!findIndex())template.jumpToIndex(fun);
			sleep(3000);
		}
    }
    
    //找到新闻，点击阅读
    if(isFindNews)
	{
        initParam.lastNewsText = newsText;
        app.dlog("找到新闻，请阅读："+newsText);
    	initParam.totalNewsReaded++;
		
		var flag=true;
		if(newsItem){
	       if(!newsItem.click())
		   {
		     app.dlog("click play item fail");
		     if(!click(newsText))
		     {
			    app.dlog("click play text fail");
		        if(app.compareVersion()>=0){
                  var bounds = newsItem.bounds();
                  if(bounds && bounds.centerX()>=0 && bounds.centerY()>=0){
			        if(click(bounds.centerX(),bounds.centerY())){
                   	   app.dlog("click play text bounds success:x="+bounds.centerX()+" y="+bounds.centerY());
		    		   sleep(1000);
				    }
				    else
				    {
			            app.dlog("click play text bounds fail");
		    		    flag=false;
				    }
			      }
			      else{
				        app.dlog("click play bounds fail");
		    	        flag=false;
			      }
			    }
			    else 
			    {
				   flag=false; //6.0
				   app.dlog("6.0以下不能点坐标");
		       
			    }
		     }
			 else
			 { 
			   app.dlog("click play text success");
		     }
		   }
		   else{
			  app.dlog("click play item success");
		   }
		   
		}
		else flag=false;
	    if(flag){
		  app.dlog("找到新闻，已点击进入");
      	  if(fun.preProcess)fun.preProcess(newsText);//阅读前预处理，如查看详细
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
template.readNews = function(seconds,fun/*isShouldBack*/){
  
	//滑动阅读新闻
	app.dlog("滑动阅读新闻");
    for(var i = 0 ;i < seconds/10 ;i++)
	{
        if(app.compareVersion()>=0)
	    {
		   app.dlog("检测新闻，视频");
		   //是否腾讯微视：
		   var classN=className("android.support.v7.widget.RecyclerView").findOnce();
		   if(classN && classN.className().indexOf("android.support.v7.widget.RecyclerView")>=0){
		      var id = classN.id();
		      if(id && id.indexOf("com.tencent.weishi")>=0){
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
		   /*
		   //if(className("com.tencent.tbs.core.webkit.WebView").findOnce()) 
		   if(!click("阅读全文")         //发发啦      
			  && !click("点击阅读全文")  //东方头条
		      && !click("展开查看原文")  //微鲤
		   
		   )    
		   click("点击查看全文");     //？
	       */
	    }
		else  
		{
			sleep(10000);
			/*
			var  waitCount=0;
		    while(waitCount<10)
		    {
		        waitCount++;    
		        var rootNode = className("com.tencent.tbs.core.webkit.WebView").findOnce();
		        if(rootNode){
			       if(click("阅读全文"))break;//发发啦
				   else
				   if(click("点击阅读全文"))break;//东方头条
				   else
				   if(click("点击查看全文"))break;//？
			    }
				
			    sleep(1000);
		    }
			sleep((10-waitCount)*1000);
			*/
		}
        //判断是否直接返回
        var shouldBack = false;
        if(fun.isShouldBack != null){
            shouldBack = fun.isShouldBack();
        }
        app.dlog("是否直接返回：shouldBack="+shouldBack);
  	 	if(shouldBack)return;
		if(fun.findIndexPage())
		{
		    app.dlog("阅读中，出现首页，退出阅读");
  			return;
		}
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
        if(app.compareVersion()>=0){
            app.dlog("swipe......");  //波波视频有时滑不动？
		    swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
 		    sleep(1000);
		}
		else
		{
		  app.dlog("刷新......");
		  template.clickIndexPage(fun);
		}
	    //视频条目
        videoItem = fun.findVideoItem();
        if(videoItem){
			if(fun.getVideoTitle)
	          videoText = fun.getVideoTitle(videoItem);
	        else
			  videoText =videoItem.child(0).text();
			app.dlog("找到视频："+videoText);
			var vItem=app.findNodeByText(videoItem,"广告");
			if(!vItem)isFindVideo = true;
			
		}
		else
		{
			if(isFindVideo)isFindVideo=false;
			app.dlog("没有找到视频条目,isFindVideo="+isFindVideo);
			
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
			sleep(3000);
	
		}
		app.dlog("查找视频结果："+videoText+" isFindVideo="+isFindVideo);
    }

    //找到视频，点击阅读
    if(isFindVideo){
		app.dlog("找到视频，点击阅读");
	    initParam.lastNewsText = videoText;
      	initParam.totalNewsReaded++;
		if(videoItem && !videoItem.click())
		{
		  app.dlog("click play fail");
		  if(!click(videoText))
		  {
			 app.dlog("click play text fail");
		     if(app.compareVersion()>=0){
               var bounds = videoItem.bounds();
               if(bounds && bounds.centerX()>=0 && bounds.centerY()>=0){
			     if(click(bounds.centerX(),bounds.centerY())){
                	app.dlog("click play text bounds success:x="+bounds.centerX()+" y="+bounds.centerY());
		    		sleep(1000);
				 }
				 else
				 {
			         app.dlog("click play text bounds fail");
		    		 
				 }
			   }
			   else{
				     app.dlog("click play bounds fail");
		    	   
			   }
			 }
		 
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
template.findOneVideo = function(findVideoItem){
    toast("findOneVideo开始获取视频资源");
    var isFindVideo = false;//是否找到视频
    var videoItem=null;         
    initParam.loopTimeToFindNews = 0;//循环次数
    while((!isFindVideo)  && initParam.loopTimeToFindNews < 20){
        initParam.loopTimeToFindNews++;
        videoItem = findVideoItem();
        if(videoItem){
						
            isFindVideo = true;
        }
		else
		{ //主页视频空空如也
          //进入关注页面：
          //utils.UITextClick("关注");
		  //sleep(1000);
		  sleep(3000);
	
		}
        
    }

    //找到视频，点击阅读
    if(isFindVideo){
        toast("找到视频，点击阅读");
		click("首页");
       
    }else{
        toast("20次滑动没有找到视频，请检查ID");
        exit();
    }
}


//看视频
template.viewVideo = function(seconds,isShouldBack){
    
	app.dlog("viewVideo");
	if(app.compareVersion()<0)
	   seconds=30;      //6.0每个视频主题看30秒
	
    for(var i = 0 ;i < seconds/10 ;i++){
       	
		if(app.compareVersion()>=0){
		  if(initParam.appName != "波波视频"){ //刷宝,快手极速版
	         sleep(18000);
			 utils.swapeToReadVideo();
		  }
		  else	  
			  sleep(10000);
		  
		}
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