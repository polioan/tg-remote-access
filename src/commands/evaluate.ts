import { define } from 'command'
import { inspect } from 'node:util'

export default define({
  name: 'evaluate',
  help: 'Eval.',
  argument: { type: 'raw' },
  async handler(context) {
    const evalResult = eval(context.argument)
    await context.reply(inspect(evalResult))
  },
})
