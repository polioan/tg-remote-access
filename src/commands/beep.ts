import { define } from 'command'
import { execSync } from 'node:child_process'
import { z } from 'z'

export default define({
  name: 'beep',
  help: 'Beep. Usage: /beep /beep frequency /beep frequency duration',
  argument: {
    type: 'space-separated',
    schema: z
      .tuple([])
      .or(z.tuple([z.coerce.number().int().finite().positive()]))
      .or(
        z.tuple([
          z.coerce.number().int().finite().positive(),
          z.coerce.number().int().finite().positive(),
        ])
      ),
  },
  async handler(context) {
    const [frequency, duration] = context.argument

    execSync(
      `powershell.exe [console]::beep(${frequency ?? 800},${duration ?? 600})`
    )

    await context.replyWithOk()
  },
})
