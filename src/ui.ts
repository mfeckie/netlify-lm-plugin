import os = require('os')
import path = require('path')
import {shellVariables, joinBinPath} from './install'

const boxen = require('boxen')

export function printBanner(command: any, force: boolean) {
  const print = force || !binInPath()
  const platform = os.platform()

  if (print && platform !== 'win32') {
    const shellInfo = shellVariables()
    const banner = `Run this command to use Netlify Large Media in your current shell:\n\n source ${shellInfo.path}`

    command.log(boxen(banner, {padding: 1}))
    command.log('(\\__/) ||\n(•ㅅ•) ||\n/ 　 づ')
  }
}

function binInPath() {
  const envPath = (process.env.PATH || '')
  const binPath = joinBinPath()
  return envPath.replace(/["]+/g, '').split(path.delimiter).find((part: string) => part === binPath)
}
