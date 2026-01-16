'use strict';
const path = require('path');

function escapeAttribute(s = '') {
  return s.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/"/g, '&quot;')
          .replace(/\n/g, '');
}

function escapeContent(s = '') {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function treeToXML(tree) {
  if (typeof tree === 'string') {
    return `${escapeContent(tree)}\n`;
  }

  const { tag, attrs = {}, nesting, children = [] } = tree;
  const indent = '\t'.repeat(nesting + 1);

  const attrsString = Object.entries(attrs)
    .map(([key, value]) => `${key}="${escapeAttribute(String(value))}"`)
    .join(' ');

  if (!children.length) {
    return `${indent}<${tag}${attrsString && ` ${attrsString}`}/>\n`;
  }

  const childrenString = children.map(treeToXML).join('');

  return `${indent}<${tag}${attrsString && ` ${attrsString}`}>\n${childrenString}${indent}</${tag}>\n`;
}

module.exports = async function* coberturaReporter(source) {
  yield '<?xml version="1.0" ?>\n';
  yield '<!DOCTYPE coverage SYSTEM "http://cobertura.sourceforge.net/xml/coverage-04.dtd">\n';

  for await (const event of source) {
    switch (event.type) {
      case 'test:coverage': {
        const { totals, workingDirectory, files } = event.data.summary;
        const rootName = path.parse(workingDirectory).name;

        // individual test files becomes "classes" in terminology of cobertura
        const classes = files.map(f => {
          const relativePath = path.relative(workingDirectory, f.path);
          const dirname = path.dirname(relativePath);
          const withReplacesSep = dirname.replaceAll(path.sep, '.');

          const branchesByLine = f.branches.reduce((acc, b) => {
            if (!acc[b.line]) {
              acc[b.line] = [];
            }

            acc[b.line].push(b);

            return acc;
          }, {});

          return {
            filename: relativePath,
            packageName: dirname === '.' ? rootName : `${rootName}.${withReplacesSep}`,
            className: path.basename(f.path),
            classLineRate: (f.coveredLinePercent / 100).toFixed(4),
            classTotalLineCount: f.totalLineCount,
            classCoveredLineCount: f.coveredLineCount,
            classBranchRate: (f.coveredBranchPercent / 100).toFixed(4),
            classTotalBranchCount: f.totalBranchCount,
            classCoveredBranchCount: f.coveredBranchCount,
            methods: f.functions.map((fn, i) => ({
              name: fn.name || `(anonymous_${i})`,
              hits: fn.count,
              signature: '()V',
              number: fn.line,
            })),
            lines: f.lines.map(l => {
              const branches = branchesByLine[l.line] || [];
              const total = branches.length;
              const covered = branches.filter(b => b.count !== 0).length;

              const conditionCoverage = branches.length
                ? `${(covered / total) * 100}% (${covered}/${total})`
                : undefined;

              return {
                branch: branches.length !== 0,
                number: l.line,
                hits: l.count,
                conditionCoverage,
              };
            }),
          };
        });

        // folders becomes packages where children are direct tests within that folder
        const packages = classes.reduce((acc, c) => {
          if (!acc[c.packageName]) {
            acc[c.packageName] = {
              children: [],
              packageTotalLineCount: 0,
              packageCoveredLineCount: 0,
              packageTotalBranchCount: 0,
              packageCoveredBranchCount: 0,
            };
          }

          acc[c.packageName].children.push(c);

          acc[c.packageName].packageTotalLineCount += c.classTotalLineCount;
          acc[c.packageName].packageCoveredLineCount += c.classCoveredLineCount;
          acc[c.packageName].packageTotalBranchCount += c.classTotalBranchCount;
          acc[c.packageName].packageCoveredBranchCount += c.classCoveredBranchCount;

          return acc;
        }, {});

        const packageTree = {
          tag: 'packages',
          nesting: 0,
          children: Object.entries(packages).map(({ 0: key, 1: value }) => ({
            tag: 'package',
            attrs: {
              name: key,
              'line-rate': (value.packageCoveredLineCount / value.packageTotalLineCount).toFixed(4),
              'branch-rate': (
                value.packageCoveredBranchCount / value.packageTotalBranchCount
              ).toFixed(4),
            },
            nesting: 1,
            children: [
              {
                tag: 'classes',
                nesting: 2,
                children: value.children.map(c => ({
                  tag: 'class',
                  attrs: {
                    name: c.className,
                    filename: c.filename,
                    'line-rate': c.classLineRate,
                    'branch-rate': c.classBranchRate,
                  },
                  nesting: 3,
                  children: [
                    {
                      tag: 'methods',
                      nesting: 4,
                      children: c.methods.map(m => ({
                        tag: 'method',
                        attrs: {
                          name: m.name,
                          hits: m.hits,
                          signature: m.signature,
                        },
                        nesting: 5,
                        children: [
                          {
                            tag: 'lines',
                            nesting: 6,
                            children: [
                              {
                                tag: 'line',
                                attrs: {
                                  number: m.number,
                                  hits: m.hits,
                                },
                                nesting: 7,
                              },
                            ],
                          },
                        ],
                      })),
                    },
                    {
                      tag: 'lines',
                      nesting: 4,
                      children: c.lines.map(l => {
                        const attrs = {
                          number: l.number,
                          hits: l.hits,
                          branch: l.branch,
                        };

                        if (l.branch) {
                          attrs['condition-coverage'] = l.conditionCoverage;
                        }

                        return { tag: 'line', nesting: 5, attrs };
                      }),
                    },
                  ],
                })),
              },
            ],
          })),
        };

        const result = {
          tag: 'coverage',
          attrs: {
            'lines-valid': totals.totalLineCount,
            'lines-covered': totals.coveredLineCount,
            'line-rate': (totals.coveredLineCount / totals.totalLineCount).toFixed(4),
            'branches-valid': totals.totalBranchCount,
            'branches-covered': totals.coveredBranchCount,
            'branch-rate': (totals.coveredBranchCount / totals.totalBranchCount).toFixed(4),
            timestamp: new Date().getTime(),
            complexity: '0',
            version: '0.1',
          },
          nesting: -1,
          children: [
            {
              tag: 'sources',
              children: [
                {
                  tag: 'source',
                  children: [workingDirectory],
                  nesting: 1,
                },
              ],
              nesting: 0,
            },
            packageTree,
          ],
        };

        yield treeToXML(result);

        break;
      }
      default:
        break;
    }
  }
};
