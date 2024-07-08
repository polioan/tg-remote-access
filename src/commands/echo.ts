import { define } from 'command'

export default define({
  name: 'echo',
  help: 'Repeats user input or sends "-empty-" if no input provided.',
  argument: { type: 'raw' },
  async handler(context) {
    await context.reply(context.argument || '-empty-')
  },
})
