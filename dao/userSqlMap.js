var userSqlMap = {
    login:"select username,password,roomno from user where username=? and password=?",
    getinslist:"select * from institution order by id",
    getuser:"select * from user where name=?",
    adduser:"insert into user(name,password,real_name,telno,role,instype) values(?,?,?,?,?,?)",
    checkcontract:"select * from contract where datediff(?,createdate)<180 and userid!=? and deleted=0 and checked=1 and insid in  (select id from institution where name=?  and address=? and attribute=?)",
    checkusedcontract:"select * from contract where userid!=? and deleted=0 and checked=1 and used=1 and insid in  (select id from institution where name=?  and address=? and attribute=?)",
    existowncontract:"select * from contract where  deleted=0 and checked=0 and insid in  (select id from institution where name=?  and address=? and attribute=? and userid=?)",
    addcontract:"insert into contract(insid,userid,createdate,deleted,checked,filename,saleid,real_name,sale_name) values(?,?,?,0,0,?,?,?,?)",
    getsaleslist:"select real_name as name,id from user where role=3",
    addinstitution:"insert into institution(name,address,attribute,userid,institutionid) values(?,?,?,?,?)",
    getinstitution:"select id from institution where name=? and address=? and attribute=? and institutionid=?",
    getinstitutionid:"select id from institution where name=? and address=? and attribute=? and userid=?",
    updatecontract:"update contract set insid=?,userid=?, deleted=0, checked=0,createdate=?,filename=?,saleid=?,real_name=?,sale_name=?,applydate=NOW() where id=?",
    getcontractlist:"select ins.institutionid as institutionid,case c.checked when 0 THEN '未审' when 1 THEN '通过' when 2 then '拒绝' else '' end as checked,c.applydate as applydate,c.id as id ,ins.name as insname,ins.address as address, (case when ins.attribute='1' THEN '公立' when ins.attribute='2' THEN '私立'  when ins.attribute='3' THEN '教育' when ins.attribute='4' THEN '保险' else '其它' end ) as attribute,c.filename as contract,c.deleted,c.used,u.real_name as salesman,u.id as salesmanid,c.userid as userid,c.createdate as createdate from institution ins,contract c,user u where c.insid=ins.id and u.id=c.saleid and c.userid=? order by c.applydate desc",
    getcontractlistformanager:"select ins.institutionid as institutionid,c.applydate as applydate,c.id as id ,c.real_name as real_name,c.sale_name as sale_name,ins.name as insname,ins.address as address, (case when ins.attribute='1' THEN '公立' when ins.attribute='2' THEN '私立'  when ins.attribute='3' THEN '教育' when ins.attribute='4' THEN '保险' else '其它' end ) as attribute,c.filename as contract,c.checked,c.deleted,c.used,u.id as salesmanid,c.userid as userid,c.createdate as createdate from institution ins,contract c,user u where c.insid=ins.id and u.id=c.saleid and c.checked=0 order by c.applydate desc",
    addcontractdetail:"insert into contract_detail(contractid,tool,devicenum,credit_price,stoptime,reportnum,single_price,total_price) values(?,?,?,?,?,?,?,?)",
    updatecontractdetail:"update contract_detail set devicenum=?,credit_price=?,stoptime=?,reportnum=?,single_price=?,total_price=? where contractid=? and tool=?",
    getsalemanbyname:"select id,real_name,telno from user where real_name=? and role=3 ",
    delcontract:"delete from contract where id=?",
    delcontractdetail:"delete from contract_detail where contractid=?",
    gettoolstable:"select tool as toolindex,case tool when 1 then 'Dream ITS' when 2 then 'Dream IT' when 3 then 'Dream S' when 4 then 'Dream C' else ' ' end as tool, devicenum as device,credit_price as creditfee,DATE_FORMAT(stoptime,'%Y-%m-%d') as stoptime,reportnum as report,single_price as singleprice,total_price as totalprice from contract_detail where contractid=? order by toolindex asc",
    getusername:"select real_name from user where id=?",
    managecontract:"update contract set checkerid=?,checked=?,checkdate=? where id=?",
    gettoolforweekconsumption:"select sum(usedamount) as usedamount,sum(purchaseamount) as purchaseamount FROM consumption where hospitalid=? and userid=? and toolid=? and TO_DAYS(NOW())-TO_DAYS(createdate)>=? and TO_DAYS(NOW())-TO_DAYS(createdate)<?",
    gettooltotalconsumption:"select sum(usedamount) as usedamount,sum(purchaseamount) as purchaseamount FROM consumption where hospitalid=? and userid=? and toolid=?",
    gettoolinfo:"select DATE_FORMAT(stoptime,'%Y-%m-%d') as stoptime from contract_detail where contractid=? and tool=? ",
    getuserid:"select id from user where real_name=?",
    gethospitalid:"select id from institution where institutionid=?",
    hassamesalerecord:"select * from consumption where userid=? and hospitalid=? and toolid=? and DATE_FORMAT(createdate,'%Y/%m/%d')=?",
    updatesalerecord:"update consumption set usedamount=?, purchaseamount=?,applydate=NOW() where userid=? and hospitalid=? and toolid=? and DATE_FORMAT(createdate,'%Y/%m/%d')=?",
    insertnewsalerecord:"insert into consumption(userid,hospitalid,toolid,createdate,usedamount,purchaseamount) values(?,?,?,?,?,?)",
    getorderforservice:"select ut.* from (select o.id , o.joinid,case when o.clinicrecord is null then '未填' else o.clinicrecord end as clinicrecord ,o.payment,o.customerid, o.wjxlink, o.courseteacher ,o.online,c.report_url,c.relation ,case when c.childname is null then '未填' else c.childname end as childname,c.sex,case when c.complains is null then '未填' else c.complains end as complains ,c.parentname,c.mobile,DATE_FORMAT(c.birthdate,'%Y-%m-%d') as birthdate,o.course, o.coursetime,o.ordertype,o.fare,o.createdate,case when o.comments is null then '未填' else o.comments end as comments ,o.checkstatus,case when o.orderdate is null then '未填' else DATE_FORMAT(o.orderdate,'%Y-%m-%d %H:%i') end as orderdate,o.orderstatus,o.insbenefit,u.real_name from orders o ,customer c,user u where o.customerid=c.id and o.updateid=u.id and o.updateid=? and o.createdate>=? and o.createdate<=? and o.delflag=0 " 
                       +" union select o.id ,o.joinid,case when o.clinicrecord is null then '未填' else o.clinicrecord end as clinicrecord ,o.payment, o.customerid, o.wjxlink, o.courseteacher ,o.online,c.report_url,c.relation,case when c.childname is null then '未填' else c.childname end as childname,c.sex,case when c.complains is null then '未填' else c.complains end as complains,c.parentname,c.mobile,DATE_FORMAT(c.birthdate,'%Y-%m-%d') as birthdate,o.course, o.coursetime,o.ordertype,o.fare,o.createdate,case when o.comments is null then '未填' else o.comments end as comments ,o.checkstatus,case when o.orderdate is null then '未填' else DATE_FORMAT(o.orderdate,'%Y-%m-%d %H:%i') end as orderdate,o.orderstatus,o.insbenefit,'系统' from orders o ,customer c where o.customerid=c.id and o.updateid=0 and o.delflag=0 and o.createdate>=? and o.createdate<=? "
                       +" union select o.id , o.joinid,case when o.clinicrecord is null then '未填' else o.clinicrecord end as clinicrecord ,o.payment,o.customerid, o.wjxlink, o.courseteacher ,o.online,c.report_url,c.relation,case when c.childname is null then '未填' else c.childname end as childname,c.sex,case when c.complains is null then '未填' else c.complains end as complains,c.parentname,c.mobile,DATE_FORMAT(c.birthdate,'%Y-%m-%d') as birthdate,o.course, o.coursetime,o.ordertype,o.fare,o.createdate,case when o.comments is null then '未填' else o.comments end as comments ,o.checkstatus,case when o.orderdate is null then '未填' else DATE_FORMAT(o.orderdate,'%Y-%m-%d %H:%i') end as orderdate,o.orderstatus,o.insbenefit,'培声管理' from orders o ,customer c, user u where o.customerid=c.id and o.delflag=0 and o.updateid=u.id and u.role=1 and o.createdate>=? and o.createdate<=?) ut order by ut.customerid desc,ut.createdate desc",
   
    getorderformanager:"select ut.*,case when u.real_name is null then '未填' else  u.real_name end as check_name from (select o.id ,o.joinid, o.customerid, o.payment,o.wjxlink, c.report_url,o.clinicrecord,o.courseteacher ,case when c.childname is null then '未填' else c.childname end as childname,c.sex,c.relation,case when c.complains is null then '未填' else c.complains end as complains,c.parentname,c.mobile,DATE_FORMAT(c.birthdate,'%Y-%m-%d') as birthdate,o.course, o.coursetime,o.ordertype,o.fare,o.createdate,case when o.comments is null then '未填' else o.comments end as comments ,o.checkstatus,case when o.orderdate is null then '未填' else DATE_FORMAT(o.orderdate,'%Y-%m-%d %H:%i') end as orderdate,o.orderstatus,o.insbenefit,o.inscheckstatus,u.real_name,o.checkid from orders o ,customer c,user u where o.customerid=c.id and o.delflag=0 and o.updateid=u.id and o.createdate>=? and o.createdate<=? " 
                       +" union select o.id ,o.joinid, o.customerid,o.payment, o.wjxlink, c.report_url,o.clinicrecord,o.courseteacher ,case when c.childname is null then '未填' else c.childname end as childname,c.sex,c.relation,case when c.complains is null then '未填' else c.complains end as complains,c.parentname,c.mobile,DATE_FORMAT(c.birthdate,'%Y-%m-%d') as birthdate,o.course,  o.coursetime,o.ordertype,o.fare,o.createdate,case when o.comments is null then '未填' else o.comments end as comments ,o.checkstatus,case when o.orderdate is null then '未填' else DATE_FORMAT(o.orderdate,'%Y-%m-%d %H:%i') end as orderdate,o.orderstatus,o.insbenefit,o.inscheckstatus,'系统' as real_name,o.checkid from orders o ,customer c where o.customerid=c.id and o.delflag=0 and o.updateid=0 and o.createdate>=? and o.createdate<=?) ut left join user u on ut.checkid=u.id order by ut.customerid desc,ut.createdate desc",
    
    getorderforfinance:"select o.id , o.customerid, o.wjxlink, o.courseteacher ,case when c.complains is null then '未填' else c.complains end as complains,c.parentname,c.mobile,DATE_FORMAT(c.birthdate,'%Y-%m-%d') as birthdate,o.course,o.payment, o.coursetime,o.ordertype,o.fare,o.createdate,o.checkstatus,o.inscheckstatus,case when o.orderdate is null then '未填' else DATE_FORMAT(o.orderdate,'%Y-%m-%d %H:%i') end as orderdate,o.orderstatus,o.insbenefit from orders o ,customer c where o.customerid=c.id and o.delflag=0 and o.fare!=0 and o.createdate>=? and o.createdate<=? order by o.customerid desc,o.createdate desc",
    getorderforinstitution:"select o.id , o.customerid, o.wjxlink, o.courseteacher ,c.complains,c.parentname,c.mobile,DATE_FORMAT(c.birthdate,'%Y-%m-%d') as birthdate,o.course, o.coursetime,o.ordertype,o.fare,o.createdate,o.checkstatus,o.inscheckstatus,case when o.orderdate is null then '未填' else DATE_FORMAT(o.orderdate,'%Y-%m-%d %H:%i') end as orderdate,o.orderstatus,o.insbenefit from orders o ,customer c where o.customerid=c.id and o.delflag=0 and o.ordertype=? order by o.checkdate desc",
    getcheckesumforinstitution:"select sum(insbenefit) as checkedsum from orders where delflag=0 and ordertype=? and inscheckstatus=1 group by ordertype",
    getuncheckesumforinstitution:"select sum(insbenefit) as uncheckedsum from orders where delflag=0 and ordertype=? and inscheckstatus=0 group by ordertype",
   
    insertnewcustomer:"insert into customer(parentname,mobile,birthdate,complains,createuserid,createdate) values(?,?,?,?,?,NOW())",
    insertpushednewcustomer:"insert into customer(parentname,mobile,birthdate,complains,createuserid,createdate) values(?,?,?,?,?,NOW())",
    insertneworder: "insert into orders(customerid,updateid,wjxlink,ordertype,joinid,createdate) values(?,?,?,?,?,NOW())",
    insertpushedneworder:"insert into orders(customerid,updateid,ordertype,orderstatus,joinid,wjxcode,createdate) values(?,?,?,?,?,?,NOW())",
    updateorderforservice:"update orders set checkstatus=?,ordertype=?, wjxlink=?,course=?, courseteacher=?,coursetime=?,fare=?,orderdate=?,comments=?,insbenefit=?,orderstatus=?,online=?,payment=?,clinicrecord=?,updateid=?,updatedate=NOW()  where id=?", 
    updateorderforfinance:"update orders set checkstatus=?,inscheckstatus=?,orderstatus=?, checkid=?,checkdate=NOW() where id=?",
    updateorderformanager:"update orders set course=?, courseteacher=?,coursetime=?,fare=?,checkstatus=?,orderdate=?,orderstatus=?,inscheckstatus=?,insbenefit=?,updateid=?,updatedate=NOW()  where id=?", 
    
    updatepushedorder:"update orders set orderstatus=?,joinid=?,wjxcode=? where customerid=?",
    updatepushedcustomer:" update customer set birthdate=?, complains=? where id=?",
    updatecustomerinfo:" update customer set childname=?,sex=?,relation=?,birthdate=?,complains=? where id=?",
    getpriceitem:"select projectid ,type,baseprice,singleprice from price_item order by projectid asc",
    getinsbenefits:"select insname,projectid,benefit from insbenefits where status=1 order by projectid asc",
    getinsbenefitsbyname:"select projectid,benefit from insbenefits where insname=? and status=1 order by projectid asc",
    getwjxcodedata:" select wjxcode,ordertype,insname,format,payway from wjxcode",
    hassameinstitution:"select id from wjxcode where insname=?",
    updateinsforwjx:"update wjxcode set insname=?,wjxcode=? where id=?",
    insertinsforwjx:"insert into wjxcode(insname,wjxcode,ordertype) values(?,?,?)",
    getmaxordertype:"select max(ordertype) as maxordertype from wjxcode",
    queryproject:"select id from insbenefits where projectid=? and insname=? and status=1",
    updateproject:"update insbenefits set benefit=? where id=?",
    insertproject:"insert into insbenefits(projectid,benefit,status,insname) values(?,?,1,?)",
    clearprojecttable:"delete from price_item",
    cleardoctortable: "delete from doctor",
    insertprojectdata:"insert into price_item(type,projectid,baseprice,singleprice,projectname) values(?,?,?,?,?)",
    insertdoctordata:"insert into doctor(name) values(?)",
    getdoctordata:"select name from doctor order by id ",
    
    getuserinfoforins:"select ut.* ,dt.hasclinic from (select rt2.*, c.sex,c.relation,c.report_url,o3.ordertype,o3.joinid,o3.orderstatus,o3.inscheckstatus,DATEDIFF(Now(),c.birthdate) as childdays,c.parentname,c.childname,c.mobile,c.birthdate,c.complains,o2.id  from (select o.customerid , max(o.id) as id from orders o group by o.customerid) o2, orders o3, (SELECT customerid,sum(fare) as totalfare,sum(insbenefit) as insbenefit, DATE_FORMAT(max(orders.orderdate),'%Y-%m-%d %T') as orderdate FROM orders where ordertype=? and delflag=0  group by customerid) rt2,"
                      +" customer c "
                      +" where rt2.customerid=o2.customerid"
                      +" and o2.id=o3.id"
                      +" and c.id=rt2.customerid"
                      +" order by o2.customerid desc) ut "
                      +" left join (SELECT count(*) as hasclinic,customerid FROM orders where clinicrecord is not null and clinicrecord!='未填' group by customerid ) dt "
                      +" on ut.customerid=dt.customerid",
                     
    
    getuserinfoforinswithpname:"select ut.* ,dt.hasclinic from (select rt2.*, ct.sex,ct.relation,ct.report_url,o3.ordertype,o3.joinid,o3.orderstatus,o3.inscheckstatus,DATEDIFF(Now(),ct.birthdate) as childdays,ct.parentname,ct.childname,ct.mobile,ct.birthdate,ct.complains,o2.id  from (select o.customerid , max(o.id) as id from orders o group by o.customerid) o2, orders o3, (SELECT customerid,sum(fare) as totalfare,sum(insbenefit) as insbenefit,DATE_FORMAT(max(orders.orderdate),'%Y-%m-%d %T') as orderdate FROM orders where ordertype=? and delflag=0  group by customerid) rt2,"
                        +"(select * from customer c where c.parentname like ?) ct "
                        +"where rt2.customerid=o2.customerid "
                        +"and o2.id=o3.id "
                        +"and ct.id=rt2.customerid "
                        +"order by o2.customerid desc) ut "
                        +" left join (SELECT count(*) as hasclinic,customerid FROM orders where clinicrecord is not null and clinicrecord!='未填' group by customerid ) dt "
                        +" on ut.customerid=dt.customerid",
                     
    
    getuserinfoforinswithcname:"select ut.* ,dt.hasclinic from (select rt2.*,ct.sex,ct.relation, ct.report_url,o3.ordertype,o3.joinid,o3.orderstatus,o3.inscheckstatus,DATEDIFF(Now(),ct.birthdate) as childdays,ct.parentname,ct.childname,ct.mobile,ct.birthdate,ct.complains,o2.id  from (select o.customerid , max(o.id) as id from orders o group by o.customerid) o2, orders o3, (SELECT customerid,sum(fare) as totalfare,sum(insbenefit) as insbenefit,DATE_FORMAT(max(orders.orderdate),'%Y-%m-%d %T') as orderdate FROM orders where ordertype=? and delflag=0  group by customerid) rt2,"
                        +"(select * from customer c where c.childname like ?) ct "
                        +"where rt2.customerid=o2.customerid "
                        +"and o2.id=o3.id "
                        +"and ct.id=rt2.customerid "
                        +"order by o2.customerid desc) ut"
                        +" left join (SELECT count(*) as hasclinic,customerid FROM orders where clinicrecord is not null and clinicrecord!='未填' group by customerid ) dt "
                        +" on ut.customerid=dt.customerid",
                     
    
    setreporturl:"update customer set report_url=? where id=?",
    querycustomer:"select * from customer where parentname=?",
    gettreatmentdata:"select DATE_FORMAT(orderdate,'%Y-%m-%d %T') as orderdate,case when clinicrecord is null then '未填' else clinicrecord end as clinicrecord  from orders where customerid=? order by orderdate desc",
    getcoursedetaildata:"select DATE_FORMAT(orderdate,'%Y-%m-%d %T') as orderdate,ordertype,course,insbenefit,coursetime,fare,insbenefit,orderstatus,inscheckstatus from orders where customerid=? and ordertype=? and delflag=0 order by orderdate desc",
    delorderdata:"update orders set delflag=1 where id=?",
    verifyoldpwd:"select * from user where name=? and password=?",
    settingnewpwd:"update user set password=? where name=?",
    getcertificatesbytype:"select * from certificate where type=?",
};


module.exports = userSqlMap;