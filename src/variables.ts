import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { z } from 'z'
import packageJson from '../package.json'

// TODO read config not only from file

export const WORK_PATH = path.join(
  os.homedir(),
  'AppData',
  'Roaming',
  packageJson.name
)

export const CONFIG_PATH = path.join(WORK_PATH, 'config.json')

export const CONFIG = (() => {
  try {
    return z
      .object({
        BOT_TOKEN: z.string(),
        USERS_IDS: z.coerce.commaSeparatedList(),
      })
      .parse(JSON.parse(fs.readFileSync(CONFIG_PATH, { encoding: 'utf8' })))
  } catch {
    console.error("Can't read or parse config.")
    process.exit(1)
  }
})()
