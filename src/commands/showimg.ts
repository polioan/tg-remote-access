import { define } from 'command'
import { filters } from 'telegram'
import open from 'open'

export default define({
  name: 'showimg',
  help: 'Show image on the screen.',
  argument: { type: 'none' },
  async handler(context) {
    if (context.has(filters.message('photo'))) {
      const tempfile = context.tmpfile('jpg')
      await context.downloadPhoto(context.message.photo, tempfile)
      await open(tempfile)
      await context.replyWithOk()
    } else {
      context.dieWithMissingAttachment()
    }
  },
})
