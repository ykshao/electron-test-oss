import axios from 'axios'
import fs from 'fs'
const localPackages = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf-8'))
export async function getfileDate(filepath) {
    let url = `https://raw.githubusercontent.com/hellosanbao/electron-yit-oss/master/${filepath}?r=${Math.random()}`
    return axios.get(url)
}

export function update() {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await getfileDate('package.json')
            resolve(res.data.version !== localPackages.version)
        } catch (error) {
            reject(error.message)
        }

    })
}

