var OSS = require('ali-oss');
const { options } = require('../app');
let aliossclient=null;

module.exports = {
    ossisexist () {
        if (aliossclient==null){
            aliossclient= new OSS({
            region: 'oss-cn-shanghai',
            accessKeyId: 'LTAI4GHEqDVz9wVa2jwBs4Fg',
            accessKeySecret: 'TKkLoR8zB3kODMO312xHPi3ImMAFHz'
          });
        }


        
    },

    async usebucket (name) {
        try {
          var  result = await aliossclient.getBucketInfo(name)
          console.log('bucketInfo: ', result.bucket);
          aliossclient.useBucket(name);
         // await this.putfile();
        } catch (error) {
          // 指定的存储空间不存在。
          if (error.name === 'NoSuchBucketError') {
            return 0;
          } else {
            console.log(error)
            return 0;
          }
        }
        return 1;
    },

    async putfile (name,filepath,callback) {
        
        try {
          //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
          let result = await aliossclient.put(name, filepath);
          //console.log(result);
          callback(result);
        } catch (e) {
          console.log(e);
          callback(null);
        }
    }

}