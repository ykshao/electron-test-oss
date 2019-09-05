const exec = require('child_process').exec

const input = process.cwd() + "/dist/electron.zip";
const output = process.cwd() + "/dist/aaa/";
exec(`unzip -n ${input} -d ${output}`,(err,stdo,stde)=>{
    console.log('err:'+err)
    console.log('stdo:'+stdo)
    console.log('stde:'+stde)
})