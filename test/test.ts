import test from 'ava'
import { sync } from 'glob'
import { readFile, writeFile } from 'mz/fs'
import { basename, resolve } from 'path'
import { compile } from '../src'

let paths = ['e2e', 'rules', 'unit']

// Kind of hacky thing to figure out if -u or --update-snapshots was passed to AVA.
// We manually write expected output in this test.
// It's more clear, and allows us to have input and output files for each test.
const argvString = process.env.npm_config_argv as string
const argv = JSON.parse(argvString || '')
const argvOriginal = argv.original || []
const update =
  argvOriginal.includes('-u') || argvOriginal.includes('--update-snapshots')

paths.forEach(path => {
  // TODO: Why does glob catch tslint.json even with the trailing slash?
  const folders = sync(resolve(__dirname, `../../test/${path}/*/`))
    .filter(_ => !_.endsWith('.json'))
    .filter(_ => !basename(_).startsWith('_'))

  const tests = folders.map(folder => ({ folder, name: basename(folder) }))

  tests.forEach(({ name, folder }) =>
    test(name, async t => {
      try {
        const inputPath = resolve(folder, 'input.txt')
        const outputPath = resolve(folder, 'output.txt')
        const input = await readFile(inputPath, 'utf-8')
        const output = await compile(input, inputPath)
        if (update) {
          await writeFile(outputPath, output)
          t.pass()
        } else {
          const expectedOutput = await readFile(outputPath, 'utf-8')
          t.is(output, expectedOutput)
        }
      } catch (e) {
        console.log('error', e)
      }
    })
  )
})
