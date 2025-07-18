const { parseLuaToJson } = require('./index.js');

// Example usage
const luaString = `
RaffleManagerDB = {
  ["version"] = "1.0",
  ["settings"] = {
    ["autoAnnounce"] = true,
    ["maxEntries"] = 50
  },
  ["raffles"] = {
    {
      ["name"] = "Epic Mount",
      ["entries"] = 15,
      ["winner"] = "PlayerName",
      ["timestamp"] = 1642684800
    },
    {
      ["name"] = "Rare Pet",
      ["entries"] = 8,
      ["winner"] = nil,
      ["timestamp"] = 1642771200
    }
  }
}
`;

try {
  const result = parseLuaToJson(luaString);
  console.log('Parsed Lua to JSON:');
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error('Error parsing Lua:', error.message);
}
