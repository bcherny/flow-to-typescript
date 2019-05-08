import "../src/log"
import "../src/rule-manager"
import * as assert from "assert"
import { sync } from "glob"
import * as Fs from "mz/fs"
import { basename, resolve } from "path"
import { CompileResult } from "../src"
import { compile } from "../src/converter"
import "./setup"

import * as Sh from "shelljs"
import { getLogger } from "../src/log"

const log = getLogger(__filename)

const rootDir = process.cwd()

async function suite() {
  const suite = process.env.TEST_SUITE
  const argPaths =
    !suite || !suite.length
      ? []
      : suite.split(",").filter(arg => arg && Fs.existsSync(arg) && Fs.lstatSync(arg).isDirectory())

  const paths = argPaths.length ? argPaths : ["e2e", "rules", "unit"]

  // MAKE OUTPUT DIRECTORY
  const outputFolder = resolve(rootDir, "dist", "results")
  Sh.mkdir("-p", outputFolder)

  paths.forEach(path => {
    // TODO: Why does glob catch tslint.json even with the trailing slash?
    const folders =
      paths === argPaths
        ? paths.map(path => resolve(path))
        : sync(resolve(rootDir, "test", path, "*"))
            .filter(_ => !_.endsWith(".json"))
            .filter(_ => !basename(_).startsWith("_"))

    folders.forEach(folder => {
      const name = basename(folder)
      test(name, async () => {
        let outputExpected = "",
          input = "",
          result: CompileResult | null = null

        try {
          const prefixes = ["input", "output"]
          const files = prefixes
            .map(prefix => Fs.readdirSync(folder).find(path => path.startsWith(prefix)))
            .filter(path => !!path)
            .map(path => resolve(folder, path))
          assert.ok(files.length === 2, `Did not find exactly two files (input/output): ${files.join(", ")}`)
          const [inputFile, outputFile] = files
          input = await Fs.readFile(inputFile, "utf-8")

          outputExpected = await Fs.readFile(outputFile, "utf-8")
          const { code: outputActual } = (result = await compile(input, inputFile))

          expect(outputActual).toBe(outputExpected)
        } catch (err) {
          log.error(`Test: ${name}`, err)

          if (result) {
            const { code, inputAst, outputAst, warnings } = result,
              testOutputFolder = resolve(outputFolder, name),
              contents = [
                ["input.js.flow", input],
                ["output.expected.ts", outputExpected],
                ["output.actual.ts", code],
                ["details.json", JSON.stringify({ inputAst, outputAst, warnings }, null, 2)]
              ]

            Sh.mkdir("-p", testOutputFolder)
            contents.forEach(([name, content]) => {
              const filename = resolve(testOutputFolder, name)
              Fs.writeFileSync(filename, content)
            })
          }

          throw err
        }
      })
    })
  })
}

suite()
