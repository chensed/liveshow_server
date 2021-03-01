var express = require('express');
var router = express.Router();
var userDAO = require('../dao/userDAO');
var result = require('../model/result');
var jsdom = require('jsdom');
var ossresource=require('../model/ossresource');
var multiparty = require('multiparty');
var fs = require("fs");
var md5 = require('js-md5');
var XLSX = require('xlsx');
const { IncomingForm } = require('formidable');

var global_userinfo_arr=[];

const WIN_UPLOAD_DIR="D:\\bethel_sale_backend\\upload";
const LINUX_UPLOAD_DIR="/root/bethel_sale_backend/upload";

const WIN_PUBLIC_DIR="D:\\bethel_sale_backend\\public";
const LINUX_PUBLIC_DIR="/root/bethel_sale_backend/public";



function  tokennotexist(curtoken){
    var size=global_userinfo_arr.length;
    for (var i=0;i<size;i++){
        if (global_userinfo_arr[i].token==curtoken)
          return false;
    }

    return true;
}

//save user info to user list
function manageuserinfo(userinfo){
    var size=global_userinfo_arr.length;
    for (var i=0;i<size;i++){
        if (global_userinfo_arr[i].name==userinfo.username){
            global_userinfo_arr[i]=userinfo; //existed user
            return ;
       }
    }

    global_userinfo_arr.push(userinfo);//new user
    return ;

}


function getroomno(token){
    var size=global_userinfo_arr.length;
    for (var i=0;i<size;i++){
        if (global_userinfo_arr[i].token==token){
            return global_userinfo_arr[i].roomno;
       }
    }

    return -1;  //not found for this token

}

//推流认证
function auth(paraminfo){
    var size=global_userinfo_arr.length;
    for (var i=0;i<size;i++){
        if (global_userinfo_arr[i].token==paraminfo.token && global_userinfo_arr[i].roomno==paraminfo.roomno){
            global_userinfo_arr[i].publishstatus=1; //开始播放
            return true;
       }
    }

    return false;

}

function changepublishstatus(roomno,status){
    var size=global_userinfo_arr.length;
    for (var i=0;i<size;i++){
        if (global_userinfo_arr[i].roomno==roomno){
            global_userinfo_arr[i].publishstatus=status; //1:publish,0:stop
            //return true;
       }
    }

}


//login api
router.post('/login',function(req, res){
    
    var paraminfo = req.body;
    //paraminfo.Password=md5(paraminfo.Password);
    //console.log(paraminfo);
    
    
  
    userDAO.login(paraminfo,function (resinfo) {
    
        if (resinfo.length==0) {//no this user
          console.log('username or password is incorrect for',paraminfo.username);
          res.json(result.createResult(false,'username or password is incorrect'));
        }
        else{
           
           var userinfo=resinfo[0];
           var millseconds=new Date().getMilliseconds();//update token by cur time
           userinfo.token=md5(paraminfo.username+millseconds);
           // save user info to user list
           manageuserinfo(userinfo);
           var retobj=new Object();
           retobj.token=userinfo.token;
           res.json(result.createResult(true,retobj));
        }
    });
    
    
});

//创建房间
//create room api
router.post('/createroom',function(req, res){
    var token=req.headers.token;
    console.log('createroom');
    if (token==null){
        res.json(result.createResult(false,"100"));//token is empty
        return ;
    }
    if (tokennotexist(token)){
        res.json(result.createResult(false,"101")); //token expired
        return ;
    }
    var roomno=getroomno(token);
    res.json(result.createResult(true,roomno)); //ok

});

//推流认证
//auth api
router.post('/auth',function(req, res){
    var paraminfo = req.body; 
    console.log(paraminfo); 
    if (paraminfo.roomno=='-1'){
       res.sendStatus(404); 
       return ;
    }
    if (auth(paraminfo))
      res.sendStatus(200); //auth ok
    else
      res.sendStatus(404);
});

router.post('/sendpublishstatus',function(req, res){
    var token=req.headers.token;
    console.log('createroom');
    if (token==null){
        res.json(result.createResult(false,"100"));//token is empty
        return ;
    }
    if (tokennotexist(token)){
        res.json(result.createResult(false,"101")); //token expired
        return ;
    }
    var paraminfo = req.body; 
    changepublishstatus(paraminfo.roomno,paraminfo.status);
    res.json(result.createResult(true,"0")); //ok

});
  

//加用户
router.post('/adduser',function(req, res){
    var token=req.headers.token;
    console.log('adduser');
    if (token==null){
        res.json(result.createResult(false,"100"));//token is empty
        return ;
    }
    if (tokennotexist(token)){
        res.json(result.createResult(false,"101")); //token expired
        return ;
    }

    var paraminfo = req.body; 
    paraminfo.password=md5(paraminfo.password); //password crypth

    userDAO.adduser(paraminfo,function (resinfo) {
        if (resinfo!='ok')
          res.json(result.createResult(false,"102")); //用户名重复
        else
          res.json(result.createResult(true,"0")); //ok
        return ;
    });
});


//文件上传
router.post('/uploadfile',function(req, res){
   var userid = req.query.userid;
   var customerid=req.query.customerid;
   
   var type= req.query.type;//1:sale data,4:user report for clinic,6:ment
   
   var form = new multiparty.Form();
   // form.uploadDir = __dirname+"/uploads/images/";

   //设置编辑
   form.encoding = 'utf-8';
   //设置文件存储路径
   var dir;
   if (type==1){
        if (process.env.windir!=null){ //windows
            form.uploadDir = WIN_UPLOAD_DIR;
            dir=WIN_UPLOAD_DIR;
        }else{ //linux
            form.uploadDir = LINUX_UPLOAD_DIR;
            dir=LINUX_UPLOAD_DIR;
        }
    
   }else{
        if (process.env.windir!=null){ //windows
            form.uploadDir = WIN_PUBLIC_DIR;
            dir=WIN_PUBLIC_DIR;
        }else{ //linux
            form.uploadDir = LINUX_PUBLIC_DIR;
            dir=LINUX_PUBLIC_DIR;
        }  
   }


   //设置单文件大小限制 
   form.maxFilesSize = 20 * 1024 * 1024; //max is 20M
   form.autoFiles=true;
   //form.maxFields = 1000;  设置所以文件的大小总和
   form.parse(req, function(err, fields, files) {
     
      if (err){
        var msgobj=new Object();
        msgobj.message=err.message;
        res.json(400,result.createResult(true, msgobj));
        return ;
      }

      if (files.file.length==0 ||files.file[0].size==0){
        var msgobj=new Object();
        msgobj.message='no uploadfile is received';
        res.json(400,result.createResult(true, msgobj));
        return ;
      }

      

      console.log(files.file[0].originalFilename);
      console.log(files.file[0].path);
      
      var newfilepath;
      if (type!=4){
        if (process.env.windir!=null)
            newfilepath=dir+"\\"+files.file[0].originalFilename; //userid+"_"+
        else
            newfilepath=dir+"/"+files.file[0].originalFilename;
            
      }else{
        if (process.env.windir!=null)
            newfilepath=dir+"\\"+customerid+"\\";//+files.file[0].originalFilename; //userid+"_"+
        else
            newfilepath=dir+"/"+customerid+"/";//+files.file[0].originalFilename;
        
        if (!fs.existsSync(newfilepath)){
          fs.mkdirSync(newfilepath);
          
        }
        
        newfilepath=newfilepath+files.file[0].originalFilename;
            
      }

      try {
               
        fs.renameSync(files.file[0].path,newfilepath);
      }catch (err){
        res.json(result.createResult(false, 'open file failed'));
        return ;
      }
      /*
      var pos=newfilepath.lastIndexOf('.');
      if (pos>0){
          var ext=newfilepath.substr(pos+1);
          if (ext=='xlsx'){
              parseSalsdata(newfilepath,res);
              return ;
          }
      }*/
      if (type==1){
         parseSalsdata(newfilepath,res);
         return ;
      }else if (type==2){
        parseprojectdata(newfilepath,res); 
        return ;
      }else if (type==3){
        parsepdoctordata(newfilepath,res); 
        return ;
      }else if (type==4){  //转诊报告
        var url="/pdfreport/"+customerid+"/"+files.file[0].originalFilename;
        setreporturl(customerid,url,res);
        return ;
      }
      res.json(result.createResult(true, 'ok'));
      return ;
      
      //send file to ali oss
      /*
      ossresource.putfile(paraminfo.name,newfilepath,function(resinfo){
          
         //msgobj.message='param [name,password] is not defined';
         if (resinfo!=null){
             var retobj=new Object();
             retobj.name=resinfo.name;
             retobj.url=resinfo.url; 
             res.json(result.createResult(true, retobj));
         }else{
             var msgobj=new Object();
             msgobj.message='put file error';
             res.json(400,result.createResult(true, msgobj));

         }
      });*/
   
   });
  
      
    
});



router.post('/pwdsetting',function (req, res){
    
    var token=req.headers.token;
    console.log('pwdsetting');
    if (token==null){
        res.json(result.createResult(false,"100"));//token is empty
        return ;
    }
    if (tokennotexist(token)){
        res.json(result.createResult(false,"101")); //token expired
        return ;
    }

    var paraminfo= req.body;
    paraminfo.oldpassword=md5(paraminfo.oldpassword);
    paraminfo.newpassword=md5(paraminfo.newpassword);
    
    
    userDAO.pwdsetting(paraminfo,function (resinfo) {
        if (resinfo==-1){
          res.json(result.createResult(false,"110")); //old pwd failed
          return ;
        }

        res.json(result.createResult(true,resinfo));
        return ;
    });


});




module.exports = router;
