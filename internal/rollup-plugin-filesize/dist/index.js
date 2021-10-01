'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var brotli = require('brotli-size');
var CliTable = require('cli-table');
var colors = require('colors/safe');
var fileSize = require('filesize');
var fs = require('fs');
var gzip = require('gzip-size');
var pacote = require('pacote');
var path = require('path');
var process = require('process');
var terser = require('terser');
var util = require('util');

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

var brotli__default = /*#__PURE__*/_interopDefaultLegacy(brotli);
var CliTable__default = /*#__PURE__*/_interopDefaultLegacy(CliTable);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);
var fileSize__default = /*#__PURE__*/_interopDefaultLegacy(fileSize);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var gzip__default = /*#__PURE__*/_interopDefaultLegacy(gzip);
var pacote__default = /*#__PURE__*/_interopDefaultLegacy(pacote);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var process__namespace = /*#__PURE__*/_interopNamespace(process);
var terser__default = /*#__PURE__*/_interopDefaultLegacy(terser);
var util__default = /*#__PURE__*/_interopDefaultLegacy(util);

const white = colors__default["default"]['white'];
const whiteBold = white.bold;
const cyan = colors__default["default"]['cyan'];
const red = colors__default["default"]['red'];
const green = colors__default["default"]['green'];
const getSize = (value) => fileSize__default["default"](value, { output: 'array', exponent: 0 });
const getRow = (title, sizeCurrent, sizeBefore) => {
    const size = [cyan(sizeCurrent.join(' '))];
    if (sizeBefore) {
        size.push(cyan(sizeBefore.join(' ')));
        const [valueCurrent, symbol] = sizeCurrent;
        const [valueBefore] = sizeBefore;
        const diff = valueCurrent - valueBefore;
        size.push(diff > 0 ? red(`+${diff} ${symbol}`) : green(`${diff} ${symbol}`));
    }
    return { [white(title)]: size };
};
const getTable = async (info) => {
    const table = new CliTable__default["default"]({
        head: [
            `${whiteBold('File:')} ${green(info.file)}`,
            whiteBold('Current version'),
            whiteBold(`Last version${info.lastVersion ? ` (${info.lastVersion})` : ''}`),
            whiteBold('Size diff'),
        ],
    });
    table.push(getRow('Bundle size', info.bundleSize, info.bundleSizeBefore));
    if (info.minSize) {
        table.push(getRow('Minified size', info.minSize, info.minSizeBefore));
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
    const { name } = await (function (t) { return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(t)); }); })(path__default["default"].join(process__namespace.cwd(), './package.json'));
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
        info.gzipSize = getSize(gzip__default["default"].sync(minifiedCode));
    }
    let file = outputOptions.file || '';
    try {
        const output = path__default["default"].join(process__namespace.cwd(), './file-size-cache');
        await pacote__default["default"].extract(`${name}@latest`, output);
        file = path__default["default"].resolve(output, file);
    }
    catch (error) {
        console.error(error);
        file = '';
    }
    if (file) {
        try {
            const codeBefore = await util__default["default"].promisify(fs__default["default"].readFile)(file, 'utf8');
            if (codeBefore) {
                info.bundleSizeBefore = getSize(Buffer.byteLength(codeBefore));
                info.brotliSizeBefore = getSize(await brotli__default["default"](codeBefore));
                const minifiedCodeBefore = (await terser__default["default"].minify(codeBefore)).code;
                if (minifiedCodeBefore) {
                    info.minSizeBefore = getSize(minifiedCodeBefore.length);
                    info.gzipSizeBefore = getSize(gzip__default["default"].sync(minifiedCodeBefore));
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
    if (process__namespace.env.FILESIZE === 'true') {
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
