# Markdown Kotlin Code Block Support

![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/nickofedev.markdown-kotlin)
![Installs](https://img.shields.io/visual-studio-marketplace/i/nickofedev.markdown-kotlin)

Kotlin syntax highlighting for fenced code blocks inside Markdown.

Supports ` ```kotlin ` and ` ```kt ` info strings.

Dark theme:

<img src="https://github.com/Unril/markdown-kotlin/blob/master/img/dark_theme.png?raw=true" width="700" alt="Dark theme">

Light theme:

<img src="https://github.com/Unril/markdown-kotlin/blob/master/img/light_theme.png?raw=true" width="700" alt="Light theme">

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

Install from the [VS Code Marketplace][marketplace].

Or search for "Markdown Kotlin Code Block Support" in the Extensions view.

## Requirements

A Kotlin extension that provides the `source.kotlin` TextMate grammar must be installed, for example [Kotlin Language (fwcd)][kotlin-ext].

Without it the fenced block will be recognized but not highlighted.

## Extension Settings

This extension has no settings.

## Known Issues

None yet. Please report bugs in the [issue tracker][issues].

## Release Notes

### 0.0.1

Initial release.

## Contributing

Pull requests are welcome. Repository: [github.com/Unril/markdown-kotlin][repo]

## License

MIT

[marketplace]: https://marketplace.visualstudio.com/items?itemName=nickofedev.markdown-kotlin
[kotlin-ext]: https://marketplace.visualstudio.com/items?itemName=fwcd.kotlin
[issues]: https://github.com/Unril/markdown-kotlin/issues
[repo]: https://github.com/Unril/markdown-kotlin
