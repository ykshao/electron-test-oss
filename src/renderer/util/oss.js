import { MessageBox } from 'element-ui';
import { sleep, local } from '@/util/util';
import remoteObject from '@/util/remoteObject';
// import stream from 'stream';
const OSS = require('ali-oss');
// const remote = require('./remoteObject').default

let client = null;

export default class AliOss {
  constructor(opt) {
    if (opt) {
      this.buildOssFunc(opt);
    }
  }

  buildOssFunc(opt = {}) {
    client = new OSS({
      region: opt.region,
      accessKeyId: opt.accessKeyId,
      accessKeySecret: opt.accessKeySecret,
      bucket: opt.bucket
    });
  }

  async checkoutLogin() {
    let res = {
      code: -1,
      message: '对象信息有误'
    };
    await client
      .get('/')
      .then(result => {
        if (result.res.status == 200) {
          res.code = 0;
          res.message = '成功';
        }
      })
      .catch(e => {
        res.code = -1;
        if (e.code == 'AccessDenied') {
          res.message = '存储类型有误';
        } else if (e.code == 'NoSuchBucket') {
          res.message = 'bucket填写有误';
        } else if (e.code == 'InvalidAccessKeyId') {
          res.message = 'AccessKeyId填写有误';
        } else if (e.code == 'SignatureDoesNotMatch') {
          res.message = 'AccessKeySecret填写有误';
        }
      });
    return res;
  }

  /**
   * 新建文件夹
   * @param {String} dir 文件夹路劲
   */
  async mkDir(dir) {
    let objectName = `${dir}/`;
    try {
      let result = await client.put(objectName, new Buffer.from(''));
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 获取指定前缀的文件列表
   * @param {String} preFix 前缀
   * @param {Number} limit  获取文件列表的数量
   */
  getFileList(prefix, limit) {
    return new Promise((resolve, reject) => {
      var options = {
        limit,
        prefix
      };
      bucketManager.listPrefix(null, options, function(
        err,
        respBody,
        respInfo
      ) {
        if (err) {
          reject(err);
        }
        resolve(respInfo);
      });
    });
  }
  /**
   * 判断oss上是否存在改文件
   * @param {String} object 要判断的额文件名
   */
  async hasObject(object) {
    let has = false;
    await client
      .get(object)
      .then(result => {
        if (result.res.status == 200) {
          has = true;
        }
      })
      .catch(e => {
        if (e.code == 'NoSuchKey') {
          has = false;
        }
      });
    return has;
  }

  /**
   * 阿里云分片上传
   * @param {String} [key] 上传后的文件名
   * @param {String} localFile 本地文件路径
   */
  async multipartUpload(objectFile, localFile, progress) {
    let result = null;
    try {
      result = client.multipartUpload(objectFile, localFile, {
        progress
      });
    } catch (e) {
      // 捕获超时异常
      if (e.code === 'ConnectionTimeoutError') {
        console.log('Woops,超时啦!');
      }
    }
    return result;
  }

  /**
   * 本地上传
   * @param {String} objectFile 上传后的文件名
   * @param {String} localFile 本地文件路径
   */
  async Put(objectFile, localFile) {
    let result = null;
    try {
      result = await client.put(objectFile, localFile);
    } catch (e) {
      result = null;
    }
    return result;
  }

  /**
   * 阿里云上传文件
   * @param {String} objectFile 上传后的文件名
   * @param {String} localFile 本地文件路径
   */
  async uploadFile(objectFile, localFile, progress = () => {}) {
    let hasFile = await this.hasObject(objectFile);
    let result = null;
    if (hasFile) {
      await remoteObject
        .showConfirm('oss上已存在文件:' + objectFile + '，是否覆盖?')
        .then(async () => {
          result = await this.Put(objectFile, localFile);
        })
        .catch(() => {
          result = { message: '取消上传' };
        });
    } else {
      result = await this.Put(objectFile, localFile);
    }
    return result;
  }

  /**
   *
   * 多文件上传
   * @param {Object} opt 上传参数
   * opt.objectFiles {Array} objectFiles oss文件名
   * opt.localFiles {Array} localFiles  本地文件名
   * optr.finishOne {Function} finishOne  上传完成一个文件的回调
   * optr.startUploadOne {Function} finishOne  开始上传一个文件的回调
   * opt.progress {Function} progress  当前上传文件的进度
   */

  uploadFiles(opt) {
    let {
      objectFiles = [],
      localFiles = [],
      finishOne = () => {},
      startUploadOne = () => {}
    } = opt;
    return new Promise((resolve, reject) => {
      let i = 0;
      let result = [];
      let checkedAll = false;
      const uploadOne = async () => {
        let hasFile = await this.hasObject(objectFiles[i]);
        startUploadOne(objectFiles[i]);
        if (hasFile && !checkedAll) {
          await remoteObject
            .showConfirm(
              'oss上已存在文件:' + objectFiles[i] + '，是否覆盖?',
              '后续都执行覆盖'
            )
            .then(async checked => {
              checkedAll = checked;
              let data = await this.Put(objectFiles[i], localFiles[i]);
              if (data) {
                result.push(data);
              }
            })
            .catch(() => {
              result.push({ message: '取消上传' });
            });
        } else {
          let data = await this.Put(objectFiles[i], localFiles[i]);
          if (data) {
            result.push(data);
          }
        }
        finishOne({ objectFiles: objectFiles[i], localFiles: localFiles[i] });
        i++;
        if (i < localFiles.length) {
          uploadOne();
        } else {
          resolve(result);
        }
      };
      uploadOne();
    });
  }

  /**
   *
   * @param { Array } paths 上传文件路径
   * @param { Object } opt 参数项
   * opt.finishOne 上传进度回调
   * opt.uploadEnd 上传完成回调
   */
  async uploadCommon(paths, opt = {}) {
    if (paths.length <= 0) {
      remoteObject.showNotification('上传失败', '不能上传文件夹');
      return;
    }
    let progress = 0;
    let { flod } = local('OssConfig');
    if (opt.flod) {
      flod = opt.flod;
    }
    // if (!opt.flod && (!local("OssConfig").flod)) {
    //     let ret = false
    //     await remoteObject.showConfirm('未设置默认上传路径，将上传到根目录，是否继续？').then(() => {
    //         ret = true
    //     }).catch(() => {
    //         opt.uploadEnd && opt.uploadEnd()
    //     })
    //     if (!ret) return
    // }
    this.currentFile = paths[0];
    let uploadRes = null;
    if (paths.length > 1) {
      let objectPaths = paths;
      if (flod) {
        objectPaths = paths.map(item => {
          return flod + item.pathname();
        });
      }
      uploadRes = await this.uploadFiles({
        objectFiles: objectPaths,
        localFiles: paths,
        finishOne(e) {
          progress += 100 / paths.length;
          opt.finishOne && opt.finishOne(progress);
        }
      });
    } else {
      let objectPath = this.currentFile;
      if (flod) {
        objectPath = flod + this.currentFile.pathname();
      }
      let inter = setInterval(() => {
        progress += 5;
        opt.finishOne && opt.finishOne(progress);
      }, 100);
      uploadRes = await this.uploadFile(objectPath, this.currentFile);
      clearInterval(inter);
      opt.finishOne && opt.finishOne(100);
    }
    await sleep(500);
    opt.uploadEnd && opt.uploadEnd();
    if (
      uploadRes &&
      Object.prototype.toString.call(uploadRes) == '[object Object]'
    ) {
      remoteObject.showNotification('上传成功', 'upload success');
    } else if (
      Object.prototype.toString.call(uploadRes) == '[object Array]' &&
      uploadRes.length > 0
    ) {
      remoteObject.showNotification('上传成功', 'upload success');
    } else {
      remoteObject.showNotification('上传失败', 'upload failed');
    }
  }

  /**
   * 获取bucket下制定目录下的文件
   * @param {String} dir 文件目录
   */
  async getDirList(dir = '') {
    console.log(dir);
    let result = null;
    try {
      result = await asyncRes({
        prefix: dir,
        delimiter: '/'
      });
    } catch (e) {}
    //递归同步当前目录cdn数据
    async function asyncRes(
      opts,
      _result = {
        objects: [],
        prefixes: []
      }
    ) {
      var result1 = await client.list(opts);
      if (result1.objects) {
        _result.objects = _result.objects.concat(
          result1.objects.filter(o => o)
        );
      }
      if (result1.prefixes) {
        _result.prefixes = _result.prefixes.concat(
          result1.prefixes.filter(o => o)
        );
      }
      if (result1.isTruncated) {
        await asyncRes(
          {
            ...opts,
            marker: result1.nextMarker
          },
          _result
        );
      }

      return _result;
    }
    return result;
  }

  /**
   * 删除一个文件或者文件夹
   * @param {String} objectPath
   */
  async delFile(objectPath) {
    return new Promise(async resolve => {
      let result = null;

      //递归删除文件夹中的内容
      const del = async list => {
        if (list.objects) {
          let delObjList = list.objects.map(item => {
            return item.name;
          });
          await client.deleteMulti(delObjList);
        }
        if (list.prefixes) {
          await list.prefixes.forEach(async item => {
            let clist = await this.getDirList(item);
            del(clist);
          });
        }
      };

      //轮询列表，文件夹是否删除完毕
      const loopQuery = async objectPath => {
        await sleep(100);
        let list = await this.getDirList(objectPath);
        if (!list.prefixes && !list.objects) {
          resolve({ code: 1, message: '文件夹删除成功' });
        } else {
          loopQuery(objectPath);
        }
      };

      await MessageBox.confirm('删除后无法恢复！确定删除该文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          if (objectPath.fileType()) {
            result = await client.delete(objectPath);
            resolve(result);
          } else {
            let list = await this.getDirList(objectPath);
            del(list);
            // loopQuery(objectPath);
            resolve({ code: 1, message: '文件夹删除成功' });
          }
        })
        .catch(() => {
          resolve({ code: -1, message: '取消删除' });
        });
    });
  }
}
