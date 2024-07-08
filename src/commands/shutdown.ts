import { define } from 'command'
import { execSync } from 'node:child_process'

export default define({
  name: 'shutdown',
  help: 'Shutdown PC.',
  argument: { type: 'none' },
  async handler(context) {
    await context.replyWithOk()
    execSync('powershell.exe shutdown /s /t 00')
  },
})
