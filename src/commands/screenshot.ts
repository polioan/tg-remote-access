import { define } from 'command'
import screenshot from 'screenshot-desktop'

export default define({
  name: 'screenshot',
  help: 'Screenshot.',
  argument: { type: 'none' },
  async handler(context) {
    const image = await screenshot({ format: 'png' })
    await context.replyWithPhoto({ source: image })
  },
})
