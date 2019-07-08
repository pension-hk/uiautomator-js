//launchApp("刷宝短视频");
launchApp("刷宝");



//back();
//sleep(5000);

//launchApp("全民小视频");
//sleep(5000);



var count=0;
 var timecount=0;
while(true){ 
var flag=text("空空如也").findOnce();
if(flag){
    
   
    
    sleep(1000);
    
    var me=text("我").findOnce();
    if(me){
        
        click("我");
        sleep(1500);
        click("我的喜欢");
        sleep(2000);
        var video=id("video_recycler_view").findOnce();
        if(video){
            toast("找到视频");
            
            }
            else{
               toast("没找到视频");
                
                }
        
    }
    else{
        
        toast("找不到(我)");
        
        }
    
    
    break;
    
 }
  if (timecount++ <30)
  {
    sleep(500);
     continue;
    
    
  }
  timecount=0;
  
    //sleep(15000);
    
    //crollDownswipe(540, 1500, 540, 1000, 200);
    //swipe(500, 1200, 500, 600, 200);
    sleep(500);
    click("首页");          
    count++;
    if(count>=1000){
       count=0;
       sleep(10000);
       back();
       back();
       sleep(5000);

       launchApp("全民小视频");
       sleep(15000);
       back();
       back();
       sleep(5000);
       launchApp("刷宝短视频");   
       sleep(5000);
       //click("我");
       //sleep(5000);
       //click("首页");
        
    }//count>=30
   
 
     
 }





