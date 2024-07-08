import { define } from 'command'
import { execSync } from 'node:child_process'

export default define({
  name: 'logoff',
  help: 'Logoff PC.',
  argument: { type: 'none' },
  async handler(context) {
    await context.replyWithOk()
    execSync('powershell.exe shutdown /l')
  },
})
