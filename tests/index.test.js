'use strict';

const { test } = require('node:test');
const assert = require('assert');
const reporter = require('../index.js');

test('empty', async () => {
  const lines = [];
  for await (const line of reporter([])) {
    lines.push(line);
  }
  assert.deepStrictEqual(lines, [
    '<?xml version="1.0" ?>\n',
    '<!DOCTYPE coverage SYSTEM "http://cobertura.sourceforge.net/xml/coverage-04.dtd">\n',
  ]);
});

test('single test', async () => {
  const lines = [];
  for await (const line of reporter([
    {
      type: 'test:coverage',
      data: {
        nesting: 0,
        summary: {
          workingDirectory: '/Users/bacebu4/dev/cobertura-test',
          files: [
            {
              path: '/Users/bacebu4/dev/cobertura-test/src/bar/qux/qux.js',
              totalLineCount: 3,
              totalBranchCount: 2,
              totalFunctionCount: 1,
              coveredLineCount: 3,
              coveredBranchCount: 2,
              coveredFunctionCount: 1,
              coveredLinePercent: 100,
              coveredBranchPercent: 100,
              coveredFunctionPercent: 100,
              functions: [{ name: 'qux', count: 1, line: 1 }],
              branches: [
                { line: 1, count: 1 },
                { line: 1, count: 1 },
              ],
              lines: [
                { line: 1, count: 1 },
                { line: 2, count: 1 },
                { line: 3, count: 1 },
              ],
            },
            {
              path: '/Users/bacebu4/dev/cobertura-test/src/bar/qux/qux.test.js',
              totalLineCount: 11,
              totalBranchCount: 3,
              totalFunctionCount: 2,
              coveredLineCount: 11,
              coveredBranchCount: 3,
              coveredFunctionCount: 2,
              coveredLinePercent: 100,
              coveredBranchPercent: 100,
              coveredFunctionPercent: 100,
              functions: [
                { name: '', count: 1, line: 5 },
                { name: '', count: 1, line: 6 },
              ],
              branches: [
                { line: 1, count: 1 },
                { line: 5, count: 1 },
                { line: 6, count: 1 },
              ],
              lines: [
                { line: 1, count: 1 },
                { line: 2, count: 1 },
                { line: 3, count: 1 },
                { line: 4, count: 1 },
                { line: 5, count: 1 },
                { line: 6, count: 1 },
                { line: 7, count: 1 },
                { line: 8, count: 1 },
                { line: 9, count: 1 },
                { line: 10, count: 1 },
                { line: 11, count: 1 },
              ],
            },
            {
              path: '/Users/bacebu4/dev/cobertura-test/foo.js',
              totalLineCount: 13,
              totalBranchCount: 4,
              totalFunctionCount: 1,
              coveredLineCount: 11,
              coveredBranchCount: 3,
              coveredFunctionCount: 1,
              coveredLinePercent: 84.61538461538461,
              coveredBranchPercent: 75,
              coveredFunctionPercent: 100,
              functions: [{ name: 'foo', count: 2, line: 1 }],
              branches: [
                { line: 1, count: 1 },
                { line: 1, count: 2 },
                { line: 2, count: 0 },
                { line: 6, count: 1 },
              ],
              lines: [
                { line: 1, count: 1 },
                { line: 2, count: 2 },
                { line: 3, count: 0 },
                { line: 4, count: 0 },
                { line: 5, count: 2 },
                { line: 6, count: 2 },
                { line: 7, count: 1 },
                { line: 8, count: 1 },
                { line: 9, count: 1 },
                { line: 10, count: 1 },
                { line: 11, count: 1 },
                { line: 12, count: 1 },
                { line: 13, count: 2 },
              ],
            },
            {
              path: '/Users/bacebu4/dev/cobertura-test/src/foo.test.js',
              totalLineCount: 17,
              totalBranchCount: 4,
              totalFunctionCount: 3,
              coveredLineCount: 17,
              coveredBranchCount: 4,
              coveredFunctionCount: 3,
              coveredLinePercent: 100,
              coveredBranchPercent: 100,
              coveredFunctionPercent: 100,
              functions: [
                { name: '', count: 1, line: 5 },
                { name: '', count: 1, line: 6 },
                { name: '', count: 1, line: 12 },
              ],
              branches: [
                { line: 1, count: 1 },
                { line: 5, count: 1 },
                { line: 6, count: 1 },
                { line: 12, count: 1 },
              ],
              lines: [
                { line: 1, count: 1 },
                { line: 2, count: 1 },
                { line: 3, count: 1 },
                { line: 4, count: 1 },
                { line: 5, count: 1 },
                { line: 6, count: 1 },
                { line: 7, count: 1 },
                { line: 8, count: 1 },
                { line: 9, count: 1 },
                { line: 10, count: 1 },
                { line: 11, count: 1 },
                { line: 12, count: 1 },
                { line: 13, count: 1 },
                { line: 14, count: 1 },
                { line: 15, count: 1 },
                { line: 16, count: 1 },
                { line: 17, count: 1 },
              ],
            },
          ],
          totals: {
            totalLineCount: 44,
            totalBranchCount: 13,
            totalFunctionCount: 7,
            coveredLineCount: 42,
            coveredBranchCount: 12,
            coveredFunctionCount: 7,
            coveredLinePercent: 95.45454545454545,
            coveredBranchPercent: 92.3076923076923,
            coveredFunctionPercent: 100,
          },
        },
      },
    },
  ])) {
    lines.push(line);
  }

  const expectedTimestampValue = lines
    .at(2)
    .split(' ')
    .filter(e => e.startsWith('timestamp'))
    .at(0)
    .split('=')
    .at(1);

  console.log(lines);

  const expectedLines = [
    '<?xml version="1.0" ?>\n',
    '<!DOCTYPE coverage SYSTEM "http://cobertura.sourceforge.net/xml/coverage-04.dtd">\n',
    `<coverage lines-valid="44" lines-covered="42" line-rate="0.9545" branches-valid="13" branches-covered="12" branch-rate="0.9231" timestamp=${expectedTimestampValue} complexity="0" version="0.1">\n` +
      '\t<sources>\n' +
      '\t\t<source>\n' +
      '/Users/bacebu4/dev/cobertura-test\n' +
      '\t\t</source>\n' +
      '\t</sources>\n' +
      '\t<packages>\n' +
      '\t\t<package name="cobertura-test.src.bar.qux" line-rate="1.0000" branch-rate="1.0000">\n' +
      '\t\t\t<classes>\n' +
      '\t\t\t\t<class name="qux.js" filename="src/bar/qux/qux.js" line-rate="1.0000" branch-rate="1.0000">\n' +
      '\t\t\t\t\t<methods>\n' +
      '\t\t\t\t\t\t<method name="qux" hits="1" signature="()V">\n' +
      '\t\t\t\t\t\t\t<lines>\n' +
      '\t\t\t\t\t\t\t\t<line number="1" hits="1"/>\n' +
      '\t\t\t\t\t\t\t</lines>\n' +
      '\t\t\t\t\t\t</method>\n' +
      '\t\t\t\t\t</methods>\n' +
      '\t\t\t\t\t<lines>\n' +
      '\t\t\t\t\t\t<line number="1" hits="1" branch="true" condition-coverage="100% (2/2)"/>\n' +
      '\t\t\t\t\t\t<line number="2" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="3" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t</lines>\n' +
      '\t\t\t\t</class>\n' +
      '\t\t\t\t<class name="qux.test.js" filename="src/bar/qux/qux.test.js" line-rate="1.0000" branch-rate="1.0000">\n' +
      '\t\t\t\t\t<methods>\n' +
      '\t\t\t\t\t\t<method name="(anonymous_0)" hits="1" signature="()V">\n' +
      '\t\t\t\t\t\t\t<lines>\n' +
      '\t\t\t\t\t\t\t\t<line number="5" hits="1"/>\n' +
      '\t\t\t\t\t\t\t</lines>\n' +
      '\t\t\t\t\t\t</method>\n' +
      '\t\t\t\t\t\t<method name="(anonymous_1)" hits="1" signature="()V">\n' +
      '\t\t\t\t\t\t\t<lines>\n' +
      '\t\t\t\t\t\t\t\t<line number="6" hits="1"/>\n' +
      '\t\t\t\t\t\t\t</lines>\n' +
      '\t\t\t\t\t\t</method>\n' +
      '\t\t\t\t\t</methods>\n' +
      '\t\t\t\t\t<lines>\n' +
      '\t\t\t\t\t\t<line number="1" hits="1" branch="true" condition-coverage="100% (1/1)"/>\n' +
      '\t\t\t\t\t\t<line number="2" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="3" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="4" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="5" hits="1" branch="true" condition-coverage="100% (1/1)"/>\n' +
      '\t\t\t\t\t\t<line number="6" hits="1" branch="true" condition-coverage="100% (1/1)"/>\n' +
      '\t\t\t\t\t\t<line number="7" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="8" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="9" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="10" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="11" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t</lines>\n' +
      '\t\t\t\t</class>\n' +
      '\t\t\t</classes>\n' +
      '\t\t</package>\n' +
      '\t\t<package name="cobertura-test" line-rate="0.8462" branch-rate="0.7500">\n' +
      '\t\t\t<classes>\n' +
      '\t\t\t\t<class name="foo.js" filename="foo.js" line-rate="0.8462" branch-rate="0.7500">\n' +
      '\t\t\t\t\t<methods>\n' +
      '\t\t\t\t\t\t<method name="foo" hits="2" signature="()V">\n' +
      '\t\t\t\t\t\t\t<lines>\n' +
      '\t\t\t\t\t\t\t\t<line number="1" hits="2"/>\n' +
      '\t\t\t\t\t\t\t</lines>\n' +
      '\t\t\t\t\t\t</method>\n' +
      '\t\t\t\t\t</methods>\n' +
      '\t\t\t\t\t<lines>\n' +
      '\t\t\t\t\t\t<line number="1" hits="1" branch="true" condition-coverage="100% (2/2)"/>\n' +
      '\t\t\t\t\t\t<line number="2" hits="2" branch="true" condition-coverage="0% (0/1)"/>\n' +
      '\t\t\t\t\t\t<line number="3" hits="0" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="4" hits="0" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="5" hits="2" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="6" hits="2" branch="true" condition-coverage="100% (1/1)"/>\n' +
      '\t\t\t\t\t\t<line number="7" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="8" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="9" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="10" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="11" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="12" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="13" hits="2" branch="false"/>\n' +
      '\t\t\t\t\t</lines>\n' +
      '\t\t\t\t</class>\n' +
      '\t\t\t</classes>\n' +
      '\t\t</package>\n' +
      '\t\t<package name="cobertura-test.src" line-rate="1.0000" branch-rate="1.0000">\n' +
      '\t\t\t<classes>\n' +
      '\t\t\t\t<class name="foo.test.js" filename="src/foo.test.js" line-rate="1.0000" branch-rate="1.0000">\n' +
      '\t\t\t\t\t<methods>\n' +
      '\t\t\t\t\t\t<method name="(anonymous_0)" hits="1" signature="()V">\n' +
      '\t\t\t\t\t\t\t<lines>\n' +
      '\t\t\t\t\t\t\t\t<line number="5" hits="1"/>\n' +
      '\t\t\t\t\t\t\t</lines>\n' +
      '\t\t\t\t\t\t</method>\n' +
      '\t\t\t\t\t\t<method name="(anonymous_1)" hits="1" signature="()V">\n' +
      '\t\t\t\t\t\t\t<lines>\n' +
      '\t\t\t\t\t\t\t\t<line number="6" hits="1"/>\n' +
      '\t\t\t\t\t\t\t</lines>\n' +
      '\t\t\t\t\t\t</method>\n' +
      '\t\t\t\t\t\t<method name="(anonymous_2)" hits="1" signature="()V">\n' +
      '\t\t\t\t\t\t\t<lines>\n' +
      '\t\t\t\t\t\t\t\t<line number="12" hits="1"/>\n' +
      '\t\t\t\t\t\t\t</lines>\n' +
      '\t\t\t\t\t\t</method>\n' +
      '\t\t\t\t\t</methods>\n' +
      '\t\t\t\t\t<lines>\n' +
      '\t\t\t\t\t\t<line number="1" hits="1" branch="true" condition-coverage="100% (1/1)"/>\n' +
      '\t\t\t\t\t\t<line number="2" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="3" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="4" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="5" hits="1" branch="true" condition-coverage="100% (1/1)"/>\n' +
      '\t\t\t\t\t\t<line number="6" hits="1" branch="true" condition-coverage="100% (1/1)"/>\n' +
      '\t\t\t\t\t\t<line number="7" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="8" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="9" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="10" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="11" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="12" hits="1" branch="true" condition-coverage="100% (1/1)"/>\n' +
      '\t\t\t\t\t\t<line number="13" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="14" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="15" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="16" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t\t<line number="17" hits="1" branch="false"/>\n' +
      '\t\t\t\t\t</lines>\n' +
      '\t\t\t\t</class>\n' +
      '\t\t\t</classes>\n' +
      '\t\t</package>\n' +
      '\t</packages>\n' +
      '</coverage>\n',
  ];

  assert.deepStrictEqual(lines, expectedLines);
});
