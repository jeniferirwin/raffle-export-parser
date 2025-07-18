/**
 * RaffleManager Lua Parser
 * 
 * A specialized parser for converting RaffleManager Lua saved variables to JSON objects.
 * This parser is designed specifically for the format used by the RaffleManager addon.
 */

class RaffleLuaParser {
  constructor() {
    this.position = 0;
    this.input = '';
  }

  /**
   * Parse a Lua string and return a JSON object
   * @param {string} luaString - The Lua string to parse
   * @returns {Object} - The parsed JSON object
   */
  parse(luaString) {
    this.input = luaString.trim();
    this.position = 0;
    
    // Skip any leading whitespace
    this.skipWhitespace();
    
    // Look for the main variable assignment
    const result = this.parseAssignment();
    
    return result;
  }

  /**
   * Skip whitespace and comments
   */
  skipWhitespace() {
    while (this.position < this.input.length) {
      const char = this.input[this.position];
      if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
        this.position++;
      } else if (char === '-' && this.input[this.position + 1] === '-') {
        // Skip comment line
        while (this.position < this.input.length && this.input[this.position] !== '\n') {
          this.position++;
        }
      } else {
        break;
      }
    }
  }

  /**
   * Parse a variable assignment
   */
  parseAssignment() {
    this.skipWhitespace();
    
    // Read the variable name
    const varName = this.readIdentifier();
    
    this.skipWhitespace();
    
    // Expect '='
    if (this.input[this.position] !== '=') {
      throw new Error(`Expected '=' at position ${this.position}`);
    }
    this.position++;
    
    this.skipWhitespace();
    
    // Parse the value
    const value = this.parseValue();
    
    return { [varName]: value };
  }

  /**
   * Read an identifier (variable name)
   */
  readIdentifier() {
    const start = this.position;
    while (this.position < this.input.length) {
      const char = this.input[this.position];
      if (/[a-zA-Z0-9_$]/.test(char)) {
        this.position++;
      } else {
        break;
      }
    }
    return this.input.slice(start, this.position);
  }

  /**
   * Parse a value (table, string, number, boolean, nil)
   */
  parseValue() {
    this.skipWhitespace();
    
    const char = this.input[this.position];
    
    if (char === '{') {
      return this.parseTable();
    } else if (char === '"') {
      return this.parseString();
    } else if (char === "'") {
      return this.parseSingleQuotedString();
    } else if (/[0-9-]/.test(char)) {
      return this.parseNumber();
    } else if (this.input.substr(this.position, 4) === 'true') {
      this.position += 4;
      return true;
    } else if (this.input.substr(this.position, 5) === 'false') {
      this.position += 5;
      return false;
    } else if (this.input.substr(this.position, 3) === 'nil') {
      this.position += 3;
      return null;
    } else {
      throw new Error(`Unexpected character '${char}' at position ${this.position}`);
    }
  }

  /**
   * Parse a Lua table
   */
  parseTable() {
    this.position++; // Skip '{'
    this.skipWhitespace();
    
    const result = {};
    let isArray = true;
    let arrayIndex = 1;
    
    while (this.position < this.input.length && this.input[this.position] !== '}') {
      this.skipWhitespace();
      
      if (this.input[this.position] === '}') {
        break;
      }
      
      let key;
      let value;
      
      // Check if it's an array-style entry [index] = value
      if (this.input[this.position] === '[') {
        this.position++; // Skip '['
        this.skipWhitespace();
        
        // Parse the key
        if (this.input[this.position] === '"' || this.input[this.position] === "'") {
          key = this.parseString();
        } else {
          key = this.parseNumber();
        }
        
        this.skipWhitespace();
        
        // Expect ']'
        if (this.input[this.position] !== ']') {
          throw new Error(`Expected ']' at position ${this.position}`);
        }
        this.position++;
        
        this.skipWhitespace();
        
        // Expect '='
        if (this.input[this.position] !== '=') {
          throw new Error(`Expected '=' at position ${this.position}`);
        }
        this.position++;
        
        this.skipWhitespace();
        
        // Parse the value
        value = this.parseValue();
        
        // If key is not a sequential integer, it's not an array
        if (typeof key !== 'number' || key !== arrayIndex) {
          isArray = false;
        }
        arrayIndex++;
        
      } else {
        // Regular key-value pair or positional value
        const savedPosition = this.position;
        
        try {
          // Try to parse as key = value
          key = this.readIdentifier();
          this.skipWhitespace();
          
          if (this.input[this.position] === '=') {
            this.position++; // Skip '='
            this.skipWhitespace();
            value = this.parseValue();
            isArray = false;
          } else {
            // It's a positional value, treat as array element
            this.position = savedPosition;
            value = this.parseValue();
            key = arrayIndex;
            arrayIndex++;
          }
        } catch (e) {
          // If parsing as identifier fails, try as value
          this.position = savedPosition;
          value = this.parseValue();
          key = arrayIndex;
          arrayIndex++;
        }
      }
      
      result[key] = value;
      
      this.skipWhitespace();
      
      // Check for comma
      if (this.input[this.position] === ',') {
        this.position++;
        this.skipWhitespace();
      }
    }
    
    if (this.input[this.position] === '}') {
      this.position++; // Skip '}'
    } else {
      throw new Error(`Expected '}' at position ${this.position}`);
    }
    
    // Convert to array if appropriate
    if (isArray && Object.keys(result).length > 0) {
      const arr = [];
      for (let i = 1; i <= Object.keys(result).length; i++) {
        if (result[i] !== undefined) {
          arr.push(result[i]);
        }
      }
      return arr;
    }
    
    return result;
  }

  /**
   * Parse a double-quoted string
   */
  parseString() {
    this.position++; // Skip opening quote
    const start = this.position;
    let result = '';
    
    while (this.position < this.input.length && this.input[this.position] !== '"') {
      if (this.input[this.position] === '\\') {
        this.position++; // Skip backslash
        if (this.position < this.input.length) {
          const escaped = this.input[this.position];
          switch (escaped) {
            case 'n':
              result += '\n';
              break;
            case 'r':
              result += '\r';
              break;
            case 't':
              result += '\t';
              break;
            case '\\':
              result += '\\';
              break;
            case '"':
              result += '"';
              break;
            default:
              result += escaped;
          }
          this.position++;
        }
      } else {
        result += this.input[this.position];
        this.position++;
      }
    }
    
    if (this.input[this.position] === '"') {
      this.position++; // Skip closing quote
    } else {
      throw new Error(`Unterminated string at position ${this.position}`);
    }
    
    return result;
  }

  /**
   * Parse a single-quoted string
   */
  parseSingleQuotedString() {
    this.position++; // Skip opening quote
    const start = this.position;
    let result = '';
    
    while (this.position < this.input.length && this.input[this.position] !== "'") {
      if (this.input[this.position] === '\\') {
        this.position++; // Skip backslash
        if (this.position < this.input.length) {
          const escaped = this.input[this.position];
          switch (escaped) {
            case 'n':
              result += '\n';
              break;
            case 'r':
              result += '\r';
              break;
            case 't':
              result += '\t';
              break;
            case '\\':
              result += '\\';
              break;
            case "'":
              result += "'";
              break;
            default:
              result += escaped;
          }
          this.position++;
        }
      } else {
        result += this.input[this.position];
        this.position++;
      }
    }
    
    if (this.input[this.position] === "'") {
      this.position++; // Skip closing quote
    } else {
      throw new Error(`Unterminated string at position ${this.position}`);
    }
    
    return result;
  }

  /**
   * Parse a number
   */
  parseNumber() {
    const start = this.position;
    
    // Handle negative numbers
    if (this.input[this.position] === '-') {
      this.position++;
    }
    
    // Parse integer part
    while (this.position < this.input.length && /[0-9]/.test(this.input[this.position])) {
      this.position++;
    }
    
    // Parse decimal part
    if (this.position < this.input.length && this.input[this.position] === '.') {
      this.position++;
      while (this.position < this.input.length && /[0-9]/.test(this.input[this.position])) {
        this.position++;
      }
    }
    
    const numberStr = this.input.slice(start, this.position);
    const number = parseFloat(numberStr);
    
    if (isNaN(number)) {
      throw new Error(`Invalid number '${numberStr}' at position ${start}`);
    }
    
    return number;
  }
}

/**
 * Parse a Lua string and return a JSON object
 * @param {string} luaString - The Lua string to parse
 * @returns {Object} - The parsed JSON object
 */
function parseLuaToJson(luaString) {
  const parser = new RaffleLuaParser();
  return parser.parse(luaString);
}

module.exports = {
  parseLuaToJson,
  RaffleLuaParser
};
