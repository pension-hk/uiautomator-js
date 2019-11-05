const script_url   ="https://raw.githubusercontent.com/pension-hk/uiautomator-js/master/autojs_script/";
const emailAddr    =null;
const imapPasswaord="ggocbroaluisbfgd"; //此为QQ邮箱SMTP/IMAP的登陆密码，不是QQ邮箱登陆密码
 
 
init();

function init(){
    toast("测试开始......");
    var mainPath=files.getSdcardPath()+"/脚本/"+"main.js";
    if(!files.exists(mainPath)){
	   downlaodScript("main");
	}
	toast(scriptName+"测试完成");
	
}

function downlaodScript(scriptName){
   app.dlog(scriptName+".js下载中");
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
	    app.dlog(scriptName+".js不存在，退出下载");
        return false;	 
   }
   if(!files.exists(path)){
	 files.create(path);  
   }
		     
   var b=files.write(path,scriptContent);
   app.dlog(scriptName+".js下载完成");
   return true;

}

