[![npm version](https://img.shields.io/npm/v/cobertura)](https://www.npmjs.com/package/cobertura)
![tests](https://github.com/bacebu4/cobertura/actions/workflows/test.yaml/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/bacebu4/cobertura/graph/badge.svg?token=JW6GTZWBSY)](https://codecov.io/gh/bacebu4/cobertura)

# Cobertura Reporter

A Cobertura reporter for `node:test`. Primarily was created in order to support GitLab's [Test coverage visualization](https://docs.gitlab.com/ee/ci/testing/test_coverage_visualization.html).

Also you can see the reporter in action in [this GitLab repo](https://gitlab.com/bacebu4/cobertura-test/-/merge_requests/1/diffs).

## Installation

```bash
npm install --save-dev cobertura
```

or

```bash
yarn add --dev cobertura
```

## Usage

Define your `test` script:

```bash
node --test \
  --experimental-test-coverage \
  --test-reporter=cobertura --test-reporter-destination=cobertura.xml \
  --test-reporter=spec --test-reporter-destination=stdout
```

Your `.gitlab-ci.yml` can look something like this:

```yml
stages:
  - test

test:
  stage: test
  image: node:21-alpine
  artifacts:
    when: always
    reports:
      coverage_report:
        coverage_format: cobertura
        path: ./cobertura.xml
  script:
    - node -v
    - npm run test
  coverage: '/all files[^|]*\|[^|]*\s+([\d\.]+)/'
```

## Acknowledgements

This test reporter is heavily inspired by test reporters of [this GitHub repo](https://github.com/MoLow/reporters) and some code parts might be directly copied from there.

## Example

Source file:

```js
export function fooOne(x) {
  if (x === 1) {
    return x + 1;
  }

  if (x === 2) {
    return x + 1;
  }

  const result = x + 1;

  return result + 1;
}
```

Test file:

```js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { fooOne } from './foo.js';

describe('fooTest', () => {
  it('returns result', () => {
    const result = fooOne(12);

    assert.strictEqual(result, 14);
  });

  it('handles when x equals to 2', () => {
    const result = fooOne(2);

    assert.strictEqual(result, 3);
  });
});
```

Output:

```xml
<?xml version="1.0" ?>
<!DOCTYPE coverage SYSTEM "http://cobertura.sourceforge.net/xml/coverage-04.dtd">
<coverage lines-valid="30" lines-covered="28" line-rate="0.9333" branches-valid="8" branches-covered="7" branch-rate="0.8750" timestamp="1700416562185" complexity="0" version="0.1">
	<sources >
		<source >
/Users/bacebu4/dev/cobertura-test
		</source>
	</sources>
	<packages >
		<package name="cobertura-test.src" line-rate="0.9333" branch-rate="0.8750">
			<class name="foo.js" filename="src/foo.js" line-rate="0.8462" branch-rate="0.7500">
				<methods >
					<method name="fooOne" hits="2" signature="()V">
						<lines >
							<line number="1" hits="2"/>
						</lines>
					</method>
				</methods>
				<lines >
					<line number="1" hits="1" branch="true" condition-coverage="100% (2/2)"/>
					<line number="2" hits="2" branch="true" condition-coverage="0% (0/1)"/>
					<line number="3" hits="0" branch="false"/>
					<line number="4" hits="0" branch="false"/>
					<line number="5" hits="2" branch="false"/>
					<line number="6" hits="2" branch="true" condition-coverage="100% (1/1)"/>
					<line number="7" hits="1" branch="false"/>
					<line number="8" hits="1" branch="false"/>
					<line number="9" hits="1" branch="false"/>
					<line number="10" hits="1" branch="false"/>
					<line number="11" hits="1" branch="false"/>
					<line number="12" hits="1" branch="false"/>
					<line number="13" hits="2" branch="false"/>
				</lines>
			</class>
			<class name="foo.test.js" filename="src/foo.test.js" line-rate="1.0000" branch-rate="1.0000">
				<methods >
					<method name="(anonymous_0)" hits="1" signature="()V">
						<lines >
							<line number="5" hits="1"/>
						</lines>
					</method>
					<method name="(anonymous_1)" hits="1" signature="()V">
						<lines >
							<line number="6" hits="1"/>
						</lines>
					</method>
					<method name="(anonymous_2)" hits="1" signature="()V">
						<lines >
							<line number="12" hits="1"/>
						</lines>
					</method>
				</methods>
				<lines >
					<line number="1" hits="1" branch="true" condition-coverage="100% (1/1)"/>
					<line number="2" hits="1" branch="false"/>
					<line number="3" hits="1" branch="false"/>
					<line number="4" hits="1" branch="false"/>
					<line number="5" hits="1" branch="true" condition-coverage="100% (1/1)"/>
					<line number="6" hits="1" branch="true" condition-coverage="100% (1/1)"/>
					<line number="7" hits="1" branch="false"/>
					<line number="8" hits="1" branch="false"/>
					<line number="9" hits="1" branch="false"/>
					<line number="10" hits="1" branch="false"/>
					<line number="11" hits="1" branch="false"/>
					<line number="12" hits="1" branch="true" condition-coverage="100% (1/1)"/>
					<line number="13" hits="1" branch="false"/>
					<line number="14" hits="1" branch="false"/>
					<line number="15" hits="1" branch="false"/>
					<line number="16" hits="1" branch="false"/>
					<line number="17" hits="1" branch="false"/>
				</lines>
			</class>
		</package>
	</packages>
</coverage>

```
