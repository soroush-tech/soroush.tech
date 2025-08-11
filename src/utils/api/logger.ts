import fs from 'fs'
const logFile = './build-log.txt'

export function log(...msg: unknown[]) {
  fs.appendFileSync(
    logFile,
    `[${new Date().toISOString()}] ${msg.map((i) => JSON.stringify(i)).join(' \n')}\n`
  )
}
