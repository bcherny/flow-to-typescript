#!/usr/bin/env node
import "./log"
import "./rule-manager"
import "./nodes"
import { sync } from "glob"
import * as Sh from "shelljs"
import * as Yargs from "yargs"
//import minimist = require("minimist")
import { readFile, writeFile, exists } from "mz/fs"
import { resolve } from "path"
import * as Path from "path"
import * as prettier from "prettier"

import { compile } from "./converter"
import { getLogger } from "./log"

const log = getLogger(__filename)

const args = Yargs.scriptName("flow2ts")
  .usage("$0 [args]")
  .option("i", {
    requiresArg: true,
    alias: "input",
    required: true,
    describe: "Input file or directory",
    type: "string"
  })
  .option("e", {
    requiresArg: true,
    alias: "ext",
    required: false,
    describe: "Regex to match the file ext",
    type: "string",
    default: "\\.js$"
  })
  .option("f", {
    requiresArg: true,
    alias: "filter",
    required: false,
    describe: "Input regex filter for excluding files",
    type: "string"
  })
  .option("o", {
    requiresArg: true,
    alias: "output",
    required: false,
    describe: "Output directory",
    type: "string"
  })
  .option("p", {
    requiresArg: true,
    alias: "pretty-config",
    required: false,
    describe: "Prettier config",
    type: "string"
  })

//log.info("args", process.argv.join(","))
//log.info("yargs", args)

main(
  args.argv

  // minimist(process.argv.slice(2), {
  //   alias: {
  //     help: ["h"],
  //     input: ["i"],
  //     output: ["o"]
  //   }
  // })
)

interface Args {
  i: string
  o: string | undefined
  p: string | undefined
  e: string
  f: string | undefined
}

function checkFileOrDir(param: string, filename: string, dir: boolean = false): boolean {
  if (!Sh.test("-e", filename) || (dir && !Sh.test("-d", filename))) {
    log.error(`Invalid param (${param}): ${filename}`)
    process.exit(-1)
  }

  return !Sh.test("-d", filename)
}

async function main(args: Args) {
  const { i: inputFile, o: outputDir, p: prettierFile, f: filterRegexStr, e: ext } = args

  const isFile = checkFileOrDir("inputFile", inputFile)
  const isDir = !isFile

  const hasOutput = !!outputDir
  if (hasOutput && outputDir) {
    if (!Sh.test("-e", outputDir)) Sh.mkdir("-p", outputDir)

    checkFileOrDir("outputDir", outputDir, true)
  }

  const hasPrettier = !!prettierFile
  let prettierConfig: any
  if (hasPrettier && prettierFile) {
    const resolved = Path.relative(__dirname, prettierFile) //(!prettierFile.includes(Path.sep) ? `.${Path.sep}` : "") + prettierFile
    if (!resolved || !(await exists(prettierFile))) {
      log.error(`Unable to resolve ${prettierFile}`)
      process.exit(-1)
    }

    //checkFileOrDir("prettierFile", resolved)
    prettierConfig = require(resolved)
  }

  const extFilter = new RegExp(ext),
    inputFilter = filterRegexStr ? new RegExp(filterRegexStr) : /.*/,
    inputFiles = !isDir
      ? [inputFile]
      : [
          ...sync(resolve(inputFile, "**", "*.*")).filter(
            file => extFilter.test(file) && inputFilter.test(file) && !/node_modules/.test(file)
          )
        ]

  for (const file of inputFiles) {
    log.info("Converting", file, prettierConfig)
    try {
      const inputCode = await readFile(file, "utf-8")
      let { code: outputCode } = await compile(inputCode, inputFile)
      if (prettierConfig) {
        outputCode = prettier.format(outputCode, prettierConfig)
      }

      if (hasOutput) {
        const outputCodeLower = outputCode.toLowerCase(),
          isJSX = ["jsx", "react", "render()"].some(term => outputCodeLower.includes(term)),
          tsExt = isJSX ? ".tsx" : ".ts"

        const outputFile = file.replace(inputFile, outputDir!!).replace(extFilter, tsExt)
        const outputFileDir = outputFile.substr(0, outputFile.lastIndexOf(Path.sep))

        log.info(`Writing file: ${outputFile}`)
        Sh.mkdir("-p", outputFileDir)

        await writeFile(outputFile, outputCode)
      } else {
        log.info("Converted output", outputCode)
      }
    } catch (e) {
      log.error(`Unable to process: ${file}`, e)
    }
  }
}
//
// function readInput(argIn: string) {
//   return readFile(resolve(process.cwd(), argIn), "utf-8")
// }
//
// function writeOutput(ts: string, argOut: string): Promise<void> {
//   if (!argOut) {
//     try {
//       process.stdout.write(ts)
//       return Promise.resolve()
//     } catch (err) {
//       return Promise.reject(err)
//     }
//   }
//   return writeFile(argOut, ts)
// }
//
// function printHelp() {
//   const pkg = require("../../package.json")
//
//   process.stdout.write(
//     `
// ${pkg.name} ${pkg.version}
// Usage: flow2ts [--input, -i] [IN_FILE] [--output, -o] [OUT_FILE]
//
// With no IN_FILE, or when IN_FILE is -, read standard input.
// With no OUT_FILE and when IN_FILE is specified, create .ts file in the same directory.
// With no OUT_FILE nor IN_FILE, write to standard output.
// `
//   )
// }
