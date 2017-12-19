import { test } from 'ava'
import { sync } from 'glob'
import { readFile } from 'mz/fs'
import { basename, resolve } from 'path'
import { compile } from '../src'

let paths = ['e2e', 'rules', 'unit']

paths.forEach(path => {
  // TODO: Why does glob catch tslint.json even with the trailing slash?
  let folders = sync(resolve(__dirname, `../../test/${path}/*/`))
    .filter(_ => !_.endsWith('.json'))
    .filter(_ => !basename(_).startsWith('_'))

  folders.forEach(folder =>
    test(basename(folder), async t => {
      try {
        let filein = resolve(folder, 'input.txt')
        let input = await readFile(filein, 'utf-8')
        let output = await readFile(resolve(folder, 'output.txt'), 'utf-8')
        t.is(await compile(input, filein), output)
      } catch (e) {
        console.log('error', e)
      }
    })
  )
})
