# Markdown Kotlin Code Blocks

![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/NikolaiFedorov.markdown-kotlin)
![Installs](https://img.shields.io/visual-studio-marketplace/i/NikolaiFedorov.markdown-kotlin)

Kotlin syntax highlighting for fenced code blocks inside Markdown.

Supports ` ```kotlin ` and ` ```kt ` info strings.

Dark theme:

<img src="https://raw.githubusercontent.com/Unril/markdown-kotlin/master/img/dark_theme.png" alt="Dark theme">

Light theme:

<img src="https://raw.githubusercontent.com/Unril/markdown-kotlin/master/img/light_theme.png" alt="Light theme">

## Features

- Kotlin highlighting in Markdown code fences
- Works with the standard Markdown editor
- Zero configuration
- Bracket matching, comments, and snippets work inside the block

## Example

````markdown
```kotlin
fun main() {
    println("Hello Kotlin")
}
```
````

## Installation

Install from the [VS Code Marketplace][marketplace] or [Open VSX][openvsx].

Or search for "Markdown Kotlin Code Blocks" in the Extensions view.

## Requirements

A Kotlin extension that provides the `source.kotlin` TextMate grammar must be installed, for example [Kotlin Language (fwcd)][kotlin-ext] or [Kotlin LSP][kotlin-lsp].

Without it the fenced block will be recognized but not highlighted.

## Extension Settings

This extension has no settings.

## Known Issues

None yet. Please report bugs in the [issue tracker][issues].

## Release Notes

### 0.0.3

- Marketplace metadata improvements (keywords, description, categories)
- Open VSX and Kotlin LSP links

### 0.0.2

- Extension icon and gallery banner
- README rewritten for Marketplace

### 0.0.1

Initial release.

## Contributing

Pull requests are welcome. Repository: [github.com/Unril/markdown-kotlin][repo]

## License

MIT

[marketplace]: https://marketplace.visualstudio.com/items?itemName=NikolaiFedorov.markdown-kotlin
[openvsx]: https://open-vsx.org/extension/NikolaiFedorov/markdown-kotlin
[kotlin-ext]: https://marketplace.visualstudio.com/items?itemName=fwcd.kotlin
[kotlin-lsp]: https://github.com/Kotlin/kotlin-lsp/
[issues]: https://github.com/Unril/markdown-kotlin/issues
[repo]: https://github.com/Unril/markdown-kotlin
