import { define } from 'command'
import open from 'open'

export default define({
  name: 'start',
  help: 'Start program, file, url.',
  argument: { type: 'raw' },
  async handler(context) {
    await open(context.argument)
    await context.replyWithOk()
  },
})
