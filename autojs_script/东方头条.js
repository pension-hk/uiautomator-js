const utils = require('common.js');
utils.wakeUp(); 
var appName="东方头条";
var appPackage=app.getPackageName(appName);
if(!app.isAppInstalled(appPackage)){
   
   toast(appName+"没有安装");
   download(appName);
   //Login(appName);
} 
else
{
   utils.launch(appName);
  
   /**
    * 全局参数
   **/
   var lastNewsText="";//上一次新闻标题
   var totalNewsReaded = 0;//已经阅读的新闻条数
   var totalNewsOneTime = 50;//一次性阅读多少条新闻
   var loopTimeToFindNews=20;//找了多少次新闻找不到会退出

   /**
     * 全局控件ID
    */
  //var newsItemId = "oq";//新闻条目ID
  var newsItemId = "go";//"fu";//新闻条目ID
  var newsItemId1 = "pl";//"oq";//新闻条目ID
  var newsItemId2 = "ld";//"ki";//新闻条目ID
  var indexFlagText="扫一扫";//首页特有的标志文字
  var indexFlagText1="发布";//首页特有的标志文字
  var indexFlagText2="搜索你感兴趣的内容";//首页特有的标志文字
  
  var indexCashOut="a_y";//提现到微信ID
  var timeAwardTip="立即领取";//时段奖励领取提醒

  if(app.getPermission())
  {
    //开始刷新闻，主循环
    jumpToIndex();

	refferProccess(appName)
  	  
    jumpToIndex();
  
    //toast("开始刷新闻，主循环");
    while(true){
       //领取时段奖励
       getAward();
  
	   if(app.compareVersion()>=0)
	   { 
         //点击进入新闻
         getOneNews();
         //阅读新闻60s
         readNews(60);
	   }
	   else
	   {
          readNewsPush(); 

	   }   
       //返回新闻列表
       backToIndex(indexFlagText,indexFlagText1);
    }//while
  }
}

//跳转到首页
function jumpToIndex(){
	var indexCount=0;
    //循环关闭所有的弹出框
    var flag = text(indexFlagText).findOnce();
	if(!flag)flag = text(indexFlagText1).findOnce();
	if(!flag)flag = text(indexFlagText2).findOnce();
    while(!flag && indexCount < 3){
       indexCount++;
	   var adClose = id("aa3").findOnce();
       if(adClose){
          back();		   
       }
       
	   adClose = id("ab0").findOnce();
       if(adClose){
           back();
       }
       //关闭要闻推送
       var newsPush = text("忽略").findOnce();
       if(newsPush){
            newsPush.click();
       }
       else{
          newsPush = id("xe").findOnce();
          if(newsPush){
            newsPush.click();
          }
       }
       
       //关闭微信提现提示窗
       var cashToWeichat = id(indexCashOut).findOnce();
       if(cashToWeichat){
            back();
       }
       //处理时段奖励提醒
       var timeAward = text(timeAwardTip).findOnce();
       if(timeAward){
            back();
       }
       //处理回退提示
       var backTip = text("继续赚钱").findOnce();
       if(backTip){
            backTip.click();
       }
        
	   var flagNews=text("新闻").findOnce();
	   if(!flagNews)flagNews=text("刷新").findOnce();
	   if(flagNews)
	   {
		   //toast("新闻或刷新标志找到");	
		   var parentW=	flagNews.parent();
		   if(parentW)parentW.click();
	   }
	   else{
	        //全部找不到，回退
		   toast("全部找不到，回退");	
	       back();
	   }
	   sleep(1000);
	   flag = text(indexFlagText).findOnce();
	   if(!flag)flag = text(indexFlagText1).findOnce();
	   if(!flag)flag = text(indexFlagText2).findOnce();
       
		  
	     
    }
    if(!flag)exit();
	toast("回到主页");
	
}


function backToIndex(indexFlagText,indexFlagText1) {
    var loop = 0;
	var loopCount=0;
	var indexBtn = text(indexFlagText).findOnce();
	if(!indexBtn)indexBtn = text(indexFlagText1).findOnce();
	if(!indexBtn)indexBtn = text(indexFlagText2).findOnce();
    while(!indexBtn  && loopCount<  20){
        loopCount++;
	    //关闭要闻推送
        var newsPush = text("忽略").findOnce();
        if(newsPush){
          newsPush.click();
        }
    	//back()后：
		var fl=text("继续赚钱").findOnce();
        if(fl){
           fl.click();
        }
		
		var newsItem=text("新闻").findOnce();
        if(!newsItem)
		{
           newsItem=text("刷新").findOnce();
  	    }
		if(newsItem){
		
    	   var parentW=	newsItem.parent();
		   if(parentW)parentW.click();
  	    }
		else
		{
		   back();
           sleep(1000);
        }
		
		indexBtn = text(indexFlagText).findOnce();
	    if(!indexBtn)indexBtn = text(indexFlagText1).findOnce();
	    if(!indexBtn)indexBtn = text(indexFlagText2).findOnce();
	
        //超出退出时长的，做一些特殊处理
        if(loop > 5){
            //无限返回的页面
            var isSucc = util.textClick("关闭");
            if(!isSucc){
                util.textBoundsClick("关闭");
            }

            //系统的安装页面
            if(!isSucc){
                util.UITextClick("取消");
            }

            //成功关闭
            if(isSucc){
                indexBtn = true;
            }
        }
        loop++;
    }
}


//
function  refferProccess(appName){
    if(!app.getWaitLogin(appName))return;
    toast("有推广码需要处理");
	var config = utils.getConfig();
    //新闻类的列表
    var newsList = config.newsAppList;
    var refferCode=newsList[0].reffer_code;
	toast("refferCode="+refferCode);
	utils.UITextClick("我的");
    sleep(1000);
	var count = 5;
	while(count--)
	{
	   var refferFillW= text("填邀请码").findOnce();
	   if(refferFillW){
	      sleep(100);
		  refferFillW=refferFillW.parent();
		  if(refferFillW)
		  {
			  refferFillW.click();
	          //填邀请码：
	          var fillText=ClasssName("EditText").findOnce();
	          if(fillText){
	             fillText.click();
	             sleep(200);
	             fillText.setText(refferCode);
	             sleep(200);
	             utils.UITextClick("提交邀请码");  
	          }		  
		      
		  }
		  break;
	   }
	   //关闭要闻推送
       var newsPush = text("忽略").findOnce();
       if(newsPush){
            newsPush.click();
       }

	   sleep(1000); 
	}
    toast("推广码处理完成");

}

//领取时段奖励
function getAward(){

    //关闭推荐新闻
    var awardClose = id("aqo").findOnce();
    if(awardClose){
        awardClose.click();
    }
}

// 获取一条新闻
function getOneNews(){

    //阅读超过50条，刷新页面
    if(totalNewsReaded > totalNewsOneTime){
        totalNews = 0;
       // click(1,1919);
        sleep(2000);
    }

    //上滑找新闻
    var isFindNews = false;//是否找到新闻
    var newsText = "";//新闻标题
    loopTimeToFindNews = 0;
    var newsItem=null;
    var newsItemW =null;
    while((!isFindNews || lastNewsText === newsText)  && loopTimeToFindNews < 20){
        //找新闻次数+1
        loopTimeToFindNews++;

        //进行下翻
        swipe(device.width / 2, device.height / 4 * 2,device.width / 2, device.height / 4, 1000);
        sleep(1000);

        //找到新闻item
        newsItemW = id(newsItemId).findOnce();//"fu"
        if(newsItemW==null)continue;
   
        var index=-1;
        var adTextFlag=false;
        for(var i=0;i<newsItemW.childCount();i++)
        {
            var linearLayout=newsItemW.child(i);
            if(linearLayout==null)continue;
            
            if(findIdFilt(linearLayout,newsItemId1))//"oq"
            {
                adTextFlag=true;
                
            }
            else
            if(!findIdFilt(linearLayout,newsItemId2))//"ki"
            {
                 continue;
            }
            
            if(findFilt(linearLayout,"置顶"))continue;
            if(findContainFilt(linearLayout,"广告"))continue;
            if(adTextFlag && !findContainFilt(linearLayout,"阅读"))continue;
            index=i;
            newsText=getNewsText(linearLayout);
            //toast("新闻标题="+newsText);
            isFindNews=true;
            break;
            
           
        }
    }
    if(index>=0)newsItem=newsItemW.child(index);
    
    
    //找到新闻
    if(newsItem){
        toast("有新闻资源，点击进入");
        lastNewsText = newsText;
        totalNewsReaded++;
        newsItem.click();
        
    }else{
        toast("20次滑动没有找到新闻，请检查新闻ID");
        exit();
    }
    
}

function findFilt(obj,flag){
   //toast("input class="+obj.className());
   for(var i=0;i<obj.childCount();i++){
       var child=obj.child(i);
       if(child===null)continue;
       
       
       var tx=child.text();
       //toast("text="+tx);
       if(tx===flag)return true;
       if(findFilt(child,flag))return true;
   } 
   return false;
}


function findContainFilt(obj,flag){
  
   for(var i=0;i<obj.childCount();i++){
       var child=obj.child(i);
       if(child===null)continue;
       var tx=child.text();
       //toast("findContainFilt:text="+tx);
       if(tx.indexOf(flag)>=0)return true;
       //if(findContainFilt(child,flag))return true;
       if(findContainFilt(child,flag))return true;
   
   } 
   return false;
}

function findIdFilt(obj,idF){
    
    for(var j=0;j<obj.childCount();j++){
        var txW=obj.child(j);
        if(txW==null)continue;
        var idFlag=txW.id();
        if(idFlag==null)continue;
        var idS=idFlag.split("id/")[1];
        if(idS===idF){
            //toast("找到类id:"+idFlag);
            
            return true;
        }
       // else{
       //     toast("类id:"+idS);
        //    
        //    }
    }
    return false;
    
}

function getNewsText(obj){
    for(var j=0;j<obj.childCount();j++){
        var txW=obj.child(j);
        if(txW==null)continue;
        var tx=txW.text();
        if(tx){
          return tx;
        }
        
    }
    return null;
}

//阅读新闻
function readNews(seconds){
    var times = seconds/10;
    var newsItem=id(indexFlagText).findOnce();
    if(newsItem)return;
    
    newsItem=id("我的").findOnce();
    if(newsItem)return;
   
    //开始滑动
    for(var i = 1;i < times;i++){
        //滑动阅读新闻
        swipe(device.width / 2, device.height * 0.8 ,
            device.width / 2, device.height * 0.5, 5000);

        swipe(device.width / 2, device.height * 0.8 ,
            device.width / 2, device.height * 0.5, 5000);

        var fl=text("忽略").findOnce();
        if(fl){
            fl.click();
        }
        //关闭继续阅读
        //var textOk = id("text_ok").findOnce();
       // if(textOk){
        //    textOk.click();
        //}

    }
}

function readNewsPush()
{
    toast("阅读推送");
 	//关闭要闻推送
    var newsPush = text("立即查看").findOnce();
    if(newsPush){
       newsPush.click();
	   sleep(5000);
    }
 
}




function download(name){
	
    var tencentDl="com.tencent.android.qqdownloader";
    var androidInstall="";
    var appPackage=app.getPackageName(name);
    if(app.isAppInstalled(appPackage)){
        toast(name+"已经安装");  
        return;
    }
    toast(name+"没有安装");
    yingyongbao(name);
    
	toast("准备安装");
      
    //循环找安装
    var installFlag = false;
    while(!installFlag){
       var uiele = text("安装").findOnce();
       if(uiele){
          uiele.click();
          installFlag = true;
       }
    }
        
    //安装完成
    var installFinishFlag = false;
    while(!installFinishFlag){
      //var uiele = text("完成").findOnce();
      var uiele = text("打开").findOnce();
      if(uiele){
          uiele.click();
          installFinishFlag = true;
      }
      sleep(2000);
    }
    //等待打开APP
    var curApp=currentPackage();
    var targetApp=app.getPackageName(name);
    while(curApp != targetApp){
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
            
       curApp=currentPackage();
       sleep(2000);
    }
    //app 打开成功
    var config = utils.getConfig();
    //新闻类的列表
    var newsList = config.newsAppList;
    var refferCode=newsList[0].reffer_code;
	toast("refferCode="+refferCode);
	//发送邮件提醒输用手机登录APP
    var sendContent="东方头条安装完成，请用手机完成注册或登录，然后找到填推广(邀请)码处填好推广码："+refferCode;
    app.sendMail(app.getMyEmail(),app.getMyPassword(),app.getContactEmail(),sendContent);
    //等待注册登录成功，填写推广码
    app.setWaitLogin(name,true);
 	
        
}

function Login(appName){
    var curImg=id("aa3").findOnce();
    if(curImg)curImg.click();
    sleep(1000); 
}



function yingyongbao(name){
    if(!app.isAppInstalled(app.getPackageName("应用宝")))
    {
        toast("请安装应用宝");
        return;
    }
    toast("启动应用宝");
    utils.launch("应用宝");
    var curPackage=currentPackage();
    while(curPackage!="com.tencent.android.qqdownloader"){
       curPackage=currentPackage();
       sleep(1000);
    }
    
    //sleep(5000);
    utils.UIClick("awt");
    sleep(1000);
    var searchId=id("yv").findOnce();
    if(!searchId)return;
    searchId.setText(name);
    sleep(1000);
    utils.UITextClick("搜索");
    sleep(5000);
    var targetApp=text(name).findOnce(1);
    if(!targetApp){
        toast("找不到目标APP："+name);
        return;
    }
    toast("找到目标APP："+name);
    var download=text("下载").findOnce();
    if(!download){
        
        toast("找不到下载按钮");
        return;
     }
    
    //toast("找到下载按钮，准备下载");
    download.parent().click();
    var currentP=currentPackage();
    var tencentDl="com.tencent.android.qqdownloader";
    while(currentP==tencentDl){//等待离开下载界面
       currentP=currentPackage();
       sleep(500);
    }
    
    var del=text("删除").findOnce();
    if(del){
        
        del.click();
        
    }
     
}

