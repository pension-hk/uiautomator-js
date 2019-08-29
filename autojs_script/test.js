const runAppName ="东方头条"; 
const runPkg      ="com.songheng.eastnews";
const indexBtn    ="新闻";
const indexText   ="刷新";
const appName     =runAppName;
const indexBtnText=indexBtn;
const indexFlagText=indexText;
const timeAwardText = "领取"; 
var   totalNewsReaded=0;
var   totalNewsOneTime=20;
var   lastNewsText="";
var   loopTimeToFindNews=20;
  
      wakeUp(); 
	
      var launched=app.launchApp(appName);
      if(!launched)
      {
         exit();
      }
      toast("等待启动......");
       
   	 var waitCount=0;
      var waitFlag=true;
      while(waitFlag  && waitCount<15){
	     waitCount++;
	     if(findIndexPage())
	     {
		  	waitFlag=false;
	     }
	     else
	     sleep(1000);
      }
    
    
	  
       //回归首页的位置
      
      jumpToIndex();

	 
	

	//while(true){
        //领取时段奖励
        //getTimeAward();
        //找到一条新闻
        getOneNews();
        //阅读新闻60s
        readNews(60);
        //返回新闻列表
     	backToIndex(indexFlagText);
    //} 
	
	
	 //var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	 //app.findNodeTest(rootNode,0,0);
		
	
	
function wakeUp(){
   if(!device.isScreenOn()){
        device.wakeUpIfNeeded();
    }
}	
 
function swapeToRead() 
{
   swipe(device.width / 2, device.height * 0.8 ,
        device.width / 2, device.height * 0.5, 1000);
   sleep(6000);		
}
function swapeToReadVideo(){
   swipe(device.width / 2, device.height * 0.8 ,
        device.width / 2, device.height * 0.5, 1000);
   swipe(device.width / 2, device.height * 0.8 ,
        device.width / 2, device.height * 0.5, 1000);
   sleep(13000);
}
	

function getOneNews(){
  
	app.dlog("开始获取新闻资源");
    /*
	//阅读超过50条，刷新页面
    if(totalNewsReaded > totalNewsOneTime){
        totalNewsReaded = 0;
        toast("阅读超过50条，刷新页面");
		var indexPage =getIndexBtnItem();
	    if(indexPage)
		{
		  toast("刷新页面");	
          flag = indexPage.click(); 
        }
        sleep(2000);
    }
    */
    //上滑找新闻
    var isFindNews = false;//是否找到新闻
    var newsText = "";//新闻标题
    var newsItem;//新闻条目
    loopTimeToFindNews = 0;//循环次数
    while((!isFindNews || lastNewsText === newsText)  && loopTimeToFindNews < 20){
        //找新闻次数+1
        loopTimeToFindNews++;
        //进行下翻
        if(app.compareVersion()>=0){
		  swipe(device.width / 2, device.height / 4 * 2,  device.width / 2, device.height / 4, 1000);
	      //sleep(2000);
		}
    	else{ 
			  sleep(1000);
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
		    	    var tmpNewsItem=app.findNodeByText(newsItem,"置顶");
			        if(!tmpNewsItem)tmpNewsItem=app.findNodeByText(newsItem,"广告");
			        if(!tmpNewsItem)isFindNews = true;
			  }
			  else
			  {
				  toast("找到新闻,但无标题");
         	  }
		    }
			
        }
	
    }

    //找到新闻，点击阅读
    if(isFindNews){
        lastNewsText = newsText;
        app.dlog("找到新闻，请阅读："+lastNewsText);
     	totalNewsReaded++;
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
        }
		else{
		  app.dlog("找到新闻，点击未进入");
    	}

    }else{
        toast("20次滑动没有找到新闻，请检查新闻ID");
	    exit();
    }
}

function readNews(seconds){
	if(desc("当前所在页面,提示").findOnce())return;
	//滑动阅读新闻
    for(var i = 0 ;i < seconds/10 ;i++){
     	if(app.compareVersion()>=0)
		{
		   if(className("android.webkit.WebView").findOnce()){	
		      swapeToRead();
			  clickReadAll();  
		   }
		   else
		   {
			   //新闻条目是视频资源：
			   swapeToReadVideo();
		   }
		   
		   
        }
		else  
		{
			//sleep(10000);
			
			var  waitCount=0;
		    while(waitCount<10)
		    {
		       waitCount++;    
		       clickReadAll();
			   sleep(1000);
		    }
			sleep((10-waitCount)*1000);
    	    
		}
        //判断是否直接返回
        //var shouldBack = isShouldBack();
        //if(shouldBack){
        //    return;
        //}
		
		
    }
}



function clickIndexPage(){
	app.dlog("点击新闻首页标识性文字");  
	var flag = false;
    var indexPage =getIndexBtnItem();
	if(indexPage)
	{
      flag = indexPage.click(); 
	  if(!flag){
		app.dlog("点击首页标识性窗口失败，改点文字");  
	   	flag=click(indexBtnText); 
		if(!flag)flag=click(indexFlagText);
      }
    } 
	return flag;
	
}

/**
 * 跳转到首页
 * 1、返回和首页标识一起判断
 */
function jumpToIndex(){

    toast("跳转到首页......");
	var waitCount  =  0;
    var indexFlag = findIndexPage();
	
	while(!indexFlag && waitCount<10){
		waitCount++;
		//template.ucMobile();
		//template.procPopWindow(fun);
		var flag = clickIndexPage();
	    //执行返回
        if(!flag){
           //回退前检查目前运行的APP状况
		   var currentPkg=currentPackage();
		   app.dlog("找首页时，没有发现首页,back(),当前页面="+currentPkg);
           if(currentPkg==="org.yuyang.automake"||currentPkg.indexOf("launcher")>=0)
		   {
			  var launched=app.launchApp(appName);
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
        indexFlag = findIndexPage();
	}
    app.dlog("已经到首页");  
	if(waitCount>=10){
	   app.dlog("找首页时，没有发现首页,连续返回10次都不起作用,退出");
       exit(); 
    }


}




function  backToIndex(indexFlagText) {
    

}



    //获取首页按钮
function getIndexBtnItem()
{
	return findIndex();		
}
		//获取首页标志
function findIndexPage()
{
   return  findIndex();
}


function findIndex(){
	  var textW=text(indexBtn).findOnce(); 
	if(!textW)textW=text(indexText).findOnce();
    if(textW)textW=textW.parent();
    return textW;  
}	

	
    //签到
function signIn(){
	
}

function preProcess(clickText){
	
}


    
function popWindow(){
	 
	
}

function popWindowProcess()
{
}

    //找出新闻的条目
function  findNewsItem(){
    	app.dlog("找出新闻的条目");
		var newsItem =null;
   	    var rootNode = className("android.support.v7.widget.RecyclerView").findOnce();
	    //app.findNodeTest(rootNode,0,0);
		if(app.compareVersion()>=0)
		     newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,0,-1);
		else newsItem=app.findNodeByClassByFilt(rootNode,"android.widget.TextView","下拉刷新",0,2,1);
		return newsItem;
	
}


function  clickReadAll()
{
	
		   
}



