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
 * 2、寻找一条新闻条目：findNewsItem
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
//toast("启动:"+initParam.appName);
var b=app.launchApp(initParam.appName);
if(!b) 
{
	  //toast(appName+",启动不成功！");
   if(!template.launch(fun.getAppName))exit();
}
//toast("成功启动:"+initParam.appName);  
	sleep(15000);



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
    
    //toast("签到执行完成");

    /**
     * 新闻阅读流程
     */
     
    while(true){
        //领取时段奖励
        template.getTimeAward(fun.doingAfterTimeAward);
        //找到一条新闻
        template.getOneNews(fun.findNewsItem);
        //阅读新闻60s
        template.readNews(60,fun.isShouldBack);
        //返回新闻列表
        utils.backToIndex(initParam.indexFlagText,initParam.indexFlagText1,initParam.indexFlagText2);
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
      
      return app.launchApp(getAppName(initParam.appName));
    
    }
	
}


/**
 * 跳转到首页
 * 1、返回和首页标识一起判断
 */
template.jumpToIndex = function(getIndexBtnItem){
toast("jumpToIndex");
    var indexFlag = text(initParam.indexFlagText).findOnce();
	//add for 东方头条：
	if(!indexFlag)indexFlag = text(initParam.indexFlagText1).findOnce();
	if(!indexFlag)indexFlag = text(initParam.indexFlagText2).findOnce();
    while(!indexFlag){
        var adFlag=id("iv_activity").findOnce();
        if(adFlag){
            back();
            sleep(500);
        }
      
        //add for 东方头条：
		adFlag = id("aa3").findOnce();
        if(adFlag){
           back();
           sleep(500);
        }
	    adFlag = id("ab0").findOnce();
        if(adFlag){
           back();
		   sleep(500);
        }
		
		//关闭微信提现提示窗
        adFlag = id("a_y").findOnce();//"a_y";//提现到微信ID
        if(adFlag){
            back();
			sleep(500);
        }
      
        //关闭要闻推送
        adFlag = text("忽略").findOnce();
        if(adFlag){
            adFlag.click();
        }
       
        //处理时段奖励提醒
        var timeAward = text("立即领取").findOnce(); //"立即领取";//时段奖励领取提醒
        if(timeAward){
            back();
			sleep(500);
         }
        //处理回退提示
        var backTip = text("继续赚钱").findOnce();
        if(backTip){
            backTip.click();
        }
	    //end for 东方头条
	  
        //点击首页标识性文字
        var flag = false;
        if(getIndexBtnItem == null){ //首页或者新闻/刷新
            flag = utils.UITextBoundsClick(initParam.indexBtnText);
        }else{
	           		var indexPage =getIndexBtnItem();
	           		if(indexPage){
                      flag = indexPage.click(); //东方头条弹出：id=J_article 出错
                    } 
		}
        
        //执行返回
       
        if(!flag){
           //toast("没有发现首页");
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
template.getOneNews = function(findNewsItem){
    
    //toast("开始获取新闻资源");
    //阅读超过50条，刷新页面
    if(initParam.totalNewsReaded > initParam.totalNewsOneTime){
        initParam.totalNews = 0;
        //click(1,1919);
		
		
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
            isFindNews = true;
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
             click(bounds.centerX(),bounds.centerY()); 
          }
		}
    }else{
        toast("20次滑动没有找到新闻，请检查新闻ID");
        exit();
    }
}

//阅读新闻
template.readNews = function(seconds,isShouldBack){

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

template.downloadApp=function(download){
	
	if(download==null)return false;
	return download(initParam.appName);	
    
}


module.exports = template;