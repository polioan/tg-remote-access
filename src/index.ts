import { bot } from 'command'
import { CONFIG } from 'variables'
import os from 'node:os'
import { format } from 'date-fns'

await bot.initiate()

for (const id of CONFIG.USERS_IDS) {
  await bot.telegram.sendMessage(
    id,
    `PC "${os.hostname()} ${os.userInfo().username}" started at ${format(new Date(), 'yyyy MMMM dd HH:mm')}.`
  )
}
