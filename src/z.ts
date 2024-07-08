import { z, type ZodType } from 'zod'

function commaSeparatedList() {
  return z.coerce.string().transform(v => {
    return v.split(',').filter(Boolean)
  })
}

const unfrozenZod = Object.assign({}, z)

const customZod = Object.assign(unfrozenZod, {
  coerce: Object.assign(unfrozenZod.coerce, { commaSeparatedList }),
})

export { customZod as z }

export { ZodError } from 'zod'

export type AnyZodType = ZodType<any, any, any>

export type Infer<T extends AnyZodType> = T['_output']
