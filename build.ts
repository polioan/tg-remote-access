import { execSync } from 'node:child_process'
import { rimrafSync } from 'rimraf'
import packageJson from './package.json'

rimrafSync(`./${packageJson.name}`)

execSync(
  `bunx cross-env NODE_ENV=production bun build ./src/index.ts --compile --outfile ${packageJson.name}`
)

console.log('Build done.')
