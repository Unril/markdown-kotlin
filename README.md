# Markdown Kotlin Code Block Support

Adds syntax highlighting for Kotlin fenced code blocks in Markdown files.

## Features

- Highlights ` ```kotlin ` and ` ```kt ` fenced code blocks in the Markdown editor
- Uses a TextMate injection grammar, the standard VS Code mechanism for embedded languages
- Maps embedded regions to language id `kotlin` so editor features (bracket matching, comments, snippets) work inside the block

| Dark theme | Light theme |
|---|---|
| ![Dark theme](https://raw.githubusercontent.com/unril/markdown-kotlin/main/img/dark_theme.png) | ![Light theme](https://raw.githubusercontent.com/unril/markdown-kotlin/main/img/light_theme.png) |

## Requirements

A Kotlin extension that provides the `source.kotlin` TextMate grammar must be installed. For example:

- [Kotlin Language (fwcd)](https://marketplace.visualstudio.com/items?itemName=fwcd.kotlin)

Without it, the fenced block will be recognized but not highlighted.

## Usage

Open any Markdown file containing a Kotlin fenced code block:

````markdown
```kotlin
fun main() {
    println("hello")
}
```
````

The code inside the fence will be tokenized using the Kotlin grammar.

To verify, run "Developer: Inspect Editor Tokens and Scopes" and click inside the block. You should see scopes from `source.kotlin` within `meta.embedded.block.kotlin`.

## How it works

The extension contributes a single injection grammar (`markdown.kotlin.codeblock`) injected into `text.html.markdown`. No commands, no activation logic, just a grammar file.

## License

MIT
