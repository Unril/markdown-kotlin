# Build, Run, and Test

## Build

```bash
npm install
npm run compile
```

## Run

1. Open this folder in VS Code
2. Press F5 to launch the Extension Development Host
3. Open this file (`DEMO.md`) in the new window
4. Verify Kotlin blocks below are syntax-highlighted

## Test

Run the unit tests (downloads VS Code, launches Extension Development Host, runs Mocha):

```bash
npm test
```

Or compile and test separately:

```bash
npm run compile
npx vscode-test
```

Tests cover:

- Grammar JSON structure and scope names
- Begin/end regex matching for ` ```kotlin `, ` ```kt `, `~~~kotlin`, case variants
- Negative cases (rejects `javascript`, `kotlinscript`, etc.)
- `package.json` grammar contribution consistency

To debug tests, use the "Extension Tests" launch configuration in

Install the CLI:

```bash
npm install -g @vscode/vsce
```

Package into a `.vsix` file:

```bash
vsce package
```

Install the `.vsix` locally:

```bash
code --install-extension markdown-kotlin-0.0.1.vsix
```

Login to a publisher (requires a [Personal Access Token][pat]):

```bash
vsce login <publisher-id>
```

Publish to the Marketplace:

```bash
vsce publish
```

Bump version and publish in one step:

```bash
vsce publish minor
```

Publish a pre-release version:

```bash
vsce publish --pre-release
```

Unpublish:

```bash
vsce unpublish <publisher-id>.markdown-kotlin
```

[pat]: https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token

## Verify scopes

Run "Developer: Inspect Editor Tokens and Scopes" and click inside a code block. You should see `source.kotlin` within `meta.embedded.block.kotlin`.

## Test blocks

### Hello world

```kotlin
fun main() {
    println("Hello, world!")
}
```

### Variables and types

```kotlin
val name: String = "Kiro"
var count = 0
val pi = 3.14159
val isReady: Boolean = true
```

### Data class and function

```kotlin
data class User(val id: Int, val name: String, val email: String)

fun greet(user: User): String {
    return "Hello, ${user.name}!"
}

fun main() {
    val user = User(1, "Alice", "alice@example.com")
    println(greet(user))
}
```

### When expression

```kotlin
fun describe(obj: Any): String = when (obj) {
    1 -> "One"
    "Hello" -> "Greeting"
    is Long -> "Long number"
    !is String -> "Not a string"
    else -> "Unknown"
}
```

### Coroutines

```kotlin
import kotlinx.coroutines.*

suspend fun fetchData(): String {
    delay(1000)
    return "result"
}

fun main() = runBlocking {
    val deferred = async { fetchData() }
    println("Waiting...")
    println(deferred.await())
}
```

### Extension function and lambda

```kotlin
fun String.isPalindrome(): Boolean {
    val cleaned = this.lowercase().filter { it.isLetterOrDigit() }
    return cleaned == cleaned.reversed()
}

fun main() {
    val words = listOf("racecar", "hello", "level", "world")
    val palindromes = words.filter { it.isPalindrome() }
    println(palindromes)
}
```

### kt info string

```kt
val x = 42
val y = x * 2
println("y = $y")
```

### Screenshot block

Example of kotlin code block:

```kotlin
package com.example.app

import kotlinx.coroutines.*

data class User(val id: Int, val name: String, val role: Role = Role.VIEWER)

enum class Role { ADMIN, EDITOR, VIEWER }

sealed class Result<out T> {
    data class Success<T>(val item: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
}

fun <T : Comparable<T>> List<T>.secondLargest(): T? =
    distinct().sortedDescending().getOrNull(1)

suspend fun findUser(users: List<User>, id: Int): Result<User> {
    delay(100)
    return users.find { it.id == id }
        ?.let { Result.Success(it) }
        ?: Result.Error("User $id not found")
}

suspend fun main() = coroutineScope {
    val users = listOf(User(1, "Alice", Role.ADMIN), User(2, "Bob"))

    val jobs = users.map { u -> async { findUser(users, u.id) } }
    jobs.awaitAll().forEach { result ->
        when (result) {
            is Result.Success -> println("${result.item.name} [${result.item.role}]")
            is Result.Error -> println(result.message)
        }
    }

    val (id, name, role) = (findUser(users, 1) as Result.Success).item
    println("Destructured: #$id $name [$role]")
}
```
