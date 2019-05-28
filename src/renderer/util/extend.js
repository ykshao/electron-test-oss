//数字转百分比
Number.prototype.toPercent = function () {
    return (Math.round(this * 10000) / 100).toFixed(2) + '%';
}

//获取路劲最后一层
String.prototype.pathname = function () {
    let arr = this.replace(/\/$/,"").split('/')
    return arr[arr.length-1];
}

//获取文件后缀
String.prototype.fileType = function () {
    let filePath = this
    var startIndex = filePath.lastIndexOf(".");
    if(startIndex != -1)
        return filePath.substring(startIndex+1, filePath.length).toLowerCase();
    else return "";
}

//判断路径文件是不是网页上可展示的图片图片
String.prototype.isimg = function(){
    // let imgExts = ['BMP','PCX','TIFF','GIF','JPEG','TGA','EXIF','FPX','SVG','PSD','CDR','PCD','DXF','UFO','EPS','PNG']
    let imgExts = ['GIF','JPEG','SVG','PNG','JPG']
    let ext = this.fileType()
    for(let i=0; i<imgExts.length; i++){
        if(ext.toLowerCase() == imgExts[i].toLowerCase()){
            return true
        }
    }
    return false
}