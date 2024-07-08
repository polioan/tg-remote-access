import { define } from 'command'
import { z } from 'z'
import fs from 'node:fs/promises'
import { getDiskInfo } from 'node-disk-info'

export default define({
  name: 'files',
  help: 'List files in directory, or disks if argument not provided.',
  argument: {
    type: 'space-separated',
    schema: z.tuple([]).or(z.tuple([z.string()])),
  },
  async handler(context) {
    const [name] = context.argument
    if (name) {
      const files = await fs.readdir(name)
      await context.reply(JSON.stringify(files, null, 2))
    } else {
      const drives = await getDiskInfo()
      await context.reply(JSON.stringify(drives, null, 2))
    }
  },
})
