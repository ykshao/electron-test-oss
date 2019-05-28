import AliOss from '@/util/oss';
// import { MessageBox } from 'element-ui';
// import axios from 'axios'
import request from 'request';
import { remote } from 'electron';

//localStorage操作
export function local() {
  let arg = arguments;
  if (arg.length == 1) {
    let val = localStorage[arg[0]];
    val = val ? JSON.parse(val) : val;
    return val;
  } else {
    let sVal = arg[1];
    sVal = JSON.stringify(sVal);
    localStorage[arg[0]] = sVal;
  }
}

export function oss() {
  return new AliOss(local('OssConfig'));
}

//判断文件类型
export function getFileType(filePath) {
  var startIndex = filePath.lastIndexOf('.');
  if (startIndex != -1)
    return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
  else return '';
}

export function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

/* v1 为本地版本号，v2 为线上版本号 */
export function compareVersion(v1, v2) {
  const vs1 = v1.toString().split('.'),
    vs2 = v2.toString().split('.');
  if (vs1.length !== vs2.length) {
    // 版本格式不一致
    return true;
  }
  for (let i = 0; i < vs1.length; ++i) {
    let diff = parseInt(vs2[i], 10) - parseInt(vs1[i], 10);
    if (diff < 0) {
      // vs1 其中一个版本号段小于 vs2
      return false;
    }
    if (diff > 0) {
      // vs2 其中一个版本号段大于 vs1
      return i + 1;
    }
  }
  // 版本一致
  return false;
}
/**
 * github上获取文件
 */

export function getRawFile(path) {
  return new Promise((resolve, reject) => {
    const url = `https://raw.githubusercontent.com/hellosanbao/electron-yit-oss/master/${path}?r=${Math.random()}`;
    // return axios.get(url)
    return request({ url, encoding: null }, (err, req, body) => {
      if (err) {
        reject(err.message);
      }
      resolve(body);
    });
  });
}

/**
 * 获取本地版本号
 *  */

export function getLocalVersion() {
  let version = local('appVersion') || remote.app.getVersion();
  if (local('appVersion')) {
    //如果本地local的版本小于app版本，则返回App版本
    if (compareVersion(local('appVersion'), remote.app.getVersion())) {
      version = remote.app.getVersion();
    }
  }

  return version;
}
