import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

interface GrammarRule {
	name?: string;
	begin?: string;
	end?: string;
	while?: string;
	contentName?: string;
	patterns?: GrammarRule[];
	include?: string;
	beginCaptures?: Record<string, { name: string }>;
	endCaptures?: Record<string, { name: string }>;
}

interface GrammarFile {
	scopeName: string;
	injectionSelector: string;
	patterns: Array<{ include: string }>;
	repository: Record<string, GrammarRule>;
}

/**
 * Strips TextMate-specific anchors (\G, ^|\G, etc.) from a regex pattern
 * so it can be used with JavaScript's RegExp engine.
 * TextMate's \G means "end of previous match" which has no JS equivalent.
 */
function stripTextMateAnchors(pattern: string): string {
	return pattern.replace(/\(\^\|\\G\)/g, '').replace(/\(?\^?\|?\\G\)?/g, '');
}

let grammar: GrammarFile;

suiteSetup(() => {
	const grammarPath = path.resolve(__dirname, '../../syntaxes/kotlin-codeblock.json');
	const raw = fs.readFileSync(grammarPath, 'utf8');
	grammar = JSON.parse(raw) as GrammarFile;
});

function makeBeginRegex(): RegExp {
	const rule = grammar.repository['kotlin-fenced-code-block'];
	assert.ok(rule.begin, 'Grammar rule must have a begin pattern');
	const pattern = stripTextMateAnchors(rule.begin);
	return new RegExp(pattern + '$', 'im');
}

function makeEndRegex(fence: string): RegExp {
	const rule = grammar.repository['kotlin-fenced-code-block'];
	assert.ok(rule.end, 'Grammar rule must have an end pattern');
	// \2 is a TextMate backreference for indentation matching -- dropped since JS RegExp
	// doesn't support it in this context. \3 is replaced with the actual fence string.
	const pattern = stripTextMateAnchors(rule.end)
		.replace('\\2', '')
		.replace('\\3', fence);
	return new RegExp(pattern + '$', 'm');
}


suite('Grammar JSON structure', () => {
	test('has correct scopeName', () => {
		assert.strictEqual(grammar.scopeName, 'markdown.kotlin.codeblock');
	});

	test('has injection selector targeting markdown', () => {
		assert.strictEqual(grammar.injectionSelector, 'L:text.html.markdown');
	});

	test('top-level patterns include the repository rule', () => {
		assert.strictEqual(grammar.patterns.length, 1);
		assert.strictEqual(grammar.patterns[0].include, '#kotlin-fenced-code-block');
	});

	test('repository contains kotlin-fenced-code-block rule', () => {
		assert.ok(grammar.repository['kotlin-fenced-code-block']);
	});

	test('fenced block rule has correct outer name', () => {
		const rule = grammar.repository['kotlin-fenced-code-block'];
		assert.strictEqual(rule.name, 'markup.fenced_code.block.markdown');
	});

	test('inner pattern has meta.embedded.block.kotlin contentName', () => {
		const rule = grammar.repository['kotlin-fenced-code-block'];
		const inner = rule.patterns?.[0];
		assert.strictEqual(inner?.contentName, 'meta.embedded.block.kotlin');
	});

	test('inner pattern includes source.kotlin', () => {
		const rule = grammar.repository['kotlin-fenced-code-block'];
		const inner = rule.patterns?.[0];
		const kotlinInclude = inner?.patterns?.find(p => p.include === 'source.kotlin');
		assert.ok(kotlinInclude, 'Expected include of source.kotlin');
	});

	test('beginCaptures assign punctuation and language scopes', () => {
		const rule = grammar.repository['kotlin-fenced-code-block'];
		assert.strictEqual(rule.beginCaptures?.['3']?.name, 'punctuation.definition.markdown');
		assert.strictEqual(rule.beginCaptures?.['4']?.name, 'fenced_code.block.language.markdown');
	});

	test('endCaptures assign punctuation scope', () => {
		const rule = grammar.repository['kotlin-fenced-code-block'];
		assert.strictEqual(rule.endCaptures?.['3']?.name, 'punctuation.definition.markdown');
	});
});


suite('Begin regex matches', () => {
	let beginRegex: RegExp;

	setup(() => {
		beginRegex = makeBeginRegex();
	});

	test('matches ```kotlin', () => {
		assert.ok(beginRegex.test('```kotlin'));
	});

	test('matches ```kt', () => {
		assert.ok(beginRegex.test('```kt'));
	});

	test('matches ~~~kotlin', () => {
		assert.ok(beginRegex.test('~~~kotlin'));
	});

	test('matches ~~~kt', () => {
		assert.ok(beginRegex.test('~~~kt'));
	});

	test('matches ```Kotlin (case-insensitive)', () => {
		assert.ok(beginRegex.test('```Kotlin'));
	});

	test('matches ```KOTLIN (case-insensitive)', () => {
		assert.ok(beginRegex.test('```KOTLIN'));
	});

	test('matches ```KT (case-insensitive)', () => {
		assert.ok(beginRegex.test('```KT'));
	});

	test('matches with leading whitespace', () => {
		assert.ok(beginRegex.test('  ```kotlin'));
	});

	test('matches four or more backticks', () => {
		assert.ok(beginRegex.test('````kotlin'));
	});

	test('matches four or more tildes', () => {
		assert.ok(beginRegex.test('~~~~kotlin'));
	});

	test('matches kotlin with attributes', () => {
		assert.ok(beginRegex.test('```kotlin {.line-numbers}'));
	});

	test('matches kotlin with colon attribute', () => {
		assert.ok(beginRegex.test('```kotlin:title'));
	});

	test('does not match ```javascript', () => {
		assert.ok(!beginRegex.test('```javascript'));
	});

	test('does not match ```python', () => {
		assert.ok(!beginRegex.test('```python'));
	});

	test('does not match ```k (too short)', () => {
		assert.ok(!beginRegex.test('```k'));
	});

	test('does not match ```kotlinscript (no word boundary)', () => {
		assert.ok(!beginRegex.test('```kotlinscript'));
	});
});


suite('End regex matches (backtick fence)', () => {
	let endRegex: RegExp;

	setup(() => {
		endRegex = makeEndRegex('```');
	});

	test('matches closing ``` on its own line', () => {
		assert.ok(endRegex.test('```'));
	});

	test('matches closing ``` with trailing whitespace', () => {
		assert.ok(endRegex.test('```  '));
	});

	test('does not match ``` with trailing text', () => {
		assert.ok(!endRegex.test('``` some text'));
	});

	test('does not match ~~~ when opened with backticks', () => {
		assert.ok(!endRegex.test('~~~'));
	});
});

suite('End regex matches (tilde fence)', () => {
	let endRegex: RegExp;

	setup(() => {
		endRegex = makeEndRegex('~~~');
	});

	test('matches closing ~~~ on its own line', () => {
		assert.ok(endRegex.test('~~~'));
	});

	test('matches closing ~~~ with trailing whitespace', () => {
		assert.ok(endRegex.test('~~~  '));
	});

	test('does not match ~~~ with trailing text', () => {
		assert.ok(!endRegex.test('~~~ some text'));
	});

	test('does not match ``` when opened with tildes', () => {
		assert.ok(!endRegex.test('```'));
	});
});


suite('package.json grammar contribution', () => {
	interface PackageJson {
		contributes: {
			grammars: Array<{
				scopeName: string;
				path: string;
				injectTo: string[];
				embeddedLanguages: Record<string, string>;
			}>;
		};
	}

	let pkg: PackageJson;

	suiteSetup(() => {
		const pkgPath = path.resolve(__dirname, '../../package.json');
		const raw = fs.readFileSync(pkgPath, 'utf8');
		pkg = JSON.parse(raw) as PackageJson;
	});

	test('contributes exactly one grammar', () => {
		assert.strictEqual(pkg.contributes.grammars.length, 1);
	});

	test('grammar scopeName matches grammar file', () => {
		assert.strictEqual(pkg.contributes.grammars[0].scopeName, grammar.scopeName);
	});

	test('grammar path points to correct file', () => {
		assert.strictEqual(pkg.contributes.grammars[0].path, './syntaxes/kotlin-codeblock.json');
	});

	test('grammar injects into markdown', () => {
		assert.deepStrictEqual(pkg.contributes.grammars[0].injectTo, ['text.html.markdown']);
	});

	test('embeddedLanguages maps kotlin scope to kotlin language', () => {
		assert.strictEqual(
			pkg.contributes.grammars[0].embeddedLanguages['meta.embedded.block.kotlin'],
			'kotlin'
		);
	});
});
