const script_url   ="https://raw.githubusercontent.com/pension-hk/uiautomator-js/master/autojs_script/";
const config_url   ="https://raw.githubusercontent.com/pension-hk/uiautomator-js/master/java/config.json";



const emailAddr    =null;
const imapPasswaord="ggocbroaluisbfgd"; //此为QQ邮箱SMTP/IMAP的登陆密码，不是QQ邮箱登陆密码
 
//shell("shell am instrument -w -r   -e debug false -e class 'com.breadwallet.uiautomator.AutoJsTests' com.pensionwallet.test/android.support.test.runner.AndroidJUnitRunner",true);

init();

function init(){
    toast("初始化......");
	//storages.remove("version");
 	
	var path         =files.getSdcardPath()+"/脚本/";
    var configPath   =path+"仓库/"+"config.json";
	var templatePath =path+"template.js";
	var commonPath   =path+"common.js";
    var config       =null;
    var readNum      =0;
    var scriptName   =null;	
	var resourceList =null;
	var currPath     =null;
	
	var configVersionRemote = getRemoteConfigVersion();
    var configVersionLocal  = getLocalConfigVersion(configPath)   
	app.dlog("configVersionRemote="+configVersionRemote+" configVersionLocal="+configVersionLocal);
	if(configVersionRemote != configVersionLocal  && configVersionRemote !=0)
	{
	    toast("脚本版本升级了，处理中......");
        config = getConfig();
        appNum = 0;
        scriptName=null;
        
		//删除新闻类的列表
        var newsList = config.newsAppList;
        appNum = newsList.length;
		for(var i = 0;i< appNum;i++){
            scriptName=newsList[i].name;
            currPath=path+scriptName+".js";
            if(files.exists(currPath))
			   files.remove(currPath);
	    }
		//删除视频类的列表
        var videoList = config.videoAppList;
	    appNum = videoList.length;
        for(var i = 0;i< appNum;i++){
            scriptName=videoList[i].name;
            currPath=path+scriptName+".js";
            if(files.exists(currPath))
		       files.remove(currPath);
        }
		//删除资源类的列表
        resourceList = config.resourceList;
	    readNum = resourceList.length;
        for(var i = 0;i< readNum;i++){
            scriptName=resourceList[i].name;
            currPath=path+scriptName+".js";
            if(files.exists(currPath))
		       files.remove(currPath);
        }
	
	    if(files.exists(configPath))
		  files.remove(configPath);	   
	    if(files.exists(templatePath))
		  files.remove(templatePath);	   
	    if(files.exists(commonPath))
		  files.remove(commonPath);	   
	
	}	
	
    if(!files.exists(templatePath)){
	   downlaodScript("template");
	}
	if(!files.exists(commonPath)){
	   downlaodScript("common");
	}
   
    config = getConfig();
    appNum = 0;
    scriptName=null;
        
	//新闻类的列表
    var newsList = config.newsAppList;
    appNum = newsList.length;
    for(var i = 0;i< appNum;i++){
        scriptName=newsList[i].name;
        currPath=path+scriptName+".js";
        if(!files.exists(currPath))
			downlaodScript(scriptName);
	}
	//视频类的列表
    var videoList = config.videoAppList;
	appNum = videoList.length;
    for(var i = 0;i< appNum;i++){
        scriptName=videoList[i].name;
        currPath=path+scriptName+".js";
        if(!files.exists(currPath))
		   downlaodScript(scriptName);
	
    }  
	//资源类的列表
    resourceList = config.resourceList;
    readNum = resourceList.length;
    for(var i = 0;i< readNum;i++){
        scriptName=resourceList[i].name;
        currPath=path+scriptName+".js";
        if(!files.exists(currPath))
			downlaodScript(scriptName);
	}
	
	
	
	app.dlog("初始化完成，执行脚本");
    app.dlog("wechat_read="+app.getPrefString("wechat_read"));
	//每次阅读的时间
    var normalRumTime = 0.3*60*60;
    var supperMarket = 0;
	while(true){
        /**
         * 0-7点阅读视频
         * 其他时间阅读新闻
         */
		var hours= new Date().getHours();
    	if(hours >= 7){
          if("yes"  != app.getPrefString("wechat_read"))
          {
          			  
			appNum = newsList.length;
        	//appNum = 1;
            for(var i = 0;i< appNum;i++){
                scriptName=newsList[i].name;
                currPath=path+scriptName+".js";
			    if(files.exists(currPath) && app.getPackageName(scriptName))
			       exec(scriptName,normalRumTime);
			    supperMarket++;
				if(supperMarket>=4)
				{  
			       supperMarket=0;
				   currPath=path+"超级淘"+".js";
                   if(files.exists(currPath) && app.getPackageName("超级淘"))
			           exec("超级淘",120);
			    }
	        }
	        		
			appNum = videoList.length;
            for(var i = 0;i< appNum;i++){
                scriptName=videoList[i].name;
                currPath=path+scriptName+".js";
            	if(files.exists(currPath) 
					&& (app.getPackageName(scriptName)||app.getPackageName(scriptName+"短视频")))
		           exec(scriptName,normalRumTime);
				   
            }
	  	  }
		  else{
			appNum = resourceList.length;
			for(var i = 0;i< appNum;i++)
	        {
		       //i=1;
               scriptName=resourceList[i].name;
		       currPath=path+scriptName+".js";
		       app.dlog("阅读：i="+i+" scriptName="+scriptName);
	           if(files.exists(currPath)){
	               exec(scriptName,normalRumTime);			
		       }
            }
		  }
		  sleep(5000);
        }
		else
		{
		  if("yes" != app.getPrefString("wechat_read"))
          {
          	
			appNum = videoList.length;
            for(var i = 0;i< appNum;i++){
                scriptName=videoList[i].name;
                currPath=path+scriptName+".js";
                if(files.exists(currPath) 
					&& (app.getPackageName(scriptName)||app.getPackageName(scriptName+"短视频")))
		          exec(scriptName,normalRumTime);

            }
		  }
		  else{
            appNum = resourceList.length;
			for(var i = 0;i< appNum;i++)
	        {
		       //i=1;
               scriptName=resourceList[i].name;
		       currPath=path+scriptName+".js";
		       app.dlog("阅读：i="+i+" scriptName="+scriptName);
	           if(files.exists(currPath)){
	               exec(scriptName,normalRumTime);			
		       }
            }
		  }			
	      sleep(5000);
        }
		
		
    }
}



//执行脚本
function exec(scriptName,seconds){
    //自动获取脚本更新
    //updateScript(scriptName);

    //开始执行
    var startDate = new Date();//开始时间
	var execPath = files.getSdcardPath()+"/脚本/";
    //var exectuion = engines.execScriptFile("/sdcard/脚本/"+scriptName+".js");
    app.dlog("执行的脚本路径="+execPath+scriptName+".js");
	var exectuion = engines.execScriptFile(execPath+scriptName+".js");

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
    exectuion.getEngine().forceStop();
    sleep(2000);	
	back();
    sleep(1000);
    back();
    sleep(1000);
    home();
    sleep(5000);
    app.launchApp("倍薪");
	sleep(5000);
	
	var myPkgName  = "org.yuyang.automake"; 
	var currentPkgName=currentPackage();
	var waitCount = 0;
	while(currentPkgName != myPkgName && waitCount<5)
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
	if(waitCount>=5 && currentPkgName != myPkgName)
    {
        home();
		sleep(2000);
		app.launchApp("倍薪");
	    sleep(2000);

	}
	currentPkgName=currentPackage();
	if(currentPkgName != myPkgName)
		app.launchApp("倍薪");
	

}

/*
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
            var scriptContent =null;
		    if(script_url){
	           scriptContent = app.getUrl(script_url+scriptName+".js");//http.get(script_url+scriptName+".js").body.string();
            }
            else
            {
               scriptContent = app.mailGet(emailAddr,imapPasswaord,scriptName);
            }	
			if(scriptContent){
			   files.write(path,scriptContent);
               storage.put(scriptName,version);
               toast("检测更新完成");
               return true;
			}
			return  false;
        }
        toast("检测无需更新");
        return false;
    }
}
*/

function downlaodScript(scriptName){
   toast(scriptName+".js下载中");
   var path = files.getSdcardPath()+"/脚本/"+scriptName+".js";
   var scriptContent =null;
   if(script_url){
	  scriptContent =app.getUrl(script_url+scriptName+".js");// http.get(script_url+scriptName+".js").body.string();
   }
   else
   {
	  scriptContent = app.mailGet(emailAddr,imapPasswaord,scriptName);
   } 
   if(null == scriptContent)return false;
   app.dlog("downlaodScript:scriptContent="+scriptContent);
   if(scriptContent.indexOf("404: Not Found")>=0)
   {
	    toast(scriptName+".js不存在，退出下载");
        return false;	 
   }
   if(!files.exists(path)){
	 files.create(path);  
   }
		     
   var b=files.write(path,scriptContent);
   toast(scriptName+".js下载完成");
   return true;

}


//获取主配置
function getConfig(){
    var configContent=null;
	var configPath=files.getSdcardPath()+"/脚本/仓库/"+"config.json";
    if(!files.exists(configPath)){
	   if(null != config_url){
	     configContent = app.getUrl(config_url);//http.get(config_url).body.string();
	     if(configContent){
		     if(!files.exists(configPath)){
                files.create(configPath)
		     }
			 files.write(configPath,configContent);
		 }
         return JSON.parse(configContent);   	   
	   }
	   else
	   {
		  configContent=app.mailGet(emailAddr,imapPasswaord,"config");
		  if(configContent){
		     
			 if(!files.exists(configPath)){
                files.create(configPath)
		     }
			 files.write(configPath,configContent);
		  }
          return JSON.parse(configContent);   	   
	   
	   }
	}
	else{
	   var file = open(configPath);
       configContent=file.read();
	}
    objConfig = JSON.parse(configContent);
    return objConfig;
		
}

function getRemoteConfigVersion(){
    var configContent=null;
	if(null != config_url){
       configContent = app.getUrl(config_url);//http.get(config_url).body.string();
	   
	}
	else
	   configContent=app.mailGet(emailAddr,imapPasswaord,"config");
    
	if(null==configContent)return 0;
	var config= JSON.parse(configContent);   	   
    var configList = config.version;
	if(null==configList)return 0;
    var thisConfig = configList[0];
    return thisConfig.version;
}

function getLocalConfigVersion(configPath){
	if(!files.exists(configPath))return 0;
	var  file = open(configPath);
    var  configContent=file.read();
    if(null==configContent)return 0;
	var config= JSON.parse(configContent);   	   
    var configList = config.version;
    if(null==configList)return 0;
    var thisConfig = configList[0];
    return thisConfig.version;
	
}