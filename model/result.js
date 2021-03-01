exports.createResult = function(flag, data,extradata) {
    var result = {};
    if (flag==false){ //exception,no data
	   //result.message='sql exception';
	   result.success ='fail';
	   result.message=data;
	   result.datas=extradata;
	}
    else{
		result.success = 'ok';
		result.datas = data;
		if (extradata!=null)
		   result.datas2=extradata;
	   
	}
    return result;
};

