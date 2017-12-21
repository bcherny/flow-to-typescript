import { test } from 'ava'
import { sync } from 'glob'
import { chain } from 'lodash'
import { readFile } from 'mz/fs'
import { basename, resolve } from 'path'
import { compile } from '../src'

let tests = chain(['e2e', 'rules', 'unit'])
  .map(_ => sync(resolve(__dirname, `../../test/${_}/*/`)))
  .flatten()
  .filter(_ => !_.endsWith('.json'))
  .filter(_ => !basename(_).startsWith('_'))
  .forEach(folder =>
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

function main() {
  tests.value()
}

main()
