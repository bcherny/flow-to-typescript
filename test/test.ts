// import { test } from 'ava'
// import { readFile } from 'mz/fs'
// import { resolve } from 'path'

// test('basic', async t => {
//   let file = await readFile(resolve(__dirname, '../../test/cases/basic.js.flow'), 'utf-8')
//   t.is(file, 'foo')
// })

import { readFile } from 'mz/fs'
import { resolve } from 'path'
import { compile } from '../src/'

async function test() {
  try {
    let file = await readFile(resolve(__dirname, '../../test/cases/basic.js.flow'), 'utf-8')
    console.log('compiled', compile(file))
  } catch (e) {
    console.log('error', e)
  }
}
test()
