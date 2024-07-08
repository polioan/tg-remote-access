import axios from 'axios'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { rimraf } from 'rimraf'
import { type Context, type types, Telegraf, filters } from 'telegram'
import { v4 as uuid } from 'uuid'
import { CONFIG, WORK_PATH } from 'variables'
import { type AnyZodType, ZodError } from 'z'
// TODO wildcard import
import background from './commands/background'
import beep from './commands/beep'
import echo from './commands/echo'
import evaluate from './commands/evaluate'
import exit from './commands/exit'
import shutdown from './commands/shutdown'
import showtxt from './commands/showtxt'
import showimg from './commands/showimg'
import start from './commands/start'
import logoff from './commands/logoff'
import info from './commands/info'
import help from './commands/help'
import screenshot from './commands/screenshot'
import files from './commands/files'

const commands: DefineOptions<AnyZodType, Argument<AnyZodType>>[] = [
  background,
  beep,
  echo,
  evaluate,
  exit,
  shutdown,
  showtxt,
  showimg,
  start,
  logoff,
  info,
  help,
  screenshot,
  files,
]

export const bot = Object.assign(new Telegraf(CONFIG.BOT_TOKEN, {}), {
  async initiate() {
    await new Promise<void>(resolve => {
      bot
        .launch({ dropPendingUpdates: true }, () => {
          console.log('Bot started.')
          resolve()
        })
        .catch(() => {
          console.error("Can't start bot.")
          process.exit(1)
        })
    })
  },
})

export type BotContext<
  T extends AnyZodType,
  U extends Argument<T>,
> = Context & {
  argument: InferArgument<T, U>
  commands: DefineOptions<AnyZodType, Argument<AnyZodType>>[]
  die: (message?: string | undefined) => never
  dieWithMissingAttachment: () => never
  replyWithOk: () => void | Promise<void>
  downloadPhoto: (
    photo: types.PhotoSize[],
    destination: string
  ) => void | Promise<void>
  tmpfile: (extension: string) => string
  persistentfile: (extension: string) => string
  rimraf: typeof rimraf
}

export interface DefineOptions<T extends AnyZodType, U extends Argument<T>> {
  name: string
  help: string
  argument: U
  handler: (context: BotContext<T, U>) => void | Promise<void>
}

export function define<T extends AnyZodType, U extends Argument<T>>(
  options: DefineOptions<T, U>
) {
  return options
}

export type Argument<T extends AnyZodType> =
  | {
      type: 'raw'
    }
  | {
      type: 'none'
    }
  | {
      type: 'space-separated'
      schema: T
    }

export type InferArgument<
  T extends AnyZodType,
  U extends Argument<T>,
> = U extends {
  type: 'raw'
}
  ? string
  : U extends { type: 'none' }
    ? void
    : U extends { type: 'space-separated'; schema: T }
      ? U['schema']['_output']
      : never

function parse(text: string) {
  const tokens = text.split(' ')
  const commandName = tokens.shift()?.replace('/', '')
  if (!commandName) {
    return null
  }
  const command = commands.find(command => {
    return command.name === commandName
  })
  if (!command) {
    return null
  }
  switch (command.argument.type) {
    case 'raw': {
      return { command, argument: tokens.join(' ') }
    }
    case 'none': {
      if (tokens.length > 0) {
        throw new Error('Too many arguments!')
      }
      return { command }
    }
    case 'space-separated': {
      return { command, argument: command.argument.schema.parse(tokens) }
    }
    default:
      throw new Error('Unknown argument type!')
  }
}

function die(message?: string | undefined): never {
  throw new Error(message)
}

function dieWithMissingAttachment(): never {
  throw new Error('Missing attachment!')
}

async function downloadPhoto(
  photo: types.PhotoSize[] | types.PhotoSize,
  destination: string
) {
  const fileId = Array.isArray(photo) ? photo.pop()?.file_id : photo.file_id
  if (!fileId) {
    throw new Error('No photo!')
  }

  const { href } = await bot.telegram.getFileLink(fileId)
  const response = await axios.get(href, { responseType: 'stream' })

  await new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(destination)
    response.data.pipe(writer)
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

function tmpfile(extension: string) {
  return path.join(os.tmpdir(), `${uuid()}.${extension}`)
}

function persistentfile(extension: string) {
  return path.join(WORK_PATH, `${uuid()}.${extension}`)
}

bot.on(filters.message(), async context => {
  try {
    if (!CONFIG.USERS_IDS.includes(String(context.from.id))) {
      return
    }

    // TODO extract to function
    const text =
      'text' in context.message
        ? context.message.text
        : 'photo' in context.message
          ? context.message.caption
          : null

    if (text) {
      if (!text.startsWith('/')) {
        await context.reply('Ignored. Commands starts with "/".')
        return
      }
      const parsed = parse(text)
      if (!parsed) {
        await context.reply('This command not found!')
        return
      }
      await parsed.command.handler(
        Object.assign(context, {
          commands,
          die,
          dieWithMissingAttachment,
          async replyWithOk() {
            await context.reply('Ok!')
          },
          downloadPhoto,
          tmpfile,
          persistentfile,
          rimraf,
          argument: parsed.argument,
        })
      )
    }
  } catch (error) {
    // TODO better error handling

    if (error instanceof ZodError) {
      await context.reply('Validation error!')
      return
    }

    if (error instanceof Error) {
      await context.reply(`Error! ${error.message ?? ''}`)
      return
    }

    console.error(error)
    await context.reply('Unknown error!')
  }
})
