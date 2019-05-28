const fs = require('fs')
const  readdirp = require('readdirp')



async function getFileArr(){
    const distpath = process.cwd()+'/dist/electron'
    const packageJson = JSON.parse(fs.readFileSync(process.cwd()+'/package.json'))
    let files = await readdirp.promise(distpath)
    const updateInfo = {}
    fileArr = files.map(file=>{
        return path = 'dist/electron/'+file.path
    })
    updateInfo.fileList = fileArr
    packageJson.updateInfo = updateInfo

    fs.writeFileSync(process.cwd()+'/package.json',JSON.stringify(packageJson,null,'\t'))
}

getFileArr()







