const script_url = "https://raw.githubusercontent.com/pension-hk/uiautomator-js/master/autojs_script/";

/**
 * 执行规则
 * 1、顺序执行
 * 2、0-7点不执行
 * 3、每次阅读10篇文章
 * 4、阅读时候，需要有一定的停顿
 */
 
 
init();
function init(){
    storages.remove("version");
    var path=files.getSdcardPath()+"/脚本/";
    
	var templatePath=path+"/"+"template.js";
	var commonPath=path+"/"+"common.js";
	if(!files.exists(templatePath)){
	   downlaodScript("template");
	}
	
	if(!files.exists(commonPath)){
	   downlaodScript("common");
	}
	/*
	var refferPath = path+"/"+"reffer.json";
	if(!files.exists(refferPath)){
	    toast("缺少reffer.json"+"，下载中");
        var pathFile = path+"reffer.json";
        var jsonContent = http.get(script_url+"reffer.json").body.string();
        if(null != jsonContent);
            files.write(pathFile,jsonContent);
        toast("reffer.json下载完成");

	}
	*/
				
   
	//每次阅读的时间
    var normalRumTime = 0.1*60*60;
    while(true){
        var config = getConfig();
        //新闻类的列表
        var newsList = config.newsAppList;
       
        //视频类的列表
        var videoList = config.videoAppList;

		var scriptName=null;
               
        /**
         * 0-7点阅读视频
         * 其他时间阅读新闻
         */
        if(new Date().getHours() >= 7){
            var appNum = newsList.length;
        	//appNum = 1;
            for(var i = 0;i< appNum;i++){
                scriptName=newsList[i].name;
                var currPath=path+scriptName+".js";
                if(!files.exists(currPath)){
				   downlaodScript(scriptName);
				   continue;
				}
			    exec(scriptName,normalRumTime);
            }
			
			appNum = videoList.length;
            for(var i = 0;i< appNum;i++){
                scriptName=videoList[i].name;
                var currPath=path+scriptName+".js";
                if(!files.exists(currPath)){
				   downlaodScript(scriptName);
				   continue;
				}

                exec(scriptName,normalRumTime);
            }
        }else{
			var appNum = videoList.length;
            for(var i = 0;i< appNum;i++){
                scriptName=videoList[i].name;
                var currPath=path+scriptName+".js";
                if(!files.exists(currPath)){
				   downlaodScript(scriptName);
				   continue;
				}

             	exec(scriptName,normalRumTime);
            }
	        //sleep(1000*60*30);//睡眠半个小时
        }
    }
}



//执行脚本
function exec(scriptName,seconds){
    //自动获取脚本更新
    updateScript(scriptName);

    //开始执行
    var startDate = new Date();//开始时间
    var exectuion = engines.execScriptFile("/sdcard/脚本/"+scriptName+".js");

    //计时器，检测时间
    var isIExec = true;
    while(isIExec){
        //计时
        var runSeconds = ((new Date().getTime()) - startDate.getTime())/1000;
        toast(scriptName+"已执行"+runSeconds +"秒");
        if(runSeconds >  seconds){
            isIExec = false; 
        }

        sleep(60*1000);//每一分钟检测一次

        //检测当前执行的任务是否已经完成
        //如果发现只有一个进程，则跳转到下一个
        if(engines.all().length < 2){
            isIExec = false; 
            stopCurrent(exectuion);
        }
    }
    //停止脚本
    stopCurrent(exectuion);
}

//停止当前脚本
function stopCurrent(exectuion){
    toast("执行停止");
    exectuion.getEngine().forceStop();
    sleep(2000);	
	
	var currentPkgName=currentPackage();
	var myPkgName  = getPackageName("倍薪"); 
	//toast("当前的包名为："+currentPkgName);
	var waitCount = 0;
	while(currentPkgName != myPkgName && waitCount<3)
	{
	   waitCount++;
	   if(currentPkgName=="com.UCMobile")
	   {
	       var  exitText =  text("退出").findOnce();
           if(exitText)exitText.click();
           else
		   {
              back();
              sleep(1000);
		   }		   
	   }
       else{ 
	       back();
           sleep(1000);
	   }
	   currentPkgName=currentPackage();
	}
	if(waitCount>=3 && currentPkgName != myPkgName)
    {
        home();
		sleep(2000);
	}
	app.launchApp("倍薪");
	

}

//更新脚本
function updateScript(scriptName){
    toast("检测脚本更新");
    var storage = storages.create("version");
    var scriptVersion = storage.get(scriptName);

    var config = getConfig();
    var newsAppList = config.newsAppList;
    for(var i = 0; i< newsAppList.length;i++){
        var thisScript = newsAppList[i];
        var name = thisScript.name;
        var version = thisScript.version;
        
        if(scriptName == name && version != scriptVersion){
            toast("检测开始更新");
            var path = "/sdcard/脚本/"+scriptName+".js";
            var scriptContent = http.get(script_url+scriptName+".js").body.string();
            files.write(path,scriptContent);
            storage.put(scriptName,version);
            toast("检测更新完成");
            return true;
        }
        toast("检测无需更新");
        return false;
    }
}

function downlaodScript(scriptName){
   toast("缺少"+scriptName+".js，下载中");
   var path = "/sdcard/脚本/"+scriptName+".js";
   var scriptContent = http.get(script_url+scriptName+".js").body.string();
   if(null == scriptContent)return false;
   var b=files.write(path,scriptContent);
   toast(scriptName+".js下载完成");

}


//获取主配置
function getConfig(){
    toast("开始获取配置");
    var url = "https://raw.githubusercontent.com/pension-hk/uiautomator-js/master/java/config.json";
    var str = http.get(url);
    str = JSON.parse(str.body.string());
    toast("配置获取完成");
    return str;    
}
