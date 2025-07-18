# RaffleManager Lua Parser

A specialized parser for converting RaffleManager Lua saved variables to JSON objects. This parser is designed specifically for the format used by the RaffleManager addon.

## Installation

```bash
npm install raffle-export-parser
```

## Usage

```javascript
const { parseLuaToJson, RaffleLuaParser } = require('raffle-export-parser');

// Simple usage
const luaString = `RaffleManagerDB = {
  ["version"] = "1.0",
  ["raffles"] = {
    {
      ["name"] = "Epic Mount",
      ["entries"] = 15,
      ["winner"] = "PlayerName"
    }
  }
}`;

const result = parseLuaToJson(luaString);
console.log(JSON.stringify(result, null, 2));

// Advanced usage with custom parser instance
const parser = new RaffleLuaParser();
const parsed = parser.parse(luaString);
```

## Features

- Parses Lua tables to JavaScript objects/arrays
- Handles nested structures
- Supports all Lua data types:
  - Tables (converted to objects or arrays)
  - Strings (single and double quoted)
  - Numbers (integers and floats)
  - Booleans (`true`/`false`)
  - Nil (converted to `null`)
- Proper escape sequence handling
- Comment support (lines starting with `--`)

## API

### `parseLuaToJson(luaString)`

Parses a Lua string and returns a JSON object.

**Parameters:**
- `luaString` (string): The Lua string to parse

**Returns:**
- Object: The parsed JSON object

**Example:**
```javascript
const result = parseLuaToJson('myVar = { "hello", "world" }');
// Returns: { myVar: ["hello", "world"] }
```

### `RaffleLuaParser`

A class for parsing Lua strings with more control over the parsing process.

**Methods:**
- `parse(luaString)`: Parse a Lua string and return a JSON object

## Supported Lua Syntax

The parser supports the following Lua syntax patterns:

```lua
-- Variable assignment
variableName = value

-- Tables with numeric indices (converted to arrays)
myArray = { "item1", "item2", "item3" }

-- Tables with string keys (converted to objects)
myObject = {
  key1 = "value1",
  key2 = "value2"
}

-- Mixed tables with explicit indices
myTable = {
  [1] = "first",
  ["key"] = "value",
  [3] = "third"
}

-- Nested structures
nested = {
  level1 = {
    level2 = {
      value = "deep"
    }
  }
}

-- Comments are ignored
-- This is a comment
myVar = "value" -- This is also a comment
```

## Error Handling

The parser will throw descriptive errors for invalid syntax:

```javascript
try {
  const result = parseLuaToJson('invalid = {');
} catch (error) {
  console.error(error.message); // "Expected '}' at position X"
}
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Issues

If you encounter any issues or have suggestions, please file them at the [GitHub Issues](https://github.com/yourusername/raffle-export-parser/issues) page.
