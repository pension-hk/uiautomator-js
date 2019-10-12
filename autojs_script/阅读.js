const script_url   ="https://raw.githubusercontent.com/pension-hk/uiautomator-js/master/autojs_script/";
const config_url   ="https://raw.githubusercontent.com/pension-hk/uiautomator-js/master/java/config.json";


const emailAddr    =null;
const imapPasswaord="ggocbroaluisbfgd"; //此为QQ邮箱SMTP/IMAP的登陆密码，不是QQ邮箱登陆密码


start();
function start(){
	toast("初始化......");
	var path=files.getSdcardPath()+"/脚本/";
    var configPath=path+"仓库/"+"config.json";	
	var config    = null;
    var readNum    = 0;
    var scriptName=null;
    var newsList   = null;
	var videoList = null;
	var resourceList = null;
	var currPath   = null;
	var templatePath=path+"template.js";
	var commonPath=path+"common.js";
	var configVersionRemote = getRemoteConfigVersion();
    var configVersionLocal  = getLocalConfigVersion(configPath)   
	app.dlog("configVersionRemote="+configVersionRemote+" configVersionLocal="+configVersionLocal);
	
	if(configVersionRemote != configVersionLocal){
	    toast("脚本版本升级了，处理中......");
        config = getConfig();
        
		//删除新闻类的列表
        newsList = config.newsAppList;
        readNum = newsList.length;
		for(var i = 0;i< readNum;i++){
            scriptName=newsList[i].name;
            currPath=path+scriptName+".js";
            if(files.exists(currPath))
			   files.remove(currPath);
	    }
		//删除视频类的列表
        videoList = config.videoAppList;
	    readNum = videoList.length;
        for(var i = 0;i< readNum;i++){
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
	
	if(!files.exists(commonPath)){
	   downlaodScript("common");
	}
   
    config    = getConfig();
    readNum    = 0;
    scriptName=null;
        
	//资源类的列表
    resourceList = config.resourceList;
    readNum = resourceList.length;
    for(var i = 0;i< readNum;i++){
        scriptName=resourceList[i].name;
        currPath=path+scriptName+".js";
        if(!files.exists(currPath))
			downlaodScript(scriptName);
	}
	
	
	toast("初始化完成，执行脚本");
	//每次阅读的时间
    var normalRumTime = 0.25*60*60;
    while(true){
	   for(var i = 0;i< readNum;i++)
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
}	
	
//执行脚本
function exec(scriptName,seconds){
    var startDate = new Date();//开始时间
    var exectuion = engines.execScriptFile(files.getSdcardPath()+"/脚本/"+scriptName+".js");

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
            app.dlog("如果发现只有一个进程");
			isIExec = false; 
            //stopCurrent(exectuion);
        }
			
		
    }
    //停止脚本
    stopCurrent(exectuion);

}
	
function stopCurrent(exectuion){
    toast("执行停止");
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
	
	
	
function downlaodScript(scriptName){
   toast(scriptName+".js下载中");
   var path = files.getSdcardPath()+"/脚本/"+scriptName+".js";
   var scriptContent =null;
   if(script_url){
	  scriptContent = http.get(script_url+scriptName+".js").body.string();
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
         //toast("开始远程获取配置");
	     configContent = http.get(config_url).body.string();
         //var objConfig = JSON.parse(configContent);
         //toast("配置="+objConfig);
          //return objConfig;
	     if(configContent){
		     //files.write(configPath,configContent);
		     if(!files.exists(configPath)){
		        //toast("配置文件不存在，创建");
                files.create(configPath)
		     }
			 //else
			 // 	 toast("配置文件存在");
			 files.write(configPath,configContent);
		 }
	     //toast("远程配置获取完成");
         return JSON.parse(configContent);   	   
	   }
	   else
	   {
		  //toast("开始获取近程配置");
		  configContent=app.mailGet(emailAddr,imapPasswaord,"config");
		  if(configContent){
		     
			 if(!files.exists(configPath)){
		        //toast("配置文件不存在，创建");
                files.create(configPath)
		     }
			 //else
			 // toast("配置文件存在");
			 files.write(configPath,configContent);
		  }
		  //toast("近程配置获取完成");
          return JSON.parse(configContent);   	   
	   
	   }
	}
	else{
	   //toast("开始获取配置");
	   var file = open(configPath);
       configContent=file.read();
	}
    //解析json：
    objConfig = JSON.parse(configContent);
    //toast("配置获取完成");
    return objConfig;
		
}
function getRemoteConfigVersion(){
	//toast("获取远程配置版本");
    var configContent=null;
	if(null != config_url){
       configContent = http.get(config_url).body.string();
    }
	else
	   configContent=app.mailGet(emailAddr,imapPasswaord,"config");
    if(null==configContent)return 0;
	var config= JSON.parse(configContent);   	   
    var configList = config.version;
	if(null==configList)return 0;
    var thisConfig = configList[0];
	//toast("远程配置版本="+thisConfig.version);
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

