import { test } from 'ava'
import { sync } from 'glob'
import { readFile } from 'mz/fs'
import { basename, resolve } from 'path'
import { compile } from '../src'

// TODO: Why does glob catch tslint.json even with the trailing slash?
let folders = sync(resolve(__dirname, '../../test/cases/*/'))
  .filter(_ => !_.endsWith('.json'))

folders.forEach(folder =>
  test(basename(folder), async t => {
    try {
      let input = await readFile(resolve(folder, 'input.js.flow'), 'utf-8')
      let output = await readFile(resolve(folder, 'output.ts'), 'utf-8')
      t.is(compile(input), output)
    } catch (e) {
      console.log('error', e)
    }
  })
)
