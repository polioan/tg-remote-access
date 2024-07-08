import { define } from 'command'
import { filters } from 'telegram'
import { setWallpaper } from 'wallpaper'

export default define({
  name: 'background',
  help: 'Set background.',
  argument: { type: 'none' },
  async handler(context) {
    if (context.has(filters.message('photo'))) {
      const destination = context.persistentfile('jpg')
      await context.downloadPhoto(context.message.photo, destination)
      await setWallpaper(destination)
      await context.reply(`Ok! Temp file - "${destination}".`)
    } else {
      context.dieWithMissingAttachment()
    }
  },
})
