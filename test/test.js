const { parseLuaToJson, RaffleLuaParser } = require('../index.js');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function runTests() {
  console.log('Running tests...\n');
  
  // Test 1: Basic variable assignment
  console.log('Test 1: Basic variable assignment');
  const test1 = parseLuaToJson('myVar = "hello world"');
  assert(test1.myVar === 'hello world', 'Basic string assignment failed');
  console.log('✓ Passed\n');
  
  // Test 2: Number parsing
  console.log('Test 2: Number parsing');
  const test2 = parseLuaToJson('myNumber = 42.5');
  assert(test2.myNumber === 42.5, 'Number parsing failed');
  console.log('✓ Passed\n');
  
  // Test 3: Boolean parsing
  console.log('Test 3: Boolean parsing');
  const test3 = parseLuaToJson('myBool = true');
  assert(test3.myBool === true, 'Boolean parsing failed');
  console.log('✓ Passed\n');
  
  // Test 4: Nil parsing
  console.log('Test 4: Nil parsing');
  const test4 = parseLuaToJson('myNil = nil');
  assert(test4.myNil === null, 'Nil parsing failed');
  console.log('✓ Passed\n');
  
  // Test 5: Array parsing
  console.log('Test 5: Array parsing');
  const test5 = parseLuaToJson('myArray = {"item1", "item2", "item3"}');
  assert(Array.isArray(test5.myArray), 'Array parsing failed - not an array');
  assert(test5.myArray.length === 3, 'Array parsing failed - wrong length');
  assert(test5.myArray[0] === 'item1', 'Array parsing failed - wrong first element');
  console.log('✓ Passed\n');
  
  // Test 6: Object parsing
  console.log('Test 6: Object parsing');
  const test6 = parseLuaToJson('myObject = {key1 = "value1", key2 = "value2"}');
  assert(typeof test6.myObject === 'object', 'Object parsing failed - not an object');
  assert(test6.myObject.key1 === 'value1', 'Object parsing failed - wrong value');
  assert(test6.myObject.key2 === 'value2', 'Object parsing failed - wrong value');
  console.log('✓ Passed\n');
  
  // Test 7: Nested structures
  console.log('Test 7: Nested structures');
  const test7 = parseLuaToJson('nested = {level1 = {level2 = {value = "deep"}}}');
  assert(test7.nested.level1.level2.value === 'deep', 'Nested structure parsing failed');
  console.log('✓ Passed\n');
  
  // Test 8: Mixed table with explicit indices
  console.log('Test 8: Mixed table with explicit indices');
  const test8 = parseLuaToJson('mixed = {[1] = "first", ["key"] = "value", [3] = "third"}');
  assert(test8.mixed[1] === 'first', 'Mixed table parsing failed - numeric index');
  assert(test8.mixed.key === 'value', 'Mixed table parsing failed - string key');
  assert(test8.mixed[3] === 'third', 'Mixed table parsing failed - numeric index');
  console.log('✓ Passed\n');
  
  // Test 9: Comments
  console.log('Test 9: Comments');
  const test9 = parseLuaToJson(`
    -- This is a comment
    myVar = "value" -- Another comment
  `);
  assert(test9.myVar === 'value', 'Comment parsing failed');
  console.log('✓ Passed\n');
  
  // Test 10: Escape sequences
  console.log('Test 10: Escape sequences');
  const test10 = parseLuaToJson('escaped = "line1\\nline2\\ttab"');
  assert(test10.escaped === 'line1\nline2\ttab', 'Escape sequence parsing failed');
  console.log('✓ Passed\n');
  
  // Test 11: RaffleManager-like structure
  console.log('Test 11: RaffleManager-like structure');
  const raffleData = `
    RaffleManagerDB = {
      ["version"] = "1.0",
      ["raffles"] = {
        {
          ["name"] = "Epic Mount",
          ["entries"] = 15,
          ["winner"] = "PlayerName"
        },
        {
          ["name"] = "Rare Pet",
          ["entries"] = 8,
          ["winner"] = nil
        }
      }
    }
  `;
  const test11 = parseLuaToJson(raffleData);
  assert(test11.RaffleManagerDB.version === '1.0', 'RaffleManager structure failed - version');
  assert(Array.isArray(test11.RaffleManagerDB.raffles), 'RaffleManager structure failed - raffles not array');
  assert(test11.RaffleManagerDB.raffles.length === 2, 'RaffleManager structure failed - wrong raffle count');
  assert(test11.RaffleManagerDB.raffles[0].name === 'Epic Mount', 'RaffleManager structure failed - raffle name');
  assert(test11.RaffleManagerDB.raffles[1].winner === null, 'RaffleManager structure failed - nil winner');
  console.log('✓ Passed\n');
  
  // Test 12: Error handling
  console.log('Test 12: Error handling');
  try {
    parseLuaToJson('invalid = {');
    assert(false, 'Error handling failed - should have thrown error');
  } catch (error) {
    assert(error.message.includes('Expected'), 'Error handling failed - wrong error message');
  }
  console.log('✓ Passed\n');
  
  console.log('All tests passed! 🎉');
}

// Run the tests
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
