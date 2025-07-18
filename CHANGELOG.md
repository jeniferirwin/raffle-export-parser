# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-18

### Added
- Initial release of RaffleManager Lua Parser
- Support for parsing Lua tables to JavaScript objects/arrays
- Handling of all basic Lua data types (strings, numbers, booleans, nil)
- Support for nested structures
- Comment parsing (lines starting with `--`)
- Escape sequence handling in strings
- Comprehensive test suite
- Example usage file
- Full documentation

### Features
- Parse Lua variable assignments
- Convert Lua tables to JavaScript objects or arrays based on structure
- Handle both numeric and string keys
- Support for mixed table structures with explicit indices
- Error handling with descriptive messages
- Support for single and double quoted strings
