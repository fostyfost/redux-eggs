'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('node:fs');
var path = require('node:path');
var process = require('node:process');
var util = require('node:util');
var zlib = require('node:zlib');
var brotli = require('brotli-size');
var CliTable = require('cli-table');
var colorette = require('colorette');
var filesize$1 = require('filesize');
var pacote = require('pacote');
var terser = require('terser');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var process__default = /*#__PURE__*/_interopDefaultLegacy(process);
var util__default = /*#__PURE__*/_interopDefaultLegacy(util);
var zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);
var brotli__default = /*#__PURE__*/_interopDefaultLegacy(brotli);
var CliTable__default = /*#__PURE__*/_interopDefaultLegacy(CliTable);
var pacote__default = /*#__PURE__*/_interopDefaultLegacy(pacote);
var terser__default = /*#__PURE__*/_interopDefaultLegacy(terser);

const gzipSizeSync = (input) => zlib__default["default"].gzipSync(input, { level: 9 }).length;
const getSize = (value) => filesize$1.filesize(value, { output: 'array', exponent: 0 });
const getRow = (title, sizeCurrent, sizeBefore) => {
    const size = [colorette.cyan(sizeCurrent.join(' '))];
    if (sizeBefore) {
        size.push(colorette.cyan(sizeBefore.join(' ')));
        const [valueCurrent, symbol] = sizeCurrent;
        const [valueBefore] = sizeBefore;
        const diff = valueCurrent - valueBefore;
        size.push(diff > 0 ? colorette.red(`+${diff} ${symbol}`) : colorette.green(`${diff} ${symbol}`));
    }
    return { [colorette.white(title)]: size };
};
const getTable = async (info) => {
    const table = new CliTable__default["default"]({
        head: [
            `${colorette.bold(colorette.white('File:'))} ${colorette.green(info.file)}`,
            colorette.bold(colorette.white('Current version')),
            colorette.bold(colorette.white(`Last version${info.lastVersion ? ` (${info.lastVersion})` : ''}`)),
            colorette.bold(colorette.white('Size diff')),
        ],
    });
    table.push(getRow('Bundle size', info.bundleSize, info.bundleSizeBefore));
    if (info.minSize) {
        table.push(getRow('Minified size', info.minSize, info.minSizeBefore));
    }
    if (info.gzipSize) {
        table.push(getRow('Gzip size', info.gzipSize, info.gzipSizeBefore));
    }
    if (info.brotliSize) {
        table.push(getRow('Brotli size', info.brotliSize, info.brotliSizeBefore));
    }
    return table.toString();
};
const getStrings = async (outputOptions, chunk) => {
    const info = {
        file: outputOptions.file || 'N/A',
        bundleSize: getSize(Buffer.byteLength(chunk.code)),
        brotliSize: getSize(await brotli__default["default"](chunk.code)),
    };
    const { name } = await (function (t) { return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(t)); }); })(path__default["default"].join(process__default["default"].cwd(), './package.json'));
    try {
        const { version } = await pacote__default["default"].manifest(`${name}@latest`);
        info.lastVersion = version;
    }
    catch (error) {
        console.error(error);
    }
    const minifiedCode = (await terser__default["default"].minify(chunk.code)).code;
    if (minifiedCode) {
        info.minSize = getSize(minifiedCode.length);
        info.gzipSize = getSize(gzipSizeSync(minifiedCode));
    }
    let file = outputOptions.file || '';
    try {
        const output = path__default["default"].join(process__default["default"].cwd(), './file-size-cache');
        await pacote__default["default"].extract(`${name}@latest`, output);
        file = path__default["default"].resolve(output, file);
    }
    catch (error) {
        console.error(error);
        file = '';
    }
    if (file && (await util__default["default"].promisify(fs__default["default"].stat)(file)).isFile()) {
        try {
            const codeBefore = await util__default["default"].promisify(fs__default["default"].readFile)(file, 'utf8');
            if (codeBefore) {
                info.bundleSizeBefore = getSize(Buffer.byteLength(codeBefore));
                info.brotliSizeBefore = getSize(await brotli__default["default"](codeBefore));
                const minifiedCodeBefore = (await terser__default["default"].minify(codeBefore)).code;
                if (minifiedCodeBefore) {
                    info.minSizeBefore = getSize(minifiedCodeBefore.length);
                    info.gzipSizeBefore = getSize(gzipSizeSync(minifiedCodeBefore));
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    return getTable(info);
};
const filesize = () => {
    const plugin = {
        name: 'filesize',
    };
    if (process__default["default"].env.FILESIZE === 'true') {
        plugin.generateBundle = async (outputOptions, bundle) => {
            Promise.all(Object.keys(bundle)
                .map(fileName => bundle[fileName])
                .filter((currentBundle) => currentBundle && currentBundle.type !== 'asset')
                .map(currentBundle => getStrings(outputOptions, currentBundle))).then(strings => {
                strings.forEach(str => {
                    if (str) {
                        console.log(str);
                    }
                });
            });
        };
    }
    return plugin;
};

exports.filesize = filesize;
