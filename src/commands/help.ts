import { define } from 'command'
import { z } from 'z'

export default define({
  name: 'help',
  help: 'Get help for command. Or get all commands if no valid argument.',
  argument: {
    type: 'space-separated',
    schema: z.tuple([]).or(z.tuple([z.coerce.string()])),
  },
  async handler(context) {
    const command = context.commands.find(command => {
      return command.name === context.argument[0]
    })
    if (command) {
      await context.reply(command.help)
    } else {
      await context.reply(
        context.commands
          .map(command => {
            return `/${command.name}`
          })
          .join('\n')
      )
    }
  },
})
