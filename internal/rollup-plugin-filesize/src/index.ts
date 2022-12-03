import brotli from 'brotli-size'
import CliTable from 'cli-table'
import { bold, cyan, green, red, white } from 'colorette'
import { filesize as fileSize } from 'filesize'
import fs from 'fs'
import pacote from 'pacote'
import path from 'path'
import * as process from 'process'
import type { NormalizedOutputOptions, OutputChunk, OutputPlugin } from 'rollup'
import terser from 'terser'
import util from 'util'
import zlib from 'zlib'

type FileSizeValue = number
type FileSizeSymbol = string
type FileSizeOutputResult = [FileSizeValue, FileSizeSymbol]

interface Info {
  lastVersion?: string
  file: string
  bundleSize: FileSizeOutputResult
  bundleSizeBefore?: FileSizeOutputResult
  minSize?: FileSizeOutputResult
  minSizeBefore?: FileSizeOutputResult
  gzipSize?: FileSizeOutputResult
  gzipSizeBefore?: FileSizeOutputResult
  brotliSize: FileSizeOutputResult
  brotliSizeBefore?: FileSizeOutputResult
}

const gzipSizeSync = (input: string): number => zlib.gzipSync(input, { level: 9 }).length

const getSize = (value: number): FileSizeOutputResult => fileSize(value, { output: 'array', exponent: 0 }) as any

const getRow = (title: string, sizeCurrent: FileSizeOutputResult, sizeBefore?: FileSizeOutputResult) => {
  const size = [cyan(sizeCurrent.join(' '))]

  if (sizeBefore) {
    size.push(cyan(sizeBefore.join(' ')))

    const [valueCurrent, symbol] = sizeCurrent
    const [valueBefore] = sizeBefore

    const diff = valueCurrent - valueBefore

    size.push(diff > 0 ? red(`+${diff} ${symbol}`) : green(`${diff} ${symbol}`))
  }

  return { [white(title)]: size }
}

const getTable = async (info: Info) => {
  const table = new CliTable({
    head: [
      `${bold(white('File:'))} ${green(info.file)}`,
      bold(white('Current version')),
      bold(white(`Last version${info.lastVersion ? ` (${info.lastVersion})` : ''}`)),
      bold(white('Size diff')),
    ],
  })

  table.push(getRow('Bundle size', info.bundleSize, info.bundleSizeBefore))

  if (info.minSize) {
    table.push(getRow('Minified size', info.minSize, info.minSizeBefore))
  }

  if (info.gzipSize) {
    table.push(getRow('Gzip size', info.gzipSize, info.gzipSizeBefore))
  }

  if (info.brotliSize) {
    table.push(getRow('Brotli size', info.brotliSize, info.brotliSizeBefore))
  }

  return table.toString()
}

const getStrings = async (outputOptions: NormalizedOutputOptions, chunk: OutputChunk) => {
  const info: Info = {
    file: outputOptions.file || 'N/A',
    bundleSize: getSize(Buffer.byteLength(chunk.code)),
    brotliSize: getSize(await brotli(chunk.code)),
  }

  const { name } = await import(path.join(process.cwd(), './package.json'))

  try {
    const { version } = await pacote.manifest(`${name}@latest`)
    info.lastVersion = version
  } catch (error) {
    console.error(error)
  }

  const minifiedCode = (await terser.minify(chunk.code)).code
  if (minifiedCode) {
    info.minSize = getSize(minifiedCode.length)
    info.gzipSize = getSize(gzipSizeSync(minifiedCode))
  }

  let file = outputOptions.file || ''

  try {
    const output = path.join(process.cwd(), './file-size-cache')

    await pacote.extract(`${name}@latest`, output)

    file = path.resolve(output, file)
  } catch (error) {
    console.error(error)

    file = ''
  }

  if (file) {
    try {
      const codeBefore = await util.promisify(fs.readFile)(file, 'utf8')

      if (codeBefore) {
        info.bundleSizeBefore = getSize(Buffer.byteLength(codeBefore))
        info.brotliSizeBefore = getSize(await brotli(codeBefore))

        const minifiedCodeBefore = (await terser.minify(codeBefore)).code
        if (minifiedCodeBefore) {
          info.minSizeBefore = getSize(minifiedCodeBefore.length)
          info.gzipSizeBefore = getSize(gzipSizeSync(minifiedCodeBefore))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return getTable(info)
}

export const filesize = (): OutputPlugin => {
  const plugin: OutputPlugin = {
    name: 'filesize',
  }

  if (process.env.FILESIZE === 'true') {
    plugin.generateBundle = async (outputOptions, bundle) => {
      Promise.all(
        Object.keys(bundle)
          .map(fileName => bundle[fileName])
          .filter((currentBundle): currentBundle is OutputChunk => currentBundle && currentBundle.type !== 'asset')
          .map(currentBundle => getStrings(outputOptions, currentBundle)),
      ).then(strings => {
        strings.forEach(str => {
          if (str) {
            console.log(str)
          }
        })
      })
    }
  }

  return plugin
}
