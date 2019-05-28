const exec = require('child_process').exec
const fs = require('fs')

const zipfile = `${process.cwd()}/dist/electron.zip`
const dir = `${process.cwd()}/dist/electron`
if(fs.existsSync(zipfile)){
    fs.unlinkSync(zipfile)
}
exec(`zip -q -r ${zipfile} ${dir}`)