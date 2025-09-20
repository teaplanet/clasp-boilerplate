import fs from 'fs';
import { replaceInFile } from 'replace-in-file';

/**
 * 指定されたファイル内のrequire文をコメントアウトし、requireで定義された変数の参照を削除。
 *
 * 対象例
 * const workbook_1 = require("./workbook");
 * const workbook = new workbook_1.Workbook(ss);
 *
 * 出力結果
 * // const workbook_1 = require("./workbook");
 * const workbook = new Workbook(ss);
 *
 * @async
 * @function removeRequired
 * @returns {Promise<void>} 何も返さないPromise
 */
async function removeRequired() {
  const requirePattern = new RegExp('(const (\\w+) = require.*?;)', 'g');
  const options = {
    files: './dist/**/*.js',
    from: requirePattern,
    to: '// $1',
  };
  const results = await replaceInFile(options);
  console.log('Replacement results:', results);

  for (let result of results) {
    console.log(result);
    if (!result.hasChanged) {
      continue;
    }

    console.log('read: ' + result.file);
    let js = await fs.promises.readFile(result.file, 'utf8');
    let matches;
    while ((matches = requirePattern.exec(js)) !== null) {
      if (matches[2]) {
        const variableName = matches[2];
        console.log(`Matched variable name: ${variableName}`);
        js = js.replaceAll(`${variableName}.`, '');
      }
    }
    await fs.promises.writeFile(result.file, js, 'utf8');
  }
}

/**
 * 指定されたファイル内のexports関連のコードをコメントアウトし、必要に応じてGAS上で動作するように書き換えます。
 *
 * コメントアウトの例
 * * Object.defineProperty(exports, "__esModule", { value: true });
 * * exports.Workbook = Workbook;
 *
 * 置換の例
 * * exports.SHEET_NAMES → const SHEET_NAMES
 * @async
 * @function removeExports
 * @returns {Promise<void>} 何も返さないPromise
 */
async function removeExports() {
  const objectExportsPattern = new RegExp(
    '(Object\\.defineProperty\\(exports, "__esModule", { value: true }\\);)',
    'g',
  );
  const exportsVoid0Pattern = new RegExp('(exports\\..*?void 0;)', 'g');
  const exportsEqualPattern = new RegExp('(exports\\.)(.*? = .*)', 'g');
  const exportsPattern = new RegExp('(exports\\.)(.*)', 'g');
  const exportsSamePattern = new RegExp('(exports\\.(\\w+)\\s*=\\s*\\2\\s*;)', 'g');

  const commentOut = '// $1';

  const options = {
    files: './dist/**/*.js',
    from: [
      exportsSamePattern,
      objectExportsPattern,
      exportsVoid0Pattern,
      exportsEqualPattern,
      exportsPattern,
    ],
    to: [commentOut, commentOut, commentOut, 'const $2', '$2'],
  };

  const results = await replaceInFile(options);
  console.log('Replacement results:', results);
}

await removeExports();
await removeRequired();
