'use strict'

const path = require('node:path')

const { jsExtensions } = require('eslint-config-polioan/common/constants')

/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
  extends: [
    'polioan/configurations/comments',
    'polioan/configurations/general',
    'polioan/configurations/generalTypes',
    'polioan/configurations/regex',
    'polioan/configurations/spellcheck',
  ],
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  settings: {},
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: path.join(__dirname, 'tsconfig.json'),
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [],
  rules: {
    'unicorn/filename-case': ['off'],
    '@typescript-eslint/no-empty-interface': ['warn'],
    'no-new': ['warn'],
    'jsdoc/require-param-description': ['off'],
    '@typescript-eslint/no-unnecessary-condition': ['warn'],
    'spellcheck/spell-checker': [
      'warn',
      {
        skipWords: [
          'os',
          'fs',
          'telegraf',
          'tg',
          'zod',
          'homedir',
          'utf8',
          'minify',
          'outfile',
          'ico',
          'rcedit',
          'exe',
          'bunx',
          'ctx',
          'wildcard',
          'awaitable',
          'jpg',
          'tmpdir',
          'axios',
          'href',
          'tmpfile',
          'dll',
          'extern',
          'rimraf',
          'persistentfile',
          'powershell',
          'cpus',
          'endianness',
          'freemem',
          'loadavg',
          'totalmem',
          'uptime',
          'gid',
          'uid',
          'drivelist',
          'showtxt',
          'showimg',
          'tempfile',
          'txt',
          'readdir',
        ],
      },
    ],
    'no-console': ['off'],
  },
  overrides: [
    {
      files: ['*.cjs'],
      extends: ['polioan/configurations/commonJS'],
    },
    {
      files: jsExtensions,
      extends: ['polioan/configurations/javascriptOnly'],
    },
  ],
}

module.exports = config
