import { define } from 'command'

export default define({
  name: 'exit',
  help: 'Exit.',
  argument: { type: 'none' },
  async handler(context) {
    await context.replyWithOk()
    process.exit(0)
  },
})
