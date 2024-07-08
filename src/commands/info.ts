import { define } from 'command'
import os from 'node:os'

export default define({
  name: 'info',
  help: 'Info.',
  argument: { type: 'none' },
  async handler(context) {
    await context.reply(
      `
os.arch(): ${os.arch()}
os.cpus().length: ${os.cpus().length}
os.availableParallelism(): ${os.availableParallelism()}
os.endianness(): ${os.endianness()}
os.freemem(): ${os.freemem()}
os.homedir(): ${os.homedir()}
os.hostname(): ${os.hostname()}
os.machine(): ${os.machine()}
os.platform(): ${os.platform()}
os.release(): ${os.release()}
os.totalmem(): ${os.totalmem()}
os.type(): ${os.type()}
os.uptime(): ${os.uptime()}
os.userInfo().homedir: ${os.userInfo().homedir}
os.userInfo().username: ${os.userInfo().username}
os.version(): ${os.version()}
      `.trim()
    )
  },
})
