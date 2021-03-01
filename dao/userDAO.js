var mysql = require('mysql');
var mysqlConf = require('../conf/mysqlConf');
var userSqlMap = require('./userSqlMap');
var jsdom = require('jsdom');
var HashMap = require('hashmap');
const { param } = require('jquery');
var moment=require('moment');

//

var pool = mysql.createPool(mysqlConf.mysql);
 
async function getcertificatesbytype(type){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.getcertificatesbytype,[type],function (error, result) {
 
		   if (error) {
			 console.log('getcertificatesbytype error');
			 resolve(null);
		   }
		   resolve(result);
	  })
   });
}

async function getuserlogininfo(param){
    return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.login,[param.username,param.password],function (error, result) {
 
		   if (error) {
		     //var result={};
		     //result.message=error.sqlMessage;
			 console.log('userlogin error');
			 resolve(null);
		   }
		   resolve(result);
	  })
   });
}

async function getinslistinfo(param){
    return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.getinslist,[],function (error, result) {
 
		   if (error) {
		     //var result={};
		     //result.message=error.sqlMessage;
			 console.log('getinslist error');
			 resolve(null);
		   }
		   resolve(result);
	  })
   });
}

async function hassameuser(username){
    return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.getuser,[username],function (error, result) {
 
		   if (error) {
		     //var result={};
		     //result.message=error.sqlMessage;
			 console.log('getuser error');
			 resolve(null);
		   }
		   if (result.length==1)  
			 resolve(1);
		   resolve(0);	 
	  })
   });
}

async function adduser(param){
    return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.adduser,[param.username,param.password,param.name,param.mobile,param.role,param.instype],function (error, result) {
 
		   if (error) {
		     //var result={};
		     //result.message=error.sqlMessage;
			 console.log('adduser error');
			 resolve(null);
		   }
		   
		   resolve(1);
		   	 
	  })
   });
}

async function checkcontract(param){
    return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.checkcontract,[param.applydate,param.userid,param.institutionname,param.address,param.attribute],function (error, result) {
 
		   if (error) {
		     //var result={};
		     //result.message=error.sqlMessage;
			 console.log('checkcontract error');
			 resolve(null);
		   }
		   if (result.length==1) //exist conflicted contract
			  resolve(1);
		   resolve(0);	  
		   	 
	  })
   });
}

async function checkusedcontract(param){
	return new  Promise((resolve, reject)=>{
		//check 6个月内有冲突的合同
		pool.query(userSqlMap.checkusedcontract,[param.userid,param.institutionname,param.address,param.attribute],function (error, result) {
 
		   if (error) {
		     //var result={};
		     //result.message=error.sqlMessage;
			 console.log('checkusedcontract error');
			 resolve(null);
		   }
		   if (result.length==1) //exist conflicted contract
			  resolve(1);
		   resolve(0);	  
		   	 
	  })
   });
}

async function existowncontract(param){
    return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.existowncontract,[param.institutionname,param.address,param.attribute,param.userid],function (error, result) {
 
		   if (error) {
		     //var result={};
		     //result.message=error.sqlMessage;
			 console.log('existowncontract error');
			 resolve(null);
		   }
		   if (result.length==1) //exist conflicted contract
			  resolve(result[0].id);
		   resolve(-1);	  
		   	 
	  })
   });
}

async function setreporturl(customerid,url){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.setreporturl,[url,customerid],function (error, result) {
 
		   if (error) {
			 
			console.log('setreporturl error');
			 resolve(false);
		   }
		   
		   resolve(true);	  
		   	 
	  })
   });
}

async function addcontract(param){
    return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.addcontract,[param.insid,param.userid,param.applydate,param.uploadfilename,param.saleid,param.real_name,param.sale_name],function (error, result) {
 
		   if (error) {
		     //var result={};
		     //result.message=error.sqlMessage;
			 console.log('addcontract error');
			 resolve(null);
		   }
		   
		   resolve(result.insertId);	  
		   	 
	  })
   });
}

async function updatecontract(param){
    return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.updatecontract,[param.insid,param.userid,param.applydate,param.uploadfilename,param.saleid,param.real_name,param.sale_name,param.id],function (error, result) {
 
		   if (error) {
	    	 console.log('updatecontract error');
			 resolve(null);
		   }
		   
		   resolve(1);	  
		   	 
	  })
   });
}

async function getsaleslist(){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.getsaleslist,[],function (error, result) {
 
		   if (error) {
		     //var result={};
		     //result.message=error.sqlMessage;
			 console.log('getsaleslist error');
			 resolve(null);
		   }
		   
		   resolve(result);	  
		   	 
	  })
   });
}

async function getinstitution(param){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getinstitution,[param.institutionname,param.address,param.attribute,param.institutionid],function (error, result) {
 
			if (error) {
			  //var result={};
			  //result.message=error.sqlMessage;
			  console.log('getinstitution error');
			  resolve(null);
			}
			
			//resolve(result.insertId);
			if (result.length>0){
				resolve(result[0].id); //return institution id
				return;
			}
			
			pool.query(userSqlMap.addinstitution,[param.institutionname,param.address,param.attribute,param.userid,param.institutionid],function (error, result) {
 
				if (error) {
				  //var result={};
				  //result.message=error.sqlMessage;
				  console.log('addinstitution error');
				  resolve(null);
				  return ;
				}
				
				resolve(result.insertId);	  
					 
		      })
		   
				 
	   })
	});

		
}

//unused api
async function getinstitutionid(param,userid){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.getinstitutionid,[param.institutionname,param.address,param.attribute,userid],function (error, result) {
 
		   if (error) {
		    
			 console.log('getinstitutionid error');
			 resolve(null);
		   }
		   //if (result.length==1) //exist conflicted contract
		   //	  resolve(1);
		   resolve(result[0].id);	  
		   	 
	  })
   });

}

async function getcontractlist(userid){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.getcontractlist,[userid],function (error, result) {
 
		   if (error) {
		    
			 console.log('getcontractlist error');
			 resolve(null);
		   }
		   for (var i=0;i<result.length;i++)
		      result[i].key=i;
	  
		   resolve(result);	  
		   	 
	  })
   });

}

async function getcontractlistformanager(){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.getcontractlistformanager,[],function (error, result) {
 
		   if (error) {
		    
			 console.log('getcontractlistformanager error');
			 resolve(null);
		   }
		   for (var i=0;i<result.length;i++){
			   result[i].key=i;
			   //get tools table
		   }
			 
		   resolve(result);	  
		   	 
	  })
   });

}


async function addrowdetail(row,contractid,toolindex){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.addcontractdetail,[contractid,toolindex,row.device,row.creditfee,row.stoptime,row.report,row.singleprice,row.totalprice],function (error, result) {
 
		   if (error) {
		    
			 console.log('addcontractdetail error');
			 resolve(null);
		   }
		   //if (result.length==1) //exist conflicted contract
		   //	  resolve(1);
		   resolve(1);	  
		   	 
	  })
   });

}

async function updaterowdetail(row,contractid,toolindex){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.updatecontractdetail,[row.device,row.creditfee,row.stoptime,row.report,row.singleprice,row.totalprice,contractid,toolindex],function (error, result) {
 
		   if (error) {
		    
			 console.log('updatecontractdetail error');
			 resolve(null);
		   }
		   resolve(1);	  
		   	 
	  })
   });

}


async function addcontractdetail(param,contractid){
   var size=param.toolstable.length;
   for (var i=0;i<size;i++){
      await addrowdetail(param.toolstable[i],contractid,i+1);
   }
}

async function updatecontractdetail(param,contractid){
	var size=param.toolstable.length;
	for (var i=0;i<size;i++){
	   await updaterowdetail(param.toolstable[i],contractid,i+1);
	}
 }
 
async function getsalesmaninfo(name){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.getsalemanbyname,[name],function (error, result) {
 
		   if (error) {
		    
			 console.log('getsalesmaninfo error');
			 resolve(null);
			 return ;
		   }
		   var retobj=new Object();
		   
		   if (result.length==0){ //exist conflicted contract
			   retobj.status=1;
			   resolve(retobj);
               return ;
		   }

		   if (result.length>1){
			  retobj.status=2; 
			  retobj.data=result;
			  for (var i=0;i<retobj.data.length;i++){
				retobj.data[i].key=retobj.data[i].id;
			  }
			  resolve(retobj);
			  return ;
		   } 
		   
		   retobj.status=0;
		   retobj.id=result[0].id;	  
		   resolve(retobj);	  
		   	 
	  })
   });
}

async function delcontract(id){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.delcontract,[id],function (error, result) {
 
		   if (error) {
		    
			 console.log('delcontract error');
			 resolve(null);
		   }
		   //if (result.length==1) //exist conflicted contract
		   //	  resolve(1);
		   resolve(1);	  
		   	 
	  })
   });

}

async function delcontract(id){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.delcontract,[id],function (error, result) {
 
		   if (error) {
		    
			 console.log('delcontract error');
			 resolve(null);
		   }
		 
		   resolve(1);	  
		   	 
	  })
   });

}

async function managecontract(params){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.managecontract,[params.checkid,params.check,new Date(),params.id],function (error, result) {
 
		   if (error) {
		    
			 console.log('managecontract error');
			 resolve(null);
		   }
		 
		   resolve(1);	  
		   	 
	  })
   });

}

async function delcontractdetail(id){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.delcontractdetail,[id],function (error, result) {
 
		   if (error) {
		    
			 console.log('delcontractdetail error');
			 resolve(null);
		   }
		   
		   resolve(1);	  
		   	 
	  })
   });

}

async function gettoolstable(id){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.gettoolstable,[id],function (error, result) {
 
		   if (error) {
		    
			 console.log('gettoolstable error');
			 resolve(null);
		   }
		   
		   resolve(result);	  
		   	 
	  })
   });

}

async function getusername(userid){
	return new  Promise((resolve, reject)=>{
		
		pool.query(userSqlMap.getusername,[userid],function (error, result) {
 
		   if (error) {
		    
			 console.log('getusername error');
			 resolve(null);
		   }
		   
		   resolve(result[0].real_name);	  
		   	 
	  })
   });
}

async function getconsumption(param){
   var retarr=[];
   
   for (var toolid=1;toolid<5;toolid++){//for last six weeks
	var toolobj=await gettoolconsumption(param,toolid);
	retarr[toolid-1]=toolobj;
   }
   return retarr;
} 

async function gettoolconsumption(param,toolid){
   var dataobj=new Object();
   if (toolid==1)
	 dataobj.tool="Dream ITS";
   else	if (toolid==2)
     dataobj.tool="Dream IT";
   else	if (toolid==3)
	 dataobj.tool="Dream S";
   else	if (toolid==4)
	 dataobj.tool="Dream C";
		 
   //总购买量和总使用量
   var totalamountobj=await gettooltotalconsumption(param,toolid);
   if (totalamountobj==null){
	 dataobj.purchase_amount=0;
	 dataobj.used_amount=0;
   }else{
	   if (totalamountobj.purchaseamount==null)
		  dataobj.purchase_amount=0;
	   else
		  dataobj.purchase_amount=totalamountobj.purchaseamount;
	   
	   if (totalamountobj.usedamount==null)
		  dataobj.used_amount=0;
	   else
		  dataobj.used_amount=totalamountobj.usedamount;
			  
   }

   dataobj.stoptime=await gettoolinfo(param.contractid,toolid);
   
   var times=5; //本周，week-1,week-2,week-3,week-4,
   
   for (var index=times-1;index>=0;index--){//for last six weeks
	  var weekamount=await gettoolweeklyconsumption(param,index,toolid);
	  if (index==4)
		 dataobj.week_4=weekamount;
      else if (index==3)		 
		 dataobj.week_3=weekamount;
	  else if (index==2)		 
		 dataobj.week_2=weekamount;
	  else if (index==1)		 
		 dataobj.week_1=weekamount;
	  else if (index==0)		 
		 dataobj.week_0=weekamount;
		 
   }
   
	
   return dataobj;

}

async function gettooltotalconsumption(param,toolid){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.gettooltotalconsumption,[param.institutionid,param.userid,toolid],function (error, result) {
 
		   if (error) {
		    
			 console.log('gettooltotalconsumption error');
			 resolve(null);
		   }
		   
		   if (result.length==0){
		     resolve(null); //no record  
		     return ; 
		   }else{
			  //if ()
			  resolve(result[0]);
		   }	  
		   	 
	  })
   });
}

async function gettoolweeklyconsumption(param,weekindex,toolid){
	var mindays;
	var maxdays;
	var days= new Date().getDay();

	if (weekindex==0){ //本周
	   mindays=0;
	   maxdays=days;
	}else{
	   mindays=(weekindex-1)*7+days;
	   maxdays=weekindex*7+days;
	}
		
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.gettoolforweekconsumption,[param.institutionid,param.userid,toolid,mindays,maxdays],function (error, result) {
 
		   if (error) {
		    
			 console.log('gettoolforweekconsumption error');
			 resolve(null);
		   }
		   
		   if (result.length==0){
		     resolve(null); //no record  
		     return ; 
		   }
		   
		   if (result[0].usedamount==null)
			 result[0].usedamount=0;
			 
		   resolve(result[0].usedamount);	  
		   	 
	  })
   });
}

async function gettoolinfo(contractid,toolid){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.gettoolinfo,[contractid,toolid],function (error, result) {
 
		   if (error) {
		    
			 console.log('gettoolinfo error');
			 resolve(null);
		   }
		   
		   if (result.length==0){
		     resolve(null); //no record  
		     return ; 
		   }
		   resolve(result[0].stoptime);	  
		   	 
	  })
   });
}



async function getuserinfoforinstituion(param){
	var paraminfo=[param.ordertype];
	var querysql=userSqlMap.getuserinfoforins;
	if (param.searchtype!=null){
		if (param.searchtype==2){ //search parent
			if (param.parentname==null)
			  param.parentname='';
			var qname='%'+param.parentname+'%'
			paraminfo=[param.ordertype,qname];
			querysql=userSqlMap.getuserinfoforinswithpname;
		}else {
			if (param.childname==null)
			  param.childname='';
			var qname='%'+param.childname+'%'
			paraminfo=[param.ordertype,qname];
			querysql=userSqlMap.getuserinfoforinswithcname;
		}
	}

	return new  Promise((resolve, reject)=>{
		pool.query(querysql,paraminfo,function (error, result) {
 
		   if (error) {
		    
			 console.log('getuserinfoforinstituion error');
			 resolve(null);
		   }

		   //var age;
		   for (var i=0;i<result.length;i++){
			 result[i].key=i;
			 var month;
			 month=parseInt(parseInt(result[i].childdays%365)/30);
			 if (month!=0)
			   result[i].age=parseInt(result[i].childdays/365)+'岁'+month+'个月';
			 else
			   result[i].age=parseInt(result[i].childdays/365)+'岁';
			   //ressylt[i].hasclinicrecord=await hasuserclinicrecord(result[i].customerid);
			 var year=moment(result[i].birthdate).year();
			 var month=moment(result[i].birthdate).month();
			 var date=moment(result[i].birthdate).date();
			 result[i].birthdate=year+'年'+month+'月'+date+'号';
			 //console.log('date');
			 if (result[i].relation==0)
			   result[i].relation='未选';
			 else if (result[i].relation==1)
			   result[i].relation='妈妈'
			 else if (result[i].relation==2)
			   result[i].relation='爸爸'
			 else if (result[i].relation==3)
			   result[i].relation='祖父母'
			 else
			   result[i].relation='其他'
		     
		   }
		   
		   resolve(result);
		   	  
		   	 
	  })
   });
}

async function insertsaledatabyrow(salesdata,row){
   var errmsg='第'+row+'行:';
   var errflag=false;
   var real_name;
   var insid;
   var insname;
   var toolname;
   var createdate;  
   try {  
     real_name=salesdata.用户;
     insid=salesdata.机构ID;
     insname=salesdata.机构名称;
     toolname=salesdata.工具名称.toLowerCase();
     createdate=salesdata.更新日期; 
   } catch (err){
	  errmsg=errmsg+';存在不能识别的标识';
	  return errmsg;
   }

   //check user name
   var userid=await getuserid(real_name);
   if (userid==null){
	  errmsg=errmsg+';存在不能识别的用户名';
	  errflag=true;
   }

   var hospitalid=await gethospitalid(insid);
   if (hospitalid==null){
	 errmsg=errmsg+';存在不能识别的机构ID';
	 errflag=true;
   }

   var toolid;  
   //check tool  
   if (toolname=='dream its')
	  toolid=1;
   else if (toolname=='dream it')
	  toolid=2;
   else if (toolname=='dream s')
	  toolid=3;
   else if (toolname=='dream c')
	  toolid=4;
   else
      errmsg=errmsg+';不能识别工具名称'; 	  
	  	   	  	 
   var purchaseamount;
   var usedamount;
   try{  
	purchaseamount=parseInt(salesdata.总购入量);
	usedamount=parseInt(salesdata.总使用量);
   }catch (err){
	 errmsg=errmsg+';总购入量或总使用量不是数字';
	 errflag=true;
   }

   var datestr='';
   
   if (createdate==null){
	 errmsg=errmsg+';更新日期不是日期格式yyyy/mm/dd或yyyy-mm-dd';
	 errflag=true;
   }else{
     datestr=createdate.getFullYear()+'/'+(createdate.getMonth()+1)+'/'+(createdate.getDate()+1);
     
   }

   if (errflag)
	 return errmsg;

   var hassameflag=await hassamesalerecord(userid,hospitalid,toolid,datestr);
   if (hassameflag)
	 await updatesalerecord(userid,hospitalid,toolid,datestr,usedamount,purchaseamount);
   else
     await insertnewsalerecord(userid,hospitalid,toolid,datestr,usedamount,purchaseamount);
	  
   errmsg=errmsg+'ok';
   return errmsg;
		  
}

async function insertprojectdatabyrow(projectdata){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.insertprojectdata,[projectdata.type,projectdata.projectid,projectdata.baseprice,projectdata.singleprice,projectdata.projectname],function (error, result) {
 
		   if (error) {
		    
			 console.log('insertprojectdata error');
			 resolve(false);
		   }
		   
		   resolve(true);
		   	 
	  })
   }); 
}

async function insertdoctordatabyrow(doctordata){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.insertdoctordata,[doctordata.name],function (error, result) {
 
		   if (error) {
		    
			 console.log('insertdoctordata error');
			 resolve(false);
		   }
		   
		   resolve(true);
		   	 
	  })
   }); 
}


async function getuserid(realname){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getuserid,[realname],function (error, result) {
 
		   if (error) {
		    
			 console.log('getuserid error');
			 resolve(null);
		   }
		   
		   if (result.length==0){
		     resolve(null); //no record  
		     return ; 
		   }else{
			  resolve(result[0].id);
		   }	  
		   	 
	  })
   });
}

async function gethospitalid(insid){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.gethospitalid,[insid],function (error, result) {
 
		   if (error) {
		    
			 console.log('gethospitalid error');
			 resolve(null);
		   }
		   
		   if (result.length==0){
		     resolve(null); //no record  
		     return ; 
		   }else{
			  resolve(result[0].id);
		   }	  
		   	 
	  })
   });
}

async function hassamesalerecord(userid,hospitalid,toolid,datestr){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.hassamesalerecord,[userid,hospitalid,toolid,datestr],function (error, result) {
 
		   if (error) {
		    
			 console.log('hassamesalerecord error');
			 resolve(null);
		   }
		   
		   if (result.length==0){
		     resolve(false); //no record  
		     return ; 
		   }else{
			  resolve(true);
		   }	  
		   	 
	  })
   });
}

async function updatesalerecord(userid,hospitalid,toolid,datestr,usedamount,purchaseamount){
	
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.updatesalerecord,[usedamount,purchaseamount,userid,hospitalid,toolid,datestr],function (error, result) {
 
		   if (error) {
		    
			 console.log('updatesalerecord error');
			 resolve(null);
		   }
		   
		   if (result.affectedRows==0){
		     resolve(false); //no record updated  
		     return ; 
		   }else{
			  resolve(true);
		   }	  
		   	 
	  })
   });
}

async function insertnewsalerecord(userid,hospitalid,toolid,datestr,usedamount,purchaseamount){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.insertnewsalerecord,[userid,hospitalid,toolid,datestr,usedamount,purchaseamount],function (error, result) {
 
		   if (error) {
		    
			 console.log('insertnewsalerecord error');
			 resolve(null);
		   }
		   
		   resolve(true); //  
		   	 
	  })
   });
}

async function getorderforservice(param){
	    if (param.startdate=='')
			  param.startdate='2020-01-01';
		if (param.enddate=='')
			  param.enddate='2040-01-01';
				
	    return new  Promise((resolve, reject)=>{
			  
			pool.query(userSqlMap.getorderforservice,[param.userid,param.startdate,param.enddate,param.startdate,param.enddate,param.startdate,param.enddate],function (error, result) {
	
			   if (error) {
	
				 console.log('getorderforservice error');
				 resolve(null);
			   }
			   for (var i=0;i<result.length;i++){
				result[i].key=i;
			}
			
			resolve(result);
			
	
	   })
	});  

}

async function getcoursedetaildata(param){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getcoursedetaildata,[param.customerid,param.ordertype],function (error, result) {
 
		   if (error) {
		    
			 console.log('getcoursedetaildata error');
			 resolve(null);
		   }
		   
		   var totalfare=0;
		   var uninsbenefit=0;

		   for (var i=0;i<result.length;i++){
			   result[i].key=i;
			   result[i].index=i+1;
			   result[i].course=course_content[result[i].course].name;
			   result[i].coursetime=result[i].coursetime+'小时';
			   totalfare=totalfare+result[i].insbenefit;
				  
			   if (result[i].inscheckstatus==0 ) { //未结算 
				  uninsbenefit+=result[i].insbenefit;
			   }

			   result[i].fare='¥'+result[i].fare;
			   result[i].insbenefit='¥'+result[i].insbenefit;
			   result[i].orderstatus=order_content[result[i].orderstatus-1].name;
			   result[i].inscheckstatus=inscheck_content[result[i].inscheckstatus].name;
		   }
		   
		   var newobj=new Object();
		   newobj.totalfare=totalfare;
		   newobj.uninsbenefit=uninsbenefit;
		   newobj.result=result;
		   resolve(newobj);
		    
		   	 
	  })
   });
}

async function gettreatmentdata(param){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.gettreatmentdata,[param.customerid],function (error, result) {
 
		   if (error) {
		    
			 console.log('gettreatmentdata error');
			 resolve(null);
		   }
		   
		   for (var i=0;i<result.length;i++){
			   result[i].key=i;
			   result[i].index=i+1;
		   }
		   
		   resolve(result);
		    
		   	 
	  })
   });
}

async function getorderformanager(param){
	
	if (param.startdate=='')
		 param.startdate='2020-01-01';
	if (param.enddate=='')
		 param.enddate='2040-01-01';
			
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getorderformanager,[param.startdate,param.enddate,param.startdate,param.enddate],function (error, result) {
 
		   if (error) {
		    
			 console.log('getorderformanager error');
			 resolve(null);
		   }
		   
		   for (var i=0;i<result.length;i++){
			   result[i].key=i;
		   }
		   
		   resolve(result);
		    
		   	 
	  })
   });
}



async function getorderforinstitution(param){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getorderforinstitution,[param.instype],function (error, result) {
 
		   if (error) {
		    
			 console.log('getorderforinstitution error');
			 resolve(null);
		   }
		   
		   for (var i=0;i<result.length;i++){
			   result[i].key=i;
		   }
		   
		   resolve(result);
		    
		   	 
	  })
   });
}


async function getcheckesumforinstitution(instype){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getcheckesumforinstitution,[instype],function (error, result) {
 
		   if (error) {
		    
			 console.log('getcheckesumforinstitution error');
			 resolve(null);
		   }
		   
		   if (result.length>0)
		      resolve(result[0].checkedsum);
		   else
		      resolve(0); 
		   	 
	  })
   });
}

async function delorderdata(id){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.delorderdata,[id],function (error, result) {
 
		   if (error) {
		    
			 console.log('delorderdata error');
			 resolve(false);
		   }
		   
		   if (result.affectedRows==1)
		      resolve(true);
		   else
		      resolve(false); 
		   	 
	  })
   });
}


async function verifyoldpwd(username,oldpwd){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.verifyoldpwd,[username,oldpwd],function (error, result) {
 
		   if (error) {
		    
			 console.log('verifyoldpwd error');
			 resolve(false);
		   }
		   
		   if (result.length==1)
		      resolve(true);
		   else
		      resolve(false); 
		   	 
	  })
   });
}

async function settingnewpwd(username,newpwd){

	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.settingnewpwd,[newpwd,username],function (error, result) {
 
		   if (error) {
		    
			 console.log('settingnewpwd error');
			 resolve(false);
		   }
		   
		   if (result.affectedRows==1)
		      resolve(true);
		   else
		      resolve(false); 
		   	 
	  })
   });
}


async function getuncheckesumforinstitution(instype){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getuncheckesumforinstitution,[instype],function (error, result) {
 
		   if (error) {
		    
			 console.log('getuncheckesumforinstitution error');
			 resolve(null);
		   }
		   
		   if (result.length>0)
		      resolve(result[0].uncheckedsum);
		   else
		      resolve(0); 
		   	 
	  })
   });
}

async function getorderforfinance(param){
	if (param.startdate=='')
		 param.startdate='2020-01-01';
	if (param.enddate=='')
		 param.enddate='2040-01-01';
	
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getorderforfinance,[param.startdate,param.enddate],function (error, result) {
 
		   if (error) {
		    
			 console.log('getorderforfinance error');
			 resolve(null);
		   }
		   
		   for (var i=0;i<result.length;i++){
			   result[i].key=i;
		   }
		   
		   resolve(result);
		    
		   	 
	  })
   });
}

async function querycustomername(parentname){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.querycustomer,[parentname],function (error, result) {
 
		   if (error) {
		    
			 console.log('querycustomername error');
			 resolve(false);
		   }
		   
		   if (result.length==0)
		     resolve(false);
		   else
		     resolve(true); 
		   	 
	  })
   });
}

async function insertnewcustomer(param){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.insertnewcustomer,[param.parentname,param.mobile,param.birthdate,param.complains,param.userid],function (error, result) {
 
		   if (error) {
		    
			 console.log('insertnewcustomer error');
			 resolve(null);
		   }
		   
		   if (result.affectedRows==1)
		     resolve(result.insertId);
		   else
		     resolve(-1); 
		   	 
	  })
   });
}

async function insertpushednewcustomer(param){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.insertpushednewcustomer,[param.parentname,param.mobile,param.birthdate,param.complains,param.userid],function (error, result) {
 
		   if (error) {
		    
			 console.log('insertpushednewcustomer error');
			 resolve(null);
		   }
		   
		   if (result.affectedRows==1)
		     resolve(result.insertId);
		   else
		     resolve(-1); 
		   	 
	  })
   });
}


async function insertneworder(param,customerid){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.insertneworder,[customerid,param.userid,param.wjxlink,param.ordertype,param.jid],function (error, result) {
 
		   if (error) {
		    
			 console.log('insertneworder error');
			 resolve(null);
		   }
		   
		   if (result.affectedRows==1)
		     resolve(result.insertId);
		   else
		     resolve(-1); 
		   	 
	  })
   });
}

async function insertpushedneworder(param,customerid){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.insertpushedneworder,[customerid,param.userid,param.ordertype,param.orderstatus,param.joinid,param.wjxcode],function (error, result) {
 
		   if (error) {
		    
			 console.log('insertpushedneworder error');
			 resolve(null);
		   }
		   
		   if (result.affectedRows==1)
		     resolve(result.insertId);
		   else
		     resolve(-1); 
		   	 
	  })
   });
}

async function updatepushedorder(param,customerid){

	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.updatepushedorder,[param.orderstatus,param.joinid,param.wjxcode,customerid],function (error, result) {
 
		   if (error) {
		    
			 console.log('updatepushedorder error');
			 resolve(null);
		   }
		   
		   if (result.affectedRows==1)
		     resolve(true);
		   else
		     resolve(false); 
		   	 
	  })
   });
}


async function updateorderforservice(param){
    return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.updateorderforservice,[param.checkstatus,param.ordertype,param.wjxlink,param.course,param.courseteacher,param.coursetime,param.fare,param.orderdate,param.comments,param.insbenefit,param.orderstatus,param.online,param.payment,param.clinicrecord,param.userid,param.id],function (error, result) {
 
		   if (error) {
		    
			 console.log('updateorderforservice error');
			 resolve(null);
		   }
		   
		   if (result.affectedRows==1)
		     resolve(true);
		   else
		     resolve(false); 
		   	 
	  })
   });
}

async function updateorderforfinance(param){
    return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.updateorderforfinance,[param.checkstatus,param.inscheckstatus,param.orderstatus,param.userid,param.id],function (error, result) {
 
		   if (error) {
		    
			 console.log('updateorderforfinance error');
			 resolve(null);
		   }
		   
		   if (result.affectedRows==1)
		     resolve(true);
		   else
		     resolve(false); 
		   	 
	  })
   });
}

async function updateorderformanager(param){
    return new  Promise((resolve, reject)=>{
		//管理员updateid:9999
		pool.query(userSqlMap.updateorderformanager,[param.course,param.courseteacher,param.coursetime,param.fare,param.checkstatus,param.orderdate,param.orderstatus,param.inscheckstatus,param.insbenefit,param.userid,param.id],function (error, result) {
 
		   if (error) {
		    
			 console.log('updateorderformanager error');
			 resolve(null);
		   }
		   
		   if (result.affectedRows==1)
		     resolve(true);
		   else
		     resolve(false); 
		   	 
	  })
   });
}

async function updatecustomerinfo(param){

	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.updatecustomerinfo,[param.childname,param.sex,param.relation,param.birthdate,param.complains,param.customerid],function (error, result) {
 
		   if (error) {
		    
			 console.log('updatecustomerinfo error');
			 resolve(null);
		   }
		   
		   if (result.affectedRows==1)
		     resolve(true);
		   else
		     resolve(false); 
		   	 
	  })
   });
}

async function updatepushedcustomer(param){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.updatepushedcustomer,[param.birthdate,param.complains,param.customerid],function (error, result) {
 
		   if (error) {
		    
			 console.log('updatepushedcustomer error');
			 resolve(null);
		   }
		   
		   if (result.affectedRows==1)
		     resolve(true);
		   else
		     resolve(false); 
		   	 
	  })
   });
}

async function getpriceitem(){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getpriceitem,[],function (error, result) {
 
		   if (error) {
		    
			 console.log('getpriceitem error');
			 resolve(null);
		   }
		   
		   
		   resolve(result);
		    
		   	 
	  })
   });
}

async function getinsbenefits(){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getinsbenefits,[],function (error, result) {
 
		   if (error) {
		    
			 console.log('getinsbenefits error');
			 resolve(null);
		   }
		   
		   
		   resolve(result);
		    
		   	 
	  })
   });
}

async function getinsbenefitsbyname(insname){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getinsbenefitsbyname,[insname],function (error, result) {
 
		   if (error) {
		    
			 console.log('getinsbenefitsbyname error');
			 resolve(null);
		   }
		   
		   
		   resolve(result);
		    
		   	 
	  })
   });
}


async function getwjxcodedata(){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getwjxcodedata,[],function (error, result) {
 
		   if (error) {
		    
			 console.log('getwjxcodedata error');
			 resolve(null);
		   }
		   
		   
		   wjxcodedatas=result;
		   
		
		   resolve(result);
		    
		   	 
	  })
   });
}

async function getdoctordata(){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getdoctordata,[],function (error, result) {
 
		   if (error) {
		    
			 console.log('getdoctordata error');
			 resolve(null);
		   }
		   
		   
		   resolve(result);
		    
		   	 
	  })
   });
}


async function hassameinstitution(insname){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.hassameinstitution,[insname],function (error, result) {
 
		   if (error) {
		    
			 console.log('hassameinstitution error');
			 resolve(0);
		   }
		   
		   
		   if (result.length>0)
		     resolve(result[0].id);
		   
		   resolve(0);
		   	 
	  })
   });
}

async function updateinsforwjx(id,insname,wjxcode){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.updateinsforwjx,[insname,wjxcode,id],function (error, result) {
 
		   if (error) {
		    
			 console.log('updateinsforwjx error');
			 resolve(false);
		   }
		   
		   
		   if (result.affectedRows==1)
		     resolve(true);
		   
		   resolve(false);
		   	 
	  })
   });
}

async function insertinsforwjx(insname,wjxcode,ordertype){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.insertinsforwjx,[insname,wjxcode,ordertype],function (error, result) {
 
		   if (error) {
		    
			 console.log('insertinsforwjx error');
			 resolve(false);
		   }
		   
		   
		   if (result.affectedRows==1)
		     resolve(true);
		   
		   resolve(false);
		   	 
	  })
   });
}

async function updateproject(benefitval,id){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.updateproject,[benefitval,id],function (error, result) {
 
		   if (error) {
		    
			 console.log('updateproject error');
			 resolve(false);
		   }
		   
		   
		   if (result.affectedRows==1)
		     resolve(true);
		   
		   resolve(false);
		   	 
	  })
   });
}

async function insertproject(projectid,insname,benefitval){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.insertproject,[projectid,benefitval,insname],function (error, result) {
 
		   if (error) {
		    
			 console.log('insertproject error');
			 resolve(false);
		   }
		   
		   
		   if (result.affectedRows==1)
		     resolve(true);
		   
		   resolve(false);
		   	 
	  })
   });
}

async function queryproject(projectid,insname){

	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.queryproject,[projectid,insname],function (error, result) {
 
		   if (error) {
		    
			 console.log('queryproject error');
			 resolve(-1);
		   }
		   
		   
		   if (result.length>0)
		     resolve(result[0].id);
		   
		   resolve(-1);
		   	 
	  })
   });
}

async function getmaxordertype(){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.getmaxordertype,[],function (error, result) {
 
		   if (error) {
		    
			 console.log('getmaxordertype error');
			 resolve(-1);
		   }
		   
		   
		   if (result.length>0)
		     resolve(result[0].maxordertype+1);
		   
		   resolve(-1);
		   	 
	  })
   });
}

async function clearprojecttable(){
	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.clearprojecttable,[],function (error, result) {
 
		   if (error) {
		    
			 console.log('clearprojecttable error');
			 resolve(false);
		   }
		   
		   
		   
		   resolve(true);
		   	 
	  })
   });
}

async function cleardoctortable(){

	return new  Promise((resolve, reject)=>{
		pool.query(userSqlMap.cleardoctortable,[],function (error, result) {
 
		   if (error) {
		    
			 console.log('cleardoctortable error');
			 resolve(false);
		   }
		   
		   
		   resolve(true);
		   	 
	  })
   });
}


module.exports = {
	async login(param,callback){
		var ret=await getuserlogininfo(param);
		
		callback(ret);
		return ;
	},

	async getinslist(param,callback){
		var ret=await getinslistinfo();
		
		callback(ret);
		return ;
	},

	async adduser(param,callback){
	   var ret=await hassameuser(param.username);
	   if (ret==1){
		  callback("same user");
	      return;
	   }
	   if (param.instype==null)
	     param.instype=1; //default: 培声
	   await adduser(param);
	   callback('ok');
	   return ; 	  
	},

	async applycontractforbethel(param,callback){
		if (param.saleid==null){ //for saleman id
			var ret= await getsalesmaninfo(param.salesman);
			if (ret.status==1){
				ret.message='104';
				callback(ret); //no such saleman
				return ;
			}else if (ret.status==2){
				ret.message='105';
				callback(ret); //exist some salemans with same name
				return ;
			}

			param.saleid=ret.id;
		}
		
		var id=param.id; //record id
		//console.log('id:',param.id);
		param.real_name=await getusername(param.userid);
		param.sale_name=await getusername(param.saleid);
			
		if (id==null){ //add new record
			var  insid=await getinstitution(param); //record id 
			param.insid=insid;
			var contractid=await addcontract(param);
			await addcontractdetail(param,contractid);
		}else{ //update record
			var  insid=await getinstitution(param); //record id
			param.insid=insid;
			await updatecontract(param);
			var contractid=id;
			await updatecontractdetail(param,contractid);
		}
		
		callback('ok');
		return ;
	},

	//for 经销商
	async applycontractforsalesman(param,callback){
		var ret=await checkcontract(param);//check 6个月内有冲突的合同
		if (ret==1){
		   callback("103");//exist conflicted contract
		   return;
		}

		ret=await checkusedcontract(param); //check 已经生效的合同
		if (ret==1){
			callback("103");//exist conflicted contract
			return;
		 }
	
		param.institutionid=0; //for saleman,institutionid=0
		var retid= param.id //record id //await existowncontract(param);
		if (retid>0){
			var insid=await getinstitution(param); //institution record id
			param.insid=insid;
			param.retid=retid;
			var name=await getusername(param.userid);
			param.real_name=name; //对于经销商，登录用户名和经销商名称相同
			param.sale_name=name;
			
			await updatecontract(param);
			var contractid=retid;
			await updatecontractdetail(param,contractid);
		}
		else  {
		    var  insid=await getinstitution(param);
			param.insid=insid;
			var name=await getusername(param.userid);
			param.real_name=name; //对于经销商，登录用户名和经销商名称相同
			param.sale_name=name;
			var contractid=await addcontract(param);
			
			//console.log('inserted contract id',contractid);
			await addcontractdetail(param,contractid);
		}
		callback('ok');
		return ; 	  
	},


    applycontract(param,callback){
		if (param.role=='3')
		  return this.applycontractforsalesman(param,callback);
		else
		  return  this.applycontractforbethel(param,callback);
		
	 },

	
	 async getsaleslist(callback){
		var ret=await getsaleslist();
		callback(ret);
		return ;
	 },

	 async getcontractlist(paraminfo,callback){
		var ret;
		if (paraminfo.userid!=null){
		   ret=await getcontractlist(paraminfo.userid);
		   for (var i=0;i<ret.length;i++){  
		     ret[i].toolstable=await gettoolstable(ret[i].id);
		   }
		}
		else{
		   ret=await getcontractlistformanager();
		   for (var i=0;i<ret.length;i++){  
		     ret[i].toolstable=await gettoolstable(ret[i].id);
		   }
		}
		callback(ret);
		return ;
	 },

	 async delcontract(paraminfo,callback){
		 await delcontract(paraminfo.id);
		 await delcontractdetail(paraminfo.id);
		 callback(true);
		 return ;
	 },

	 async getoolstable(paraminfo,callback){
		 var ret=await gettoolstable(paraminfo.id);
		 for (var i=0;i<ret.length;i++){
			ret[i].key=ret[i].toolindex;
		  }
		 callback(ret);
		 return ;
	 },

	 async managecontract(paraminfo,callback){
		await managecontract(paraminfo);
		callback(true);
		return ;
	},

	async getconsumption(paraminfo,callback){
		var retobj=await getconsumption(paraminfo);
		callback(retobj);
		return ;
	},

	async uploadsaledata(salesdataarr,callback){
	  var errmsgs=[];
	  for (var index=0;index<salesdataarr.length;index++){
		  var retmsg=await insertsaledatabyrow(salesdataarr[index],index+1);
		  //if (retmsg!='ok')
		  errmsgs[index]=retmsg;
	  }
	  callback(true);
	},

	async uploadprojectdata(projectdataarr,callback){
	  await clearprojecttable();
	  var errmsgs=[];
	  for (var index=0;index<projectdataarr.length;index++){
		  await insertprojectdatabyrow(projectdataarr[index]);
		  //if (retmsg!='ok')
		  //errmsgs[index]=retmsg;
	  }
	  callback(true);

	},

	async uploaddoctordata(doctordataarr,callback){
		await cleardoctortable();
		var errmsgs=[];
		for (var index=0;index<doctordataarr.length;index++){
			await insertdoctordatabyrow(doctordataarr[index]);
			//if (retmsg!='ok')
			//errmsgs[index]=retmsg;
		}
		callback(true);
  
	},
  
	async getorder(paraminfo,callback){
		var retobj;
		//var orders;
		if (paraminfo.role==4){ //机构
		  retobj=new Object();
		  retobj.orders=await getorderforinstitution(paraminfo);
		  retobj.checkednum=await getcheckesumforinstitution(paraminfo.instype);
		  retobj.uncheckednum=await getuncheckesumforinstitution(paraminfo.instype);
		  
		}
		else if (paraminfo.role==5) //客服
		  retobj=await getorderforservice(paraminfo);
		else if (paraminfo.role==6) //财务
		  retobj=await getorderforfinance(paraminfo);
		else if (paraminfo.role==1) //管理员 
		  retobj=await getorderformanager(paraminfo);
		callback(retobj);
		return ;
	},

	async applycustomer(paraminfo,callback){
		if (paraminfo.id==null){
		   var newid=await insertnewcustomer(paraminfo); //new customer record id
		   if (newid>=0){
			   var answers={q2:paraminfo.parentname,q3:paraminfo.mobile};

			   paraminfo.wjxlink=wjxhandle.generateUserUrl(WJX_VID,'customerid='+newid,answers);
			   await insertneworder(paraminfo,newid);
		   }
		}
		//else
		//   await updatecustomer(paraminfo);
		callback(true);   
		return ;
	},


	async updateorder(paraminfo,callback){
	   if (paraminfo.orderdate=='未填')
		  paraminfo.orderdate=null;
	   var ret;	  
	   if (paraminfo.role==5){ //客服  
		  //if (paraminfo.insbenefit==null)
		  //   paraminfo.insbenefit=0;
		  ret =await updateorderforservice(paraminfo);
		  
		  if (paraminfo.orderstatus==8){ //结束(续约),生成新订单
		
			paraminfo.orderstatus=1; //新预约
			await insertneworder(paraminfo,paraminfo.customerid);
		  }

	   }else if (paraminfo.role==6) { //财务
		  ret =await updateorderforfinance(paraminfo);
	   }else if (paraminfo.role==1) { //manager
		ret =await updateorderformanager(paraminfo);
	   }
	   callback(ret);   
	   return ;
	},

	async reneworder(paraminfo,callback){
		paraminfo.orderstatus=1; //新预约
		var ret= await insertneworder(paraminfo,paraminfo.customerid);
		callback(ret);   
		return ;
	},

	async updatecustomerinfo(paraminfo,callback){
		var ret= await updatecustomerinfo(paraminfo);
		callback(ret);   
		return ;
	},

	async updatepushedcustomer(paraminfo,callback){
		var ret= await updatepushedcustomer(paraminfo);
		if (ret){
			//需要保留链接
			//paraminfo.wjxlink=null;
			paraminfo.orderstatus=2; //预约反馈
			ret=await updatepushedorder(paraminfo,paraminfo.customerid);
			callback(ret);
		}
		return ;
	},

	async insertpushedcustomer(paraminfo,callback){
		var newid=await insertpushednewcustomer(paraminfo); //new customer record id
		if (newid>=0){
			//需要保留链接
			//paraminfo.wjxlink=null;
			paraminfo.orderstatus=2; //预约反馈
			await insertpushedneworder(paraminfo,newid);
		}

		callback(true);
		return ;

	},

	async getpriceitem(paraminfo,callback){
		var retobj= await getpriceitem();
		callback(retobj);
		return ;
	},

	async getinsbenefits(callback){
		var retobj= await getinsbenefits();
		callback(retobj);
		return ;
	},

	async getinsbenefitsbyname(insname,callback){
		var retobj= await getinsbenefitsbyname(insname);
		callback(retobj);
		return ;
	},

	//called from app (global data)
	async getwjxcodedata(callback){
		await getwjxcodedata();
		callback();
	},

	async getwjxcode(callback){
	   var retobj=await getwjxcodedata();
	   callback(retobj);
	   return ;	
	},

	async getdoctor(callback){
		var retobj=await getdoctordata();
		callback(retobj);
		return ;	
	 },
 

	getwjxcodeinfo(wjxcode){
	  if (wjxcodedatas==null)
		return {ordertype:1,format:null}; //培声 
	  var size=	wjxcodedatas.length;
	  for (var i=0;i<size;i++){
		var codestr=wjxcodedatas[i].wjxcode;
		if (codestr.indexOf(',')<0){
			if (codestr==wjxcode)
			  return {ordertype:wjxcodedatas[i].ordertype,format:wjxcodedatas[i].format};
		}else{
			var codelist=codestr.split(",");
			console.log('codelist:',codelist);
			console.log('wjxcode:',wjxcode);
			
			for (var j=0;j<codelist.length;j++){
				console.log('code:',parseInt(codelist[j]));
			
				if (parseInt(codelist[j])==wjxcode){
				   var formats=wjxcodedatas[i].format;
				   formats=JSON.parse(formats);
				   for (var k=0;k<formats.length;k++){
					 if (formats[k].wjxcode==wjxcode) 
					    return {ordertype:wjxcodedatas[i].ordertype,format:formats[k]};
				   }
				}
			}
		}
	  }	

	  return {ordertype:1,format:null};
		
	},


	async getinstype(callback){
        //var retobj= await getinstype();
		callback(wjxcodedatas);
		return ;
	},

	async getanswerbyjid(paraminfo,callback){
		var retobj=await wjxhandle.getAnswer(paraminfo.vid,paraminfo.jid);
		//console.log(retobj);
		callback(retobj);
	},

	async getwjxanswerbyvid(vid,starttime,endtime,ordertype){
		var retobj=await wjxhandle.getAnswer(vid,null,1,50,0,null,starttime,endtime);
		//callback(retobj);
		var answers=retobj.answers;
		//console.log('wjx userdata',answers.length);
		
		//console.log(answers);
		//console.log(answers[0].answer_items);
		var  index=0;
		for(var item in retobj.answers){
			answers=retobj.answers;
			//console.log(item);
			if (answers[item]==null)
			  continue;
			
		  	var paraminfo=new Object();
			paraminfo.jid=answers[item].jid;
			if (vid!='49337294') 
    			paraminfo.parentname=answers[item].answer_items['20000'].answer_text;
			else
			    paraminfo.parentname=answers[item].answer_items['30000'].answer_text;
	
			paraminfo.index=answers[item].index;
			console.log(answers[item].index+':'+paraminfo.parentname);
			
			if (paraminfo.parentname=='王红梅'){
				console.log('find ');
			}

			if (vid!='49337294'){ 
				paraminfo.mobile=answers[item].answer_items['30000'].answer_text;
				paraminfo.birthdate=answers[item].answer_items['80000'].answer_text;
				paraminfo.complains=answers[item].answer_items['110000'].answer_text;
			}else{
				paraminfo.mobile=answers[item].answer_items['40000'].answer_text;
				paraminfo.birthdate=answers[item].answer_items['90000'].answer_text;
				paraminfo.complains=answers[item].answer_items['120000'].answer_text;
			}

			paraminfo.userid=0;
			paraminfo.ordertype=ordertype; //培声
			
			if (answers[item].answer_items['10000'].answer_text.includes('在线'))
			  paraminfo.online=1; //线上
			else
			  paraminfo.online=2;//线下
			
			var exists=await querycustomername(paraminfo.parentname); 
			if (exists)//信息已经在表里
			  continue;

			newid=await insertnewcustomer(paraminfo);
			if (newid>=0){
				var answers={q2:paraminfo.parentname,q3:paraminfo.mobile};

				paraminfo.wjxlink=null;//wjxhandle.generateUserUrl(vid,'customerid='+newid,answers);
				paraminfo.ordertype=ordertype; //培声
				await insertneworder(paraminfo,newid);
			}
		}

		console.log('get wjx answers end');
	},

	async setinsbenefit(paraminfo,callback){
		var id=await hassameinstitution(paraminfo.insname);
		
		if (id>0)
		   await updateinsforwjx(id,paraminfo.insname,paraminfo.wjxcode);
		else { 
		  var ordertype=await getmaxordertype();	
		  await insertinsforwjx(paraminfo.insname,paraminfo.wjxcode,ordertype);
		}

		paraminfo.benefits=new Array();
		paraminfo.benefits[0]=paraminfo.dreamits;
		paraminfo.benefits[1]=paraminfo.dreamit;
		paraminfo.benefits[2]=paraminfo.dreams;
		paraminfo.benefits[3]=paraminfo.dreamc;
		paraminfo.benefits[4]=paraminfo.query;
		paraminfo.benefits[5]=paraminfo.training;
		paraminfo.benefits[6]=paraminfo.education;
		
		for (var i=0;i<paraminfo.benefits.length;i++){
		  var retid=await queryproject(i+1,paraminfo.insname);
		  if (retid>0)
		    await updateproject(paraminfo.benefits[i],retid);
		  else
		    await insertproject(i+1,paraminfo.insname,paraminfo.benefits[i]);  
		}
		callback(true);  
	},

	async getuserinfoforinstituion(paraminfo,callback){
		var retobj=await getuserinfoforinstituion(paraminfo);
		callback(retobj);
		return ;
	},

	async setreporturl(customerid,url,callback){
		var retobj=await setreporturl(customerid,url);
		callback(retobj);
		return ;
	},

	async gettreatmentdata(paraminfo,callback){
		var retobj=await gettreatmentdata(paraminfo);
		callback(retobj);
		return ;
	},

	async getcoursedetaildata(paraminfo,callback){
		var retobj=await getcoursedetaildata(paraminfo);
		callback(retobj);
		return ;
	},

	async delorderdata(id,callback){
		var retobj=await delorderdata(id);
		callback(retobj);
		return ;
	},

	async pwdsetting(paraminfo,callback){
	   var ret=await verifyoldpwd(paraminfo.username,paraminfo.oldpassword);
	   if (ret==false){
		   callback(-1);
		   return ;
	   }
	   retobj=await settingnewpwd(paraminfo.username,paraminfo.newpassword);
	   callback(retobj);
	   return ;
	},

	async getcertificatesbytype(paraminfo,callback){
		var retobj=await getcertificatesbytype(paraminfo.type);
		callback(retobj);
		return ;
	}
};