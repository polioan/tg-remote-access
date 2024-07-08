import { define } from 'command'
import open from 'open'
import fs from 'node:fs/promises'

export default define({
  name: 'showtxt',
  help: 'Show text on the screen.',
  argument: { type: 'raw' },
  async handler(context) {
    const tempfile = context.tmpfile('txt')
    await fs.writeFile(tempfile, context.argument, { encoding: 'utf8' })
    await open(tempfile)
    await context.replyWithOk()
  },
})
